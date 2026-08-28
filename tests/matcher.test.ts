import { describe, expect, it } from "vitest";
import { checkTrajectory, TrajectoryInputError, type ToolEvent, type TrajectoryFixture } from "../src/index.js";

const fixture: TrajectoryFixture = {
  version: 1,
  name: "research then save",
  expect: [
    { id: "lookup", tool: "docs.search", args: { scope: "api" }, count: { min: 2, max: 2 } },
    { id: "save", tool: "report.write", after: ["lookup"] },
  ],
  forbid: [{ tool: "shell.exec" }],
  allowUnmatched: false,
};

const valid: ToolEvent[] = [
  { seq: 1, tool: "docs.search", phase: "call", args: { scope: "api", token: "scrubbed" }, attempt: 1 },
  { seq: 2, tool: "docs.search", phase: "call", args: { scope: "api" }, attempt: 2 },
  { seq: 3, tool: "report.write", phase: "call", args: { path: "report" } },
];

describe("checkTrajectory", () => {
  it("passes a documented partial-order trace", () => {
    const result = checkTrajectory(fixture, valid);
    expect(result.pass).toBe(true);
    expect(result.matches).toEqual({ lookup: [0, 1], save: [2] });
  });

  it.each([
    ["missing save", valid.slice(0, 2), "missing"],
    ["missing lookup", valid.slice(2), "missing"],
    ["too few retries", [valid[0], valid[2]], "count"],
    ["too many retries", [valid[0], valid[1], { ...valid[1], seq: 3 }, { ...valid[2], seq: 4 }], "count"],
    ["reversed order", [valid[2], valid[0], valid[1]], "order"],
    ["forbidden call", [...valid, { seq: 4, tool: "shell.exec", phase: "call" }], "forbidden"],
    ["unexpected call", [...valid, { seq: 4, tool: "mail.send", phase: "call" }], "unexpected"],
    ["wrong argument", [{ ...valid[0], args: { scope: "web" } }, valid[1], valid[2]], "count"],
    ["wrong phase", [{ ...valid[0], phase: "result" }, valid[1], valid[2]], "count"],
    ["empty trace", [], "missing"],
  ] as const)("detects seeded mutation: %s", (_name, events, code) => {
    const result = checkTrajectory(fixture, events);
    expect(result.pass).toBe(false);
    expect(result.failures.some((failure) => failure.code === code)).toBe(true);
  });

  it("ignores bookkeeping phases in call-only strict fixtures", () => {
    const events: ToolEvent[] = [valid[0]!, { seq: 2, tool: "docs.search", phase: "error", error: { name: "Timeout", message: "[redacted]" } }, { ...valid[1]!, seq: 3 }, { seq: 4, tool: "docs.search", phase: "result" }, { ...valid[2]!, seq: 5 }];
    expect(checkTrajectory(fixture, events).pass).toBe(true);
  });

  it("rejects cycles and unknown dependencies", () => {
    expect(() => checkTrajectory({ version: 1, name: "bad", expect: [{ id: "a", tool: "a", after: ["b"] }] }, [])).toThrow(TrajectoryInputError);
    expect(() => checkTrajectory({ version: 1, name: "cycle", expect: [{ id: "a", tool: "a", after: ["b"] }, { id: "b", tool: "b", after: ["a"] }] }, [])).toThrow(/cycle/);
  });
});
