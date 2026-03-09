# Cloudflare OpenNext Deployment

Use this project with OpenNext on Cloudflare Workers.

## Why Previous Builds Failed

- `@opennextjs/cloudflare build` internally runs `build` (`bun run build` in Cloudflare).
- If `build` points to `build:cf`, it recursively calls OpenNext build again and fails.
- The correct split is:
	- `build`: `next build`
	- `build:cf`: `@opennextjs/cloudflare build`

## Required Scripts

- `build`: `next build`
- `build:cf`: `cross-env NEXT_VERSION=15.0.0 npx @opennextjs/cloudflare build`
- `deploy:cf`: `npm run build:cf && npx wrangler deploy`

## Required Cloudflare Build Settings

- Build command: `npm run build:cf`
- Do not set a static output directory for Workers deployment.

## Required Environment Variables

- `NODE_VERSION=20`
- `NEXT_VERSION=15.0.0`

## Notes

- `open-next.config.ts` and `wrangler.jsonc` must exist in repo root to avoid interactive prompts in CI.
- `wrangler.jsonc` should keep:
	- `main`: `.open-next/worker.js`
	- `assets.directory`: `.open-next/assets`
	- `compatibility_flags`: include `nodejs_compat`
- Commit a lock file (`package-lock.json`) to improve reproducibility and caching.
