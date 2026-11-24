---
name: agent-authoring
description: Create or edit Claude Code subagents and skills for this project to the official spec. Use when adding a new agent or skill or improving an existing one.
---
# Agent authoring

Follow the official docs: subagents https://code.claude.com/docs/en/sub-agents and skills https://code.claude.com/docs/en/skills.

## Subagent file: `.claude/agents/<name>.md`
```markdown
---
name: <kebab-case-name>
description: <when to use this agent, one or two sentences>
model: haiku | sonnet | opus
skills: [skill-a, skill-b]
---
<system prompt: persona, job, rules, and "read knowledge/<name>/ first">
```

## Skill file: `.claude/skills/<name>/SKILL.md`
```markdown
---
name: <kebab-case-name>
description: <what it does and when to use it>
---
<instructions>
```

## Checklist for every new agent
- Add a `knowledge/<name>/README.md` with sourced notes.
- Add a row to `docs/agent-brains.md` and `docs/expert-roster.md`.
- On-stage agents must include `real-person-refusal`, `entertainment-framing` and `structured-json-output`.
