export type EventPhase = "call" | "result" | "error";
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface ToolEvent {
  seq: number;
  tool: string;
  phase: EventPhase;
  args?: JsonValue;
  result?: JsonValue;
  error?: { name: string; message: string };
  attempt?: number;
}

export interface EventSelector {
  tool: string;
  phase?: EventPhase;
  args?: JsonValue;
}

export interface ExpectedAction extends EventSelector {
  id: string;
  after?: string[];
  count?: { min?: number; max?: number };
}

export interface TrajectoryFixture {
  version: 1;
  name: string;
  expect: ExpectedAction[];
  forbid?: EventSelector[];
  allowUnmatched?: boolean;
}

export type FailureCode = "missing" | "count" | "order" | "forbidden" | "unexpected";

export interface TrajectoryFailure {
  code: FailureCode;
  message: string;
  expectedId?: string;
  eventIndices?: number[];
}

export interface AnnotatedEvent extends ToolEvent {
  index: number;
  status: "matched" | "forbidden" | "unexpected" | "ignored";
  matchedId?: string;
}

export interface TrajectoryResult {
  pass: boolean;
  fixture: string;
  summary: { observed: number; matched: number; failures: number };
  matches: Record<string, number[]>;
  failures: TrajectoryFailure[];
  events: AnnotatedEvent[];
}
