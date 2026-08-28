import type { EventPhase, ToolEvent, TrajectoryFixture } from "./types.js";

export class TrajectoryInputError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Invalid trajectory input:\n- ${issues.join("\n- ")}`);
    this.name = "TrajectoryInputError";
    this.issues = issues;
  }
}

const phases: EventPhase[] = ["call", "result", "error"];

function countIsValid(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0;
}

export function validateFixture(value: unknown): asserts value is TrajectoryFixture {
  const issues: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TrajectoryInputError(["fixture must be an object"]);
  }
  const fixture = value as Partial<TrajectoryFixture>;
  if (fixture.version !== 1) issues.push("version must be 1");
  if (typeof fixture.name !== "string" || !fixture.name.trim()) issues.push("name must be a non-empty string");
  if (!Array.isArray(fixture.expect)) issues.push("expect must be an array");

  const ids = new Set<string>();
  if (Array.isArray(fixture.expect)) {
    fixture.expect.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        issues.push(`expect[${index}] must be an object`);
        return;
      }
      if (typeof item.id !== "string" || !item.id.trim()) issues.push(`expect[${index}].id must be non-empty`);
      else if (ids.has(item.id)) issues.push(`expect[${index}].id duplicates "${item.id}"`);
      else ids.add(item.id);
      if (typeof item.tool !== "string" || !item.tool.trim()) issues.push(`expect[${index}].tool must be non-empty`);
      if (item.phase !== undefined && !phases.includes(item.phase)) issues.push(`expect[${index}].phase is invalid`);
      if (item.after !== undefined && (!Array.isArray(item.after) || item.after.some((id) => typeof id !== "string"))) {
        issues.push(`expect[${index}].after must be an array of IDs`);
      }
      if (item.count !== undefined) {
        const min = item.count.min ?? 1;
        const max = item.count.max ?? min;
        if (!countIsValid(min) || !countIsValid(max) || max < min) issues.push(`expect[${index}].count must use integers with 0 <= min <= max`);
      }
    });
    fixture.expect.forEach((item, index) => {
      item.after?.forEach((id) => {
        if (!ids.has(id)) issues.push(`expect[${index}].after references unknown ID "${id}"`);
        if (id === item.id) issues.push(`expect[${index}] cannot depend on itself`);
      });
    });

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const byId = new Map(fixture.expect.map((item) => [item.id, item]));
    const visit = (id: string): void => {
      if (visiting.has(id)) {
        issues.push(`dependency cycle includes "${id}"`);
        return;
      }
      if (visited.has(id)) return;
      visiting.add(id);
      byId.get(id)?.after?.forEach(visit);
      visiting.delete(id);
      visited.add(id);
    };
    ids.forEach(visit);
  }

  if (fixture.forbid !== undefined && !Array.isArray(fixture.forbid)) issues.push("forbid must be an array");
  fixture.forbid?.forEach((item, index) => {
    if (!item || typeof item !== "object" || typeof item.tool !== "string" || !item.tool.trim()) issues.push(`forbid[${index}].tool must be non-empty`);
    if (item.phase !== undefined && !phases.includes(item.phase)) issues.push(`forbid[${index}].phase is invalid`);
  });
  if (fixture.allowUnmatched !== undefined && typeof fixture.allowUnmatched !== "boolean") issues.push("allowUnmatched must be boolean");
  if (issues.length) throw new TrajectoryInputError(issues);
}

export function validateEvents(value: unknown): asserts value is ToolEvent[] {
  const issues: string[] = [];
  if (!Array.isArray(value)) throw new TrajectoryInputError(["events must be an array"]);
  value.forEach((event, index) => {
    if (!event || typeof event !== "object") {
      issues.push(`events[${index}] must be an object`);
      return;
    }
    const candidate = event as Partial<ToolEvent>;
    if (typeof candidate.tool !== "string" || !candidate.tool.trim()) issues.push(`events[${index}].tool must be non-empty`);
    if (!candidate.phase || !phases.includes(candidate.phase)) issues.push(`events[${index}].phase is invalid`);
    if (!Number.isInteger(candidate.seq) || Number(candidate.seq) < 1) issues.push(`events[${index}].seq must be a positive integer`);
    if (candidate.attempt !== undefined && (!Number.isInteger(candidate.attempt) || candidate.attempt < 1)) issues.push(`events[${index}].attempt must be a positive integer`);
  });
  if (issues.length) throw new TrajectoryInputError(issues);
}
