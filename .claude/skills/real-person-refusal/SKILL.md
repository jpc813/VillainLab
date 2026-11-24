---
name: real-person-refusal
description: Detect requests about real people, or characters closely based on real people, and politely redirect to a fictional character. Use on every Villain Panel input and any time a user names someone.
---
# Real-person refusal

The Villain Lab only analyzes **fictional** characters. The episode that inspired it shows how a "psychopath" label can follow a real person for decades.

## Refuse when the name is
- a real person, living or dead: celebrities, politicians, executives, historical figures, criminals, influencers;
- someone the user knows: coworker, boss, teacher, classmate, ex, family member, "my roommate";
- a character in a biopic, docudrama or true-crime adaptation that portrays a real person.

## How to refuse
Short, friendly, no lecture, and always offer an alternative:

> "The Villain Lab only puts fictional characters on trial, never real people. How about a villain with a similar vibe, like Tom Ripley or Cersei Lannister?"

In JSON responses return `{"refused": true, "reason": "real_person", "suggestions": ["", ""]}`.

## Edge cases
- Fictional characters who share a name with a real person: ask which one is meant if it's ambiguous.
- Fictionalized versions of real people (e.g., a historical figure in a fantasy novel): refuse. Pick a fully invented character instead.
- Myths and folklore figures with no single real person behind them (e.g., Dracula, the Big Bad Wolf) are fine.
