// Villain Panel. Starter villains load from pre-generated JSON (no API cost).
// Other fictional characters run live: prosecution + defense in parallel, then the judge.
// Sends only: agent name, character name, panel context, optional class password.
import { looksReal } from "./guard.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let THEMES = [];
let STARTERS = [];
let current = null; // { character, version, prosecution, defense, judge, spin?, then_vs_now?, pregenerated, spoilers }
let password = "";

const form = $("#trial-form"), input = $("#character"), status = $("#status"), caseEl = $("#case");
const pwRow = $("#pw-row"), pwInput = $("#password");

function setStatus(msg, error = false) {
  status.textContent = msg;
  status.classList.toggle("error", error);
}

async function init() {
  try {
    const r = await fetch("data/panels/index.json");
    const data = await r.json();
    THEMES = data.themes; STARTERS = data.characters;
  } catch { setStatus("Couldn't load the starter villains. Refresh the page to try again.", true); return; }
  const list = $("#starter-list");
  const dl = $("#starter-names");
  for (const c of STARTERS) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c.name;
    b.addEventListener("click", () => { input.value = c.name; input.dataset.fromArchive = "1"; run(c.name); });
    li.append(b); list.append(li);
    const o = document.createElement("option"); o.value = c.name; dl.append(o);
  }
  // A name filled in by an archive button gets replaced, not appended to, when the user types a new one.
  const selectArchiveName = () => { if (input.dataset.fromArchive) input.select(); };
  input.addEventListener("focus", selectArchiveName);
  input.addEventListener("pointerup", selectArchiveName);
  input.addEventListener("input", () => { delete input.dataset.fromArchive; });
}

async function callAgent(agent, character, context = {}, fast = false) {
  const r = await fetch("/api/agent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ agent, character, context, password: password || undefined, fast: fast || undefined }),
  });
  let data = {};
  try { data = await r.json(); } catch { /* fallthrough */ }
  if (r.status === 401) { pwRow.classList.add("show"); pwInput.focus(); throw new Error(data.message || "Enter the class password to run a live panel."); }
  if (!r.ok) {
    const err = new Error(data.message || "The live panel isn't available. Pick a starter villain instead.");
    // 504 from our function, or a gateway timeout/error page from Netlify itself.
    err.retryFast = !fast && (r.status === 504 || r.status === 502 || data.canRetryFast === true);
    throw err;
  }
  return data;
}

// Slower agents (judge, then-vs-now) retry once on the fast model if they time out.
async function callWithFallback(agent, character, context, slowMsg) {
  try {
    return await callAgent(agent, character, context);
  } catch (e) {
    if (!e.retryFast) throw e;
    setStatus(slowMsg);
    return await callAgent(agent, character, context, true);
  }
}

async function run(name) {
  name = name.trim();
  if (!name) { setStatus("Type a fictional character's name, or pick one from the docket.", true); input.focus(); return; }
  // Clear the previous verdict so a refusal or error never sits above another character's scores.
  caseEl.hidden = true;
  if (name.length > 60) { setStatus("That name is too long. Use 60 characters or fewer.", true); return; }
  if (looksReal(name)) {
    setStatus("The Villain Lab only puts fictional characters on trial, never real people. Try Tom Ripley or Cersei Lannister.", true);
    return;
  }
  const btn = $("#trial-btn"); btn.disabled = true;
  const starter = STARTERS.find((c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === slugify(name));
  try {
    if (starter) {
      setStatus("Opening the case file…");
      const r = await fetch(`data/panels/${starter.slug}.json`);
      if (!r.ok) throw new Error("Couldn't open that case file. Refresh the page and try again.");
      current = await r.json();
      setStatus("");
      render();
      return;
    }
    setStatus(`Vera (prosecution) and Felix (defense) are reviewing ${name}…`);
    const [p, d] = await Promise.all([callAgent("prosecution-rater", name), callAgent("defense-rater", name)]);
    if (p.refused || d.refused) { setStatus(p.message || d.message || "That one can't go on trial here. Pick a fictional character.", true); return; }
    setStatus("Judge Okafor is weighing both sides…");
    const j = await callWithFallback("judge", name, { prosecution: p.result, defense: d.result }, "The judge is taking a while, so a faster clerk is writing up the ruling…");
    if (j.refused) { setStatus(j.message || "The judge declined this case. Pick a fictional character.", true); return; }
    current = { character: name, version: p.version || j.version || "", prosecution: p, defense: d, judge: j, pregenerated: false, spoilers: true };
    setStatus("");
    render();
  } catch (e) {
    setStatus(e.message, true);
  } finally {
    btn.disabled = false;
  }
}

const article = (n) => (n === 8 || n === 11 || n === 18 || (n >= 80 && n < 90) ? "An" : "A");
const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
const idx = (scores) => Math.round(THEMES.reduce((a, t) => a + (Number(scores?.[t]) || 0), 0) / 80 * 100);

function render() {
  const c = current;
  const P = c.prosecution.result, D = c.defense.result, J = c.judge.result;
  const pi = num(P.villain_index ?? idx(P.scores)), di = num(D.villain_index ?? idx(D.scores)), ji = num(J.villain_index ?? idx(J.judge_scores));
  const gap = Math.abs(pi - di);
  let biggest = THEMES[0], bg = -1;
  for (const t of THEMES) { const g = Math.abs((P.scores[t] || 0) - (D.scores[t] || 0)); if (g > bg) { bg = g; biggest = t; } }

  caseEl.innerHTML = `
    <h2 class="case-title">${esc(c.character)}</h2>
    <p class="case-version">${esc(c.version)}${c.pregenerated ? " (from the case archive)" : " (live panel)"}</p>
    <p class="gap-headline">Same character, same evidence: <span class="p">${pi}</span> for the prosecution, <span class="d">${di}</span> for the defense. ${article(gap)} ${gap}-point disagreement.</p>
    <div class="scoreline">
      <div class="score p"><b>${pi}</b><span>Vera Stone, prosecution</span></div>
      <div class="score d"><b>${di}</b><span>Felix Hart, defense</span></div>
      <div class="score"><b>${ji}</b><span>Judge Okafor's ruling</span></div>
    </div>
    <p class="sr-only">Villain Index is out of 100.</p>
    <div class="chart" role="group" aria-label="Trait theme scores, out of 10">
      <p class="legend"><span><i class="lp"></i>Prosecution</span><span><i class="ld"></i>Defense</span><span><i class="lj"></i>Judge</span><span>Each theme is scored out of 10.</span></p>
      ${THEMES.map((t) => {
        const p = num(P.scores[t]), d = num(D.scores[t]), j = num(J.judge_scores?.[t]);
        return `<div class="theme${t === biggest ? " big-gap" : ""}">
          <div class="theme-name">${esc(t)}</div>
          <div class="bars" aria-hidden="true">
            <div class="bar p"><span data-w="${p * 10}"></span></div>
            <div class="bar d"><span data-w="${d * 10}"></span></div>
            <div class="judge-mark" data-l="${j * 10}"></div>
          </div>
          <div class="nums"><span class="p">${p}</span> / <span class="d">${d}</span> / ${j}<span class="sr-only"> (prosecution, defense, judge)</span></div>
        </div>`;
      }).join("")}
    </div>

    <div class="ruling">
      <div>
        <h3>The ruling</h3>
        <p class="verdict">${esc(J.verdict)}</p>
        <h3>Why they disagreed</h3>
        <ul class="gaps">${(J.gaps || []).map((g) => `<li><b>${esc(g.theme)}</b> (${esc(g.prosecution)} vs. ${esc(g.defense)}): ${esc(g.why)}</li>`).join("")}</ul>
      </div>
      <div>
        <h3>Dark Triad profile</h3>
        <ul class="triad">
          <li><span>Schemer (Machiavellianism)</span><b>${esc(J.dark_triad?.machiavellianism)}</b></li>
          <li><span>Egoist (narcissism)</span><b>${esc(J.dark_triad?.narcissism)}</b></li>
          <li><span>Cold predator (psychopathy)</span><b>${esc(J.dark_triad?.psychopathy)}</b></li>
        </ul>
        <p class="label-ent">For entertainment only, not a diagnosis. <a href="about.html#how">How the panel works</a></p>
      </div>
    </div>

    <div class="sides">
      ${side("p", "Vera Stone, for the prosecution", P)}
      ${side("d", "Felix Hart, for the defense", D)}
    </div>

    <div class="extras">
      <button class="btn ghost" type="button" id="btn-spin">Ask the Spin Doctor</button>
      <button class="btn ghost" type="button" id="btn-tvn">Compare then and now</button>
    </div>
    <div class="extra-out" id="extra-out" hidden aria-live="polite"></div>`;

  caseEl.hidden = false;
  requestAnimationFrame(() => {
    caseEl.querySelectorAll("[data-w]").forEach((s) => (s.style.width = s.dataset.w + "%"));
    caseEl.querySelectorAll("[data-l]").forEach((s) => (s.style.left = s.dataset.l + "%"));
  });
  $("#btn-spin").addEventListener("click", showSpin);
  $("#btn-tvn").addEventListener("click", showTvn);
  caseEl.querySelector(".case-title").setAttribute("tabindex", "-1");
  caseEl.querySelector(".case-title").focus({ preventScroll: false });
}

function side(cls, title, R) {
  const ev = Object.entries(R.evidence || {});
  return `<section class="side ${cls}">
    <h3>${esc(title)}</h3>
    ${R.closing_argument ? `<q>${esc(R.closing_argument)}</q>` : ""}
    <dl>${ev.map(([t, e]) => `<dt>${esc(t)}</dt><dd>${esc(e)}</dd>`).join("")}</dl>
  </section>`;
}

async function showSpin() {
  const out = $("#extra-out"); out.hidden = false;
  try {
    if (!current.spin) {
      out.innerHTML = `<p>Chase Sterling is polishing his talking points…</p>`;
      const reply = await callAgent("spin-doctor", current.character, { judge: current.judge.result });
      if (reply.refused || !reply.result) { out.innerHTML = `<p class="status error">${esc(reply.message || "Chase declined this one. Try another character.")}</p>`; return; }
      current.spin = reply;
    }
    const S = current.spin.result;
    out.innerHTML = `<div class="memo"><h3>Chase Sterling, Spin Doctor: "${esc(S.title)}"</h3>
      <ul>${(S.reframes || []).map((r) => `<li><b>${esc(r.theme)}</b>: ${esc(r.spin)}</li>`).join("")}</ul>
      <p>${esc(S.wink)}</p><p class="label-ent">Satire. For entertainment only, not a diagnosis.</p></div>`;
  } catch (e) { out.innerHTML = `<p class="status error">${esc(e.message)}</p>`; }
}

async function showTvn() {
  const out = $("#extra-out"); out.hidden = false;
  if (current.pregenerated && !current.then_vs_now) {
    out.innerHTML = `<div class="memo"><p>Hope Rivera says ${esc(current.character)} doesn't have a turning point to compare. Try Zuko, Darth Vader, Walter White, Jaime Lannister, Severus Snape or Lady Macbeth.</p></div>`;
    return;
  }
  if (current.spoilers && !out.dataset.ok) {
    out.innerHTML = `<div class="spoiler"><p>This compares the beginning of the story with the end, so it includes spoilers.</p>
      <button class="btn ghost" type="button" id="spoil-ok">Show spoilers</button></div>`;
    $("#spoil-ok").addEventListener("click", () => { out.dataset.ok = "1"; showTvn(); });
    return;
  }
  try {
    if (!current.then_vs_now) {
      out.innerHTML = `<p>Hope Rivera is comparing the beginning and the end…</p>`;
      const reply = await callWithFallback("then-vs-now-analyst", current.character, { judge: current.judge.result }, "Switching Hope to fast mode…");
      if (reply.refused || !reply.result) { out.innerHTML = `<p class="status error">${esc(reply.message || "Hope declined this one. Try another character.")}</p>`; return; }
      current.then_vs_now = reply;
    }
    const T = current.then_vs_now.result;
    out.innerHTML = `<div class="memo"><h3>Hope Rivera, then vs. now</h3>
      <div class="tvn"><div><b>${esc(T.then?.index)}</b>Villain Index at the start</div><div><b>${esc(T.now?.index)}</b>Villain Index at the end</div></div>
      <p>${esc(T.track_record_effect)}</p><p><b>${esc(T.verdict)}</b></p><p class="label-ent">For entertainment only, not a diagnosis.</p></div>`;
  } catch (e) { out.innerHTML = `<p class="status error">${esc(e.message)}</p>`; }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (pwInput.value) password = pwInput.value;
  delete $("#extra-out")?.dataset.ok;
  run(input.value);
});

init();
