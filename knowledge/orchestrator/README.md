# Knowledge: Marlowe (orchestrator)

Marlowe reads this folder before answering. Add documents here (markdown, text or PDF) to teach this agent more; commit them to `main`.

## Key notes
- The team: 15 agents (6 on-stage, 9 crew). See docs/expert-roster.md.
- Panel flow: raters in parallel, then judge; spin and then-vs-now optional.
- Deploy needs three sign-offs: ethics (Ruth), privacy (Sam), QA (Grace).
- Netlify synchronous functions have a time limit (historically 10s, reportedly raised to 30s), so the browser orchestrates one agent per call.

## Sources
- Claude Code subagents: https://code.claude.com/docs/en/sub-agents
- Netlify background functions: https://docs.netlify.com/build/functions/background-functions/
- Project roster: docs/expert-roster.md

## Related project docs
- docs/README.md (index)
- docs/05-ethics-and-copyright.md
- docs/privacy-rules.md
