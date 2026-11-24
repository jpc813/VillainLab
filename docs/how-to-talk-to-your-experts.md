# How to talk to your experts

Open this repository in Claude Code (claude.ai/code), then type `@` and pick an agent.

## Ask one expert
- `@agent-literary-analyst Build an evidence file for Severus Snape (book version). Flag spoilers.`
- `@agent-forensic-psych-researcher Explain in two paragraphs why the PCL-R can't be a web quiz.`
- `@agent-quiz-writer Draft three new quiz questions for the Thrill Hunger theme.`
- `@agent-ethics-safety-reviewer Review site/about.html for diagnostic language.`

## Ask the whole team (through the orchestrator)
1. `@agent-orchestrator Run a full Villain Panel on Cersei Lannister: Vera and Felix in parallel, then Judge Okafor. Show me the biggest gap.`
2. `@agent-orchestrator Compare Zuko and Walter White with Then vs. Now. Which one changed more, and how much of each score is Track Record?`
3. `@agent-orchestrator Someone typed a real celebrity into the panel. Have the team check that every on-stage agent refuses correctly and the browser blocks it first.`
4. `@agent-orchestrator Get the site ready to deploy: Ruth, Sam and Grace each sign off, and fix anything they flag.`

## Teach an agent something new
1. On GitHub, open `knowledge/<agent-name>/`, then **Add file → Upload files**, and commit to `main`.
2. In Claude Code: `First pull the latest from main. @agent-<name> Using the new document in your knowledge folder, ...`
