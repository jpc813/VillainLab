# Netlify architecture

The whole app deploys on **Netlify**, free tier, from the `main` branch.

## Recommended design

```
Browser (static site: HTML/CSS/JS, no build step)
 ├── Self-quiz ............ runs 100% in the browser. Never calls a server.
 ├── About / Resources .... static pages
 └── Villain Panel / Spin Doctor / Then vs. Now
        │  one POST per agent, run in parallel from the browser
        ▼
Netlify Function  /api/agent   (netlify/functions/agent.mjs)
        │  reads ANTHROPIC_API_KEY (+ optional APP_PASSWORD) from env vars
        ▼
Claude API (Messages API)

Fallback: /data/panels/<character>.json pre-generated for the 18 starter villains
```

### Why one call per agent
Netlify's standard (synchronous) functions have a hard time limit, and the clock counts time spent waiting on an API. Netlify's docs and forum have historically cited **10 seconds** by default; a Netlify staff post says the default was **raised to 30 seconds** for all plans. **Verify the current limit in the Netlify functions docs before building.** Either way, the safe design is: each function call runs **one** agent with a short, focused prompt, and the **browser** orchestrates (Prosecution and Defense in parallel → Judge). No single call does the whole debate. Netlify **Background Functions** can run up to 15 minutes, but they don't return a response to the browser directly, so they're a poor fit here.

## Keeping the API key secret

- Store the key as a Netlify **environment variable** named `ANTHROPIC_API_KEY`, scoped to Functions, and marked as a secret. Set it in the Netlify UI, never in code or in `netlify.toml`.
- Functions read it with `process.env.ANTHROPIC_API_KEY`.
- Variables declared in `netlify.toml` are **not** available to functions at runtime, another reason to use the UI.
- The browser never sees the key; it only talks to `/api/agent`.

## Keeping costs low

1. **Pre-generate** panels for the 18 starter villains and commit them as JSON. The demo then costs nothing, and works even if the key is missing or the budget runs out.
2. **APP_PASSWORD** (optional env var): the function refuses requests without the right password, so strangers can't spend your credit.
3. **Small, fast models for most agents.** Use a Haiku-class model for the raters and Spin Doctor, a Sonnet-class model for the Judge. Check https://platform.claude.com/docs/en/about-claude/pricing for current model IDs and prices before building.
4. **Cap output length** (`max_tokens`) on every call.
5. **Set a monthly spend limit** for the API workspace in the Claude Console.
6. **Rate-limit politely** in the function (e.g., reject more than a few requests per minute from one visitor).
7. **Allow-list the agent names** the function will run, so it can't be used as a general-purpose free Claude proxy.

## Function contract (draft)

`POST /api/agent`
```json
{ "agent": "prosecution-rater", "character": "Iago", "context": {}, "password": "optional" }
```
Returns `{ "agent": "...", "output": { ...structured JSON... } }` or a friendly error. Real-person names are refused by the Ethics & Safety prompt inside every agent, plus a lightweight check in the browser.

## Files Netlify needs

- `netlify.toml`: publish folder (e.g., `site`), functions folder (`netlify/functions`), redirect `/api/*` → `/.netlify/functions/:splat`.
- `netlify/functions/agent.mjs`: uses built-in `fetch` to call the Messages API (no npm packages required).

## Sources

- Netlify functions & env vars: https://docs.netlify.com/build/functions/environment-variables
- Netlify env var scopes (Functions scope for secrets): https://docs.netlify.com/build/environment-variables/overview/
- Background functions: https://docs.netlify.com/build/functions/background-functions/
- Netlify forum, default timeout raised to 30s: https://answers.netlify.com/t/trying-to-deploy-a-background-function-on-the-pro-plan/125280
- Claude API pricing and models: https://platform.claude.com/docs/en/about-claude/pricing
