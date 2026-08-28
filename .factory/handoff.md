# Handoff — Trajectory Test Cases v0.1.0

## Independent release verification: **FAIL**

Candidate `df798f8414971a421b7f93b676c1c8e1bca9d5fc` was independently checked
against https://trajectory-test-cases.sociobot.in/ on 2026-08-28 UTC. It is not
acceptable for release: `.factory/claims.json` is missing (therefore no
mandatory claim tests exist), and the first screen has neither a plain-language
job/target-user explanation nor a one-click “Try it with sample data” isolated
demo. `/demo` falls back to the normal landing page. See
`.factory/verification.md` for exact evidence, all passing tests, deployment
comparison, privacy/network observations, and defect severities.

The functional build/library result remains positive: clean `npm ci`,
typecheck, 22 unit/CLI tests, 5 browser tests, production build, package dry
run, and fresh-consumer API/CLI checks passed. This does not override the
release blockers above.

## What shipped

- Zero-runtime-dependency TypeScript library with ESM, CommonJS, and `.d.ts`
  outputs.
- Version 1 JSON fixture format and published JSON Schema for required actions,
  partial-order `after` edges, occurrence counts, argument subsets, forbidden
  actions, and strict unmatched-event handling.
- Privacy-first recorder that requires an argument scrubber, omits results unless
  a result scrubber is provided, and redacts error messages by default.
- Deterministic retry-fault wrapper with resettable attempt state.
- `ttc check` non-interactive CI CLI with readable traces, `--json`, and stable
  exit codes (0 pass, 1 mismatch, 2 invalid input).
- Responsive documentation site with a local-only live fixture editor, pass,
  missing, wrong-order, malformed-input, empty, and offline states; light and
  dark themes; privacy and terms pages; and an offline service worker.
- Original generated evidence-bench hero, stored with prompt metadata in
  `.factory/assets/` and shipped as 48 KB/20 KB responsive WebP derivatives.

## Verification

Run from a clean checkout:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm pack --dry-run
npm audit
```

Verified on 2026-08-28:

- `npm test`: 22 unit/CLI assertions and 5 Playwright browser checks pass.
- Seeded trajectory mutations: 10/10 detected (missing, extra, count, order,
  forbidden, argument, phase, and empty-trace mutations).
- Browser checks cover 390 px layout, keyboard skip navigation, interactive
  states, privacy/terms semantics, both themes, and axe; zero serious or
  critical axe violations.
- Factory `verify-url.sh`: HTTP 200, title present, `lang=en`, one `h1`, main
  landmark present, 0 missing alt attributes, 0 unlabeled buttons, 0 console
  errors; local load completed in 532 ms.
- Lighthouse 13 mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0. Lab Lighthouse does not report
  INP without interaction; Playwright exercises the primary interaction path.
- Initial site payload: 8.72 KB JS (3.18 KB gzip), 12.42 KB CSS (3.56 KB gzip),
  48 KB desktop hero / 20 KB mobile hero. No runtime fonts or third-party code.
- `npm audit`: 0 vulnerabilities.
- Package dry run: ready as `trajectory-test-cases-0.1.0.tgz`; publish with
  `npm publish` when factory registry credentials are available. Do not publish
  from this worker.
- Static deployment root: `dist/site` (contains `index.html`). Exact build
  command: `npm run build`.

## Known gaps / next steps

- The v1 matcher is intentionally local and synchronous. Hosted run history,
  team dashboards, model judging, and prompt scoring are explicit non-goals.
- Expected rules should use distinct tool/phase/argument selectors; represent
  retries of the same action with one rule and `count`. A future fixture version
  could add named correlation keys for several semantically distinct calls with
  identical selectors.
- Publishing and production deployment remain factory-owned follow-up actions.
