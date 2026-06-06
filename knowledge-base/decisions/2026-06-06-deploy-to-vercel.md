# Decision — Aurora deployed to Vercel production (public)

- **Date:** 2026-06-06
- **Status:** accepted
- **Owners:** director, cto, qa, fullstack-engineer
- **Context:** Aurora ran only on localhost. To be a shareable teaching artifact it needed a live, public URL — deployed and *verified*, not just pushed. This entry records how it went live, what was checked first, and the one limitation we accepted on purpose.

## Decision

Deploy `aurora-commerce` to **Vercel production** via the Vercel CLI to a new project, served at a public `*.vercel.app` URL. Ship it behind the existing demo auth gate, with a real session secret set in the Vercel environment and the serverless in-memory limitation accepted and documented.

- **Live URL:** https://aurora-commerce-eta.vercel.app
- **Vercel project:** `christiandeeplearners-projects/aurora-commerce` (GitHub repo auto-connected during `vercel link`)

## Why

- **A live URL is the review link.** "Done" is not a clean build — it is a link a human can click (`../standards/review-links-standard.md`). The deployed storefront and command center are that link.
- **CLI to a new project** was the fastest fully-agent-driven path to a public URL; no dashboard setup required. The repo is now also connected for future git-push deploys if wanted.
- **A teaching artifact must be shareable.** The whole point of the repo is to be revealed; a localhost-only build can't be.

## What was checked before going live

A three-front read-only audit ran first; all gates were green before deploy:

| Gate | Result |
|---|---|
| Public-safety audit | **Clear.** No `.env` committed; `.gitignore` covers `.env*` / `.vercel` / `.next` / `*.pem`; no secrets in git history; fixtures are pure faker (`@aurora-demo.test`, no real PII). |
| `pnpm build` | Clean — 0 type errors. |
| `pnpm lint` | Exit 0 (2 benign React-Compiler "skipped memoization" warnings on TanStack Table). |
| `pnpm seed` determinism | Re-seed produced byte-identical fixtures (empty `git diff`). |
| `pnpm test:e2e` (local) | 3/3 green, run twice, incl. the full checkout → command-center loop. |
| `prod-smoke` (live) | 5/5 green against the deployed URL (home, PDP, collection, auth gate, login + KPI grid). |
| Visual (live) | Storefront hero and command-center overview confirmed by screenshot on the public URL. |

## Locked choices

| Choice | Value |
|---|---|
| Host | Vercel, production, default Node server output (no `vercel.json`, no `output` override) |
| Deploy method | Vercel CLI — `vercel --prod --yes` to a new project |
| Public URL | https://aurora-commerce-eta.vercel.app |
| Session secret | `AURORA_SESSION_SECRET` set in Vercel **production env only** (never committed); replaces the `not-for-production` fallback in `src/lib/auth.ts` |
| Auth posture | Command center behind the demo gate (any email + password `aurora`, disclosed on `/login`); storefront fully public; all data fake |
| Live verification | `PLAYWRIGHT_BASE_URL` override + `e2e/prod-smoke.spec.ts` (read-only; no state mutation) |

## Consequences

- The live URL is now the canonical review link for Aurora.
- The GitHub repo is connected to the Vercel project; pushing to the default branch can auto-deploy (verify branch settings before relying on it).
- **Accepted limitation:** the in-memory data seam resets on serverless cold starts, so a storefront checkout is only visible in the command center within the same warm instance. Durable orders are a noted backlog item, not a bug. See `../learnings/2026-06-06-in-memory-seam-resets-on-serverless.md`.
- To rotate the secret or redeploy, see `../../DEPLOYMENT.md`.

## Alternatives considered

- **GitHub → Vercel dashboard auto-deploy.** Deferred: more up-front dashboard clicks; the CLI path was faster and fully scriptable. (The repo is connected, so this can be enabled later.)
- **Add a database for durable orders.** Deferred: expands scope and delays going live; the fake-data seam is the teaching point, and fake data is demo-safe as-is.
- **Keep-warm / single-region mitigation.** Deferred: only partially hides the cold-start reset and adds config without real durability.
