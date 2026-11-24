# The Villain Lab

An app where a panel of AI agents debates whether famous **fictional** villains fit the psychopathy profile, inspired by *This American Life* #436, "The Psychopath Test" (2011). Built for a class agent assignment; deployed on Netlify.

## Non-negotiable rules
1. **Fictional characters only.** Refuse real people (and characters based closely on them) politely, and suggest a fictional alternative.
2. **Entertainment, not diagnosis.** Never call anyone a psychopath clinically. Label results "For entertainment only, not a diagnosis."
3. **Original content.** Never reproduce PCL-R items, criteria or manual text. Summarize sources in your own words.
4. **Privacy.** The self-quiz runs only in the browser: no network calls, no storage. See `docs/privacy-rules.md`.
5. **Fictitious names** for private people and radio staff from the episode (key in `docs/09-about-page-story.md`, never published on the site).

## The team (15 subagents in `.claude/agents/`)
- **Leadership:** `orchestrator` (Marlowe), `agent-builder` (Forge, the meta agent)
- **On-stage panel** (run live through the Netlify Function): `prosecution-rater` (Vera), `defense-rater` (Felix), `judge` (Judge Okafor), `spin-doctor` (Chase), `then-vs-now-analyst` (Hope), `literary-analyst` (Professor Quill)
- **Research & standards:** `forensic-psych-researcher` (Dr. Kessler), `quiz-writer` (Penny), `ethics-safety-reviewer` (Ruth), `privacy-engineer` (Sam)
- **Builders:** `frontend-engineer` (Dani), `functions-engineer` (Theo), `qa-tester` (Grace)

Models and personalities: `docs/agent-brains.md`. Roles and the 18 shared skills: `docs/expert-roster.md`. Skills live in `.claude/skills/`.

Every agent reads `knowledge/<agent-name>/` before answering. Add documents there to teach an agent more.

## How to use the team
- Ask one expert: `@agent-judge Who wins the gap between Vera and Felix on Cersei, and why?`
- Ask the whole team: `@agent-orchestrator Run a full panel on Iago and summarize the disagreement.`
- More examples: `docs/how-to-talk-to-your-experts.md`.

## Sign-offs before any deploy
`ethics-safety-reviewer`, `privacy-engineer` and `qa-tester` must all pass.

## Layout
- `docs/`: research, roster, brains, rules (start at `docs/README.md`)
- `.claude/agents/`, `.claude/skills/`: the team
- `knowledge/`: one folder per agent
- `site/` (static site) and `netlify/functions/` (the Claude API function): built in the next step
