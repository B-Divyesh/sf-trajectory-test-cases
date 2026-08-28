# Independent verification — FAIL

**Candidate:** `df798f8414971a421b7f93b676c1c8e1bca9d5fc` (`main`)

**Live URL:** https://trajectory-test-cases.sociobot.in/

**Verified:** 2026-08-28 UTC, from a clean checkout at the candidate commit.

## Release decision

**FAIL — do not release this candidate.** The mandatory claims contract and
one-click isolated demo are missing. These are explicit release blockers even
though the library, CLI, production build, and existing browser tests work.

## Required first checks

### Claims tests: BLOCKED / FAIL

The first repository check found that `.factory/claims.json` does not exist.
Consequently there were no claim-test commands to run from the demo entry point.
This is itself a release-blocking finding under the work order. It also leaves
the landing-page and README claims unlisted and untested, including “No
network. No model. Same input, same verdict,” “Raw secrets and payloads never
enter the trace by default,” “Zero runtime dependencies,” and the README’s
local-only/privacy claims.

### Cold first read: FAIL

On a fresh live visit the first screen reads “Assert the path. Not the prose.”
and presents `npm i -D trajectory-test-cases` / **Copy install**. The following
sentence describes tool calls, retries, and ordering, but the first screen does
not say in plain words who this is for, nor give a clear product-first action.
There is no **Try it with sample data** control (live accessible-name count:
0), no “Demo — sample data, nothing is saved” banner, and no Reset demo / Start
for real controls. `/demo` returns HTTP 200 only because it falls back to the
ordinary landing page; its h1 remains “Assert the path. Not the prose.”

This fails the plain-words and demo-sandbox acceptance test before any setup.
`.factory/demo.md` and `.factory/copy-audit.md` are also absent.

## Tests and build evidence

All commands below were run after `npm ci` (96 packages installed; npm audit
reported 0 vulnerabilities):

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | PASS | TypeScript completed with no diagnostics. |
| `npm test` | PASS | 22 Vitest unit/CLI tests and 5 Playwright tests passed. |
| `npm run build` | PASS | Built library plus `dist/site`. |
| `npm pack --dry-run` | PASS | 10.2 kB tarball, 53.9 kB unpacked, 9 files. |
| Clean consumer package API | PASS | Installed the packed tarball in a fresh temp project; documented ESM API passed scrubber/redaction/retry flow. |
| Clean consumer CLI | PASS | `ttc check` pass, mismatch, and malformed-input paths returned 0, 1, and 2 respectively. |
| `npm audit --omit=dev` | PASS | 0 vulnerabilities. |

There is no `lint` script and no repository `verify-url.sh`; those checks could
not be run. The browser checks below provide the corresponding live semantic,
console, and axe coverage.

## End-to-end product exercise

On the live page, using keyboard activation where applicable:

| Scenario | Result |
| --- | --- |
| Seeded passing trace | PASS; verdict `PASS` and all three declared actions matched. |
| Missing final call | PASS; verdict `FAIL`, “Missing save: expected 1 report.write call.” |
| Out-of-order call | PASS; verdict `FAIL`, reports `save must occur after all lookup events`. |
| Empty trace | PASS; verdict `FAIL`, empty-state guidance plus missing action failures. |
| Malformed fixture JSON | PASS; `INPUT ERROR`, role=alert, concrete parse error, and recovery instruction. |
| Keyboard | PASS; first Tab reaches visible 3 px skip-link focus; Enter/Space operate example/run buttons. |
| 390 x 844 mobile | PASS; no horizontal overflow. |
| Reduced motion | PASS; computed trace animation duration `0.01ms`; document scroll behavior `auto`. |
| Live axe | PASS; 0 serious or critical violations in the default theme. Existing repository test also passes dark-theme axe. |
| Console/page errors | PASS; none observed during normal, invalid, and offline flows. |
| Offline reload / service worker | PASS for current build: a fresh visit then offline reload returned 200, showed the offline banner, and ran the passing fixture. `registration.update()` retained the current active `/sw.js` with no waiting worker. |

The library behavior aligns with the researched core job: the seeded tests
detect all 10 supplied missing/extra/count/order/forbidden/argument/phase/empty
mutations, exceeding the brief’s 90% target for that supplied mutation set.

## Privacy, network, deployment, and policy evidence

- A cold live load made only five same-origin requests: the document, two
  JavaScript files, stylesheet, and product image. No analytics, fonts,
  third-party runtime scripts, or product API endpoints were observed.
- The static product exposes no server-side/API endpoint; rate-limit testing is
  not applicable. There is no sign-in flow.
- The candidate build and live deployment match exactly: byte comparisons were
  identical for `/`, `/privacy/`, `/terms/`, `/sw.js`, manifest, both JS/CSS
  bundles, and both shipped WebP images.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`.

## Defects

### P1 — release blockers

1. **Missing claims manifest and claim tests.** `.factory/claims.json` is
   absent, so zero mandatory observable-claim tests were run from a demo entry
   point. Every page/README claim is consequently unlisted/unproved. Add the
   manifest and exactly one tagged test per claim; run them from a clean demo
   state.
2. **No one-click isolated demo.** There is no first-screen “Try it with sample
   data” action, demo storage namespace, persistent demo banner, reset/leave
   controls, direct demo route, or `.factory/demo.md`. The existing playground
   is reachable only after scrolling and is not marked or isolated as the
   required sandbox.
3. **First screen fails the plain-words contract.** “Assert the path. Not the
   prose.” is a slogan rather than a plain job headline; it does not name the
   intended CI engineers. Replace it with the job in user words and pair the
   required demo action with an immediate explanation of its result.

### P2 — deployment/security and required QA evidence

4. **Declared browser security/caching policy is not deployed.**
   `site/public/_headers` declares CSP, Permissions-Policy, and immutable
   caching for assets, but fresh live responses omit CSP and Permissions-Policy
   entirely and serve JS/CSS as `Cache-Control: public, must-revalidate,
   max-age=30` rather than immutable. Configure the deployment to apply the
   intended response headers and verify them live.
5. **Required supporting QA documents/tools are missing.**
   `.factory/demo.md`, `.factory/copy-audit.md`, and `verify-url.sh` are absent;
   there is also no lint script. Add the required demo/copy evidence and a
   repeatable URL verification command (and lint if the chosen stack supports
   it).

## Reproduction

```sh
npm ci
npm run typecheck
npm test
npm run build
npm pack --dry-run
npm audit --omit=dev
```

Then visit the live URL in a fresh browser context. Observe the first screen,
search accessible buttons for “Try it with sample data” (zero matches), and
request `/demo` (it renders the normal landing h1). Inspect headers with:

```sh
curl -sSI https://trajectory-test-cases.sociobot.in/
curl -sSI https://trajectory-test-cases.sociobot.in/assets/index-DtNmtjdC.js
```
