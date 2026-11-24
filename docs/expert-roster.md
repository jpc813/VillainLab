# Expert roster: The Villain Lab team

**Decision:** everything deploys on Netlify. The self-quiz is static and runs only in the browser. The Villain Panel, Spin Doctor and Then vs. Now call the Claude API through one Netlify Function (`/api/agent`), with pre-generated panels for the 18 starter villains as a fallback. The rules in `privacy-rules.md` and `05-ethics-and-copyright.md` are non-negotiable.

The team has two kinds of agents:
- **On-stage agents** run inside the live app (through the Netlify Function) and talk to users.
- **Crew agents** design, build, review and deploy the app (in Claude Code).

## Shared vocabulary: our original trait themes

Raters, the Judge and the Quiz Writer all use the same **eight original trait themes**. They are our own plain-language groupings inspired by published research. They are **not** PCL-R items, wording or criteria.

| Theme | Plain meaning |
|---|---|
| Charm Offensive | Smooth, flattering, wins people over fast |
| Main Character Energy | Sees self as superior, special, entitled |
| Con Artistry | Lies, schemes, uses people as tools |
| Remorse Meter | Does the character show guilt or regret? (scored inverted) |
| Cold Heart | Little warmth or empathy for others' pain |
| Thrill Hunger | Bored easily, chases risk and excitement |
| Short Fuse | Impulsive, explosive, poor self-control |
| Track Record | Pattern of harmful acts across the story |

Each theme is scored **0–10** with evidence from the story. The total becomes a **Villain Index (0–100)**. It is deliberately a different scale from the PCL-R, and it is always labeled "for entertainment."

## The roster (15 agents)

### Leadership

| Agent | Name & personality | Model | Job |
|---|---|---|---|
| `orchestrator` | **Marlowe**: calm stage manager, speaks in short, decisive cues | opus | Runs the crew in Claude Code and decides which experts work on each task; in the app, defines the panel flow (raters in parallel, then Judge) |
| `agent-builder` (meta) | **Forge**: tinkerer who loves a clean template | opus | Creates new agents and skills, and improves existing ones, following the Claude Code docs |

### On-stage panel

| Agent | Name & personality | Model | Job |
|---|---|---|---|
| `prosecution-rater` | **Vera Stone**: sharp, relentless, assumes the worst | haiku | Scores a fictional character on the eight themes as if hired by the prosecution, citing story evidence |
| `defense-rater` | **Felix Hart**: warm, persuasive, finds the human angle | haiku | Scores the same character from the same evidence as if hired by the defense |
| `judge` | **Judge Okafor**: dry wit, fair, explains like a good teacher | sonnet | Compares both scores, names the themes where they split and why, and gives a Dark Triad-style verdict |
| `spin-doctor` | **Chase Sterling**: oily corporate optimist, every flaw is a "leadership asset" | haiku | Reframes each dark trait as a strength (satire inspired by Act Two) |
| `then-vs-now-analyst` | **Hope Rivera**: patient, believes people (and characters) can change | sonnet | Splits a character's early story from their ending, and shows how much of the score is "track record" that can't change |
| `literary-analyst` | **Professor Quill**: bookish, precise about which version of a story | sonnet | Builds the evidence file for a character (key scenes and choices), notes book vs. film differences, and flags spoilers |

### Research & standards

| Agent | Name & personality | Model | Job |
|---|---|---|---|
| `forensic-psych-researcher` | **Dr. Ada Kessler**: careful scientist, allergic to overclaiming | opus | Keeps the science accurate, writes the explainers, and makes sure every result states its limits |
| `quiz-writer` | **Penny Lark**: playful, kind, great with a punchline | sonnet | Writes the original self-quiz questions, scoring and funny, gentle result messages |
| `ethics-safety-reviewer` | **Ruth Ellison**: firm but friendly gatekeeper | opus | Blocks real-person ratings, diagnostic language and copyrighted material; signs off before deploy |
| `privacy-engineer` | **Sam Ito**: quietly paranoid, checks the Network tab twice | sonnet | Verifies quiz data never leaves the browser and nothing is stored; signs off before deploy |

### Builders

| Agent | Name & personality | Model | Job |
|---|---|---|---|
| `frontend-engineer` | **Dani Cruz**: pixel-proud, accessibility-first | sonnet | Builds the static site: Panel, Spin Doctor, Then vs. Now, Quiz, About and Resources pages |
| `functions-engineer` | **Theo Park**: pragmatic, counts tokens and seconds | sonnet | Writes the Netlify Function, `netlify.toml`, cost controls and the pre-generated panel JSON |
| `qa-tester` | **Grace Hollis**: cheerful bug hunter, tries every weird input | sonnet | Tests every feature, the refusal of real people, mobile layouts and the no-API fallback |

**Why these models:** Haiku for the fast, high-volume on-stage raters and the Spin Doctor (cheap and quick, so each call fits the Netlify time limit). Sonnet for the Judge and for most specialist work. Opus for leadership, science and ethics judgment, where a mistake costs the most.

## Skills (shared across agents)

Each skill becomes `.claude/skills/<skill-name>/SKILL.md`.

| Skill | What it does | Used by |
|---|---|---|
| `trait-theme-scoring` | Score a character 0–10 on each of the eight themes with evidence; compute the Villain Index | prosecution-rater, defense-rater, judge, quiz-writer, forensic-psych-researcher |
| `canon-evidence` | Gather specific scenes and choices from the story, naming the version (book, film, show) | literary-analyst, prosecution-rater, defense-rater, then-vs-now-analyst, spin-doctor |
| `real-person-refusal` | Detect real people (or characters closely based on them) and politely redirect to fiction | prosecution-rater, defense-rater, judge, spin-doctor, then-vs-now-analyst, literary-analyst, ethics-safety-reviewer, frontend-engineer |
| `entertainment-framing` | Non-diagnostic wording: no "is a psychopath," no "diagnosis"; always add the for-fun label | all on-stage agents, quiz-writer, ethics-safety-reviewer, frontend-engineer |
| `dark-triad-profile` | Describe a character as schemer / egoist / cold predator mix | judge, forensic-psych-researcher, literary-analyst |
| `disagreement-analysis` | Compare two ratings, find the biggest gaps and explain which evidence each side leaned on | judge, orchestrator |
| `redemption-arc-analysis` | Separate early vs. late story behavior; show how history dominates a score | then-vs-now-analyst, literary-analyst, judge |
| `spin-reframing` | Turn each dark trait into corporate-speak "strength," clearly satirical | spin-doctor |
| `structured-json-output` | Return agent results in the agreed JSON shape so the browser can render them | all on-stage agents, functions-engineer, frontend-engineer |
| `source-citation` | Summarize sources in our own words, link them, and keep `sources.md` and the Resources page current | forensic-psych-researcher, literary-analyst, ethics-safety-reviewer, frontend-engineer |
| `copyright-check` | Ensure no PCL-R items, no long quotes, no copied transcripts | ethics-safety-reviewer, quiz-writer, forensic-psych-researcher |
| `quiz-design` | Write original, balanced self-quiz items and browser-only scoring with kind result tiers | quiz-writer, forensic-psych-researcher, privacy-engineer |
| `privacy-audit` | Run the checklist in `privacy-rules.md` (code search plus Network-tab test) | privacy-engineer, qa-tester, ethics-safety-reviewer |
| `netlify-claude-function` | Call the Claude Messages API from a Netlify Function with env-var secrets, an allow-list of agents, max_tokens caps, an optional APP_PASSWORD and rate limiting | functions-engineer, privacy-engineer, qa-tester |
| `pregenerate-panels` | Produce and commit panel JSON for the 18 starter villains | functions-engineer, orchestrator, literary-analyst |
| `static-site-build` | Accessible, responsive HTML/CSS/JS with no build step and no third-party scripts | frontend-engineer, qa-tester |
| `test-plan` | Write and run the feature, refusal, fallback and mobile test checklist | qa-tester, privacy-engineer |
| `agent-authoring` | Create or edit agents and skills to the Claude Code spec | agent-builder, orchestrator |

## How a Villain Panel request flows

1. User picks a fictional character. The browser does a quick real-person check.
2. If a pre-generated panel exists, it is shown instantly (no API cost). Otherwise:
3. The browser calls `/api/agent` for **prosecution-rater** and **defense-rater** at the same time.
4. Then it calls **judge** with both results.
5. Optional buttons call **spin-doctor** or **then-vs-now-analyst**.
6. Every response carries the "for entertainment only" label.

## Sign-offs required before every deploy

- **ethics-safety-reviewer** (Ruth): no real-person ratings, no diagnostic language, no copyrighted test material.
- **privacy-engineer** (Sam): privacy audit passed.
- **qa-tester** (Grace): test plan passed, including the no-API fallback.
