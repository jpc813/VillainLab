# Privacy rules (non-negotiable)

Owner: **Privacy Engineer** agent. Sign-off required from the Privacy Engineer and the Ethics & Safety Reviewer before every deploy.

## The self-quiz

1. **Runs entirely in the browser.** Questions, answers, scoring and results live in page memory only.
2. **Nothing leaves the page.** Quiz answers and results are never sent to any server, Netlify Function, the Claude API, analytics, error trackers, logs or third-party scripts.
3. **Nothing is saved.** No accounts, no `localStorage`, `sessionStorage`, IndexedDB or cookies for quiz data. Refreshing the page clears everything.
4. **Takes only about yourself.** There is no mode to answer questions about another person.
5. **"Hide my result" button** clears the result from the screen instantly.
6. **No share buttons** for personal results. (Villain verdicts may be shared.)
7. **Clear notice** on the start and results screens: *"For entertainment only, not a diagnosis. Your answers never leave this page and aren't saved."*

## The Villain Panel

8. **Fictional characters only.** Real people are refused politely, in the browser and in every agent's instructions.
9. The function receives only the agent name, the character name and panel context. **No personal data.**
10. No logging of request bodies in the function beyond what Netlify records by default.

## Site-wide

11. **No analytics or tracking scripts.** No third-party fonts or scripts that phone home are needed; use system fonts.
12. A short **Privacy** section on the About page restates rules 1–11 in plain English.

## How the Privacy Engineer verifies

- Search the code for `fetch(`, `XMLHttpRequest`, `navigator.sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie` and any third-party `<script src>`. Every hit must be justified and none may touch quiz data.
- Load the quiz with the browser's Network tab open, take it, and confirm **zero** network requests are made from start to result.
- Confirm a page refresh shows a blank quiz.
