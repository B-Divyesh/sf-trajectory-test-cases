# Polish 3 — zero-findings closure

**Base reviewed:** `7f3c1636b8d9e980720344638b1deb3fab76913b`  
**Repair code:** `fcffaee` (`fix: use literal section headings`)  
**Live URL:** <https://trajectory-test-cases.sociobot.in/>

Read before repair: `review-1.md`, `review-2.md`, `review-3.md`,
`polish-1.md`, `polish-2.md`, `verification.md`, `verification-2.md`, and the
previous handoff. Every listed finding is mapped below; no item is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the 17-entry claims contract and its one-to-one tagged tests. Re-ran every manifest command from a fresh clone after `npm ci`. | Fresh clone `/tmp/trajectory-test-cases-polish-3-final-HsELSb`; all 17 commands pass; `npm run lint` reports `17 entries, one tagged test each`; live browser suite exercises the demo claims. Screenshot: `evidence/polish-3-live-mobile-demo.png`. Live: <https://trajectory-test-cases.sociobot.in/demo/?demo=1>. |
| F-1-2 | Kept route-specific titles, descriptions, canonical URLs, OG/Twitter fields, 1200 × 630 social art, and 180 px touch icon on home, demo, legal routes, and 404. | `has complete route metadata and the shared site skeleton`; `social and touch artwork has the declared dimensions`; live `npm run verify:url -- https://trajectory-test-cases.sociobot.in`. Screenshot: `evidence/polish-3-live-home.png`. |
| F-1-3 | Kept the shared header/footer, legal links, build ID, route h1 focus, and polite announcer on every route, including 404. | `route navigation and browser back restore heading focus`; live URL verifier reports focused h1 and footer legal links on all five routes. Screenshot: `evidence/polish-3-live-404.png`. |
| F-1-4 | Kept result-naming sample controls: `Load passing trace`, `Load missing-call example`, `Load wrong-order example`, and `Load empty trace`. | `homepage is accessible and interactive`; `demo is accessible, keyboard operable, and usable at 390px`; live suite 19/19. Screenshot: `evidence/polish-3-live-mobile-demo.png`. |
| F-1-5 | Put the literal section names in the actual h2 elements: `Check agent calls in three steps` and `Four library tools`. Also made the method and safety headings literal. | Exact-copy assertions in `homepage is accessible and interactive`; updated `.factory/copy-audit.md`; screenshot: `evidence/polish-3-live-home-full.png`; live landing URL check. |
| F-2-1 | Kept the compact mobile sample result directly below the demo intro. It shows the loaded `docs.search` / `report.write` trace and `PASS` before scrolling. | `demo is accessible, keyboard operable, and usable at 390px` checks the sample geometry against 844 px; screenshot: `evidence/polish-3-live-mobile-demo.png`; live: <https://trajectory-test-cases.sociobot.in/demo/?demo=1>. |
| F-3-1 | Replaced landing eyebrow `Local trace bench` with `Fixture checker` and heading `Break a fixture. Read the evidence.` with `Test a fixture with sample events`. Replaced the same slogan pattern on demo and the product-themed 404 with literal copy. | New exact-copy regression assertions in `homepage is accessible and interactive` and `404 names the missing page in plain words`; live HTML contains the literal heading; screenshot: `evidence/polish-3-live-home-full.png`; live: <https://trajectory-test-cases.sociobot.in/#playground>. |

## Fresh-clone acceptance evidence

The clean clone above ran every command named in `.factory/claims.json`:

- Browser demo claims: `demo-sandbox`, `local-privacy`, `browser-runtime`,
  `deterministic-verdict`, and `offline-reload` all passed.
- Library and CLI claims: `matcher-rules`, `recorder-scrubbing`,
  `package-contract`, `cli-contract`, `cli-readable-trace`,
  `public-functions`, `node-requirement`, `selector-matching`,
  `default-count`, `call-bookkeeping`, `scrubber-required`, and
  `cli-no-prompt` all passed.
- `npm test` passed: 36 unit tests and 19 Chromium tests, including Axe,
  keyboard, privacy/request, offline, routing, metadata, 404, and mobile
  checks. `npm run typecheck`, `npm run lint`, `npm run build`,
  `npm pack --dry-run`, and `npm audit --omit=dev` also passed.

## Live deployment recheck

`/opt/fleet/lib/deploy-static.sh trajectory-test-cases dist/site` deployed the
production `dist/site` build. The live verifier passed home, demo, Privacy,
Terms, and an HTTP 404. `PLAYWRIGHT_BASE_URL=https://trajectory-test-cases.sociobot.in npx playwright test`
passed 19/19 after deployment. The cold 390 × 844 demo
screen shows the isolated banner, both `docs.search` events, `report.write`,
and `PASS` without scrolling.

Live Lighthouse evidence is
`.factory/evidence/lighthouse-polish-3.json`: Performance 100, Accessibility
100, Best Practices 100, SEO 100; FCP 235 ms, LCP 235 ms, TBT 0 ms, CLS 0.
