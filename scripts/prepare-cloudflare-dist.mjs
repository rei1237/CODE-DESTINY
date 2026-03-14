import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const candidates = [resolve(rootDir, ".open-next", "assets"), resolve(rootDir, "out")];

const sourceDir = candidates.find((dirPath) => existsSync(dirPath));

if (!sourceDir) {
  console.error("[prepare-cloudflare-dist] Missing source output (.open-next/assets or out).");
  process.exit(1);
}

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

mkdirSync(distDir, { recursive: true });
cpSync(sourceDir, distDir, { recursive: true, force: true });

if (!existsSync(resolve(distDir, "index.html"))) {
  console.error("[prepare-cloudflare-dist] dist/index.html is missing after copy.");
  process.exit(1);
}

console.log(`[prepare-cloudflare-dist] Copied ${sourceDir} -> ${distDir}`);