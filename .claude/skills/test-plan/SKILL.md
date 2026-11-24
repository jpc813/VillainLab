---
name: test-plan
description: Write and run the Villain Lab test checklist: features, real-person refusal, no-API fallback, privacy and mobile. Use before every deploy.
---
# Test plan

## Features
- [ ] Each of the 18 starter villains loads a pre-generated panel.
- [ ] A non-starter fictional character runs a live panel (when the API key is set).
- [ ] Spin Doctor and Then vs. Now buttons work.
- [ ] Quiz: all 12 questions, every result tier reachable, Hide my result works.
- [ ] About and Resources pages load; all Resources links work.

## Safety
- [ ] Real people (a celebrity, a politician, "my boss") are refused with suggestions, in the browser and by the function.
- [ ] No result text says "diagnosis" or calls anyone a psychopath clinically.

## Resilience
- [ ] With no API key or a wrong password, the site shows a friendly message and still serves the starter panels.
- [ ] Unknown agent names return 400 from the function.

## Privacy
- [ ] `privacy-audit` passes.

## Devices
- [ ] Phone width (360px), tablet, desktop; light and dark mode; keyboard only.
