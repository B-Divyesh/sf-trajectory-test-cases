# Independent verification 2 — PASS

**Candidate:** `f9e046396d9fbe205c839ad7a11d9f016f236bfc` (`main`)

**Live URL:** <https://trajectory-test-cases.sociobot.in/>

**Verified:** 2026-08-28 UTC from a clean checkout and fresh browser contexts.

## Release decision

**PASS.** The previous claims/demo/deployment blockers are repaired and the live
site is byte-identical to this candidate's built landing HTML, application JS,
CSS, and hero image. No release-blocking defects were found.

## First-read result

Cold desktop visit: “Test agent tool paths in CI.” It is for “CI engineers who
need stable checks for required calls, retries, and ordering.” The first action
is **Try it with sample data**, with the adjacent explanation “Opens a passing
fixture in the local trace bench.” The one-click `/demo/` page opens a passing
sample and has the persistent “Demo — sample data, nothing is saved” banner,
**Reset demo**, and **Start for real**.

## Clean-install quality gates

`npm ci` installed 96 packages and reported zero vulnerabilities. These exact
commands passed:

| Check | Result | Evidence |
| --- | --- | --- |
| All eight commands in `.factory/claims.json` | PASS | Each command selected exactly one tagged test; the four browser-demo and four unit/package claims passed. |
| `npm test` | PASS | 28/28 Vitest tests and 10/10 Playwright tests passed. |
| `npm run typecheck` | PASS | No TypeScript diagnostics. |
| `npm run lint` | PASS | Claims verifier reported 8 entries and one tagged test per entry. |
| `npm run build` | PASS | Produced `dist/` and `dist/site/`. |
| `npm pack --dry-run` | PASS | Ready-to-publish package contains ESM, CJS, declarations, CLI, schema, README, license, and changelog. |

### Claims evidence

All required commands were run verbatim after `npm ci`:

1. `npm run test:claims -- --grep @claim:demo-sandbox` — PASS
2. `npm run test:claims -- --grep @claim:local-privacy` — PASS
3. `npm run test:claims -- --grep @claim:deterministic-verdict` — PASS
4. `npm run test:claims -- --grep @claim:offline-reload` — PASS
5. `npm run build:lib && npm run test:unit -- --testNamePattern=@claim:matcher-rules` — PASS
6. `npm run build:lib && npm run test:unit -- --testNamePattern=@claim:recorder-scrubbing` — PASS
7. `npm run build:lib && npm run test:unit -- --testNamePattern=@claim:package-contract` — PASS
8. `npm run build:lib && npm run test:unit -- --testNamePattern=@claim:cli-contract` — PASS

## Independent product exercise

- A fresh live demo begins with the realistic research-then-save sample at
  `PASS`. Keyboard Enter on **Missing call** changes it to `FAIL`; Space on
  **Reset demo** restores `PASS`.
- Malformed fixture JSON produces the announced error “Could not run this
  fixture… Fix the JSON or load a known example.” Reset recovers it to `PASS`.
- The published package was packed and installed into a clean temporary
  consumer. ESM and CommonJS imports both ran `checkTrajectory`; the ESM
  recorder omitted a supplied secret after scrubbing; deterministic retry fault
  injection failed once then returned `ok`; the JSON Schema resolved.
- In that consumer, `ttc check --json` returned 0 for a pass, 1 for a mismatch,
  and 2 for malformed input, with machine-readable JSON and no stderr for the
  first two cases.
- The 390 x 844 live demo had no horizontal overflow. Tab reached every tested
  control in order with a visible 3 px blue focus outline; Enter and Space
  operated the controls. `prefers-reduced-motion: reduce` changed transition
  duration to `0.01ms`.
- Playwright axe scans on live light and dark themes found zero serious or
  critical violations. `./verify-url.sh https://trajectory-test-cases.sociobot.in`
  passed: title, `lang=en`, one `main`, one `h1`, image alt, named controls,
  and zero console errors.

## Privacy, PWA, and deployment checks

- Cold live load made only five requests, all same-origin: document, two JS
  assets, CSS, and the product WebP. During the demo's malformed-input and
  reset flow, Playwright observed **zero** outgoing requests. Demo storage was
  only `sessionStorage["demo:ttc-workspace"]`; localStorage was empty.
- The browser was controlled by `/sw.js`; `registration.update()` completed,
  the worker is `no-cache`, versioned (`ttc-shell-v2`), calls `skipWaiting` /
  `clients.claim`, and removes old caches. After the first visit, offline
  reload showed `PASS` and ran the fixture locally.
- `/`, `/demo/`, `/privacy/`, and `/terms/` each returned 200. Live HTML has
  CSP, Permissions-Policy, Referrer-Policy, nosniff, and HSTS. Hashed JS, CSS,
  and WebP assets have `public, max-age=31536000, immutable`; `/sw.js` is
  `no-cache`.
- Candidate/live SHA-256 comparisons matched for `index.html`, application JS,
  CSS, and the 1200 px hero image. Initial application JS is 9.65 kB
  (3.44 kB gzip); CSS is 14.36 kB (3.89 kB gzip); hero assets are 18 kB and
  48 kB, comfortably within the stated budgets.
- This is a static local-first product: no product server endpoint or
  sign-in flow exists, so 429 allowance and Entra-tenant checks are not
  applicable.

## Defects by severity

- **P0:** none.
- **P1:** none.
- **P2:** none.
- **P3:** none found in this verification.

## Reproduce

```sh
npm ci
npm run test:claims -- --grep @claim:demo-sandbox
npm run test:claims -- --grep @claim:local-privacy
npm run test:claims -- --grep @claim:deterministic-verdict
npm run test:claims -- --grep @claim:offline-reload
npm run build:lib && npm run test:unit -- --testNamePattern=@claim:matcher-rules
npm run build:lib && npm run test:unit -- --testNamePattern=@claim:recorder-scrubbing
npm run build:lib && npm run test:unit -- --testNamePattern=@claim:package-contract
npm run build:lib && npm run test:unit -- --testNamePattern=@claim:cli-contract
npm test && npm run typecheck && npm run lint && npm run build
./verify-url.sh https://trajectory-test-cases.sociobot.in
npm pack --dry-run
```
