// POST /api/agent: runs ONE on-stage Villain Lab agent against the Claude API.
// Secrets come from Netlify environment variables (set in the Netlify UI):
//   ANTHROPIC_API_KEY  (required for live panels)
//   APP_PASSWORD       (optional: require a password so strangers can't spend credit)
//   MODEL_FAST / MODEL_SMART (optional model ID overrides)
//   JUDGE_MODEL        (optional, the one-line switch: set to "fast" to always run
//                       the judge and then-vs-now on the fast model)
//   AGENT_TIMEOUT_MS   (optional, default 26000: stop a slow call early so the
//                       browser can retry on the fast model before Netlify's
//                       own function time limit cuts it off)
// Privacy: request bodies are never logged. The quiz never calls this function.
import { PROMPTS } from "../lib/prompts.mjs";
import { looksReal } from "../lib/guard.mjs";

const MODELS = {
  haiku: process.env.MODEL_FAST || "claude-haiku-5-5",
  sonnet: process.env.MODEL_SMART || "claude-sonnet-5-5",
  opus: process.env.MODEL_SMART || "claude-sonnet-5-5", // on-stage agents never need opus
};
const MAX_TOKENS = { judge: 4000, "then-vs-now-analyst": 3000 };
const THEMES = ["Charm Offensive", "Main Character Energy", "Con Artistry", "Remorse Meter",
  "Cold Heart", "Thrill Hunger", "Short Fuse", "Track Record"];
// The exact keys the page renders, restated with every call so a model can't drift from them.
const SHAPE_HINTS = {
  "prosecution-rater": 'Required: result.scores (all eight themes, integers 0-10), result.evidence, result.villain_index, result.closing_argument.',
  "defense-rater": 'Required: result.scores (all eight themes, integers 0-10), result.evidence, result.villain_index, result.closing_argument.',
  judge: 'Required: result.judge_scores (all eight themes, integers 0-10), result.villain_index, result.gaps (2-3 items, each "why" under 40 words), result.dark_triad, result.verdict (under 80 words).',
};
const hasAllScores = (s) => s && typeof s === "object" && THEMES.every((t) => Number.isFinite(Number(s[t])));
// Returns true when a non-refused reply has the scores the page needs.
function shapeOk(agent, p) {
  if (p?.refused) return true;
  if (agent === "judge") return hasAllScores(p?.result?.judge_scores);
  if (agent === "prosecution-rater" || agent === "defense-rater") return hasAllScores(p?.result?.scores);
  return !!p?.result;
}
// Keep only the panel context the agents need, and only short text/number values.
function cleanContext(ctx) {
  const out = {};
  for (const k of ["prosecution", "defense", "judge"]) {
    if (ctx[k] && typeof ctx[k] === "object") out[k] = ctx[k];
  }
  return out;
}
const DEFAULT_MAX_TOKENS = 2000;
const TIMEOUT_MS = Number(process.env.AGENT_TIMEOUT_MS) || 26000;
const ALWAYS_FAST = (process.env.JUDGE_MODEL || "").toLowerCase() === "fast";
const LABEL = "For entertainment only, not a diagnosis.";

// Best-effort rate limit (functions are stateless; this resets on cold start).
const hits = new Map();
const LIMIT = 30, WINDOW_MS = 10 * 60 * 1000;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

function extractJson(text) {
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("no json");
  return JSON.parse(text.slice(a, b + 1));
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad_request", message: "Send JSON." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "bad_request", message: "Send JSON." }, 400);

  // Rate limit first, so the password can't be guessed without limit.
  const ip = context?.ip || "unknown";
  const now = Date.now();
  const rec = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (rec.length >= LIMIT) return json({ error: "rate_limited", message: "The panel needs a breather. Try again in a few minutes." }, 429);
  rec.push(now); hits.set(ip, rec);

  const pw = process.env.APP_PASSWORD;
  if (pw && body.password !== pw) return json({ error: "password_required", message: "This panel needs the class password." }, 401);

  const agent = String(body.agent || "");
  if (!Object.hasOwn(PROMPTS, agent)) return json({ error: "unknown_agent" }, 400);

  const character = String(body.character || "").trim();
  if (!character || character.length > 60) return json({ error: "bad_character", message: "Enter a character name (60 characters max)." }, 400);
  if (looksReal(character)) {
    return json({ agent, character, refused: true, reason: "real_person",
      suggestions: ["Tom Ripley", "Cersei Lannister"], label: LABEL,
      message: "The Villain Lab only puts fictional characters on trial, never real people." });
  }

  const ctx = cleanContext(body.context && typeof body.context === "object" ? body.context : {});
  const ctxText = JSON.stringify(ctx);
  if (ctxText.length > 12000) return json({ error: "context_too_large" }, 400);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: "api_unavailable", message: "Live panels are off right now. Try one of the starter villains." }, 503);

  const { model, system } = PROMPTS[agent];
  // body.fast is a downgrade-only flag the browser sends when retrying after a timeout.
  const useFast = body.fast === true || ALWAYS_FAST;
  const modelId = useFast ? MODELS.haiku : (MODELS[model] || MODELS.haiku);
  const userMsg = `Character: ${character}\nPanel context (JSON): ${ctxText}${SHAPE_HINTS[agent] ? `\n${SHAPE_HINTS[agent]}` : ""}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const callClaude = (withThinkingOff) => fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal: ctrl.signal,
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: modelId,
      max_tokens: MAX_TOKENS[agent] || DEFAULT_MAX_TOKENS,
      system,
      messages: [{ role: "user", content: userMsg }],
      // Skip extended thinking: these are short, structured answers and speed matters.
      ...(withThinkingOff ? { thinking: { type: "disabled" } } : {}),
    }),
  });
  try {
    let r = await callClaude(true);
    if (r.status === 400) {
      // If this model doesn't accept the thinking setting, retry once without it.
      console.error("retrying without thinking setting");
      r = await callClaude(false);
    }
    if (!r.ok) {
      console.error("Claude API error", r.status); // status only; never the body or prompt
      return json({ error: "upstream_error", message: "The panel couldn't reach its experts. Try a starter villain." }, 502);
    }
    const data = await r.json();
    const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    let parsed;
    try {
      parsed = extractJson(text);
    } catch {
      // Diagnostics only: no user input, no prompt, no model text.
      console.error("no usable JSON", JSON.stringify({
        agent, model: modelId, stop_reason: data.stop_reason,
        blocks: (data.content || []).map((c) => c.type), text_length: text.length,
        output_tokens: data.usage?.output_tokens,
      }));
      return json({ error: "bad_reply", message: "The expert's notes came back garbled. Try again." }, 502);
    }
    if (!shapeOk(agent, parsed)) {
      console.error("reply missing required fields", JSON.stringify({ agent, model: modelId, stop_reason: data.stop_reason }));
      return json({ error: "bad_reply", message: "The expert's notes came back incomplete. Try again." }, 502);
    }
    return json({ ...parsed, agent, character, model: modelId, label: LABEL });
  } catch (e) {
    if (e?.name === "AbortError") {
      return json({ error: "timeout", message: "That expert took too long.", canRetryFast: !useFast }, 504);
    }
    console.error("agent failure", e?.name || "error");
    return json({ error: "agent_failed", message: "The expert fumbled their notes. Try again." }, 502);
  } finally {
    clearTimeout(timer);
  }
};

export const config = { path: "/api/agent" };
