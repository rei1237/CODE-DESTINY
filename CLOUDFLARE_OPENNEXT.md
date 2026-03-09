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
- `build:cf:static`: compatibility command for Cloudflare Pages Deploy command (`npm run build:cf:static`)
- `deploy:cf:static`: `node scripts/deploy-pages.mjs` (non-shell fallback handling)
- `deploy:cf`: `npm run build:cf && npx wrangler deploy`

## Required Cloudflare Build Settings

- Build command: `npm run build:cf`
- Do not set a static output directory for Workers deployment.

If your project is still configured with a Pages Deploy command, this also works:

- Build command: `npm run build`
- Deploy command: `npm run build:cf:static`

And these files should exist:

- `wrangler.pages.jsonc` with `pages_build_output_dir`
- `scripts/deploy-pages.mjs` for deterministic `project-name` and `branch` resolution

## Authentication Error (code 10000)

If logs show `Authentication error [code: 10000]` during deploy command:

- Cause: `wrangler pages deploy` is trying to call Cloudflare API from CI with a token that lacks required Pages permissions.
- Fix in this repo: `scripts/deploy-pages.mjs` auto-detects Cloudflare Pages CI and skips manual `wrangler pages deploy`.
- Recommendation: remove unnecessary custom API tokens from Pages build environment unless explicitly required.

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
