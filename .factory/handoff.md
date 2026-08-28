# Polish 2 handoff — PASS

## Outcome

Repair commit: `ec97f2c` (`fix: show demo evidence above mobile fold`). The
remaining blocking review finding is closed. At 390 × 844, a direct
`/demo/?demo=1` entry now shows a read-only, live-loaded `docs.search` / `report.write`
sample and its `PASS` evidence before the fold. The compact evidence strip mirrors
the current matcher result, including failure and input-error states; the editable
fixture remains below it.

The demo remains isolated: `demo:` session storage only, a persistent banner,
**Reset demo**, and **Start for real**. No real workspace data is read or written.

## Exact verification evidence

- Fresh clone: `/tmp/trajectory-test-cases-polish-2-EuPXLN` made with `git clone`
  at `ec97f2c`, followed by `npm ci` (0 vulnerabilities).
- Every one of the 17 commands in `.factory/claims.json` passed from that clone:
  `demo-sandbox`, `local-privacy`, `browser-runtime`, `deterministic-verdict`,
  `offline-reload`, `matcher-rules`, `recorder-scrubbing`, `package-contract`,
  `cli-contract`, `cli-readable-trace`, `public-functions`, `node-requirement`,
  `selector-matching`, `default-count`, `call-bookkeeping`, `scrubber-required`,
  and `cli-no-prompt`.
- Full clean-clone suite: `npm test` passed (36 unit tests, 18 Chromium tests);
  `npm run lint` passed (claims manifest: 17 entries, one tagged test each);
  `npm run build` passed and produced `dist/site`; `npm pack --dry-run` passed.
- Accessibility: the browser suite runs Axe on home, demo, Privacy, Terms, and
  404 in both normal and dark coverage; there are no serious or critical issues.
  It also checks route focus, metadata, legal links, keyboard controls, and no
  390px overflow.
- The new regression is `demo is accessible, keyboard operable, and usable at
  390px` in `tests/browser/site.spec.ts`. It asserts `#mobile-sample` contains
  `docs.search`, visible `PASS`, and a bounding box ending at or above 844 px.
- Visual proof: `evidence/polish-2-mobile-demo.png` shows the 390 × 844 initial
  viewport with the sample trace and verdict above the fold.

## Deploy and live recheck

Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh trajectory-test-cases
dist/site`. Azure Static Web Apps deployment
`67ea833c-8ab3-4dae-9834-cfb86275f7ab` succeeded; the custom domain is Ready.

- `npm run verify:url -- https://trajectory-test-cases.sociobot.in` passed for
  home, demo, Privacy, Terms, and a real HTTP 404 with no actionable console
  errors.
- `PLAYWRIGHT_BASE_URL=https://trajectory-test-cases.sociobot.in npx playwright
  test` passed 18/18, including privacy, offline, Axe, metadata, focus, and
  mobile checks.
- Cold 390 × 844 live entry verified the banner, two `docs.search` rows,
  `report.write`, and `PASS` before scrolling. Evidence:
  `evidence/polish-2-live-mobile-demo.png`.

## Known gaps

None. Publishing the npm package remains a factory-owned registry operation;
the ready-to-publish package was verified with `npm pack --dry-run`.
