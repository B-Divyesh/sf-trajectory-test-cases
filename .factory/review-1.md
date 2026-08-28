# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28 UTC
**Live URL:** <https://trajectory-test-cases.sociobot.in/>
**Candidate:** `adfec0c92240836ed8eb67f8ed99d5098fc9c516`

## Verdict

**FAIL.** The first read and demo meet the core product test, and every listed
claim test passes, but the product does not meet the zero-findings standard.
One blocking claims-contract finding and four other findings remain.

## Cold first read

Fresh 390 × 844 and 1440 × 1000 contexts both showed this before scroll:

> “Test agent tool paths in CI.”
>
> “For CI engineers who need stable checks for required calls, retries, and
> ordering.”
>
> “Try it with sample data” — “Opens a passing fixture in the local trace
> bench.”

Interpretation: this checks the sequence of an agent’s tool calls in CI, for
CI engineers; click **Try it with sample data** first. The first screen answers
what, who, and what to click. It has no horizontal overflow at 390 px and no
console errors. This is not a first-read blocker.

## Findings

### F-1-1 — BLOCKING — live claims lack manifest entries and tagged proof

**Locations / exact copy:** landing facts and feature copy, plus README:

- “Runs in this browser”
- “No account or upload”
- “The package matcher runs here in your browser.”
- “Get stable exit codes, structured JSON, and a line-by-line trace that
  explains the mismatch.” (the line-by-line-trace clause is not covered by
  `cli-contract`)
- “Use the recorder, matcher, fault injector, or renderer independently.”
- “Requires Node.js 20 or newer.”
- “Each expected action matches a tool, an optional phase (`call`, `result`, or
  `error`), and an optional JSON-subset of scrubbed `args`.”
- “`count` defaults to exactly one.”
- “result/error bookkeeping is ignored by default when all declared
  expectations target calls.”
- “The recorder requires `scrubArgs` …”
- “The CLI never prompts, so it is safe in CI.”

These are concrete promises a library user can rely on. `.factory/claims.json`
has no entry that names and tests these behaviours. The closest tagged tests
cover privacy requests, core matching categories, selected exports, and CLI
exit codes; they do not prove the quoted clauses. This violates the required
“every claim is a test” contract even though the existing eight entries pass.

**Concrete fix:** either remove the unsupported clauses or add narrowly named
claims with one `@claim:<id>` test each. Suggested tests: assert no auth/UI or
network request for browser use; assert the four public functions import and
run; assert `engines.node`; exercise phase/args/default-count/bookkeeping;
assert missing `scrubArgs` fails safely; and run the CLI with closed stdin and
verify it terminates without reading it. Add a readable CLI mismatch assertion
if retaining the line-by-line-trace promise.

### F-1-2 — P1 — route metadata is incomplete, and the social image has the wrong required dimensions

**Location:** live `/demo/`, `/privacy/`, `/terms/`, and `/not-a-real-route`.

The landing has canonical, OG, Twitter and favicon metadata. The demo, Privacy,
Terms, and designed 404 each have only description, title, canonical (not the
404), and SVG favicon. They have no Open Graph title/description/image, no
Twitter title/description/image, and no 180 px Apple touch icon. The only OG
image is `site/public/assets/evidence-bench-1200.webp`, which is **1200 × 800**,
not the required 1200 × 630.

This makes shared links and device icons inconsistent by route and fails the
site metadata contract.

**Concrete fix:** add route-specific OG and Twitter metadata to every route,
including the 404; generate/crop a product-owned 1200 × 630 social image; add
and link a 180 × 180 Apple touch icon; add a route metadata regression test.

### F-1-3 — P1 — shared navigation/footer and route-change focus are absent on some routes

**Location:** live `/not-a-real-route`, all live route transitions.

The 404 contains only a main landmark and “Return to the documentation”; it
has no shared header, no footer, no Privacy/Terms links, and no build/version
identifier. The other routes have visibly different primary navigation:
landing has Demo/API/GitHub, demo has Home/Privacy, and legal pages have
Home/Demo/GitHub. No footer includes a version/build id.

On fresh direct loads of `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404,
`document.activeElement` remains `BODY`; there is no focus movement to the new
`h1` or polite route announcement. This leaves keyboard and screen-reader
visitors without the required route-change cue.

**Concrete fix:** use one header/footer component on all five routes (wordmark
home, a consistent compact nav including Demo and Privacy, footer Privacy,
Terms, Param Factory credit, and build id). On navigation/back restoration,
focus the incoming `h1` and announce its route name through one polite live
region. Test direct links, back, focus, and the 404 skeleton.

### F-1-4 — P2 — example buttons do not name the action

**Location:** landing and `/demo/` controls: “Passing trace”, “Missing call”,
“Wrong order”, and “Empty trace”.

These are buttons that load examples, but their labels are state names rather
than result-naming verbs. A first-time keyboard user must infer what activation
does.

**Concrete fix:** rename them “Load passing trace”, “Load missing-call
example”, “Load wrong-order example”, and “Load empty trace”. Keep the
accessible names and tests aligned with the new action labels.

### F-1-5 — P3 — two section headings contain an unmeasured adjective or unexplained jargon

**Location / exact copy:** “A smaller test primitive” and “Tiny public surface”
on the landing page.

“Smaller” and “tiny” are comparative marketing adjectives without a measure;
“test primitive” and “public surface” do not tell a cold reader what the
section contains when heard out of context.

**Concrete fix:** use “Check agent calls in three steps” and “Four library
tools” (or equivalent literal headings). This keeps the technical audience
while naming the content.

## Demo and sandbox verification

Pass. From a fresh context, one landing click opened `/demo/` with title
“Demo — Trajectory Test Cases”, a visible “Demo — sample data, nothing is
saved” banner, an immediately visible passing research-then-save trace,
**Reset demo**, and **Start for real**.

Replacing the events with `[]` changed the verdict to `FAIL`; **Reset demo**
restored `PASS`. During the edit/reset flow, Playwright recorded zero outgoing
requests. Storage was only `sessionStorage["demo:ttc-workspace"]`; local
storage was empty. Demo state therefore does not touch real storage. The
direct demo route is usable, realistic, and not a weak/demo-only shell.

## Claims verification

`npm ci` completed with zero vulnerabilities. Every command named by
`.factory/claims.json` passed from that clean install:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `local-privacy` | PASS |
| `deterministic-verdict` | PASS |
| `offline-reload` | PASS |
| `matcher-rules` | PASS |
| `recorder-scrubbing` | PASS |
| `package-contract` | PASS |
| `cli-contract` | PASS |

The privacy claim was independently repeated against live `/demo/`: initial
resources were same-origin only; after load, editing and running the sample
made zero requests. The local claim test also verified the offline reload
flow after service-worker control. The missing work is the unlisted live copy
in F-1-1, not a failure of the eight declared tests.

## History check

There were no earlier `review-*.md` or `polish-*.md` files. I read
`.factory/verification.md`, `.factory/verification-2.md`, and the previous
handoff. The earlier release blockers are fixed in live behaviour and code:
the claims manifest exists and declared commands pass; `/demo/` is isolated
and resettable; the first-screen job/action is plain; response security
headers are live; and the supporting demo/copy/URL-verification files exist.
No earlier finding is regressed. The new findings above are gaps the prior
verification did not enumerate.

## Structure, accessibility, and product-scope check

- Live `/`, `/demo/`, `/privacy/`, `/terms/` return 200; the unknown route
  returns the designed 404 with HTTP 404. All crawled internal and external
  links returned 200 (mailto links excluded as explicit non-HTTP actions).
- The live landing title, description, canonical, one `h1`, one `main`,
  `lang=en`, favicon, security headers, robots, and sitemap are present.
  `npm run verify:url -- https://trajectory-test-cases.sociobot.in` passed.
- Axe found no serious or critical issues on landing, demo, Privacy, Terms, or
  the 404. The 390 px landing and demo had no horizontal overflow. No console
  errors appeared on load or demo operation.
- The visual system is distinct and matches `.factory/design.md`: warm paper,
  inspection-ink borders, numbered evidence labels, local type, and original
  evidence-bench art. It does not present as a generic gradient/card SaaS
  template.
- The brief is intentionally deterministic and model-agnostic, with model
  judging explicitly out of scope. No AI step is implied or missing. JSON
  fixture/event input and CLI JSON output provide the relevant import/export
  path; sync is not implied.

## Copy audit

Counts use whitespace-delimited words, treating hyphenated words as one.
Code/JSON samples are executable content and excluded. No auditable sentence
exceeds 22 words. The flags are F-1-1, F-1-4, and F-1-5 above; no banned
marketing word was found.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Theme | 1 |
| Deterministic agent testing | 3 |
| Test agent tool paths in CI. | 6 |
| For CI engineers who need stable checks for required calls, retries, and ordering. | 13 |
| Try it with sample data | 5 |
| Opens a passing fixture in the local trace bench. | 9 |
| Runs in this browser | 4 |
| No account or upload | 4 |
| Free under the MIT License | 5 |
| Copy install | 2 |
| Zero runtime dependencies | 3 |
| ESM + CJS | 2 |
| TypeScript declarations | 2 |
| Fixture → evidence | 2 |
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
| Passing trace | 2 |
| Missing call | 2 |
| Wrong order | 2 |
| Empty trace | 2 |
| Fixture | 1 |
| fixture.json | 2 |
| JSON fixture defining expected and forbidden tool actions. | 8 |
| Observed | 1 |
| events.json | 2 |
| JSON array of already scrubbed tool events. | 7 |
| The check sends no trace data. | 6 |
| The same input returns the same verdict. | 7 |
| Run fixture | 2 |
| Inspection trace | 2 |
| Missing save: expected 1 report.write call. | 7 |
| A smaller test primitive | 4 |
| Keep only the invariants that matter. | 6 |
| Record scrubbed events | 3 |
| You supply the argument scrubber. | 5 |
| The recorder stores its output, not the raw arguments. | 9 |
| Declare partial order | 3 |
| Name required actions, attach only meaningful “after” edges, and forbid dangerous calls. | 12 |
| Fail with evidence | 3 |
| Get stable exit codes, structured JSON, and a line-by-line trace that explains the mismatch. | 14 |
| Tiny public surface | 3 |
| One checker. | 2 |
| Four tools. | 2 |
| Use the recorder, matcher, fault injector, or renderer independently. | 9 |
| The package has no runtime dependencies. | 6 |
| Read the full API | 4 |
| Copy code | 2 |
| A pass is path evidence—not a safety certificate. | 9 |
| Trajectory Test Cases verifies only the actions and ordering you declare. | 11 |
| Keep output quality, security, and end-to-end behavior in your wider test strategy. | 12 |
| Open fixtures for agent paths. | 5 |
| Built by Sociobot. | 3 |
| GitHub | 1 |
| Privacy | 1 |
| Terms | 1 |

### README

| Copy | Words |
| --- | ---: |
| Trajectory Test Cases | 3 |
| Test required agent tool calls, retries, and ordering with deterministic fixtures built for CI. | 14 |
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
| Requires Node.js 20 or newer. | 6 |
| The package ships ESM, CommonJS, and TypeScript declarations with no runtime dependencies. | 12 |
| Usage | 1 |
| Create a fixture in `fixtures/weather.json`: | 7 |
| Record a scrubbed trace and check it: | 7 |
| Each expected action matches a tool, an optional phase (`call`, `result`, or `error`), and an optional JSON-subset of scrubbed `args`. | 20 |
| `after` contains IDs that must be fully observed first. | 9 |
| `count` defaults to exactly one. | 5 |
| Forbidden actions are checked independently. | 5 |
| Set `allowUnmatched` to `false` to catch any extra events; result/error bookkeeping is ignored by default when all declared expectations target calls. | 22 |
| The recorder requires `scrubArgs` and stores only its output. | 9 |
| Result payloads are omitted unless you also provide `scrubResult`. | 9 |
| Editors and validators can load the published JSON Schema from `trajectory-test-cases/fixture.schema.json`. | 14 |
| CLI | 1 |
| Write the recorder output to JSON, then run: | 8 |
| Exit code `0` means the declared trajectory passed, `1` means it mismatched, and `2` means the input or command was invalid. | 21 |
| `--json` writes one machine-readable result to stdout. | 7 |
| The CLI never prompts, so it is safe in CI. | 10 |
| Development | 1 |
| The live documentation and local trace playground are at `trajectory-test-cases.sociobot.in`. | 12 |
| Demo changes stay in isolated session storage and are discarded when you leave. | 13 |
| See `CHANGELOG.md` for releases. | 5 |
| Deploy | 1 |
| The factory deploys the static contents of `dist/site`; registry publishing is handled separately. | 14 |
| This repository contains no analytics, remote fonts, or runtime third-party scripts. | 11 |
| License | 1 |
| MIT © 2026 Sociobot (Param Factory). | 5 |

## What would make this perfect

Close F-1-1 by making every visitor-facing promise testable or removing it;
then give every route the same complete metadata and navigation skeleton,
including a correctly sized social image and route-focus behaviour. Rename the
four loader buttons and the two vague headings. Re-run this full review from a
fresh browser context after deployment.
