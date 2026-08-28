# Trajectory Test Cases

Check required agent tool calls, retries, and ordering with deterministic CI
fixtures.

Trajectory Test Cases is for engineers testing tool-calling agents in CI. It
records scrubbed arguments, injects repeatable retry faults, and prints the
exact mismatch. A passing fixture proves only the declared path invariants. It
does **not** prove response quality, correctness, or safety.

## Try the demo

Open the [sample-data demo](https://trajectory-test-cases.sociobot.in/demo/?demo=1).
It loads a passing fixture in one click. Demo edits use isolated `demo:` session
storage and are discarded when you leave. The checker sends no trace data. The
demo also reloads offline after the first visit.

## Install

```sh
npm install --save-dev trajectory-test-cases
```

Requires Node.js 20 or newer. The package ships ESM, CommonJS, and TypeScript
declarations with no runtime dependencies.

## Usage

Create a fixture in `fixtures/weather.json`:

```json
{
  "version": 1,
  "name": "weather lookup is saved after a retry",
  "expect": [
    { "id": "lookup", "tool": "weather.search", "count": { "min": 2, "max": 2 } },
    { "id": "save", "tool": "notes.write", "after": ["lookup"] }
  ],
  "forbid": [{ "tool": "shell.exec" }],
  "allowUnmatched": false
}
```

Record a scrubbed trace and check it:

```ts
import {
  checkTrajectory,
  createRecorder,
  injectRetryFault,
  renderTrace,
  type TrajectoryFixture,
} from "trajectory-test-cases";

const recorder = createRecorder({
  scrubArgs(tool, args) {
    if (tool === "weather.search") {
      return { city: String((args as { city?: unknown }).city ?? "") };
    }
    return "[scrubbed]";
  },
});

const search = injectRetryFault(
  async (city: string) => ({ city, celsius: 18 }),
  { failOnAttempts: [1], message: "upstream timeout" },
);

for (let attempt = 1; attempt <= 2; attempt += 1) {
  recorder.call("weather.search", { city: "Lisbon", apiKey: "secret" }, { attempt });
  try {
    await search("Lisbon");
    recorder.result("weather.search", { ok: true }, { attempt });
  } catch (error) {
    recorder.error("weather.search", error, { attempt });
  }
}
recorder.call("notes.write", { path: "/daily", body: "18 C" });

const fixture: TrajectoryFixture = {
  version: 1,
  name: "weather lookup is saved after a retry",
  expect: [
    { id: "lookup", tool: "weather.search", count: { min: 2, max: 2 } },
    { id: "save", tool: "notes.write", after: ["lookup"] },
  ],
  forbid: [{ tool: "shell.exec" }],
  allowUnmatched: true,
};

const result = checkTrajectory(fixture, recorder.events());
console.log(renderTrace(result));
if (!result.pass) process.exitCode = 1;
```

Each expected action matches a tool, an optional phase (`call`, `result`, or
`error`), and an optional JSON-subset of scrubbed `args`. `after` contains IDs
that must be fully observed first. `count` defaults to exactly one. Forbidden
actions are checked independently. Set `allowUnmatched` to `false` to catch any
extra events; result/error bookkeeping is ignored by default when all declared
expectations target calls.

The recorder requires `scrubArgs` and stores only its output. Result payloads
are omitted unless you also provide `scrubResult`.

Editors and validators can load the published JSON Schema from
`trajectory-test-cases/fixture.schema.json`.

## CLI

Write the recorder output to JSON, then run:

```sh
npx ttc check --fixture fixtures/weather.json --events traces/weather.json
npx ttc check --fixture fixtures/weather.json --events traces/weather.json --json
```

Exit code `0` means the declared trajectory passed, `1` means it mismatched,
and `2` means the input or command was invalid. `--json` writes one machine-
readable result to stdout. The CLI does not prompt for input.

## Development

```sh
npm ci
npm test
npm run build          # library + ./dist/site
npm run build:site     # landing page only -> ./dist/site
npm pack --dry-run
```

The live documentation and local trace playground are at
<https://trajectory-test-cases.sociobot.in>. Demo changes stay in isolated
session storage and are discarded when you leave. See
[CHANGELOG.md](CHANGELOG.md) for releases.

## Deploy

The factory deploys the static contents of `dist/site`; registry publishing is
handled separately. This repository contains no analytics, remote fonts, or
runtime third-party scripts.

## License

MIT © 2026 Sociobot (Param Factory).
