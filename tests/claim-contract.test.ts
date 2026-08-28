import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkTrajectory, createRecorder, injectRetryFault } from "../src/index.js";

describe("published product claims", () => {
  it("@claim:matcher-rules checks path rules and injects repeatable retry faults", async () => {
    const fixture = {
      version: 1 as const,
      name: "research then save",
      expect: [
        { id: "lookup", tool: "docs.search", count: { min: 2, max: 2 } },
        { id: "save", tool: "report.write", after: ["lookup"] },
      ],
      forbid: [{ tool: "shell.exec" }],
      allowUnmatched: false,
    };
    const passing = [
      { seq: 1, tool: "docs.search", phase: "call" as const },
      { seq: 2, tool: "docs.search", phase: "call" as const },
      { seq: 3, tool: "report.write", phase: "call" as const },
    ];
    expect(checkTrajectory(fixture, passing).pass).toBe(true);
    expect(checkTrajectory(fixture, passing.slice(0, 2)).failures.map((failure) => failure.code)).toContain("missing");
    expect(checkTrajectory(fixture, [passing[2]!, passing[0]!, passing[1]!]).failures.map((failure) => failure.code)).toContain("order");
    expect(checkTrajectory(fixture, [...passing, { seq: 4, tool: "shell.exec", phase: "call" as const }]).failures.map((failure) => failure.code)).toContain("forbidden");
    expect(checkTrajectory(fixture, [...passing, { seq: 4, tool: "other", phase: "call" as const }]).failures.map((failure) => failure.code)).toContain("unexpected");
    const fault = injectRetryFault(async () => "done", { failOnAttempts: [1] });
    await expect(fault()).rejects.toMatchObject({ code: "TTC_INJECTED_FAULT", attempt: 1 });
    await expect(fault()).resolves.toBe("done");
    fault.reset();
    await expect(fault()).rejects.toMatchObject({ attempt: 1 });
  });

  it("@claim:recorder-scrubbing stores scrubber output and omits raw arguments", () => {
    const raw = { query: "timeouts", token: "secret-value" };
    const recorder = createRecorder({ scrubArgs: (_tool, args) => ({ query: (args as typeof raw).query }) });
    recorder.call("docs.search", raw);
    recorder.result("docs.search", { privateResult: "hidden-result" });
    const serialized = JSON.stringify(recorder.events());
    expect(serialized).toContain("timeouts");
    expect(serialized).not.toContain("secret-value");
    expect(serialized).not.toContain("hidden-result");
  });

  it("@claim:package-contract ships ESM, CommonJS, declarations, schema, MIT, and no runtime dependencies", async () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { dependencies?: unknown; exports: Record<string, unknown>; license: string };
    expect(packageJson.dependencies).toBeUndefined();
    expect(packageJson.license).toBe("MIT");
    expect(packageJson.exports).toHaveProperty("./fixture.schema.json");
    expect(readFileSync("dist/index.d.ts", "utf8")).toContain("checkTrajectory");
    expect(JSON.parse(readFileSync("schema/fixture.schema.json", "utf8"))).toHaveProperty("$schema");
    const runtime = ["dist/index.js", "dist/index.cjs", "dist/cli.cjs"].map((path) => readFileSync(path, "utf8")).join("\n");
    expect(runtime).not.toMatch(/\bfetch\s*\(|node:https?|XMLHttpRequest|sendBeacon|telemetry/i);
    const distEsm = "../dist/index.js";
    const esm = await import(distEsm) as { checkTrajectory?: unknown };
    const require = createRequire(import.meta.url);
    const distCjs = "../dist/index.cjs";
    const cjs = require(distCjs) as typeof esm;
    expect(typeof esm.checkTrajectory).toBe("function");
    expect(typeof cjs.checkTrajectory).toBe("function");
  });

  it("@claim:cli-contract returns stable exit codes and machine-readable mismatch output", () => {
    const directory = mkdtempSync(join(tmpdir(), "ttc-claim-"));
    const fixturePath = join(directory, "fixture.json");
    const eventsPath = join(directory, "events.json");
    writeFileSync(fixturePath, JSON.stringify({ version: 1, name: "save once", expect: [{ id: "save", tool: "report.write" }] }));
    const run = (events: string) => {
      writeFileSync(eventsPath, events);
      return spawnSync(process.execPath, ["dist/cli.cjs", "check", "--fixture", fixturePath, "--events", eventsPath, "--json"], { encoding: "utf8" });
    };
    const passing = run(JSON.stringify([{ seq: 1, tool: "report.write", phase: "call" }]));
    const mismatch = run("[]");
    const invalid = run("{");
    expect(passing.status).toBe(0);
    expect(JSON.parse(passing.stdout)).toMatchObject({ pass: true });
    expect(mismatch.status).toBe(1);
    expect(JSON.parse(mismatch.stdout)).toMatchObject({ pass: false });
    expect(invalid.status).toBe(2);
    writeFileSync(eventsPath, "[]");
    const readable = spawnSync(process.execPath, ["dist/cli.cjs", "check", "--fixture", fixturePath, "--events", eventsPath], { encoding: "utf8" });
    expect(readable.status).toBe(1);
    expect(readable.stdout).toContain("Missing save");
  });
});
