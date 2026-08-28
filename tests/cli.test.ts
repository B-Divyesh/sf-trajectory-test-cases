import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("ttc CLI", () => {
  it("has useful help", () => {
    const output = execFileSync(process.execPath, ["dist/cli.cjs", "--help"], { encoding: "utf8" });
    expect(output).toContain("ttc check --fixture");
    expect(output).toContain("Exit codes: 0 pass, 1 trajectory mismatch, 2 invalid command or input");
  });

  it("returns JSON and stable mismatch exit code", () => {
    const directory = mkdtempSync(join(tmpdir(), "ttc-test-"));
    const fixturePath = join(directory, "fixture.json");
    const eventsPath = join(directory, "events.json");
    writeFileSync(fixturePath, JSON.stringify({ version: 1, name: "needs save", expect: [{ id: "save", tool: "report.write" }] }));
    writeFileSync(eventsPath, "[]");
    const processResult = spawnSync(process.execPath, ["dist/cli.cjs", "check", "--fixture", fixturePath, "--events", eventsPath, "--json"], { encoding: "utf8" });
    expect(processResult.status).toBe(1);
    expect(JSON.parse(processResult.stdout)).toMatchObject({ pass: false, fixture: "needs save" });
    expect(processResult.stderr).toBe("");
  });

  it("uses exit code 2 for malformed input", () => {
    const directory = mkdtempSync(join(tmpdir(), "ttc-test-"));
    const fixturePath = join(directory, "fixture.json");
    const eventsPath = join(directory, "events.json");
    writeFileSync(fixturePath, "{");
    writeFileSync(eventsPath, "[]");
    const processResult = spawnSync(process.execPath, ["dist/cli.cjs", "check", "-f", fixturePath, "-e", eventsPath], { encoding: "utf8" });
    expect(processResult.status).toBe(2);
    expect(processResult.stderr).toContain("Could not read");
  });
});
