/// <reference types="vite/client" />
import "./style.css";
import { checkTrajectory, type ToolEvent, type TrajectoryFixture } from "../../src/index";

const fixture: TrajectoryFixture = {
  version: 1,
  name: "research then save",
  expect: [
    { id: "lookup", tool: "docs.search", count: { min: 2, max: 2 } },
    { id: "save", tool: "report.write", after: ["lookup"] },
  ],
  forbid: [{ tool: "shell.exec" }],
  allowUnmatched: false,
};

const traces: Record<string, ToolEvent[]> = {
  pass: [
    { seq: 1, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 1 },
    { seq: 2, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 2 },
    { seq: 3, tool: "report.write", phase: "call", args: { section: "findings" } },
  ],
  missing: [
    { seq: 1, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 1 },
    { seq: 2, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 2 },
  ],
  order: [
    { seq: 1, tool: "report.write", phase: "call", args: { section: "findings" } },
    { seq: 2, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 1 },
    { seq: 3, tool: "docs.search", phase: "call", args: { query: "timeouts" }, attempt: 2 },
  ],
  empty: [],
};

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required control is missing: ${selector}`);
  return element;
}

const fixtureInput = required<HTMLTextAreaElement>("#fixture-input");
const eventsInput = required<HTMLTextAreaElement>("#events-input");
const output = required<HTMLElement>("#trace-output");
const status = required<HTMLElement>("#trace-status");
const runButton = required<HTMLButtonElement>("#run-check");

fixtureInput.value = JSON.stringify(fixture, null, 2);
eventsInput.value = JSON.stringify(traces.missing, null, 2);

function escapeText(value: string): string {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function run(): void {
  try {
    const result = checkTrajectory(JSON.parse(fixtureInput.value), JSON.parse(eventsInput.value));
    status.textContent = result.pass ? "PASS" : "FAIL";
    status.className = `status ${result.pass ? "pass" : "fail"}`;
    const eventRows = result.events.map((event) => `
      <div class="trace-row ${event.status}">
        <span class="trace-marker" aria-hidden="true">${event.status === "matched" ? "●" : event.status === "ignored" ? "·" : "×"}</span>
        <span class="trace-seq">${String(event.index + 1).padStart(2, "0")}</span>
        <strong>${escapeText(event.tool)}</strong>
        <span>${event.phase}${event.attempt ? ` · attempt ${event.attempt}` : ""}</span>
        <span>${event.matchedId ? `→ ${escapeText(event.matchedId)}` : event.status}</span>
      </div>`).join("");
    const empty = result.events.length === 0 ? '<div class="trace-empty"><strong>No events observed.</strong><span>Add a scrubbed event or load an example to test this fixture.</span></div>' : "";
    const failures = result.failures.map((failure) => `<li><span aria-hidden="true">!</span>${escapeText(failure.message)}</li>`).join("");
    output.innerHTML = `${eventRows}${empty}${failures ? `<ul class="failure-list" aria-label="Failures">${failures}</ul>` : '<p class="pass-note"><span aria-hidden="true">✓</span> All declared path invariants matched.</p>'}`;
  } catch (error) {
    status.textContent = "INPUT ERROR";
    status.className = "status fail";
    const message = error instanceof Error ? error.message : String(error);
    output.innerHTML = `<div class="trace-error" role="alert"><strong>Could not run this fixture.</strong><span>${escapeText(message)}</span><span>Fix the JSON or load a known example.</span></div>`;
  }
}

runButton.addEventListener("click", run);
document.querySelectorAll<HTMLButtonElement>("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const example = button.dataset.example ?? "missing";
    eventsInput.value = JSON.stringify(traces[example], null, 2);
    document.querySelectorAll<HTMLButtonElement>("[data-example]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    run();
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-copy], [data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = button.dataset.copyTarget ? document.querySelector(`#${button.dataset.copyTarget}`)?.textContent ?? "" : button.dataset.copy ?? "";
    try {
      await navigator.clipboard.writeText(target);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      button.textContent = "Copy failed";
    }
  });
});

const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
themeToggle?.setAttribute("aria-label", `Switch to ${document.documentElement.dataset.theme === "dark" ? "light" : "dark"} theme`);
themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("ttc-theme", next);
  themeToggle.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} theme`);
});

function updateOnlineState(): void {
  const offline = document.querySelector<HTMLElement>("#offline");
  if (offline) offline.hidden = navigator.onLine;
}
window.addEventListener("online", updateOnlineState);
window.addEventListener("offline", updateOnlineState);
updateOnlineState();
run();

if ("serviceWorker" in navigator && import.meta.env.PROD) void navigator.serviceWorker.register("/sw.js");
