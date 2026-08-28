import { accessSync, constants, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("release QA contracts", () => {
  it("ships deployment-native security and immutable asset headers", () => {
    const config = JSON.parse(readFileSync("site/public/staticwebapp.config.json", "utf8")) as {
      routes: Array<{ route: string; headers?: Record<string, string> }>;
      globalHeaders: Record<string, string>;
    };
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.globalHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(config.routes.find((route) => route.route === "/assets/*")?.headers?.["Cache-Control"]).toContain("immutable");
  });

  it("includes the verifier, demo guide, copy audit, and claims manifest", () => {
    for (const path of ["verify-url.sh", ".factory/demo.md", ".factory/copy-audit.md", ".factory/claims.json"]) accessSync(path, constants.R_OK);
  });
});
