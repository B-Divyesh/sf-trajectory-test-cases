import type { AnnotatedEvent, EventSelector, JsonValue, ToolEvent, TrajectoryFailure, TrajectoryFixture, TrajectoryResult } from "./types.js";
import { validateEvents, validateFixture } from "./validate.js";

function isSubset(expected: JsonValue, actual: JsonValue | undefined): boolean {
  if (expected === null || typeof expected !== "object") return Object.is(expected, actual);
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && expected.length === actual.length && expected.every((value, index) => isSubset(value, actual[index]));
  }
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) return false;
  return Object.entries(expected).every(([key, value]) => isSubset(value, actual[key]));
}

function selectorMatches(selector: EventSelector, event: ToolEvent): boolean {
  return event.tool === selector.tool && event.phase === (selector.phase ?? "call") && (selector.args === undefined || isSubset(selector.args, event.args));
}

export function checkTrajectory(fixtureValue: unknown, eventsValue: unknown): TrajectoryResult {
  validateFixture(fixtureValue);
  validateEvents(eventsValue);
  const fixture = fixtureValue;
  const events = eventsValue;
  const matches: Record<string, number[]> = {};
  const failures: TrajectoryFailure[] = [];
  const annotations: AnnotatedEvent[] = events.map((event, index) => ({ ...event, index, status: "ignored" }));
  const claimed = new Set<number>();

  for (const expected of fixture.expect) {
    const indices: number[] = [];
    events.forEach((event, index) => {
      if (!claimed.has(index) && selectorMatches(expected, event)) indices.push(index);
    });
    indices.forEach((index) => {
      claimed.add(index);
      const annotation = annotations[index];
      if (annotation) {
        annotation.status = "matched";
        annotation.matchedId = expected.id;
      }
    });
    matches[expected.id] = indices;
    const min = expected.count?.min ?? 1;
    const max = expected.count?.max ?? min;
    if (indices.length < min) {
      failures.push({
        code: indices.length === 0 ? "missing" : "count",
        expectedId: expected.id,
        eventIndices: indices,
        message: indices.length === 0
          ? `Missing ${expected.id}: expected ${min} ${expected.tool} ${expected.phase ?? "call"}${min === 1 ? "" : "s"}`
          : `Too few ${expected.id}: expected at least ${min}, observed ${indices.length}`,
      });
    } else if (indices.length > max) {
      failures.push({ code: "count", expectedId: expected.id, eventIndices: indices, message: `Too many ${expected.id}: expected at most ${max}, observed ${indices.length}` });
    }
  }

  for (const expected of fixture.expect) {
    const current = matches[expected.id] ?? [];
    if (!current.length) continue;
    for (const dependency of expected.after ?? []) {
      const previous = matches[dependency] ?? [];
      if (!previous.length) continue;
      const previousLast = Math.max(...previous);
      const currentFirst = Math.min(...current);
      if (previousLast >= currentFirst) {
        failures.push({
          code: "order",
          expectedId: expected.id,
          eventIndices: [...previous, ...current],
          message: `Out of order: ${expected.id} must occur after all ${dependency} events`,
        });
      }
    }
  }

  for (const forbidden of fixture.forbid ?? []) {
    const indices = events.flatMap((event, index) => selectorMatches(forbidden, event) ? [index] : []);
    if (indices.length) {
      indices.forEach((index) => {
        const annotation = annotations[index];
        if (annotation) annotation.status = "forbidden";
      });
      failures.push({ code: "forbidden", eventIndices: indices, message: `Forbidden action observed: ${forbidden.tool} ${forbidden.phase ?? "call"} at ${indices.map((index) => `#${index + 1}`).join(", ")}` });
    }
  }

  if (fixture.allowUnmatched === false) {
    const relevantPhases = new Set(fixture.expect.map((item) => item.phase ?? "call"));
    const indices: number[] = [];
    events.forEach((event, index) => {
      const annotation = annotations[index];
      if (annotation?.status === "ignored" && relevantPhases.has(event.phase)) {
        annotation.status = "unexpected";
        indices.push(index);
      }
    });
    if (indices.length) failures.push({ code: "unexpected", eventIndices: indices, message: `Unexpected ${indices.length === 1 ? "event" : "events"}: ${indices.map((index) => `#${index + 1}`).join(", ")}` });
  }

  return {
    pass: failures.length === 0,
    fixture: fixture.name,
    summary: { observed: events.length, matched: claimed.size, failures: failures.length },
    matches,
    failures,
    events: annotations,
  };
}
