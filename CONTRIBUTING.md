# Contributing

## Workflow
1. Create a branch: `feat/...`, `fix/...`, `chore/...`
2. Open a PR into `main`
3. Keep PRs small (one feature per PR)

## Code boundaries
- Never import `/server/*` from UI components
- API routes in `/app/api/*` must be thin controllers that call `/server/services/*`
- Inngest functions live in `/inngest/*` and call `/server/services/*`

## AI usage rules
When using AI, request:
- minimal diffs
- files changed list
- how to run + verify locally
