import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const forcePages = args.includes("--pages");
const forceWorker = args.includes("--worker");

if (forcePages && forceWorker) {
  console.error("[deploy-cloudflare] Use only one of --pages or --worker.");
  process.exit(1);
}

const isPagesCi =
  process.env.CF_PAGES === "1" ||
  process.env.CF_PAGES === "true" ||
  process.env.CLOUDFLARE_PAGES === "1" ||
  process.env.CLOUDFLARE_PAGES === "true" ||
  !!process.env.CF_PAGES_PROJECT_NAME ||
  !!process.env.CLOUDFLARE_PAGES_PROJECT_NAME;

const deployTarget = forceWorker ? "worker" : "pages";
const forcePagesWranglerDeploy =
  process.env.CF_PAGES_FORCE_WRANGLER_DEPLOY === "1" ||
  process.env.CF_PAGES_FORCE_WRANGLER_DEPLOY === "true";
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (typeof result.status === "number") {
    process.exit(result.status);
  }

  process.exit(1);
}

function runBuildIfMissingOutput(outputDir) {
  if (existsSync(outputDir)) {
    return true;
  }

  console.log("[deploy-cloudflare] dist not found. Running `npm run build:cf`...");
  const buildResult = spawnSync(npmCmd, ["run", "build:cf"], {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (buildResult.status !== 0) {
    return false;
  }

  return existsSync(outputDir);
}

if (deployTarget === "pages") {
  console.log("[deploy-cloudflare] Target: pages");

  if (isPagesCi && !forcePagesWranglerDeploy) {
    const outputDir = resolve(process.cwd(), "dist");

    if (!runBuildIfMissingOutput(outputDir)) {
      console.error(
        "[deploy-cloudflare] Missing dist output. Ensure build command runs `npm run build:cf` before deploy command."
      );
      process.exit(1);
    }

    console.log(
      "[deploy-cloudflare] CF Pages CI detected. Skipping `wrangler pages deploy` and relying on pages_build_output_dir auto-publish."
    );
    process.exit(0);
  }

  run("node", [resolve(process.cwd(), "scripts/deploy-pages.mjs")]);
} else {
  console.log("[deploy-cloudflare] Target: worker");
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  run(npxCmd, ["wrangler", "deploy", "--config", "wrangler.worker.jsonc"]);
}
