# Learning — The in-memory seam resets on serverless cold starts

- **Date:** 2026-06-06
- **Tags:** architecture, fake-data, serverless, vercel, deployment
- **Confidence:** high

## The learning

Aurora's fake-data seam builds one mutable world in memory at module load and stashes it on `globalThis` (`src/lib/data-layer/fake/store.ts`). On a long-lived server (local `next dev` / `next start`) that world persists for the whole process, which is exactly why the storefront-checkout → command-center loop works: `createOrder()` writes into the same in-memory array the command center reads.

On **Vercel serverless**, that assumption partially breaks. Each function instance has its *own* in-memory world, and instances come and go with cold starts. So a checkout placed on one instance is visible in the command center **only while the same warm instance serves both requests**. After a cold start — or if a different instance handles the next request — the freshly placed order is gone.

## Why it matters

The most quotable demo moment ("I just checked out, and look — the order shows up in the command center") is reliable **locally** and *probabilistic* in serverless production. If you stage that moment live on the deployed URL without knowing this, it can silently fail in front of an audience: the order simply won't appear, with no error to explain why.

It does not affect the seeded data (KPIs, existing orders, customers, the funnel) — that is rebuilt deterministically on every cold start, so it always looks right. Only **freshly mutated** state is at risk.

## The rule it implies

- For the live checkout→orders moment, demo it **locally** (`pnpm dev`/`start`, one process) where the shared world holds — or accept it may not persist in serverless prod and say so.
- Verify deployed builds with **read-only** checks only; never assert on freshly created state across requests in serverless (`../../e2e/prod-smoke.spec.ts` deliberately does no checkout). See `2026-06-06-verifying-a-live-deploy-when-the-loop-test-is-local.md`.
- The durable fix is the seam's own promise: swap the in-memory store for a real backend behind the same interface (`src/lib/data-layer/`) — a one-layer change, not an app rewrite.

## Connects to

- Decision: `../decisions/2026-06-06-deploy-to-vercel.md` (accepted this as a known limitation).
- Learning: `2026-06-03-fake-data-seam-keeps-the-demo-honest.md` (the same seam; this is its serverless edge case).
- Runbook: `../../DEPLOYMENT.md` (the caveat, restated for operators).
