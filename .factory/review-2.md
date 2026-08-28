# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Candidate:** `c7af1c4337a5a14fce2bd2eba4e10c14904938ce`  
**Live URL:** <https://trajectory-test-cases.sociobot.in/>

## Verdict

**FAIL.** One blocking finding remains. The cold landing read is clear, the claims contract passes, and the demo is isolated, but the one-click demo fails the required mobile first-screen test: at 390 px it does not actually show the sample being used without scrolling.

## Cold first read

Fresh contexts at 390 × 844 and 1440 × 1000 loaded the same first-screen meaning before any scroll:

> “Check agent tool paths in CI.”
>
> “For engineers who test required tool calls, retries, and ordering in CI.”
>
> “Try it with sample data” — “Opens a passing fixture in the local trace bench.”

Interpretation: this is a CI test library for engineers who need to check the sequence, retry count, and order of an agent's tool calls. The first action is **Try it with sample data**. The page therefore answers what it does, who it is for, and what to click. There was no horizontal overflow or console error at 390 px or desktop.

## Findings

### F-2-1 — BLOCKING — mobile demo does not show the product in use on its first screen

**Location / evidence:** Fresh 390 × 844 visit to `/demo/?demo=1`, immediately after clicking the landing action. The first viewport shows:

> “Test a sample agent tool path.”
>
> “A passing trace is loaded below. Change an event to see the exact mismatch.”
>
> “Run the fixture. Read the evidence.”

The sample fixture editor starts at approximately **997 px** below the viewport top, and the visible `PASS` result starts at approximately **1,860 px**. The first viewport contains only the introduction and the beginning of example buttons; it does not contain an observed trace, the matching result, or another visible piece of the product operating on the realistic sample. A visitor must scroll before seeing the promised result.

This fails the demo requirement that the first screen after the one-click entry already show the product being used with realistic sample data. It is especially material for the stated phone/30-second first read: “loaded below” asks the visitor to trust a result that is not yet visible.

**Concrete fix:** on narrow screens, put a compact, read-only passing trace and its `PASS` evidence directly beneath the demo banner/heading, or collapse the intro so the existing trace panel begins within the initial 844 px viewport. Keep the editable JSON panels lower on the page if necessary. Add a 390 × 844 browser test that asserts both a representative seeded event (`docs.search` or `report.write`) and the initial `PASS` result have bounding boxes inside the initial viewport after direct demo entry.

## Demo and sandbox check

The desktop demo and the underlying sandbox behavior otherwise pass. From a fresh live browser context, the landing action opened `/demo/?demo=1` with title **“Demo — Trajectory Test Cases”**, the persistent banner **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real**. The seeded realistic trace contains two `docs.search` calls followed by `report.write` and begins in `PASS`.

Replacing the events with `[]` changed the result to `FAIL`; **Reset demo** returned it to `PASS`; **Start for real** returned home and removed the demo workspace. Local storage stayed empty. Session storage contained only `demo:ttc-workspace` while in the demo and was empty after leaving. The edit, run, reset, and leave flow made no outgoing requests after the page resources had loaded. Demo state is therefore separated from real state. The direct `/demo/` and `?demo=1` entries are present.

## Claims check

I read `.factory/claims.json` and executed every command named there from a fresh clone (`/tmp/trajectory-test-cases-review-2`) after `npm ci`. All passed. The full suite also passed: 36 unit tests and 18 browser tests. `npm run lint` confirmed 17 manifest entries with one tagged test each; `npm run build` and `npm pack --dry-run` passed.

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

The live privacy behavior was independently checked in Playwright: a cold load used same-origin document, scripts, stylesheet, and product image only; demo editing/resetting issued zero requests, set no cookie, and loaded no analytics, remote font, or third-party runtime resource. The tagged offline test passed after service-worker control and offline reload. Every visitor-facing claim-like sentence on the landing and README maps to one of the 17 listed claims; no unlisted-claim finding was found.

## History check

I read every earlier review, polish record, verification record, demo document, copy audit, and handoff. Each prior finding is fixed in both live behavior and source, not merely marked resolved:

| Earlier finding | Confirmation |
| --- | --- |
| `F-1-1` claims coverage | The 17-entry manifest names the browser, privacy, matcher, recorder, CLI, package, and selector promises; each tagged command passed from the clean clone. |
| `F-1-2` metadata | Home, Demo, Privacy, Terms, and 404 have route titles, descriptions, canonicals, OG/Twitter fields, SVG favicon, 180 px touch icon, and the 1200 × 630 product social image. |
| `F-1-3` shared shell/focus | Each route has the same header/footer/legal links and build ID. Direct route loads, navigation, and back restored focus to the incoming `h1`; `#route-announcer` announced the route. |
| `F-1-4` example button names | Live controls read “Load passing trace”, “Load missing-call example”, “Load wrong-order example”, and “Load empty trace”. |
| `F-1-5` vague headings | Live headings now read “Check agent calls in three steps” and “Four library tools”. |
| Earlier release blockers | The claims manifest, isolated resettable demo, plain first screen, required support documents, URL verifier, and deployed CSP/Permissions-Policy are all present and working. |

The mobile-first-screen gap in `F-2-1` was not enumerated by an earlier finding, so it has no earlier ID to repeat.

## Structure, routing, accessibility, and scope check

- `npm run verify:url -- https://trajectory-test-cases.sociobot.in` passed for home, demo, Privacy, Terms, and the 404: one `main`, one `h1`, `lang=en`, descriptions, route-specific title/canonical/OG/Twitter metadata, favicon, touch icon, focus, footer legal links, image alt text, named controls, and no console errors.
- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown route returned a designed HTTP 404 with a return link. The sitemap and robots file are live. The internal links, GitHub, Param Factory, and explicit mail links resolved appropriately; no dead navigational link was found.
- Keyboard/browser checks passed: the skip link works, direct loads and back/forward focus the destination heading, visible focus remains present, controls are named, and the route announcer is polite. The test suite's axe checks found no serious or critical issue. Reduced-motion behavior and 390 px no-overflow checks pass.
- The visual system is product-specific rather than a generic SaaS template: the warm paper, inspection-ink borders, evidence labels, local type stacks, and original evidence-bench art match `.factory/design.md`.
- The brief explicitly excludes model judging and hosted experiments. This deterministic, model-agnostic library has JSON fixture/trace input and CLI JSON output; an AI step, sync service, or embedded provider key is neither implied nor appropriate. No missed-leverage or decorative-AI finding was found.

## Copy audit

Counts use whitespace-delimited words and treat a hyphenated term as one word. Executable JSON/TypeScript/shell examples are excluded. Headings, labels, and buttons are included because their wording is also part of the first read. No item exceeds 22 words; no banned marketing adjective, inconsistent term, contextless heading, or non-result-naming button was found. The tables below are the required full inventory.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| You’re offline. | 2 |
| The checker still runs locally. | 5 |
| Demo | 1 |
| Privacy | 1 |
| GitHub | 1 |
| Theme | 1 |
| Deterministic agent testing | 3 |
| Check agent tool paths in CI. | 6 |
| For engineers who test required tool calls, retries, and ordering in CI. | 12 |
| Try it with sample data | 5 |
| Opens a passing fixture in the local trace bench. | 9 |
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
| Local trace bench | 3 |
| Break a fixture. | 3 |
| Read the evidence. | 3 |
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
| The same input returns the same verdict. | 7 |
| Run fixture | 2 |
| Inspection trace | 2 |
| Missing save: expected 1 report.write call. | 6 |
| No events observed. | 3 |
| Add a scrubbed event or load an example to test this fixture. | 12 |
| Could not run this fixture. | 5 |
| Fix the JSON or load a known example. | 8 |
| All declared path invariants matched. | 5 |
| Check agent calls in three steps | 6 |
| Keep only the invariants that matter. | 6 |
| Record scrubbed events | 3 |
| You supply the argument scrubber. | 5 |
| The recorder stores its output, not the raw arguments. | 9 |
| Declare partial order | 3 |
| Name required actions, attach only meaningful “after” edges, and forbid dangerous calls. | 12 |
| Fail with evidence | 3 |
| Get stable exit codes, structured JSON, and a line-by-line trace that explains the mismatch. | 14 |
| Four library tools | 3 |
| One checker. | 2 |
| Four tools. | 2 |
| Use the recorder, matcher, fault injector, or renderer independently. | 9 |
| The package has no runtime dependencies. | 6 |
| Read the full API | 4 |
| Copy code | 2 |
| A pass is path evidence—not a safety certificate. | 8 |
| Trajectory Test Cases verifies only the actions and ordering you declare. | 11 |
| Keep output quality, security, and end-to-end behavior in your wider test strategy. | 12 |
| Built by Param Factory. | 4 |
| Terms | 1 |

### README

| Copy | Words |
| --- | ---: |
| Trajectory Test Cases | 3 |
| Check required agent tool calls, retries, and ordering with deterministic CI fixtures. | 12 |
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
| The live documentation and local trace playground are at `trajectory-test-cases.sociobot.in`. | 10 |
| Demo changes stay in isolated session storage and are discarded when you leave. | 13 |
| See `CHANGELOG.md` for releases. | 4 |
| Deploy | 1 |
| The factory deploys the static contents of `dist/site`; registry publishing is handled separately. | 13 |
| This repository contains no analytics, remote fonts, or runtime third-party scripts. | 11 |
| License | 1 |
| MIT © 2026 Sociobot (Param Factory). | 6 |

## What would make this perfect

Close `F-2-1`: make the 390 px first demo viewport visibly contain the seeded trace and its passing evidence, then add the viewport assertion described in the fix. Re-run the complete clean-context review after deployment. With that one mobile demo issue closed, this review found no other remaining work.
