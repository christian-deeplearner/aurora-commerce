# Learning — A reused dev server can silently test stale code

- **Date:** 2026-06-06
- **Tags:** verification, playwright, gotcha, deployment
- **Confidence:** high

## The learning

`playwright.config.ts` sets `reuseExistingServer: !process.env.CI`. That is the right default — but it means: if **any** server is already bound to port 3000, Playwright uses it instead of starting a fresh one from current code. During the deploy prep, an older `next dev` from a previous working state was still on :3000, serving a home page that no longer existed in the source (an old hero headline). All three e2e specs failed — not because the code was broken, but because the suite was testing a **ghost**.

The tell: the build was clean and `curl localhost:3000/` returned 200, yet the served HTML contained headings (`Chosen for you`, `Made to keep`) that `grep` could not find anywhere in `src/`. Served content that doesn't exist in the source = stale server, not a real failure.

## Why it matters

This failure mode is a confidence trap in both directions. A stale server can make good code look broken (what happened here) — or, worse, make broken code look fine, by serving an older, working version. Either way the gate is lying, and you can burn a long time "fixing" code that was never the problem.

## The rule it implies

- Before trusting a local e2e run, confirm the server under test is **current**: grep one string that only exists in the current source and assert it's in the served HTML, or just start clean.
- When results look impossible (clean build, failing tests, or served text absent from source), suspect the server before the code: `lsof -ti tcp:3000 | xargs kill`, then re-run. Two consecutive clean runs from a fresh server is the real green.
- For deployment verification specifically, this risk vanishes on the live URL — the deployed build is unambiguously the current one. It's the *local* gate that needs the freshness check.

## Connects to

- Decision: `../decisions/2026-06-06-deploy-to-vercel.md` (this was caught and corrected during pre-deploy gates).
- Learning: `2026-06-06-verifying-a-live-deploy-when-the-loop-test-is-local.md` (the other half of trustworthy verification).
