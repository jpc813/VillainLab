// POST /api/agent: runs ONE on-stage Villain Lab agent against the Claude API.
// Secrets come from Netlify environment variables (set in the Netlify UI):
//   ANTHROPIC_API_KEY  (required for live panels)
//   APP_PASSWORD       (optional: require a password so strangers can't spend credit)
//   MODEL_FAST / MODEL_SMART (optional model ID overrides)
// Privacy: request bodies are never logged. The quiz never calls this function.
import { PROMPTS } from "../lib/prompts.mjs";
import { looksReal } from "../lib/guard.mjs";

const MODELS = {
  haiku: process.env.MODEL_FAST || "claude-haiku-5-5",
  sonnet: process.env.MODEL_SMART || "claude-sonnet-5-5",
  opus: process.env.MODEL_SMART || "claude-sonnet-5-5", // on-stage agents never need opus
};
const MAX_TOKENS = { judge: 900, "then-vs-now-analyst": 900 };
const DEFAULT_MAX_TOKENS = 700;
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

  const ctx = body.context && typeof body.context === "object" ? body.context : {};
  const ctxText = JSON.stringify(ctx);
  if (ctxText.length > 12000) return json({ error: "context_too_large" }, 400);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: "api_unavailable", message: "Live panels are off right now. Try one of the starter villains." }, 503);

  const ip = context?.ip || "unknown";
  const now = Date.now();
  const rec = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (rec.length >= LIMIT) return json({ error: "rate_limited", message: "The panel needs a breather. Try again in a few minutes." }, 429);
  rec.push(now); hits.set(ip, rec);

  const { model, system } = PROMPTS[agent];
  const userMsg = `Character: ${character}\nPanel context (JSON): ${ctxText}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODELS[model] || MODELS.haiku,
        max_tokens: MAX_TOKENS[agent] || DEFAULT_MAX_TOKENS,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!r.ok) {
      console.error("Claude API error", r.status); // status only; never the body or prompt
      return json({ error: "upstream_error", message: "The panel couldn't reach its experts. Try a starter villain." }, 502);
    }
    const data = await r.json();
    const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    const parsed = extractJson(text);
    return json({ ...parsed, agent, character, label: LABEL });
  } catch (e) {
    console.error("agent failure", e?.name || "error");
    return json({ error: "agent_failed", message: "The expert fumbled their notes. Try again." }, 502);
  }
};

export const config = { path: "/api/agent" };
