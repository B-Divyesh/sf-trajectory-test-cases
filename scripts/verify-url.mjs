import { chromium } from "@playwright/test";

const input = new URL(process.argv[2] ?? "http://127.0.0.1:4173/");
const origin = input.origin;
const local = ["127.0.0.1", "localhost"].includes(input.hostname);
const routes = ["/", "/demo/?demo=1", "/privacy/", "/terms/", local ? "/404.html" : "/verify-not-a-real-route"];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const route of routes) {
  const errors = [];
  const onConsole = (message) => { if (message.type() === "error") errors.push(message.text()); };
  const onPageError = (error) => errors.push(error.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  const response = await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
  const expectedStatus = !local && route === "/verify-not-a-real-route" ? 404 : 200;
  if (response?.status() !== expectedStatus) throw new Error(`${route}: expected HTTP ${expectedStatus}, received ${response?.status() ?? "no response"}`);
  const result = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    mains: document.querySelectorAll("main").length,
    headings: document.querySelectorAll("h1").length,
    headingFocused: document.activeElement === document.querySelector("h1"),
    missingAlt: [...document.querySelectorAll("img")].filter((image) => !image.hasAttribute("alt")).length,
    unnamedButtons: [...document.querySelectorAll("button")].filter((button) => !(button.getAttribute("aria-label") || button.textContent?.trim())).length,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") ?? "",
    appleTouch: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("sizes") ?? "",
    footerLegal: Boolean(document.querySelector('footer a[href="/privacy/"]') && document.querySelector('footer a[href="/terms/"]')),
  }));
  const actionableErrors = expectedStatus === 404 ? errors.filter((error) => !/Failed to load resource.*404/i.test(error)) : errors;
  if (!result.title || !result.lang || result.mains !== 1 || result.headings !== 1 || !result.headingFocused || result.missingAlt || result.unnamedButtons || !result.canonical || !result.ogTitle || !result.twitterTitle || result.appleTouch !== "180x180" || !result.footerLegal || actionableErrors.length) {
    throw new Error(`${route}: ${JSON.stringify({ ...result, consoleErrors: actionableErrors })}`);
  }
  console.log(JSON.stringify({ url: page.url(), http: response.status(), ...result, consoleErrors: actionableErrors.length }));
  page.off("console", onConsole);
  page.off("pageerror", onPageError);
}

await browser.close();
