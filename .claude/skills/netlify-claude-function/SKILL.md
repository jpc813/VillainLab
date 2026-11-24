---
name: netlify-claude-function
description: Call the Claude Messages API from a Netlify Function with env-var secrets, an agent allow-list, max_tokens caps, an optional APP_PASSWORD and light rate limiting. Use when building or changing /api/agent.
---
# Netlify Claude function

## Shape
- File: `netlify/functions/agent.mjs`, modern Netlify syntax: `export default async (req, context) => Response`.
- Route: `netlify.toml` redirects `/api/*` to `/.netlify/functions/:splat`.
- Use built-in `fetch` to `https://api.anthropic.com/v1/messages` with headers `x-api-key`, `anthropic-version: 2023-06-01`, `content-type: application/json`. No npm packages needed.

## Security and cost
1. Read `process.env.ANTHROPIC_API_KEY` (set in the Netlify UI, Functions scope, marked secret; **not** in netlify.toml, which functions can't read at runtime).
2. If `process.env.APP_PASSWORD` is set, reject requests without a matching password (401).
3. **Allow-list** agents: prosecution-rater, defense-rater, judge, spin-doctor, then-vs-now-analyst. Reject anything else (400).
4. Load each agent's system prompt from a bundled prompts file; never accept a system prompt from the browser.
5. Cap `max_tokens` (around 700 for raters and spin, 900 for the judge). Character name max 60 chars.
6. Simple in-memory rate limit per IP (best effort; functions are stateless).
7. One agent per request so each call finishes inside Netlify's synchronous time limit (verify the current limit in Netlify's docs; design for 10s).
8. Never log request bodies. Return friendly JSON errors.

## Models
Pick current model IDs from https://platform.claude.com/docs/en/about-claude/pricing (Haiku-class for raters and spin, Sonnet-class for the judge). Keep them in one config object.
