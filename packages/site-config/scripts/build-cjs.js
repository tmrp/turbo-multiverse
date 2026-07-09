#!/usr/bin/env node
/**
 * Builds the CommonJS variant of the package into `dist/cjs`, served to
 * consumers through the "require" condition in the package `exports` map.
 *
 * The only such consumer is the NestJS api app: Nest compiles to CommonJS,
 * so its `require("@repo/site-config")` cannot load the ESM build on
 * runtimes without `require(esm)` support (e.g. Vercel's Node lambdas).
 *
 * Steps:
 * 1. `tsc -p tsconfig.cjs.json` — same sources, `module: CommonJS`.
 * 2. Write `dist/cjs/package.json` with `{"type":"commonjs"}` so Node treats
 *    the output as CJS despite the package root's `"type": "module"`.
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(packageRoot, "dist", "cjs");

execSync("tsc -p tsconfig.cjs.json", { cwd: packageRoot, stdio: "inherit" });

mkdirSync(outDir, { recursive: true });

writeFileSync(
  join(outDir, "package.json"),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);
