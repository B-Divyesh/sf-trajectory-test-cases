# Review 1 handoff — FAIL

This reviewer made no product-code changes. The complete adversarial report is
in `.factory/review-1.md`.

## Completed verification

- Cold live checks at 390 × 844 and desktop; first read is clear and the
  primary demo path is visible.
- One-click live demo, edit, reset, storage isolation, and Playwright request
  logging; demo uses only `sessionStorage["demo:ttc-workspace"]` and makes no
  requests after load.
- Every command in `.factory/claims.json`, plus `npm test`, typecheck, claims
  lint, build, package dry run, live URL verification, live link crawl, route
  metadata inspection, and Axe scans of all routes.
- Earlier verification/handoff records were read and their old blockers were
  confirmed repaired.

## Remaining gaps

The verdict is **FAIL**. The blocking gap is unlisted/testless visitor claims.
Other gaps are incomplete non-landing metadata, incorrect social-image aspect,
inconsistent route skeleton/focus handling, and a few action/copy labels. See
`F-1-1` through `F-1-5` for exact quotes, evidence, and concrete repairs.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm pack --dry-run
npm run verify:url -- https://trajectory-test-cases.sociobot.in
```

---

# Independent verification handoff — PASS

Candidate `f9e046396d9fbe205c839ad7a11d9f016f236bfc` at
<https://trajectory-test-cases.sociobot.in/> **passed independent QA on
2026-08-28 UTC**. All eight clean-state claim commands, full tests, typecheck,
lint, production build, URL semantics check, package/CLI consumer exercise,
live privacy request logging, offline reload, 390 px keyboard flow, axe light/
dark scans, headers, cache policy, and candidate/live asset hashes passed.
There are no P0–P3 defects. Full exact evidence and reproduction commands are
in `.factory/verification-2.md`.

# Repair handoff — Trajectory Test Cases

## Outcome

The release blockers reported in verifier commit
`ccac250c9671e2c8164ffab7b2d50b9be7704637` for candidate
`df798f8414971a421b7f93b676c1c8e1bca9d5fc` are repaired. The package remains
an npm library with ESM, CommonJS, TypeScript declarations, schema, and CLI.
The static deployment root remains `dist/site`.

## Finding-by-finding repair

1. **Claims contract:** `.factory/claims.json` now lists eight user-facing
   claims. Each has exactly one `@claim:<id>` test and a clean-state command.
   `npm run lint` rejects missing, duplicate, or orphaned claim tags.
2. **One-click demo:** the landing first screen links to a real `/demo/` page.
   It opens with a passing fixture and displays the required persistent demo
   banner, **Reset demo**, and **Start for real** controls. Demo state uses only
   `sessionStorage` keys prefixed `demo:` and is deleted on reset or exit. See
   `.factory/demo.md`.
3. **First-screen language:** the headline is “Test agent tool paths in CI.”
   The next sentence identifies CI engineers and the checks they need. The
   action explains that it opens a passing local fixture. Copy evidence and
   terminology are in `.factory/copy-audit.md`.
4. **Response policy:** `site/public/staticwebapp.config.json` now configures
   Azure Static Web Apps directly. It sets CSP, Permissions-Policy,
   Referrer-Policy, nosniff, immutable `/assets/*` caching, no-cache service
   worker updates, and the product-specific 404 response.
5. **Repeatable QA:** added `npm run lint`, `npm run test:claims`,
   `npm run verify:url`, the executable `verify-url.sh`, demo documentation,
   copy audit, response-policy tests, and exact regression coverage for all
   findings.

The service worker cache is versioned to `ttc-shell-v2`, precaches `/demo/`,
claims clients immediately, and removes old caches. Existing pass, missing,
wrong-order, empty, malformed-input, theme, legal, and package behaviors remain
covered.

## Verification evidence — 2026-08-28 UTC

Run from a clean checkout:

```sh
npm ci
npm run lint
npm test
npm run build
npm pack --dry-run
npm audit
```

- Clean install: 96 packages; 0 vulnerabilities.
- Lint/type/claims structure: pass; 8 manifest entries with one tagged test
  each.
- Unit/integration: 28/28 pass across five files.
- Browser: 10/10 pass in Chromium 1.58.2. Coverage includes desktop, 390×844,
  keyboard Enter/Space, light/dark axe scans, demo isolation, privacy network
  interception, deterministic replay, offline reload, and service-worker
  update state.
- Every command in `.factory/claims.json`: pass independently.
- `verify-url.sh`: `/`, `/demo/`, `/privacy/`, and `/terms/` each return 200
  with a title, `lang=en`, one `h1`, one `main`, labeled buttons, complete image
  alt text, and zero console errors.
- Production build: `dist/site/index.html` exists. Initial app JavaScript is
  9.65 KB (3.44 KB gzip); CSS is 14.36 KB (3.89 KB gzip). The 48 KB desktop
  and 20 KB mobile hero assets remain below budget.
- Lighthouse 13 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 0 ms, CLS 0. Lab Lighthouse does
  not report INP without field interaction; Playwright exercises the primary
  interactions.
- Package: `npm pack --dry-run` produces a 10.3 KB archive with nine files.
  A fresh temporary consumer installed the archive and passed documented ESM,
  CommonJS, recorder/redaction, matcher, and CLI resolution checks.
- Privacy: the full demo run issues no network request after load, all loaded
  runtime resources are same-origin, and no analytics, remote fonts, or
  third-party scripts are present.

## Deployment evidence

Repair commit `5f28208` was pushed to `origin/main` and its `dist/site` was
deployed to the production Azure Static Web App. Post-deploy checks against
<https://trajectory-test-cases.sociobot.in> found:

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown route returns
  the designed page with HTTP 404.
- The live first screen uses the repaired job headline, and `/demo/` has the
  dedicated demo title, banner, passing sample, reset, and exit controls.
- CSP, Permissions-Policy, Referrer-Policy, and `X-Content-Type-Options` are
  present on live HTML and asset responses.
- `/assets/app-YcD-SGAG.js` returns
  `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` returns
  `Cache-Control: no-cache`.
- All 10 Playwright tests pass against the custom production domain using
  `PLAYWRIGHT_BASE_URL=https://trajectory-test-cases.sociobot.in npx playwright test`.
- Byte comparisons passed for the built and live landing, demo, privacy, terms,
  service worker, app JavaScript, and CSS. Representative SHA-256 hashes:
  landing `e4bdb240…bd34`, demo `30661f30…6f85`, service worker
  `4dabbc6c…d6b`, app JavaScript `a175b63a…326`, and CSS `e3c8f6a2…d66c`.

## Known gaps and next steps

- Registry publication is intentionally not performed by workers. The package
  is ready for the factory to publish with `npm publish`.
- The v1 matcher remains local and synchronous by design. Hosted history,
  dashboards, model judging, and prompt scoring remain out of scope.
