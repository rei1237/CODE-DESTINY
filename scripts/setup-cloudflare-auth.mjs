import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const examplePath = resolve(rootDir, ".env.cloudflare.example");
const envPath = resolve(rootDir, ".env.cloudflare");

if (!existsSync(examplePath)) {
  console.error("[setup-cloudflare-auth] Missing .env.cloudflare.example");
  process.exit(1);
}

if (existsSync(envPath)) {
  console.log("[setup-cloudflare-auth] .env.cloudflare already exists.");
  console.log("[setup-cloudflare-auth] Update CLOUDFLARE_API_TOKEN in that file.");
  process.exit(0);
}

copyFileSync(examplePath, envPath);

console.log("[setup-cloudflare-auth] Created .env.cloudflare from template.");
console.log("[setup-cloudflare-auth] Next step: set CLOUDFLARE_API_TOKEN in .env.cloudflare");
console.log("[setup-cloudflare-auth] Token page: https://dash.cloudflare.com/profile/api-tokens");
