---
name: privacy-audit
description: Run the Villain Lab privacy checklist: code search plus a Network-tab test proving quiz data never leaves the browser and nothing is stored. Use before every deploy.
---
# Privacy audit

## 1. Code search
Search the site and functions for: `fetch(`, `XMLHttpRequest`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, `<script src="http`, analytics, tracking.
- Every `fetch` must be in Villain Panel code and send only `agent`, `character`, panel context and an optional password.
- **No** quiz module may import or call any of the above.

## 2. Network test
Open the quiz, open DevTools > Network, clear it, take the whole quiz, view the result, press "Hide my result." **Expect zero requests.**

## 3. Storage test
DevTools > Application: localStorage, sessionStorage, cookies and IndexedDB must hold nothing from the quiz. Refresh: the quiz must be blank.

## 4. Copy check
The start and result screens show: "For entertainment only, not a diagnosis. Your answers never leave this page and aren't saved."

## Report
Pass/fail per check, with file and line for any failure. Deploy is blocked until all pass.
