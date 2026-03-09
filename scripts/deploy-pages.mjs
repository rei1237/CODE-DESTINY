import { spawnSync } from "node:child_process";

// In Cloudflare Pages CI, deployment/upload is handled by the platform.
// Running wrangler pages deploy again can fail due to token scope differences.
if (
  process.env.CF_PAGES === "1" ||
  process.env.CF_PAGES === "true" ||
  process.env.CLOUDFLARE_PAGES === "1"
) {
  console.log("[deploy-pages] Cloudflare Pages CI detected. Skipping wrangler pages deploy.");
  process.exit(0);
}

const projectName =
  process.env.CF_PAGES_PROJECT_NAME ||
  process.env.CLOUDFLARE_PAGES_PROJECT_NAME ||
  process.env.CLOUDFLARE_PROJECT_NAME ||
  "code-destiny-web";

const branchArgIndex = process.argv.findIndex((arg) => arg === "--branch");
const branch =
  (branchArgIndex >= 0 && process.argv[branchArgIndex + 1]) ||
  process.env.CF_PAGES_BRANCH ||
  "main";

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const args = [
  "wrangler",
  "pages",
  "deploy",
  ".open-next/assets",
  "--project-name",
  projectName,
  "--branch",
  branch,
  "--config",
  "wrangler.pages.jsonc",
];

console.log(`[deploy-pages] project=${projectName} branch=${branch}`);

const result = spawnSync(npxCmd, args, {
  stdio: "inherit",
  shell: false,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
