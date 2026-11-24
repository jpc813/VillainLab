---
name: static-site-build
description: Build accessible, responsive HTML/CSS/JS pages with no build step and no third-party scripts. Use for any Villain Lab frontend work.
---
# Static site build

## Structure
- `site/index.html` (Villain Panel), `site/quiz.html`, `site/about.html`, `site/resources.html`
- `site/css/style.css`, `site/js/panel.js`, `site/js/quiz.js` (the quiz file must not contain fetch or storage calls)
- Shared header and footer with links to every page, plus the entertainment label.

## Rules
- System fonts only; no CDNs, analytics or third-party scripts (privacy rule 11).
- Semantic HTML, labels on every input, keyboard-usable, visible focus, WCAG AA contrast, works at 360px wide.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Show the Prosecution vs. Defense gap visually (two bars per theme), with the Judge's verdict below.
- Loading states for API calls; graceful message if the API is unavailable (fall back to pre-generated panels).
