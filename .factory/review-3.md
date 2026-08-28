# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Candidate:** `7f3c1636b8d9e980720344638b1deb3fab76913b`  
**Live URL:** <https://trajectory-test-cases.sociobot.in/>

## Verdict

**FAIL.** The product is clear, tryable, private in demo mode, and its listed
claims pass. One copy-structure finding remains. The requested standard is
zero findings, so this is not a pass.

## Cold first read

Fresh browser contexts at 390 × 844 and 1440 × 1000 loaded the following before
scrolling:

> “Check agent tool paths in CI.”
>
> “For engineers who test required tool calls, retries, and ordering in CI.”
>
> “Try it with sample data” — “Opens a passing fixture in the local trace
> bench.”

In my own words: this npm library lets CI engineers verify that an agent made
the required tool calls, in the required retry count and order. I should click
**Try it with sample data** first. The first screen therefore answers what it
does, who it is for, and what to click. It had no horizontal overflow or console
errors in either context.

## Finding

### F-3-1 — P2 — the playground heading is a slogan, not a section name

**Location / exact copy:** landing page `<h2 id="playground-title">`:

> “Break a fixture. Read the evidence.”

This is a pair of imperative, metaphor-like slogans. It does not name the
section when read out of context in a heading list, and it does not tell a
first-time visitor that the section is an editable fixture-and-event checker.
The nearby eyebrow, “Local trace bench,” uses internal jargon and does not
repair the heading.

**Concrete fix:** replace the heading with **“Test a fixture with sample
events”** (or equivalent literal section name) and replace the eyebrow with
**“Fixture checker”**. Keep the existing useful instruction below it: “Edit
either JSON panel or load a seeded mutation.” Add an exact-copy regression test
so a slogan does not return.

## Demo and sandbox verification

Pass. In a fresh 390 px context, the landing action opened
`/demo/?demo=1`. The initial viewport contained the persistent banner:

> “Demo — sample data, nothing is saved”

It also contained the live sample result at y=409 px: `PASS`, two
`docs.search` events, one `report.write` event, and “All declared path
invariants matched.” This is a realistic, already-running product state rather
than an empty demo shell.

Changing the events to `[]` and running the fixture changed the result to
`FAIL` with “Missing lookup: expected 2 docs.search calls.” **Reset demo**
restored the passing sample. **Start for real** returned home and removed the
demo workspace. The demo used only
`sessionStorage["demo:ttc-workspace"]`; local storage remained empty. The
edit, run, reset, and leave flow made zero requests. Initial resources were all
same-origin. This confirms that the demo does not read or write real workspace
storage and that the stated local privacy behavior is observable.

## Claims verification

I read `.factory/claims.json` and ran every listed command in a new local clone
after `npm ci`. All 17 passed. `npm run lint` confirmed one tagged test per
manifest entry.

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

The live landing and README claim-like copy is covered by those entries. I found
no unlisted claim. In addition, `npm test` passed (36 unit, 18 browser), as did
`npm run lint`, `npm run build`, `npm pack --dry-run`, and
`npm run verify:url -- https://trajectory-test-cases.sociobot.in`.

## History verification

I read every prior review, polish record, verification record, and handoff. The
prior findings are fixed in both current code and live behavior:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | The 17-entry claims manifest exists; each command passed from the clean clone; current visitor promises map to it. |
| F-1-2 | Home, demo, Privacy, Terms, and 404 have route titles, descriptions, canonical URLs, OG/Twitter metadata, 1200 × 630 social art, and a 180 px touch icon. |
| F-1-3 | All routes have the shared header/footer; direct route loads focus the sole h1 and announce the route. |
| F-1-4 | Sample buttons now say “Load …”, naming their result. |
| F-1-5 | The prior vague headings were replaced by “Check agent calls in three steps” and “Four library tools.” |
| F-2-1 | The fresh mobile demo now shows its seeded events and PASS result inside the first viewport. |

None of those findings regressed. F-3-1 is a new, independent heading check.

## Structure, accessibility, links, and scope

- `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` returned 200. An unknown
  route returned the designed 404 with HTTP 404 and a route-specific title.
- Every route had `lang=en`, exactly one main landmark and h1, a description,
  canonical URL, OG/Twitter metadata, favicon, and Apple touch icon. Direct
  loads focused the h1 and populated the polite route announcer.
- I crawled all landing, demo, legal, footer, and external links. HTTP links
  returned 200; the two email links are explicit `mailto:` actions.
- The live URL verifier passed all five routes with zero actionable console
  errors. The complete browser suite includes Axe checks with no serious or
  critical findings. Mobile home and demo did not overflow.
- The warm-paper, inspection-ink, evidence-tag identity matches
  `.factory/design.md`; it is not a generic gradient/card SaaS template.
- The brief deliberately excludes model judging and hosted experiments. A
  decorative AI step would not help this deterministic library. JSON fixture /
  event input and CLI JSON output supply the implied import/export path; sync
  is not implied.

## Complete copy audit

Counts use whitespace-delimited words; hyphenated words count as one. Code and
JSON samples are executable content and excluded. The only flag is F-3-1.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| You’re offline. The checker still runs locally. | 7 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| GitHub | 1 | Pass |
| Theme | 1 | Pass |
| Deterministic agent testing | 3 | Pass |
| Check agent tool paths in CI. | 6 | Pass |
| For engineers who test required tool calls, retries, and ordering in CI. | 12 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a passing fixture in the local trace bench. | 9 | Pass |
| Runs locally in your browser | 5 | Pass |
| No account or trace upload | 5 | Pass |
| Free under the MIT License | 5 | Pass |
| Copy install | 2 | Pass |
| Zero runtime dependencies | 3 | Pass |
| ESM + CJS | 2 | Pass |
| TypeScript declarations | 2 | Pass |
| Fixture → evidence | 2 | Pass |
| Paper tool-event cards connected by a blue dependency cord, with a red retry mark and green pass tab. | 18 | Pass |
| The fixture checks required calls and their partial order. | 9 | Pass |
| Required calls | 2 | Pass |
| Ordering edges | 2 | Pass |
| Forbidden actions | 2 | Pass |
| Retry counts | 2 | Pass |
| Local trace bench | 3 | Pass |
| Break a fixture. Read the evidence. | 6 | **F-3-1** |
| Edit either JSON panel or load a seeded mutation. | 9 | Pass |
| The package matcher runs here in your browser. | 8 | Pass |
| Load passing trace | 3 | Pass |
| Load missing-call example | 3 | Pass |
| Load wrong-order example | 3 | Pass |
| Load empty trace | 3 | Pass |
| Fixture | 1 | Pass |
| JSON fixture defining expected and forbidden tool actions. | 8 | Pass |
| Observed | 1 | Pass |
| JSON array of already scrubbed tool events. | 7 | Pass |
| The check sends no trace data. | 6 | Pass |
| The same input returns the same verdict. | 8 | Pass |
| Run fixture | 2 | Pass |
| Inspection trace | 2 | Pass |
| No events observed. | 3 | Pass |
| Add a scrubbed event or load an example to test this fixture. | 12 | Pass |
| Could not run this fixture. | 5 | Pass |
| Fix the JSON or load a known example. | 9 | Pass |
| All declared path invariants matched. | 5 | Pass |
| Check agent calls in three steps | 6 | Pass |
| Keep only the invariants that matter. | 6 | Pass |
| Record scrubbed events | 3 | Pass |
| You supply the argument scrubber. | 5 | Pass |
| The recorder stores its output, not the raw arguments. | 9 | Pass |
| Declare partial order | 3 | Pass |
| Name required actions, attach only meaningful “after” edges, and forbid dangerous calls. | 12 | Pass |
| Fail with evidence | 3 | Pass |
| Get stable exit codes, structured JSON, and a line-by-line trace that explains the mismatch. | 14 | Pass |
| Four library tools | 3 | Pass |
| One checker. Four tools. | 4 | Pass |
| Use the recorder, matcher, fault injector, or renderer independently. | 9 | Pass |
| The package has no runtime dependencies. | 6 | Pass |
| Read the full API | 4 | Pass |
| Copy code | 2 | Pass |
| A pass is path evidence—not a safety certificate. | 8 | Pass |
| Trajectory Test Cases verifies only the actions and ordering you declare. | 11 | Pass |
| Keep output quality, security, and end-to-end behavior in your wider test strategy. | 12 | Pass |
| Built by Param Factory. | 4 | Pass |
| Terms | 1 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Trajectory Test Cases | 3 | Pass |
| Check required agent tool calls, retries, and ordering with deterministic CI fixtures. | 11 | Pass |
| Trajectory Test Cases is for engineers testing tool-calling agents in CI. | 11 | Pass |
| It records scrubbed arguments, injects repeatable retry faults, and prints the exact mismatch. | 13 | Pass |
| A passing fixture proves only the declared path invariants. | 9 | Pass |
| It does not prove response quality, correctness, or safety. | 9 | Pass |
| Try the demo | 3 | Pass |
| Open the sample-data demo. | 4 | Pass |
| It loads a passing fixture in one click. | 8 | Pass |
| Demo edits use isolated `demo:` session storage and are discarded when you leave. | 13 | Pass |
| The checker sends no trace data. | 6 | Pass |
| The demo also reloads offline after the first visit. | 9 | Pass |
| Install | 1 | Pass |
| Requires Node.js 20 or newer. | 6 | Pass |
| The package ships ESM, CommonJS, and TypeScript declarations with no runtime dependencies. | 12 | Pass |
| Usage | 1 | Pass |
| Create a fixture in `fixtures/weather.json`: | 7 | Pass |
| Record a scrubbed trace and check it: | 7 | Pass |
| Each expected action matches a tool, an optional phase (`call`, `result`, or `error`), and an optional JSON-subset of scrubbed `args`. | 20 | Pass |
| `after` contains IDs that must be fully observed first. | 9 | Pass |
| `count` defaults to exactly one. | 5 | Pass |
| Forbidden actions are checked independently. | 5 | Pass |
| Set `allowUnmatched` to `false` to catch any extra events; result/error bookkeeping is ignored by default when all declared expectations target calls. | 22 | Pass |
| The recorder requires `scrubArgs` and stores only its output. | 9 | Pass |
| Result payloads are omitted unless you also provide `scrubResult`. | 9 | Pass |
| Editors and validators can load the published JSON Schema from `trajectory-test-cases/fixture.schema.json`. | 14 | Pass |
| CLI | 1 | Pass |
| Write the recorder output to JSON, then run: | 8 | Pass |
| Exit code `0` means the declared trajectory passed, `1` means it mismatched, and `2` means the input or command was invalid. | 21 | Pass |
| `--json` writes one machine-readable result to stdout. | 7 | Pass |
| The CLI does not prompt for input. | 7 | Pass |
| Development | 1 | Pass |
| The live documentation and local trace playground are at `trajectory-test-cases.sociobot.in`. | 12 | Pass |
| Demo changes stay in isolated session storage and are discarded when you leave. | 13 | Pass |
| See `CHANGELOG.md` for releases. | 5 | Pass |
| Deploy | 1 | Pass |
| The factory deploys the static contents of `dist/site`; registry publishing is handled separately. | 14 | Pass |
| This repository contains no analytics, remote fonts, or runtime third-party scripts. | 11 | Pass |
| License | 1 | Pass |
| MIT © 2026 Sociobot (Param Factory). | 5 | Pass |

No audited line exceeds 22 words. No banned marketing adjective appeared. The
terminology is consistent: fixture, event, trace, demo, verdict, and mismatch.

## What would make this perfect

Replace the one slogan heading in F-3-1 with a literal section name and lock it
with a regression test. Re-run this full live review, including the fresh demo
and all claims, after deployment. With that single finding gone, the product
would meet the stated zero-findings standard.
