import { spawnSync } from "node:child_process";
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

const deployTarget = forcePages ? "pages" : forceWorker ? "worker" : isPagesCi ? "pages" : "worker";

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

if (deployTarget === "pages") {
  console.log("[deploy-cloudflare] Target: pages");
  run("node", [resolve(process.cwd(), "scripts/deploy-pages.mjs")]);
} else {
  console.log("[deploy-cloudflare] Target: worker");
  const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  run(npxCmd, ["wrangler", "deploy", "--config", "wrangler.worker.jsonc"]);
}
