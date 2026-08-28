import { defineConfig } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  use: { baseURL: externalBaseUrl ?? "http://127.0.0.1:4173", browserName: "chromium", trace: "retain-on-failure" },
  ...(externalBaseUrl ? {} : { webServer: {
    command: "npx vite preview --config vite.config.ts --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  } }),
});
