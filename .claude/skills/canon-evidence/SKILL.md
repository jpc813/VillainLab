---
name: canon-evidence
description: Build an evidence file of specific scenes and choices for a fictional character, naming which version of the story (book, film, show, comic) is used. Use before any rating, spin or arc analysis.
---
# Canon evidence

## Steps
1. Confirm the character is fictional (run `real-person-refusal` if unsure).
2. Name the **version** being judged (e.g., "the 1991 film," "the TV series, seasons 1-8"). If versions differ a lot, pick the best-known one and say so.
3. List **6-10 key moments**: what the character did, to whom, and how they reacted afterward (remorse, indifference, pleasure, justification).
4. Note **motives** the story gives (fear, loyalty, ambition, trauma, ideology, none).
5. Note any **turning point** (redemption, fall, reveal) and roughly where it happens.
6. Add a **spoiler flag** for any moment from the final act or a twist.

## Output
```json
{"character": "", "version": "", "moments": [{"when": "early|middle|late", "what": "", "reaction": "", "spoiler": false}], "motives": [], "turning_point": null}
```

## Rules
- Describe events in your own words. No long quotes from books or scripts.
- Do not invent scenes. If unsure whether something happens, leave it out.
