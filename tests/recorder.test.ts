import { describe, expect, it, vi } from "vitest";
import { createRecorder, injectRetryFault, renderTrace } from "../src/index.js";

describe("createRecorder", () => {
  it("requires and applies an argument scrubber without storing raw values", () => {
    const raw = { query: "test", token: "do-not-store" };
    const recorder = createRecorder({ scrubArgs: (_tool, args) => ({ query: (args as typeof raw).query }) });
    recorder.call("docs.search", raw, { attempt: 1 });
    raw.query = "mutated";
    expect(recorder.events()).toEqual([{ seq: 1, tool: "docs.search", phase: "call", args: { query: "test" }, attempt: 1 }]);
    expect(JSON.stringify(recorder.events())).not.toContain("do-not-store");
  });

  it("omits results and redacts error messages by default", () => {
    const recorder = createRecorder({ scrubArgs: () => null });
    recorder.result("docs.search", { secret: "hidden" });
    recorder.error("docs.search", new Error("private upstream detail"));
    expect(JSON.stringify(recorder.events())).not.toMatch(/hidden|private upstream detail/);
    expect(recorder.events()[1]?.error).toEqual({ name: "Error", message: "[redacted]" });
  });

  it("returns copies and resets deterministically", () => {
    const recorder = createRecorder({ scrubArgs: () => null });
    recorder.call("one", {});
    const copy = recorder.events();
    copy[0]!.tool = "changed";
    expect(recorder.events()[0]?.tool).toBe("one");
    recorder.clear();
    expect(recorder.events()).toEqual([]);
  });
});

describe("injectRetryFault", () => {
  it("fails only configured attempts and can reset", async () => {
    const handler = vi.fn(async (value: number) => value * 2);
    const wrapped = injectRetryFault(handler, { failOnAttempts: [1, 3], message: "timeout" });
    await expect(wrapped(2)).rejects.toMatchObject({ name: "InjectedRetryFault", code: "TTC_INJECTED_FAULT", attempt: 1 });
    await expect(wrapped(3)).resolves.toBe(6);
    await expect(wrapped(4)).rejects.toMatchObject({ attempt: 3 });
    expect(handler).toHaveBeenCalledTimes(1);
    wrapped.reset();
    expect(wrapped.attempts()).toBe(0);
    await expect(wrapped(5)).rejects.toMatchObject({ attempt: 1 });
  });
});

describe("renderTrace", () => {
  it("renders empty and failed traces without ANSI by default", () => {
    const text = renderTrace({ pass: false, fixture: "empty", summary: { observed: 0, matched: 0, failures: 1 }, matches: {}, failures: [{ code: "missing", message: "Missing search" }], events: [] });
    expect(text).toContain("FAIL  empty");
    expect(text).toContain("No events observed");
    expect(text).not.toContain("\u001b");
  });
});
