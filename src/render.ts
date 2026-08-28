import type { TrajectoryResult } from "./types.js";

export interface RenderOptions { color?: boolean }

const paint = (enabled: boolean, code: number, value: string): string => enabled ? `\u001b[${code}m${value}\u001b[0m` : value;

export function renderTrace(result: TrajectoryResult, options: RenderOptions = {}): string {
  const color = options.color ?? false;
  const head = result.pass
    ? paint(color, 32, `PASS  ${result.fixture}`)
    : paint(color, 31, `FAIL  ${result.fixture}`);
  const rows = result.events.length
    ? result.events.map((event) => {
      const marker = event.status === "matched" ? "●" : event.status === "ignored" ? "·" : "×";
      const markerColor = event.status === "matched" ? 32 : event.status === "ignored" ? 90 : 31;
      const attempt = event.attempt ? ` attempt=${event.attempt}` : "";
      const match = event.matchedId ? ` → ${event.matchedId}` : "";
      return `${paint(color, markerColor, marker)}  ${String(event.index + 1).padStart(2, "0")}  ${event.tool} · ${event.phase}${attempt}${match}`;
    })
    : ["·  No events observed"];
  const failures = result.failures.map((failure) => `${paint(color, 31, "!")}  ${failure.message}`);
  const summary = `${result.summary.matched}/${result.summary.observed} matched · ${result.summary.failures} ${result.summary.failures === 1 ? "failure" : "failures"}`;
  return [head, "", ...rows, ...(failures.length ? ["", ...failures] : []), "", summary].join("\n");
}
