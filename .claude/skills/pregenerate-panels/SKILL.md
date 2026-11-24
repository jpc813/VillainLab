---
name: pregenerate-panels
description: Produce and commit pre-generated Villain Panel JSON for the 18 starter villains so the demo works without live API calls. Use after the agents' prompts are final.
---
# Pre-generate panels

## Steps
1. For each character in `docs/06-fictional-characters.md`, run the full panel: prosecution-rater, defense-rater, judge, spin-doctor, then-vs-now-analyst (the last only for characters with an arc).
2. Validate each result against `structured-json-output`.
3. Save to `site/data/panels/<slug>.json` (slug: lowercase, hyphens), and write `site/data/panels/index.json` listing all slugs and display names.
4. Have the ethics-safety-reviewer spot-check at least five files.
5. Commit. The frontend loads these first and only calls the API for other characters.
