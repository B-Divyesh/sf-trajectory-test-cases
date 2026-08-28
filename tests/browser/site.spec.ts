import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage is accessible and interactive", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("link", { name: "Skip to main content" }).focus();
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await expect(page).toHaveTitle(/Trajectory Test Cases/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Check agent tool paths in CI.");
  await expect(page.locator("#playground-title")).toHaveText("Test a fixture with sample events");
  await expect(page.locator("#playground .eyebrow")).toContainText("Fixture checker");
  await expect(page.locator("#method-title")).toHaveText("Check agent calls in three steps");
  await expect(page.locator("#api-title")).toHaveText("Four library tools");
  await expect(page.locator("#boundary-title")).toHaveText("A passing fixture does not prove safety.");
  await expect(page.getByText("Missing save", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Load passing trace" }).click();
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  await page.getByRole("button", { name: "Load empty trace" }).click();
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
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeVisible();
  const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primaryNav.getByRole("link", { name: "Demo", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Privacy", exact: true })).toBeVisible();
  await page.locator("#playground").scrollIntoViewIfNeeded();
  await expect(page.locator("#fixture-input")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("demo is accessible, keyboard operable, and usable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/?demo=1");
  await expect(page.locator("h1")).toHaveText("Test a sample agent tool path.");
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  const sample = page.locator("#mobile-sample");
  await expect(sample).toContainText("docs.search");
  await expect(sample.getByText("PASS", { exact: true })).toBeVisible();
  const sampleBox = await sample.boundingBox();
  expect(sampleBox).not.toBeNull();
  expect((sampleBox?.y ?? Infinity) + (sampleBox?.height ?? Infinity)).toBeLessThanOrEqual(844);
  await page.getByRole("button", { name: "Load missing-call example" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#trace-status")).toHaveText("FAIL");
  await page.getByRole("button", { name: "Reset demo" }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#trace-status")).toHaveText("PASS");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

for (const path of ["/privacy/", "/terms/"]) {
  test(`${path} has baseline semantics`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toBeFocused();
  });
}

for (const route of ["/", "/demo/?demo=1", "/privacy/", "/terms/", "/404.html"]) {
  test(`${route} has complete route metadata and the shared site skeleton`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/trajectory-test-cases\.sociobot\.in\//);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Trajectory Test Cases/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /evidence-bench-social\.webp$/);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /Trajectory Test Cases/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /evidence-bench-social\.webp$/);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("sizes", "180x180");
    await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Demo", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Privacy", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Footer navigation" }).getByRole("link", { name: "Terms", exact: true })).toBeVisible();
    await expect(page.locator("footer")).toContainText("Param Factory");
    await expect(page.locator("footer")).toContainText("v0.1.0");
    await expect(page.locator("h1")).toBeFocused();
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });
}

test("social and touch artwork has the declared dimensions", async ({ page }) => {
  await page.goto("/");
  const dimensions = await page.evaluate(async () => {
    const load = (src: string) => new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = reject;
      image.src = src;
    });
    return {
      social: await load(new URL(document.querySelector<HTMLMetaElement>('meta[property="og:image"]')!.content).pathname),
      touch: await load(document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')!.href),
    };
  });
  expect(dimensions).toEqual({ social: { width: 1200, height: 630 }, touch: { width: 180, height: 180 } });
});

test("route navigation and browser back restore heading focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Privacy", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator("#route-announcer")).toContainText("Demo page loaded");
});

test("404 names the missing page in plain words", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator("h1")).toHaveText("This page was not found.");
  await expect(page.locator(".not-found-main .eyebrow")).toContainText("Page not found");
});
