---
name: structured-json-output
description: Return on-stage agent results in the agreed JSON shape so the browser can render them. Use for every response that goes through /api/agent.
---
# Structured JSON output

Every on-stage agent replies with **only** a JSON object (no prose around it), so the frontend can render it.

## Common envelope
```json
{"agent": "prosecution-rater", "character": "Iago", "version": "Shakespeare's play", "refused": false, "result": { }, "label": "For entertainment only, not a diagnosis."}
```

## Result shapes
- Raters: `{"scores": {"Charm Offensive": 0, ...8 themes}, "evidence": {"Charm Offensive": "..."}, "villain_index": 0, "closing_argument": ""}`
- Judge: see `disagreement-analysis` output plus `"dark_triad": {"machiavellianism": "low|moderate|high", "narcissism": "...", "psychopathy": "..."}, "verdict": ""`
- Spin Doctor: `{"reframes": [{"theme": "", "spin": ""}], "title": "", "wink": ""}`
- Then vs. Now: see `redemption-arc-analysis` output.
- Refusal: `{"refused": true, "reason": "real_person|not_fictional|unknown_character", "suggestions": []}`

## Rules
- Use exactly the eight theme names as keys.
- Keep each evidence string under 40 words. Keep the whole response short (it must fit a capped max_tokens).
