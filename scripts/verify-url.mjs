import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));
const response = await page.goto(url, { waitUntil: "networkidle" });
if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
const result = await page.evaluate(() => ({
  title: document.title,
  lang: document.documentElement.lang,
  mains: document.querySelectorAll("main").length,
  headings: document.querySelectorAll("h1").length,
  missingAlt: [...document.querySelectorAll("img")].filter((image) => !image.hasAttribute("alt")).length,
  unnamedButtons: [...document.querySelectorAll("button")].filter((button) => !(button.getAttribute("aria-label") || button.textContent?.trim())).length,
}));
if (!result.title || !result.lang || result.mains !== 1 || result.headings !== 1 || result.missingAlt || result.unnamedButtons || errors.length) throw new Error(JSON.stringify({ ...result, consoleErrors: errors }));
console.log(JSON.stringify({ url, http: response.status(), ...result, consoleErrors: errors.length }));
await browser.close();
