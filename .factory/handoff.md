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

Production deployment and post-deploy header/identity checks are pending the
repair commit. Replace this paragraph with the deployed commit, live header
values, route checks, and build/live hashes after deployment.

## Known gaps and next steps

- Registry publication is intentionally not performed by workers. The package
  is ready for the factory to publish with `npm publish`.
- The v1 matcher remains local and synchronous by design. Hosted history,
  dashboards, model judging, and prompt scoring remain out of scope.
