# Polish 3 handoff — PASS

## Delivered

Repaired review candidate `7f3c163` in code commit `fcffaee` and deployed its
static `dist/site` build to <https://trajectory-test-cases.sociobot.in/>.

- Replaced the remaining slogan-led fixture-checker heading with the literal
  `Test a fixture with sample events`, and locked it with browser regression
  coverage.
- Replaced adjacent slogan/jargon headings on the landing, demo, and 404 with
  self-contained plain-language section names. The product keeps its
  warm-paper evidence-bench visual system and original art.
- Preserved and rechecked the prior repairs: one-click isolated `/demo/?demo=1`
  sample, persistent reset/leave banner, `demo:` session-only storage, full
  metadata/routing/404/legal shell, route focus announcements, mobile evidence
  strip, privacy/offline behavior, and all claim tests.
- Updated the catalog description to `Check agent tool paths, retries, and
  ordering in CI.` (53 characters, verb first).

## Verification

Fresh clone: `/tmp/trajectory-test-cases-polish-3-final-HsELSb`.

1. `npm ci` passed with zero reported vulnerabilities.
2. Every one of the 17 commands in `.factory/claims.json` passed from that
   clone. `npm run lint` confirmed exactly one tagged test for every claim.
3. `npm test` passed: 36 unit tests and 19 browser tests. The browser suite
   includes Axe scans, keyboard operation, mobile no-overflow, demo isolation,
   request privacy, offline reload, metadata, focus, and 404 coverage.
4. `npm run typecheck`, `npm run lint`, `npm run build`, `npm pack --dry-run`,
   and `npm audit --omit=dev` passed. The ready-to-publish tarball is 10.4 kB
   (54.5 kB unpacked).
5. Built assets remain within budget: application JS 3.56 kB gzip and CSS
   4.21 kB gzip.

Deployment used:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh trajectory-test-cases dist/site
```

Post-deploy checks passed:

```sh
npm run verify:url -- https://trajectory-test-cases.sociobot.in
PLAYWRIGHT_BASE_URL=https://trajectory-test-cases.sociobot.in npx playwright test
```

The URL verifier passed `/`, `/demo/?demo=1`, `/privacy/`, `/terms/`, and a
real HTTP 404. The live suite passed 19/19. Cold screenshots are
`evidence/polish-3-live-home.png`,
`evidence/polish-3-live-home-full.png`,
`evidence/polish-3-live-mobile-demo.png`, and
`evidence/polish-3-live-404.png`.

Live Lighthouse results are saved in
`.factory/evidence/lighthouse-polish-3.json`: 100 Performance, 100
Accessibility, 100 Best Practices, 100 SEO; FCP 235 ms, LCP 235 ms, TBT 0 ms,
and CLS 0.

## Known gaps and next steps

None. The npm package is ready for the factory registry workflow; do not
publish from this worker. The factory owns deployment and registry credentials.
