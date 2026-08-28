# Perfection-loop polish 1

Reviewed source: `.factory/review-1.md` at
`ada2a9c29aa2e17f20719f51c50a972b8d548e28`. No earlier
`.factory/review-*.md` or `.factory/polish-*.md` files existed.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Expanded `.factory/claims.json` from 8 to 17 claims. Added one uniquely tagged behavioral test for browser execution without auth, readable CLI rows, all four public functions, Node 20, selector phase/argument subsets, default count, call-only bookkeeping, mandatory scrubbing, and closed-stdin CLI execution. Strengthened the privacy and result-scrubbing assertions. | `npm run lint` reports 17 entries with one tag each. Every manifest command passed independently from clean clone `/tmp/ttc-clean-0fzIOT` at `1ad6e6c`. Tagged tests: `@claim:browser-runtime`, `cli-readable-trace`, `public-functions`, `node-requirement`, `selector-matching`, `default-count`, `call-bookkeeping`, `scrubber-required`, and `cli-no-prompt`. Live browser claim tests passed at <https://trajectory-test-cases.sociobot.in/?demo=1>. |
| F-1-2 | Added route-specific Open Graph and Twitter metadata, canonical URLs, theme color, SVG favicon, and 180 px touch icon to home, demo, Privacy, Terms, and 404. Added a product-owned 1200 × 630 social crop and recorded its provenance. | `social and touch artwork has the declared dimensions`; five `has complete route metadata and the shared site skeleton` cases; live `npm run verify:url`; [404 screenshot](evidence/polish-1-404.png). |
| F-1-3 | Standardized the same wordmark, Demo/Privacy/GitHub navigation, theme control, legal footer links, Param Factory credit, and `v0.1.0` across all routes. Added the shared route shell, polite announcer, direct-load heading focus, and bfcache/back focus restoration. Rebuilt the 404 as a normal Vite route while preserving a real HTTP 404 rewrite. | `route navigation and browser back restore heading focus`; route metadata/skeleton cases; live unknown route returned HTTP 404 with focused `h1`, footer legal links, and zero actionable console errors. |
| F-1-4 | Renamed all example controls to verbs: “Load passing trace”, “Load missing-call example”, “Load wrong-order example”, and “Load empty trace”. | `homepage is accessible and interactive`; `demo is accessible, keyboard operable, and usable at 390px`; [mobile demo screenshot](evidence/polish-1-mobile-demo.png). |
| F-1-5 | Replaced “A smaller test primitive” with “Check agent calls in three steps” and “Tiny public surface” with “Four library tools”. Re-audited every landing line. | Exact-copy assertions in `homepage is accessible and interactive`; `.factory/copy-audit.md`; [mobile home screenshot](evidence/polish-1-mobile-home.png). |

## Controller-required acceptance work

- Rewrote the first screen to “Check agent tool paths in CI.” and named the
  audience, action result, local browser execution, account/upload boundary,
  and MIT price fact.
- `/?demo=1` now enters `/demo/?demo=1` directly. The one-click landing action
  uses the same URL. Demo edits and theme state use only `demo:` session keys;
  reset restores the passing sample and leaving clears every demo key.
- The 390 px header keeps Demo and Privacy visible, the editors stack, and the
  demo banner remains sticky. Browser tests assert no horizontal overflow.
- The catalog line is verb-first and 86 characters in
  `.factory/catalog-description.txt`.

## Verification summary

- Clean clone: 17/17 manifest claim commands passed independently; 36/36 unit
  and integration tests; 18/18 Chromium tests; build, pack, and audit passed.
- Accessibility: Axe ran on home, demo, Privacy, Terms, and 404 in the route
  suite; zero serious or critical findings in light and dark treatments.
- Privacy/offline: zero requests during a demo run, same-origin resources only,
  no cookies/analytics/remote fonts, and an offline reload that still runs the
  passing fixture.
- Live: all 18 browser tests passed. `/`, `/demo/?demo=1`, `/privacy/`, and
  `/terms/` returned 200; an unknown route returned the designed 404.
- Live Lighthouse evidence is in `evidence/lighthouse-polish-1.json`: 100
  Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 0.9 s,
  TBT 10 ms, CLS 0.

All F-1-1 through F-1-5 acceptance work is resolved.
