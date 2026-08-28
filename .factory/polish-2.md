# Polish 2 — cumulative adversarial-review closure

**Candidate repaired:** `c7af1c4337a5a14fce2bd2eba4e10c14904938ce`  
**Repair code commit:** `ec97f2c`  
**Live target:** <https://trajectory-test-cases.sociobot.in/>

All review files were read: `review-1.md`, `review-2.md`, `polish-1.md`,
`verification.md`, and `verification-2.md`. The prior findings remain covered
by executable regression tests and the fresh-clone claim run. This round closes
the one newly open finding.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the 17-entry claims manifest and the matching browser/library/CLI tagged tests that cover every visitor-facing promise. | Fresh clone `/tmp/trajectory-test-cases-polish-2-EuPXLN`: every command in `.factory/claims.json` passed; `npm run lint` reports 17 entries with one tagged test each. Live check: <https://trajectory-test-cases.sociobot.in/demo/?demo=1>. |
| F-1-2 | Retained route-specific title, description, canonical, OG/Twitter image metadata, SVG favicon, and 180px touch icon for home, demo, legal pages, and 404. | `has complete route metadata and the shared site skeleton`; `social and touch artwork has the declared dimensions`; `npm run verify:url -- https://trajectory-test-cases.sociobot.in`. |
| F-1-3 | Retained the shared wordmark/nav/footer/legal links/build ID and direct-load/back heading focus with polite route announcement. | `route navigation and browser back restore heading focus`; route skeleton tests; live URL verification. |
| F-1-4 | Retained verb-named fixture controls. | `homepage is accessible and interactive`; `demo is accessible, keyboard operable, and usable at 390px`; live demo check. |
| F-1-5 | Retained literal section headings, `Check agent calls in three steps` and `Four library tools`. | Exact-copy checks in `homepage is accessible and interactive`; `.factory/copy-audit.md`; live landing check. |
| F-2-1 | Added a compact, read-only mobile evidence strip immediately below the demo intro. It renders the real loaded sample verdict and event tools, and changes with the matcher result. Reduced the mobile intro rhythm so the full strip fits the first 390 × 844 viewport. | `demo is accessible, keyboard operable, and usable at 390px` asserts seeded `docs.search`, visible `PASS`, and `#mobile-sample` ending within 844px. Screenshot: `evidence/polish-2-mobile-demo.png`. Live URL: <https://trajectory-test-cases.sociobot.in/demo/?demo=1>. |

## Verification summary

- Clean clone at `ec97f2c`: `npm ci`; 17/17 manifest commands; `npm test`
  (36 unit + 18 Chromium); `npm run lint`; `npm run build`; and
  `npm pack --dry-run` all pass.
- Browser/Axe coverage covers home, demo, Privacy, Terms, and 404; there are no
  serious or critical accessibility violations. The tests also exercise keyboard
  reset/example controls, direct route heading focus, metadata, mobile overflow,
  offline reload, and local-only demo behavior.
- The initial static bundle remains small: app JS is 3.56 kB gzip and CSS is
  4.21 kB gzip.
- Deployment and final cold live recheck are recorded in `.factory/handoff.md`
  after pushing `main`.
