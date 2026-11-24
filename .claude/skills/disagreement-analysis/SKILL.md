---
name: disagreement-analysis
description: Compare two ratings of the same character, find the biggest gaps and explain which evidence each side leaned on. Use for the Judge and for summarizing panels.
---
# Disagreement analysis

Demonstrates **adversarial allegiance** (Murrie et al., 2013): experts lean toward the side that hired them, even looking at the same file.

## Steps
1. Put both raters' theme scores side by side; compute the gap for each theme and the Villain Index gap.
2. Pick the **top 2-3 themes** with the largest gaps.
3. For each, explain: what evidence did Prosecution emphasize? What did Defense emphasize or reframe? Did either stretch the evidence?
4. Give the Judge's own fair score per theme (usually between the two, not always the average).
5. One-sentence takeaway that makes the gap the star: "Same character, same evidence, a 23-point disagreement."

## Output
```json
{"gaps": [{"theme": "", "prosecution": 0, "defense": 0, "why": ""}], "judge_scores": {}, "villain_index": 0, "takeaway": ""}
```
