# Learning — Verify a live deploy with a read-only smoke, not the full loop

- **Date:** 2026-06-06
- **Tags:** verification, playwright, deployment, testing
- **Confidence:** high

## The learning

The full-loop e2e (`e2e/storefront-checkout.spec.ts`) is a **local** gate by design: it mutates one shared in-memory world and asserts a freshly-placed order appears in the command center. That assertion is meaningless — and flaky — against serverless production, where state doesn't persist across instances (see `2026-06-06-in-memory-seam-resets-on-serverless.md`).

So "run the e2e against prod" is the wrong instinct. Instead, split verification into two tiers:

1. **Local, full behavior:** run the whole suite against `pnpm dev`/`start` (one process, shared world). This is the real gate — it proves the logic, including checkout.
2. **Live, read-only smoke:** a separate spec that only *reads* — pages render, the auth gate redirects, login succeeds, the KPI grid shows — pointed at the deployed URL. No mutation, so serverless cold starts can't make it lie.

We implemented tier 2 by making `playwright.config.ts` honor `PLAYWRIGHT_BASE_URL` (when set, it skips the local `webServer` and targets the URL) and adding `e2e/prod-smoke.spec.ts`. Live check:

```
PLAYWRIGHT_BASE_URL=https://aurora-commerce-eta.vercel.app pnpm test:e2e e2e/prod-smoke.spec.ts
```

## Why it matters

A green "live" test that secretly depends on warm-instance state is worse than no live test — it reports confidence it can't back. Read-only smoke against the real URL is honest: it proves the deployment serves the current code, the auth boundary holds, and the operator console renders — exactly the things a deploy can break — without ever depending on persistence the platform doesn't give you.

## The rule it implies

- One env var (`PLAYWRIGHT_BASE_URL`) turns the local harness into a remote smoke harness — no second framework.
- Live smoke specs **never mutate**. If a check needs to create state, it belongs in the local tier.
- Pair the smoke run with a couple of `curl` status checks (`/` → 200, `/overview` → 307 → `/login`) and a screenshot of each surface. That trio — smoke green, status codes right, surfaces visibly rendered — is the live review link.

## Connects to

- Decision: `../decisions/2026-06-06-deploy-to-vercel.md` (this was the live verification used).
- Standard: `../standards/review-links-standard.md` (verify → produce the link → send it).
- Learning: `2026-06-06-in-memory-seam-resets-on-serverless.md` (the reason the loop test is local-only).
