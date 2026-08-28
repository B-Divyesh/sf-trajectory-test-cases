# Review 3 handoff — FAIL

## What was done

Performed the requested independent, read-only adversarial review of the live
site and candidate `7f3c163`. No product code was changed. Added
`.factory/review-3.md` with the complete review and copy audit.

## How verified

- Used fresh 390 × 844 and 1440 × 1000 browser contexts on the live site.
- Entered the one-click demo, verified the initial mobile sample/PASS result,
  changed its events to fail, reset it, exited it, inspected storage, and
  recorded requests.
- Created a clean local clone, ran `npm ci`, then ran every one of the 17
  `.factory/claims.json` commands successfully.
- Ran `npm test` (36 unit and 18 browser tests), `npm run lint`,
  `npm run build`, `npm pack --dry-run`, and the live URL verifier successfully.
- Checked all real routes, route metadata, h1 focus and announcements, mobile
  overflow, the designed 404, and all HTTP links.
- Read every earlier review, polish, verification, and handoff record and
  confirmed F-1-1 through F-1-5 and F-2-1 remain fixed live and in code.

## Remaining work

One P2 finding remains: landing `<h2 id="playground-title">` says “Break a
fixture. Read the evidence.” This is a slogan rather than a self-contained
section name. Replace it with literal copy such as “Test a fixture with sample
events,” change “Local trace bench” to “Fixture checker,” and add an exact-copy
regression test. The review verdict is therefore FAIL until that is deployed
and independently rechecked.
