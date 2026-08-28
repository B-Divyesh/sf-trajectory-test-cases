# Polish 1 handoff — PASS

## Outcome

Perfection-loop round 1 resolves every finding in `.factory/review-1.md`.
Trajectory Test Cases remains a TypeScript npm library with ESM, CommonJS,
declarations, schema, and CLI. The documentation/demo remains a static Vite
site built to `dist/site` with the evidence-bench visual system intact.

The repair code commit is `1ad6e6c`. It was pushed to `origin/main`, built, and
deployed through `/opt/fleet/lib/deploy-static.sh trajectory-test-cases
dist/site`. The live site is
<https://trajectory-test-cases.sociobot.in/>. The complete finding map is in
`.factory/polish-1.md`.

## What changed

- Rewrote the first screen with a verb-first job statement and concrete facts.
- Added direct `/?demo=1` entry, one-click sample loading, persistent demo
  controls, complete `demo:` session isolation, reset, and clean exit.
- Expanded the claims manifest to 17 entries and added one behavioral test for
  every previously unproved browser, matcher, recorder, package, and CLI claim.
- Added route-specific title/canonical/Open Graph/Twitter metadata, a 1200 ×
  630 social image, and a 180 × 180 touch icon to every route and the 404.
- Standardized header/footer navigation, legal links, Param Factory credit,
  version, focus transfer, route announcement, browser-back behavior, and the
  real 404 response.
- Replaced noun-only example labels and vague section jargon with literal
  verb-led copy. Updated the copy audit, demo guide, design provenance, catalog
  description, and verification script.
- Kept Demo and Privacy visible at 390 px, stacked the workbench cleanly, and
  retained the sticky demo status/actions without horizontal overflow.

## Exact verification evidence

Clean GitHub clone `/tmp/ttc-clean-0fzIOT` at `1ad6e6c`:

```sh
npm ci
npm run lint
# Every `test` command from .factory/claims.json, run independently
npm test
npm run build
npm pack --dry-run
npm audit
```

- Install/audit: 96 packages; 0 vulnerabilities.
- Claims: 17/17 independent manifest commands passed; claim lint found exactly
  one tag per manifest entry.
- Unit/integration: 36/36 passed across five files.
- Browser: 18/18 passed. Coverage includes all-route metadata and Axe scans,
  direct and back-navigation focus, desktop/dark, 390 × 844 home and demo,
  keyboard Enter/Space, demo reset/exit isolation, privacy interception,
  deterministic replay, and offline reload.
- Build: `dist/site/index.html` exists; initial application JavaScript is 9.39
  KB (3.39 KB gzip), shared JavaScript is 1.57 KB (0.80 KB gzip), and CSS is
  15.00 KB (4.03 KB gzip). The social image is 34.6 KB.
- Package: `npm pack --dry-run` produced a 10.4 KB archive containing nine
  publishable files.
- Lighthouse on the live mobile profile: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 10 ms, CLS 0. Evidence:
  `.factory/evidence/lighthouse-polish-1.json`.

Live cold verification after deployment:

```sh
npm run verify:url -- https://trajectory-test-cases.sociobot.in
PLAYWRIGHT_BASE_URL=https://trajectory-test-cases.sociobot.in npx playwright test
```

- `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` returned HTTP 200. A cold
  unknown URL returned the designed page with HTTP 404.
- Every route had its own title, description, canonical, Open Graph/Twitter
  data, touch icon, one `h1`, one `main`, focused heading, shared legal footer,
  and zero actionable console errors.
- All 18 browser tests passed against production, including every browser
  claim, offline reload, privacy request logging, route focus/back behavior,
  exact revised labels/headings, image dimensions, and Axe checks.
- A production link crawl returned 200 for every normal internal and external
  link. The 404 skip link targets the canonical 404 document and its main
  landmark.
- CSP, Permissions Policy, Referrer Policy, nosniff, immutable asset caching,
  and no-cache service-worker delivery are active. The production social image
  is 1200 × 630 and 34,610 bytes.
- Cold visual evidence: `.factory/evidence/polish-1-mobile-home.png`,
  `.factory/evidence/polish-1-mobile-demo.png`, and
  `.factory/evidence/polish-1-404.png`.

## Remaining work

No review finding or product defect remains in this work order. Registry
publication is intentionally reserved for the factory; the package is ready
for `npm publish`.
