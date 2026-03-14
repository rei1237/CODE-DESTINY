import { spawnSync } from "node:child_process";

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
  "wrangler.jsonc",
];

console.log(`[deploy-pages] project=${projectName} branch=${branch}`);

function runDeploy(env) {
  return spawnSync(npxCmd, args, {
    stdio: "inherit",
    shell: false,
    env,
  });
}

const isPagesCi =
  process.env.CF_PAGES === "1" ||
  process.env.CF_PAGES === "true" ||
  process.env.CLOUDFLARE_PAGES === "1";

let result;

if (isPagesCi && process.env.CLOUDFLARE_API_TOKEN) {
  // Some CI setups inject a low-scope token that breaks Pages deploy.
  // First try without overriding token to allow platform/default auth.
  const envWithoutToken = { ...process.env };
  delete envWithoutToken.CLOUDFLARE_API_TOKEN;
  console.log("[deploy-pages] CF Pages CI detected. Trying deploy without CLOUDFLARE_API_TOKEN override...");
  result = runDeploy(envWithoutToken);

  if (result.status !== 0) {
    console.log("[deploy-pages] Retry with CLOUDFLARE_API_TOKEN...");
    result = runDeploy(process.env);
  }
} else {
  result = runDeploy(process.env);
}

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
