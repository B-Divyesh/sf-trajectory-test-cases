import { expect, test } from "@playwright/test";

test("@claim:demo-sandbox opens sample data in one click and isolates its state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page).toHaveTitle("Demo — Trajectory Test Cases");
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  await page.locator("#events-input").fill("[]");
  await page.getByRole("button", { name: "Run fixture" }).click();
  await expect(page.locator("#trace-status")).toHaveText("FAIL");
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual(["demo:ttc-workspace"]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => Object.keys(sessionStorage).filter((key) => key.startsWith("demo:")))).toEqual([]);
});

test("@claim:local-privacy sends no trace data and loads no third-party runtime resources", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo/");
  await page.locator("#fixture-input").fill('{"version":1,"name":"private-token","expect":[]}');
  await page.locator("#events-input").fill('[{"seq":1,"tool":"private-token","phase":"call"}]');
  requests.length = 0;
  await page.getByRole("button", { name: "Run fixture" }).click();
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  expect(requests).toEqual([]);
  const resourceOrigins = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => new URL(entry.name).origin));
  expect(new Set(resourceOrigins)).toEqual(new Set([new URL(page.url()).origin]));
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.locator('script[src*="analytics"], script[src^="http"], link[href^="https://fonts."]').count()).toBe(0);
});

test("@claim:browser-runtime runs the package matcher without an account or setup", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Load wrong-order example" }).click();
  await expect(page.locator("#trace-status")).toHaveText("FAIL");
  await expect(page.locator("#trace-output")).toContainText("Out of order");
});

test("@claim:deterministic-verdict returns the same result for the same sample input", async ({ page }) => {
  await page.goto("/demo/");
  const before = await page.locator("#trace-output").innerText();
  await page.getByRole("button", { name: "Run fixture" }).click();
  const afterFirstRun = await page.locator("#trace-output").innerText();
  await page.getByRole("button", { name: "Run fixture" }).click();
  const afterSecondRun = await page.locator("#trace-output").innerText();
  expect(afterFirstRun).toBe(before);
  expect(afterSecondRun).toBe(before);
});

test("@claim:offline-reload keeps the demo usable after the first visit", async ({ page, context }) => {
  await page.goto("/demo/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("Demo — Trajectory Test Cases");
    await page.getByRole("button", { name: "Run fixture" }).click();
    await expect(page.locator("#trace-status")).toHaveText("PASS");
  } finally {
    await context.setOffline(false);
  }
  const workerState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { active: registration.active?.scriptURL.endsWith("/sw.js") ?? false, waiting: Boolean(registration.waiting) };
  });
  expect(workerState).toEqual({ active: true, waiting: false });
});
