# Deploying Aurora

> Aurora is live on Vercel: **https://aurora-commerce-eta.vercel.app**
> This runbook is how it got there and how to redeploy, verify, and roll back.
> It pairs with `workflows/pre-deployment.md` (the gate sequence) and
> `knowledge-base/decisions/2026-06-06-deploy-to-vercel.md` (why).

Aurora is a public **teaching artifact**. Everything below assumes that: the data
is fake, the auth is a demo gate, and the repo is meant to be read. Nothing here
exposes anything real — see **What is public / what is safe** at the bottom.

---

## TL;DR

```bash
# one-time, you (interactive — only a human can authenticate):
vercel login

# from the repo root:
pnpm build && pnpm lint && pnpm test:e2e   # local gate (see below)
vercel --prod --yes                        # build + deploy to production
```

The production URL is the review link. Verify it before calling it done.

---

## Prerequisites

- **Node 20+** (`package.json` pins `engines.node >= 20`; local dev used v24).
- **pnpm** (the repo's package manager).
- **Vercel CLI** — `npm i -g vercel` (this deploy used v54.9.1).
- **A Vercel login** — `vercel login`. The agent cannot do this for you; account
  authentication is always a human action. Current project owner: the
  `christiandeeplearners-projects` scope.

The project is already linked (`vercel link` → `christiandeeplearners-projects/aurora-commerce`),
and the GitHub repo is connected, so `vercel --prod` from the repo root just works.

---

## The deploy, step by step (what we actually ran)

1. **Local pre-deploy gates** (all must be green — `workflows/pre-deployment.md`):
   - `pnpm build` → 0 type errors.
   - `pnpm lint` → exit 0 (2 benign React-Compiler warnings on TanStack Table are expected).
   - `pnpm seed` → `git diff fixtures/` empty (deterministic).
   - `pnpm test:e2e` → all specs green, **run twice** (catch flake). If you see
     impossible failures, suspect a stale `:3000` server —
     `lsof -ti tcp:3000 | xargs kill` and re-run (see the learnings).
2. **Link the project** (one-time): `vercel link --yes`.
3. **Set the session secret** (before first public deploy):
   ```bash
   printf '%s' "$(openssl rand -base64 32)" | vercel env add AURORA_SESSION_SECRET production
   ```
4. **Deploy to production:** `vercel --prod --yes`.
5. **Verify the live URL** (next section).

---

## Environment variables

| Var | Where | Required? | Notes |
|---|---|---|---|
| `AURORA_SESSION_SECRET` | Vercel → Project → Settings → Environment Variables (Production) | Recommended | Signs the mock-session JWT. Set to a strong random value; **never committed**. Without it, `src/lib/auth.ts` falls back to a `not-for-production` demo secret. |
| `NODE_ENV` | Set automatically by Vercel | n/a | `production` enables the `secure` cookie flag. |

No `NEXT_PUBLIC_*` vars, no database, no third-party keys. That's the whole list.

**Rotate the secret:**
```bash
vercel env rm AURORA_SESSION_SECRET production
printf '%s' "$(openssl rand -base64 32)" | vercel env add AURORA_SESSION_SECRET production
vercel --prod --yes   # redeploy so the new value takes effect
```

---

## Verifying a deployment

Local proves behavior; live proves the deploy. Do both.

- **Local (full behavior):** `pnpm test:e2e` against `pnpm dev`/`start` — one process,
  shared in-memory world, so the full checkout → command-center loop is meaningful.
- **Live (read-only smoke):** never assert on freshly-created state in serverless.
  ```bash
  PLAYWRIGHT_BASE_URL=https://aurora-commerce-eta.vercel.app pnpm test:e2e e2e/prod-smoke.spec.ts
  curl -s -o /dev/null -w "%{http_code}\n" https://aurora-commerce-eta.vercel.app/          # 200
  curl -s -o /dev/null -w "%{http_code}\n" https://aurora-commerce-eta.vercel.app/overview  # 307 → /login
  ```
  Then eyeball both surfaces (storefront home + command-center overview after demo login).
  Smoke green + right status codes + surfaces rendered = the live review link.

Why split this way: see
`knowledge-base/learnings/2026-06-06-verifying-a-live-deploy-when-the-loop-test-is-local.md`.

---

## Known limitation: serverless resets in-memory state

Aurora's data is an in-memory seam seeded at module load. On serverless, each
instance has its own world and cold starts wipe fresh mutations. **A storefront
checkout only appears in the command center within the same warm instance.** The
seeded data (KPIs, existing orders, the funnel) always looks right because it is
rebuilt deterministically on every start — only freshly placed orders are at risk.

This is accepted for a teaching demo. To make the live checkout→orders moment
fully reliable, demo it locally, or swap the in-memory store for a real backend
behind the same `src/lib/data-layer/` interface (a one-layer change). Detail:
`knowledge-base/learnings/2026-06-06-in-memory-seam-resets-on-serverless.md`.

---

## Rollback

```bash
vercel ls                       # list recent deployments
vercel rollback <deployment-url># promote a previous deployment to production
```
Or redeploy a known-good commit with `vercel --prod`.

---

## What is public / what is safe

- **Public, no login:** the entire storefront (`/`, collections, product pages,
  cart, checkout). Reads only the fake-data seam.
- **Behind the demo gate:** the command center (`/overview`, `/orders`, `/products`,
  `/customers`, `/analytics`, `/agents`). The gate is intentionally weak — **any
  email + password `aurora`**, and the credentials are printed on `/login`. Anyone
  can enter; that is by design for a teaching artifact.
- **Safe because the data is fake.** Every customer, order, and KPI is seeded
  `@faker-js/faker` output (`@aurora-demo.test` emails). There is no real PII, no
  real money, no external service. The command center is labeled "LIVE · FAKE DATA".
- **No secrets in the repo.** `.gitignore` covers `.env*` / `.vercel` / `.next` / `*.pem`;
  there are no committed secrets and none in git history. The only real secret,
  `AURORA_SESSION_SECRET`, lives in Vercel's environment, never in git.

If Aurora ever swaps fake data for real, this section must be revisited **before**
the next deploy — the demo auth gate and printed credentials are safe only because
nothing behind them is real.
