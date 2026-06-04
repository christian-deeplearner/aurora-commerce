# Aurora — Customer Notes

> Running notebook of what we learn about how Aurora customers actually behave. This is a memory base: it starts seeded and compounds. New observations append with a date.

All names and figures are seeded/fictional. No real customer data lives here.

## Standing observations (seed)

- **High AOV, low frequency.** The Aurora buyer spends well and returns in a season, not a week. Optimize the command center for value-per-customer, not order count. (See `icp.md`.)
- **The collection one-liner decides the scroll.** In seeded session data, sessions that read past the collection hero convert 4x the ones that bounce on it. The serif one-liner is the highest-leverage 8 words on the site.
- **Returns are a quality signal, not a failure.** Imogen-type buyers return fit, keep material. A low return rate on a collection means the size/fit copy on the PDP is doing its job.
- **No-account checkout wins.** Guest checkout completes at a materially higher rate than account-gated checkout. Do not gate the purchase behind a signup.
- **Email fatigue is real.** This buyer unsubscribes fast. The "NOTIFY ME" footer is permission to contact once, well — not a list to blast.

## How to add a note

```
## YYYY-MM-DD — <short title>

What we observed (one or two lines, concrete).
What it implies for storefront / command center / voice.
Confidence: low | medium | high. Source: seeded data | rehearsal | live.
```

Keep notes atomic. One observation per entry. When a note hardens into a rule the build must honor, promote it to `../standards/` and link back here.

## Log

### 2026-06-03 — Seed established
The seeded fixtures (`scripts/generate-fixtures.ts`, deterministic) encode the high-AOV/low-frequency Imogen pattern. The command-center Overview and Analytics surfaces are built to read that pattern, not generic e-commerce volume. Confidence: n/a (by construction). Source: seeded data.
