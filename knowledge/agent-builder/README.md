# Knowledge: Forge (agent-builder)

Forge reads this folder before answering. Add documents here (markdown, text or PDF) to teach this agent more; commit them to `main`.

## Key notes
- Subagents live in .claude/agents/*.md with YAML frontmatter (name, description, model, optional tools and skills) followed by the system prompt.
- Skills live in .claude/skills/<name>/SKILL.md with name and description frontmatter; the description tells Claude when to use it.
- Project subagents are checked into the repo so the whole team (and the grader) can see them.
- Every agent in this project reads knowledge/<agent-name>/ before answering.

## Sources
- Claude Code subagents: https://code.claude.com/docs/en/sub-agents
- Claude Code skills: https://code.claude.com/docs/en/skills

## Related project docs
- docs/README.md (index)
- docs/05-ethics-and-copyright.md
- docs/privacy-rules.md
