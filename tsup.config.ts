import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    sourcemap: true,
    target: "node20",
    outDir: "dist",
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["cjs"],
    clean: false,
    sourcemap: true,
    target: "node20",
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
  },
]);
