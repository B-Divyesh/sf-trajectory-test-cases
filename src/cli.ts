import { readFile } from "node:fs/promises";
import { checkTrajectory } from "./matcher.js";
import { renderTrace } from "./render.js";
import { TrajectoryInputError } from "./validate.js";

const HELP = `Trajectory Test Cases 0.1.0

Assert a scrubbed tool-event trace against a partial-order fixture.

Usage:
  ttc check --fixture <fixture.json> --events <events.json> [--json] [--no-color]
  ttc --help

Options:
  -f, --fixture <path>  Version 1 fixture JSON
  -e, --events <path>   ToolEvent array, or an object containing { events }
      --json            Emit machine-readable JSON only
      --no-color        Disable ANSI color
  -h, --help            Show this help

Exit codes: 0 pass, 1 trajectory mismatch, 2 invalid command or input.
The CLI never sends data or prompts for input.`;

interface Args { fixture: string | undefined; events: string | undefined; json: boolean; color: boolean; help: boolean }

function parseArgs(argv: string[]): Args {
  const parsed: Args = { fixture: undefined, events: undefined, json: false, color: Boolean(process.stdout.isTTY && !process.env.NO_COLOR), help: false };
  const values = [...argv];
  while (values.length) {
    const token = values.shift();
    if (token === "check") continue;
    if (token === "-h" || token === "--help") parsed.help = true;
    else if (token === "--json") parsed.json = true;
    else if (token === "--no-color") parsed.color = false;
    else if (token === "-f" || token === "--fixture") parsed.fixture = values.shift();
    else if (token === "-e" || token === "--events") parsed.events = values.shift();
    else throw new Error(`Unknown argument: ${token ?? ""}`);
  }
  return parsed;
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read ${path}: ${detail}`);
  }
}

export async function run(argv = process.argv.slice(2)): Promise<number> {
  try {
    const args = parseArgs(argv);
    if (args.help || argv.length === 0) {
      process.stdout.write(`${HELP}\n`);
      return 0;
    }
    if (argv[0] !== "check") throw new Error("Expected command: check");
    if (!args.fixture || !args.events) throw new Error("check requires --fixture and --events");
    const fixture = await readJson(args.fixture);
    const eventValue = await readJson(args.events);
    const events = eventValue && typeof eventValue === "object" && !Array.isArray(eventValue) && "events" in eventValue
      ? (eventValue as { events: unknown }).events
      : eventValue;
    const result = checkTrajectory(fixture, events);
    process.stdout.write(args.json ? `${JSON.stringify(result)}\n` : `${renderTrace(result, { color: args.color })}\n`);
    return result.pass ? 0 : 1;
  } catch (error) {
    const detail = error instanceof TrajectoryInputError ? error.issues.join("; ") : error instanceof Error ? error.message : String(error);
    process.stderr.write(`ttc: ${detail}\nRun ttc --help for usage.\n`);
    return 2;
  }
}

declare const require: NodeRequire | undefined;
declare const module: NodeModule | undefined;
if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  void run().then((code) => { process.exitCode = code; });
}
