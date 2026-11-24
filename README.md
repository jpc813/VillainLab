# The Villain Lab

A panel of AI agents puts famous **fictional** villains on trial. A prosecution-hired expert and a defense-hired expert score the same character on eight original trait themes, and a judge explains why they disagree. That's a playful demonstration of *adversarial allegiance*, a research finding featured in *This American Life* #436, "The Psychopath Test" (2011). Also includes a private, for-fun self-quiz.

**For entertainment only, not a diagnosis. Fictional characters only.**

## What's in the repo

| Path | What it is |
|---|---|
| `site/` | The static website (no build step): Villain Panel, quiz, About, Resources |
| `site/data/panels/` | Pre-generated panels for 18 starter villains (work with no API key) |
| `netlify/functions/agent.mjs` | `/api/agent`: runs one on-stage agent against the Claude API |
| `scripts/build-prompts.mjs` | Builds the live prompts from `.claude/agents` + skills + knowledge on every deploy |
| `.claude/agents/`, `.claude/skills/` | The 15-agent team and 18 shared skills |
| `knowledge/` | One knowledge folder per agent |
| `docs/` | Research, roster, agent brains, privacy and ethics rules |
| `CLAUDE.md` | How the team works |

## Deploy on Netlify

1. In Netlify: **Add new project → Import an existing project → GitHub**, then pick **VillainLab**.
2. Leave the build settings alone; `netlify.toml` sets them (build: `node scripts/build-prompts.mjs`, publish: `site`).
3. Optional, for live panels on any fictional character: under **Environment variables**, add
   - `ANTHROPIC_API_KEY`: your key from platform.claude.com (mark it secret, Functions scope)
   - `APP_PASSWORD`: a class password, so strangers can't spend your credit
   - Optional `MODEL_FAST` / `MODEL_SMART` to override the default model IDs.
   - Optional `JUDGE_MODEL` = `fast`: always run the Judge (and Then vs. Now) on the fast model. Without it, the Judge tries the smarter model and automatically retries on the fast one if it runs long.
   - Optional `AGENT_TIMEOUT_MS` (default `26000`): how long a call may run before it's stopped and retried on the fast model. Netlify's function limit is 30 seconds; lower this only if your plan's limit is shorter.
4. Click **Deploy**. Without a key, the 18 starter villains and the quiz still work.

Set a monthly spend limit for your API key in the Claude Console.

## Privacy

The quiz runs entirely in the browser: no network requests, no storage. The panel sends only the character's name. No analytics, cookies or third-party scripts. See `docs/privacy-rules.md`.

## Credits

Inspired by [This American Life #436](https://www.thisamericanlife.org/436/the-psychopath-test). Built by an AI agent team following the "Build Synthetic Employees with Claude Code" guide. Sources: [`docs/sources.md`](docs/sources.md).
