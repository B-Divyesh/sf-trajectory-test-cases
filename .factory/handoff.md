# Review 2 handoff — FAIL

## Outcome

Completed the requested adversarial first-read review without changing product
code. The review is in `.factory/review-2.md`.

The deployed product is **not accepted**: `F-2-1` is blocking. On a fresh
390 × 844 demo entry, the editor begins around 997 px below the viewport and
the `PASS` sample result around 1,860 px below it. The first screen says a
sample is loaded but does not visibly show the product using that sample.

## Verification completed

- Fresh 390 × 844 and 1440 × 1000 live-page reads; no console error or
  horizontal overflow.
- Fresh live demo exercise: banner, passing sample, failing edit, reset, leave,
  isolated `demo:` session storage, empty local storage, and no post-load
  requests.
- Fresh clone at `/tmp/trajectory-test-cases-review-2`: `npm ci`; every command
  listed by all 17 `.factory/claims.json` entries; `npm test` (36 unit + 18
  browser tests); `npm run lint`; `npm run build`; and `npm pack --dry-run`.
  All passed.
- Live `npm run verify:url -- https://trajectory-test-cases.sociobot.in` passed
  for all standard routes and 404. Metadata, focus, route skeleton, link
  crawl, privacy/network behavior, history findings, visual identity, and
  scope were checked.

## Next step

Move a compact seeded trace and its `PASS` evidence into the initial 390 px
demo viewport (or compact the intro enough for the existing trace to appear),
then add a mobile viewport regression test and repeat the full review.
