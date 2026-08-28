# Adversarial first-read review 4 — PASS

**Reviewed:** 2026-08-28 UTC  
**Candidate:** `61fc20144608e37d1ef7a9bfd8a64d27663fffba`  
**Live URL:** <https://trajectory-test-cases.sociobot.in/>

## Verdict

**PASS.** This round found zero blocking, major, or minor findings. The live product is clear on a cold phone and desktop visit, provides an immediately usable isolated demo, and has a tested claim for each visitor-facing promise on the landing page and README.

## Cold first read

Fresh browser contexts at **390 × 844** and **1440 × 1000**, before scrolling, showed:

> “Check agent tool paths in CI.”
>
> “For engineers who test required tool calls, retries, and ordering in CI.”
>
> “Try it with sample data” — “Opens a passing fixture in the fixture checker.”

In my own words: this is an npm library and browser checker for CI engineers who need to verify an agent made required tool calls in the expected order and retry count. I should click **Try it with sample data** first. The first screen answers what it does, for whom, and what to click. It had no horizontal overflow at 390 px and no console errors at either target size.

## Findings

None.

## Demo and sandbox verification

The one-click landing action and direct `/?demo=1` entry both reached `/demo/?demo=1`. In a fresh 390 × 844 context, the page title was `Demo — Trajectory Test Cases`; the persistent banner read `Demo — sample data, nothing is saved`; and the compact sample evidence strip started at **y=409 px**, ending at **y=557 px**. It visibly contained `PASS`, two `docs.search` calls, and `report.write` before scrolling.

The sample was a realistic research-then-save tool trace, not an empty shell. Replacing its events with `[]` and running the fixture produced the exact missing-lookup failure. **Reset demo** restored `PASS`. **Start for real** returned home and removed demo storage.

During the demo run and reset, storage was only `sessionStorage["demo:ttc-workspace"]`; `localStorage` was empty. After leaving, both storage areas were empty. The fresh context had no cookies. The initial resources and redirect were all same-origin; editing and running the fixture issued no request. This confirms that demo activity does not touch real workspace storage or transmit trace text. The offline claim is also covered by its clean-sandbox Playwright test, which waits for service-worker control, reloads offline, and runs the passing fixture.

## Claims verification

I read `.factory/claims.json` and ran every listed `test` command verbatim in a new clean clone at `/tmp/trajectory-test-cases-review-4-JK7D8l` after `npm ci`. All 17 passed. `npm run lint` in that checkout also confirmed one tagged test per manifest entry.

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `local-privacy` | PASS |
| `browser-runtime` | PASS |
| `deterministic-verdict` | PASS |
| `offline-reload` | PASS |
| `matcher-rules` | PASS |
| `recorder-scrubbing` | PASS |
| `package-contract` | PASS |
| `cli-contract` | PASS |
| `cli-readable-trace` | PASS |
| `public-functions` | PASS |
| `node-requirement` | PASS |
| `selector-matching` | PASS |
| `default-count` | PASS |
| `call-bookkeeping` | PASS |
| `scrubber-required` | PASS |
| `cli-no-prompt` | PASS |

Landing and README promises map to these entries: browser/local use and no account to `browser-runtime`; no upload and no third-party runtime resources to `local-privacy`; repeatability to `deterministic-verdict`; matcher categories to `matcher-rules`; scrubbed recording to `recorder-scrubbing`; install/package facts to `package-contract`; and the documented CLI/API behavior to the corresponding CLI and public-function claims. No unlisted claim was found.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms count as one word. Executable JSON, TypeScript, and shell samples are excluded because they are program input rather than explanatory prose. Headings, labels, actions, and dynamic status/error sentences are included. No copy item exceeds 22 words; no banned marketing adjective, unexplained mood heading, inconsistent core term, or non-result-naming action was found.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| You’re offline. The checker still runs locally. | 7 |
| Demo | 1 |
| Privacy | 1 |
| GitHub | 1 |
| Theme | 1 |
| Deterministic agent testing | 3 |
| Check agent tool paths in CI. | 6 |
| For engineers who test required tool calls, retries, and ordering in CI. | 12 |
| Try it with sample data | 5 |
| Opens a passing fixture in the fixture checker. | 9 |
| Runs locally in your browser | 5 |
| No account or trace upload | 5 |
| Free under the MIT License | 5 |
| Copy install | 2 |
| Zero runtime dependencies | 3 |
| ESM + CJS | 3 |
| TypeScript declarations | 2 |
| Fixture → evidence | 3 |
| Paper tool-event cards connected by a blue dependency cord, with a red retry mark and green pass tab. | 18 |
| The fixture checks required calls and their partial order. | 9 |
| Required calls | 2 |
| Ordering edges | 2 |
| Forbidden actions | 2 |
| Retry counts | 2 |
| Fixture checker | 2 |
| Test a fixture with sample events | 6 |
| Edit either JSON panel or load a seeded mutation. | 9 |
| The package matcher runs here in your browser. | 8 |
| Load passing trace | 3 |
| Load missing-call example | 3 |
| Load wrong-order example | 3 |
| Load empty trace | 3 |
| Fixture | 1 |
| fixture.json | 1 |
| JSON fixture defining expected and forbidden tool actions. | 8 |
| Observed | 1 |
| events.json | 1 |
| JSON array of already scrubbed tool events. | 7 |
| The check sends no trace data. | 6 |
| The same input returns the same verdict. | 8 |
| Run fixture | 2 |
| Inspection trace | 2 |
| Missing save: expected 1 report.write call. | 7 |
| No events observed. | 3 |
| Add a scrubbed event or load an example to test this fixture. | 12 |
| Could not run this fixture. | 5 |
| Fix the JSON or load a known example. | 9 |
| All declared path invariants matched. | 5 |
| How it works | 3 |
| Check agent calls in three steps | 6 |
| Record scrubbed events | 3 |
| You supply the argument scrubber. | 5 |
| The recorder stores its output, not the raw arguments. | 9 |
| Declare partial order | 3 |
| Name required actions, attach only meaningful “after” edges, and forbid dangerous calls. | 12 |
| See why a fixture failed | 5 |
| Get stable exit codes, structured JSON, and a line-by-line trace that explains the mismatch. | 14 |
| Package API | 2 |
| Four library tools | 3 |
| Use the recorder, matcher, fault injector, or renderer independently. | 9 |
| The package has no runtime dependencies. | 6 |
| Read the full API | 4 |
| Copy code | 2 |
| A passing fixture does not prove safety. | 7 |
| Trajectory Test Cases verifies only the actions and ordering you declare. | 11 |
| Keep output quality, security, and end-to-end behavior in your wider test strategy. | 12 |
| Check agent tool paths in CI. | 6 |
| Built by Param Factory. | 4 |
| Terms | 1 |

### README

| Copy | Words |
| --- | ---: |
| Trajectory Test Cases | 3 |
| Check required agent tool calls, retries, and ordering with deterministic CI fixtures. | 11 |
| Trajectory Test Cases is for engineers testing tool-calling agents in CI. | 11 |
| It records scrubbed arguments, injects repeatable retry faults, and prints the exact mismatch. | 13 |
| A passing fixture proves only the declared path invariants. | 9 |
| It does not prove response quality, correctness, or safety. | 9 |
| Try the demo | 3 |
| Open the sample-data demo. | 4 |
| It loads a passing fixture in one click. | 8 |
| Demo edits use isolated `demo:` session storage and are discarded when you leave. | 13 |
| The checker sends no trace data. | 6 |
| The demo also reloads offline after the first visit. | 9 |
| Install | 1 |
| Requires Node.js 20 or newer. | 5 |
| The package ships ESM, CommonJS, and TypeScript declarations with no runtime dependencies. | 12 |
| Usage | 1 |
| Create a fixture in `fixtures/weather.json`: | 5 |
| Record a scrubbed trace and check it: | 7 |
| Each expected action matches a tool, an optional phase (`call`, `result`, or `error`), and an optional JSON-subset of scrubbed `args`. | 20 |
| `after` contains IDs that must be fully observed first. | 9 |
| `count` defaults to exactly one. | 5 |
| Forbidden actions are checked independently. | 5 |
| Set `allowUnmatched` to `false` to catch any extra events; result/error bookkeeping is ignored by default when all declared expectations target calls. | 21 |
| The recorder requires `scrubArgs` and stores only its output. | 9 |
| Result payloads are omitted unless you also provide `scrubResult`. | 9 |
| Editors and validators can load the published JSON Schema from `trajectory-test-cases/fixture.schema.json`. | 11 |
| CLI | 1 |
| Write the recorder output to JSON, then run: | 8 |
| Exit code `0` means the declared trajectory passed, `1` means it mismatched, and `2` means the input or command was invalid. | 21 |
| `--json` writes one machine-readable result to stdout. | 7 |
| The CLI does not prompt for input. | 7 |
| Development | 1 |
| The live documentation and fixture checker are at `trajectory-test-cases.sociobot.in`. | 10 |
| Demo changes stay in isolated session storage and are discarded when you leave. | 13 |
| See `CHANGELOG.md` for releases. | 4 |
| Deploy | 1 |
| The factory deploys the static contents of `dist/site`; registry publishing is handled separately. | 13 |
| This repository contains no analytics, remote fonts, or runtime third-party scripts. | 11 |
| License | 1 |
| MIT © 2026 Sociobot (Param Factory). | 6 |

The terminology stays consistent: **fixture** for declared expectations, **event** for a recorded action, **trace** for an ordered event list, **demo** for the sample environment, **verdict** for the evaluation result, and **mismatch** for a rule failure.

## History verification

I read every earlier `review-*.md`, `polish-*.md`, verification record, demo record, copy audit, and handoff. Each previous finding is fixed in both current source and the live deployment:

| Earlier finding | Current verification |
| --- | --- |
| `F-1-1` claims coverage | The 17-entry manifest and one tagged test per entry passed from the clean clone; current landing/README promises map to those entries. |
| `F-1-2` route metadata | Home, demo, Privacy, Terms, and 404 expose route titles, descriptions, canonicals, OG/Twitter fields, SVG favicon, 180 × 180 touch icon, and 1200 × 630 social art. |
| `F-1-3` shared shell/focus | Every route has the shared wordmark/nav/footer/legal links/build id; direct load, navigation, and browser Back focus the destination h1 and update the polite announcer. |
| `F-1-4` sample-control labels | Live controls say `Load passing trace`, `Load missing-call example`, `Load wrong-order example`, and `Load empty trace`. |
| `F-1-5` vague headings | The live literal headings are `Check agent calls in three steps` and `Four library tools`. |
| `F-2-1` mobile demo result | The 390 px first demo viewport contains the live sample events and `PASS`; the measured strip ends at y=557 px. |
| `F-3-1` slogan heading | The live playground heading is `Test a fixture with sample events`, with `Fixture checker` as its context label. |

No earlier finding was unfixed, half-fixed, or regressed.

## Structure, accessibility, links, and scope

- `npm run verify:url -- https://trajectory-test-cases.sociobot.in` passed for home, demo, Privacy, Terms, and an unknown route. It confirmed one `main`, one h1, `lang=en`, focused route h1, named controls, image alt text, canonicals, route metadata, touch icon, footer legal links, and no console errors.
- `/`, `/demo/`, `/privacy/`, `/terms/`, `/robots.txt`, and `/sitemap.xml` returned 200. An unknown route returned the designed HTTP 404.
- I crawled all live links from the landing, demo, legal pages, and 404. All HTTP links returned 200; `mailto:` links are explicit non-HTTP actions.
- The live landing response has CSP with response-header `frame-ancestors`, Permissions-Policy, Referrer-Policy, and `X-Content-Type-Options: nosniff`.
- The live suite passed **19/19** Chromium tests. Its Axe checks found no serious or critical violation on the landing, demo, legal routes, or 404 in light and dark treatments. It covers keyboard operation, focus, reduced motion, 390 px layout, offline reload, and the demo sandbox.
- The visual identity is distinct and matches `.factory/design.md`: warm paper, inspection-ink borders, evidence labels, local type, and original evidence-bench art. It is not a generic SaaS-card/gradient presentation.
- The brief explicitly excludes model judging and hosted experiments. JSON fixtures/traces plus CLI JSON output already provide the useful import/export route. An AI feature, sync service, or provider key is not implied and would not improve this deterministic local-first library.

## What would make this perfect

Maintain this standard as the package evolves: keep new visitor-facing promises out of the copy until a clean-sandbox claim test exists, and preserve the visible mobile sample result when changing the demo layout. No current product change is required.
