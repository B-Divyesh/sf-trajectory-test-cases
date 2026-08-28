import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage is accessible and interactive", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await expect(page).toHaveTitle(/Trajectory Test Cases/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByText("Missing save", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Passing trace" }).click();
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  await page.getByRole("button", { name: "Empty trace" }).click();
  await expect(page.getByText("No events observed.")).toBeVisible();
  await page.locator("#fixture-input").fill("{");
  await page.getByRole("button", { name: "Run fixture" }).click();
  await expect(page.getByRole("alert")).toContainText("Fix the JSON");
  expect(errors).toEqual([]);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("dark treatment has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Switch to dark theme/ }).click();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("mobile layout remains usable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#playground").scrollIntoViewIfNeeded();
  await expect(page.locator("#fixture-input")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

for (const path of ["/privacy/", "/terms/"]) {
  test(`${path} has baseline semantics`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  });
}
