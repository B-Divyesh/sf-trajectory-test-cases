# Landing copy audit

Audited 2026-08-28 after polish round 3. Counts use whitespace-delimited
words and treat hyphenated terms as one word. Executable JSON and code are
excluded. Every visible landing sentence, heading, label, and action is listed.

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
| Opens a passing fixture in the fixture checker. | 9 | Pass |
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
| Fixture checker | 2 | Pass |
| Test a fixture with sample events | 6 | Pass |
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
| Missing save: expected 1 report.write call. | 7 | Pass |
| No events observed. | 3 | Pass |
| Add a scrubbed event or load an example to test this fixture. | 12 | Pass |
| Could not run this fixture. | 5 | Pass |
| Fix the JSON or load a known example. | 9 | Pass |
| All declared path invariants matched. | 5 | Pass |
| How it works | 3 | Pass |
| Check agent calls in three steps | 6 | Pass |
| Record scrubbed events | 3 | Pass |
| You supply the argument scrubber. | 5 | Pass |
| The recorder stores its output, not the raw arguments. | 9 | Pass |
| Declare partial order | 3 | Pass |
| Name required actions, attach only meaningful “after” edges, and forbid dangerous calls. | 12 | Pass |
| See why a fixture failed | 5 | Pass |
| Get stable exit codes, structured JSON, and a line-by-line trace that explains the mismatch. | 14 | Pass |
| Package API | 2 | Pass |
| Four library tools | 3 | Pass |
| Use the recorder, matcher, fault injector, or renderer independently. | 9 | Pass |
| The package has no runtime dependencies. | 6 | Pass |
| Read the full API | 4 | Pass |
| Copy code | 2 | Pass |
| A passing fixture does not prove safety. | 7 | Pass |
| Trajectory Test Cases verifies only the actions and ordering you declare. | 11 | Pass |
| Keep output quality, security, and end-to-end behavior in your wider test strategy. | 12 | Pass |
| Check agent tool paths in CI. | 6 | Pass |
| Built by Param Factory. | 4 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| GitHub | 1 | Pass |

No line exceeds 22 words. No line contains a banned marketing word. The first
screen says the job, audience, first action, and three concrete facts in one
breath.

## Terminology

| Concept | One term used |
| --- | --- |
| Declarative expected path | fixture |
| Recorded action | event |
| Ordered event list | trace |
| Browser sample environment | demo |
| Evaluation result | verdict |
| Rule failure explanation | mismatch |
