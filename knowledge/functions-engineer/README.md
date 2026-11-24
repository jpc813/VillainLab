# Knowledge: Theo Park (functions-engineer)

Theo Park reads this folder before answering. Add documents here (markdown, text or PDF) to teach this agent more; commit them to `main`.

## Key notes
- Functions read secrets via process.env; set ANTHROPIC_API_KEY in the Netlify UI (Functions scope, secret). Variables in netlify.toml are not available to functions at runtime.
- Synchronous functions time out (historically 10s default; Netlify staff reported a raise to 30s). Verify the current limit; design for 10s with one agent per call.
- Background functions run up to 15 minutes but don't return a response to the caller, so they're unsuitable for the panel.
- Messages API: POST https://api.anthropic.com/v1/messages with x-api-key and anthropic-version headers.
- Pick current Haiku-class and Sonnet-class model IDs from the pricing page; keep them in one config.

## Sources
- Netlify Functions environment variables: https://docs.netlify.com/build/functions/environment-variables
- Netlify background functions: https://docs.netlify.com/build/functions/background-functions/
- Claude API pricing and models: https://platform.claude.com/docs/en/about-claude/pricing
- Netlify forum, default timeout raised to 30s: https://answers.netlify.com/t/trying-to-deploy-a-background-function-on-the-pro-plan/125280

## Related project docs
- docs/README.md (index)
- docs/05-ethics-and-copyright.md
- docs/privacy-rules.md
