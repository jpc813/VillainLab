# The Villain Lab: research docs

Context for the agent team that builds and runs **The Villain Lab**: an app where AI agents debate whether famous *fictional* villains fit the psychopathy profile, inspired by *This American Life* #436, "The Psychopath Test" (2011).

## What the app does

1. **Villain Panel**: a Prosecution Rater and a Defense Rater score the same fictional character; a Judge explains why they disagree and gives a Dark Triad-style verdict.
2. **Spin Doctor**: reframes every dark trait as a "leadership strength."
3. **Then vs. Now**: separates a character's past from who they become.
4. **"Too Neurotic to Be a Psychopath?"**: an original, private, for-fun self-quiz.
5. **About** (how a radio staff all scored zero, names changed) and **Resources** pages.

## Index

| File | What's in it |
|---|---|
| [01-episode-summary.md](01-episode-summary.md) | The episode, in our own words, with fictitious names, and how each part maps to a feature |
| [02-psychopathy-science.md](02-psychopathy-science.md) | What psychopathy is, how the PCL-R works at a high level, its limits |
| [03-adversarial-allegiance.md](03-adversarial-allegiance.md) | Research showing experts lean toward the side that hired them, the basis of the Villain Panel |
| [04-dark-triad.md](04-dark-triad.md) | Psychopathy vs. narcissism vs. Machiavellianism |
| [05-ethics-and-copyright.md](05-ethics-and-copyright.md) | Never reproduce the PCL-R, no diagnosis, no rating real people |
| [06-fictional-characters.md](06-fictional-characters.md) | 18 starter villains and antiheroes |
| [07-netlify-architecture.md](07-netlify-architecture.md) | Static site + one Netlify Function, API key handling, cost controls |
| [privacy-rules.md](privacy-rules.md) | Non-negotiable privacy requirements and how to verify them |
| [08-zoom-demo-guide.md](08-zoom-demo-guide.md) | Running the class demo over Zoom |
| [09-about-page-story.md](09-about-page-story.md) | The About page text and the (unpublished) name key |
| [sources.md](sources.md) | Every link, for the Resources page |
| [agent-brains.md](agent-brains.md) | Each agent's name, model, personality and why |
| [how-to-talk-to-your-experts.md](how-to-talk-to-your-experts.md) | Example prompts for one agent or the whole team |
| [expert-roster.md](expert-roster.md) | The 15-agent team, their personalities and models, the 18 shared skills, and the trait themes |

## Ground rules for every agent

- **Fictional characters only.** Politely refuse real people.
- **Entertainment, not diagnosis.** Never call anyone a psychopath in a clinical sense.
- **Original content.** Never reproduce PCL-R items; summarize sources in our own words.
- **Privacy first.** Quiz data never leaves the browser and is never saved.
