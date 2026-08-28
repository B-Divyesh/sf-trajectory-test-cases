import type { JsonValue, ToolEvent } from "./types.js";

type MaybePromise<T> = T | Promise<T>;

export interface RecorderOptions {
  scrubArgs: (tool: string, args: unknown) => JsonValue;
  scrubResult?: (tool: string, result: unknown) => JsonValue;
  scrubError?: (tool: string, error: unknown) => { name: string; message: string };
}

export interface EventMeta { attempt?: number }

export interface TrajectoryRecorder {
  call(tool: string, args: unknown, meta?: EventMeta): ToolEvent;
  result(tool: string, result: unknown, meta?: EventMeta): ToolEvent;
  error(tool: string, error: unknown, meta?: EventMeta): ToolEvent;
  events(): ToolEvent[];
  clear(): void;
}

function cloneJson<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    throw new TypeError("Scrubbers must return JSON-serializable values");
  }
}

function safeError(error: unknown): { name: string; message: string } {
  return { name: error instanceof Error ? error.name : "Error", message: "[redacted]" };
}

export function createRecorder(options: RecorderOptions): TrajectoryRecorder {
  if (!options || typeof options.scrubArgs !== "function") throw new TypeError("createRecorder requires a scrubArgs function");
  let recorded: ToolEvent[] = [];

  const add = (tool: string, phase: ToolEvent["phase"], fields: Omit<ToolEvent, "seq" | "tool" | "phase"> = {}): ToolEvent => {
    if (typeof tool !== "string" || !tool.trim()) throw new TypeError("tool must be a non-empty string");
    if (fields.attempt !== undefined && (!Number.isInteger(fields.attempt) || fields.attempt < 1)) throw new TypeError("attempt must be a positive integer");
    const event = cloneJson({ seq: recorded.length + 1, tool, phase, ...fields });
    recorded.push(event);
    return cloneJson(event);
  };

  return {
    call(tool, args, meta = {}) {
      return add(tool, "call", { args: cloneJson(options.scrubArgs(tool, args)), ...meta });
    },
    result(tool, result, meta = {}) {
      const payload = options.scrubResult ? { result: cloneJson(options.scrubResult(tool, result)) } : {};
      return add(tool, "result", { ...payload, ...meta });
    },
    error(tool, error, meta = {}) {
      const scrubbed = options.scrubError ? options.scrubError(tool, error) : safeError(error);
      return add(tool, "error", { error: cloneJson(scrubbed), ...meta });
    },
    events: () => cloneJson(recorded),
    clear: () => { recorded = []; },
  };
}

export interface RetryFaultOptions {
  failOnAttempts: readonly number[];
  message?: string;
}

export type FaultInjectedHandler<TArgs extends unknown[], TResult> =
  ((...args: TArgs) => MaybePromise<TResult>) & { attempts(): number; reset(): void };

export function injectRetryFault<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => MaybePromise<TResult>,
  options: RetryFaultOptions,
): FaultInjectedHandler<TArgs, TResult> {
  if (typeof handler !== "function") throw new TypeError("handler must be a function");
  if (!Array.isArray(options?.failOnAttempts) || options.failOnAttempts.some((value) => !Number.isInteger(value) || value < 1)) {
    throw new TypeError("failOnAttempts must contain positive integers");
  }
  const failures = new Set(options.failOnAttempts);
  let attempt = 0;
  const wrapped = (async (...args: TArgs): Promise<TResult> => {
    attempt += 1;
    if (failures.has(attempt)) {
      const error = new Error(options.message ?? `Injected fault on attempt ${attempt}`) as Error & { code: string; attempt: number };
      error.name = "InjectedRetryFault";
      error.code = "TTC_INJECTED_FAULT";
      error.attempt = attempt;
      throw error;
    }
    return handler(...args);
  }) as FaultInjectedHandler<TArgs, TResult>;
  wrapped.attempts = () => attempt;
  wrapped.reset = () => { attempt = 0; };
  return wrapped;
}
