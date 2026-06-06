# Starter prompt — build Aurora from scratch, live

Paste this into a **fresh Claude Code session in an empty folder**. It builds the
whole project the way this repo was actually built: a memory base first, a named
agent team, plan-before-code, a real verification gate, and learnings written back.

Enable the team first:

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

Then paste:

---

Build **Aurora** from scratch — a fictional editorial-luxury e-commerce brand ("A House of Light"): one Next.js app with two surfaces — a customer **storefront** and an operator **command center** — over one deterministic **fake-data seam**. No real data anywhere. Work like a real AI-native team, and **plan before you build**.

**1 · Memory base first.** Write `CLAUDE.md` as the company operating doc — five sections: **Who / What / Who-For / How-We-Talk / What-We-Refuse** — plus a `knowledge-base/` with `voice/`, `customer/`, `standards/`, `decisions/`, `learnings/`, and `index.md`. This is the context the whole team reads before acting.

**2 · Stand up the harness.** Create `.claude/agents/` with a named team, one markdown job description each:
- **director** — orchestrates the team, holds the gates, synthesizes. Never writes code.
- **tpm** — turns the goal into ordered tasks with binary acceptance criteria.
- **cto** — architecture, stack standards, the build/type-check gate, final sign-off.
- **fullstack-engineer** — the surfaces, the fake-data seam, API routes. The one who types.
- **ui-ux-designer** — the editorial-luxury design system, layout, responsive.
- **qa** — Playwright e2e and the verification gate. Proves behavior; never asserts it.

Add `.claude/settings.json` (enable agent teams; a `PreToolUse` guard hook that blocks force-push and flags prod deploys) and `workflows/new-feature.md` — a gated **PLAN → BUILD → VERIFY → SHIP** spec with binary gates.

**3 · Plan first — plan mode.** Propose the full build and wait for my approval before writing any code:
- **Stack:** Next.js 16 (App Router), React 19, **TypeScript strict — no `any`**, Tailwind v4 with **design tokens (never invent a hex value)**, TanStack Query + Table, Recharts (client components only), `jose` for a single mock login, `@faker-js/faker` for seeded deterministic data, **pnpm**.
- **Shape:** one app, two route groups — `app/(store)` (storefront) and `app/(command)` (command center) — plus the seam `src/lib/data-layer/`. **All data flows through the seam**; swapping fake data for a real backend is a one-file change.
- **Conventions:** shared types in `src/lib/types.ts` (one source of truth); `cn()` + formatters in `src/lib/utils.ts`; Server Components by default, `"use client"` only for interactivity/hooks/charts; validate inputs with `zod`; the client never sets a price (resolve it server-side); `data-testid` on interactive elements.

Read me the plan. No code before I approve.

**4 · Build with the team, in parallel.** `director` runs it: `fullstack-engineer` builds the storefront, the command center, and the seam; `ui-ux-designer` builds the design system — they stay in **disjoint files** (two agents in one file is a conflict; two route groups is a team). **The detail that makes it real:** a customer checkout on the storefront **creates an order that appears in the command center** — both read the same seam.

**5 · Prove it, don't assert it.** `qa` adds Playwright and writes the **full-loop test**: storefront PDP → add to cart → checkout → assert that exact order shows up in the command center. Gates: `pnpm build` clean, `pnpm lint` 0 errors, `pnpm test:e2e` green — run it twice to catch flake. Nothing is "done" without the test green and a clickable review link.

**6 · Ship + write it back.** Deploy, give me the live review link, and append what we decided and what we learned to `knowledge-base/decisions/` and `knowledge-base/learnings/` — so the base compounds and the next iteration starts smarter.

Start with step 1. Plan before you build.

---

*That last move — writing decisions and learnings back — is the self-improving harness. Every lap, the team gets sharper.*
