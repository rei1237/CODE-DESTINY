import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function mustExist(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relPath}`);
  }
}

function readJson(relPath) {
  const fullPath = path.join(root, relPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

try {
  mustExist("open-next.config.ts");
  mustExist("wrangler.jsonc");

  const pkg = readJson("package.json");
  const scripts = pkg.scripts || {};

  if (scripts.build !== "next build") {
    throw new Error(
      'Invalid scripts.build. It must be exactly "next build" to avoid recursive OpenNext builds.'
    );
  }

  if (!String(scripts["build:cf"] || "").includes("@opennextjs/cloudflare build")) {
    throw new Error("Invalid scripts.build:cf. It must invoke @opennextjs/cloudflare build.");
  }

  console.log("[verify-cloudflare-setup] OK");
} catch (err) {
  console.error("[verify-cloudflare-setup] FAILED");
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
