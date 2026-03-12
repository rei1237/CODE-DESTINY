# Cloudflare OpenNext Deployment

Use this project with OpenNext on Cloudflare Workers.

## Why Previous Builds Failed

- `@opennextjs/cloudflare build` internally runs `build` (`bun run build` in Cloudflare).
- If `build` points to `build:cf`, it recursively calls OpenNext build again and fails.
- The correct split is:
	- `build`: `next build`
	- `build:cf`: `@opennextjs/cloudflare build`

## Why "ASSETS is reserved" Happens

- Cloudflare Pages treats `ASSETS` as a reserved binding name.
- If `wrangler.jsonc` contains a Worker-style `assets.binding: "ASSETS"`, Pages deploy can fail with:
	- `The name 'ASSETS' is reserved in Pages projects.`

## Final File Layout

- `wrangler.jsonc`: Pages-safe config (no `main`, no explicit `assets.binding`)
- `wrangler.worker.jsonc`: Worker deploy config (used only for `wrangler deploy`)
- `next.config.mjs`: normal Next.js config (no special ASSETS binding)

## Required Scripts

- `build`: `next build`
- `build:cf`: `cross-env NEXT_VERSION=15.0.0 npx @opennextjs/cloudflare build`
- `build:cf:static`: compatibility command for Cloudflare Pages Deploy command (`npm run build:cf:static`)
- `deploy:cf:static`: `node scripts/deploy-pages.mjs` (non-shell fallback handling)
- `deploy:cf`: `npm run build:cf && npx wrangler deploy --config wrangler.worker.jsonc`

## Required Cloudflare Build Settings

- Build command: `npm run build:cf`
- `wrangler.jsonc` provides `pages_build_output_dir: .open-next/assets`, so Pages can publish automatically after a successful build.

If your project is still configured with a Pages Deploy command, this also works:

- Build command: `npm run build`
- Deploy command: `npm run build:cf:static`

And these files should exist:

- `wrangler.pages.jsonc` with `pages_build_output_dir`
- `scripts/deploy-pages.mjs` for deterministic `project-name` and `branch` resolution

## Authentication Error (code 10000)

If logs show `Authentication error [code: 10000]` during deploy command:

- Cause: `wrangler pages deploy` is trying to call Cloudflare API from CI with a token that lacks required Pages permissions.
- Fix in this repo: `scripts/deploy-pages.mjs` auto-detects Cloudflare Pages CI and retries deploy without `CLOUDFLARE_API_TOKEN` first.
- Recommendation: remove unnecessary custom API tokens from Pages build environment unless explicitly required.

## Required Environment Variables

- `NODE_VERSION=20`
- `NEXT_VERSION=15.0.0`

## Notes

- `open-next.config.ts` and `wrangler.jsonc` must exist in repo root to avoid interactive prompts in CI.
- `wrangler.jsonc` (Pages) must not define `assets.binding: "ASSETS"`.
- Use `wrangler.worker.jsonc` for Worker deploy path only.
- Commit a lock file (`package-lock.json`) to improve reproducibility and caching.

## Deployment Checklist

- Reserved names:
	- Do not use `ASSETS` binding in Pages config.
- Compatibility flags:
	- Keep `nodejs_compat` enabled.
	- Keep `compatibility_date` pinned (example: `2025-01-01` or newer tested date).
- Commands:
	- Build: `npm run build:cf`
	- If Deploy command is mandatory: `npm run build:cf:static`
- Auth:
	- If using `wrangler pages deploy`, ensure token has Pages write scope.
	- Prefer removing unnecessary custom `CLOUDFLARE_API_TOKEN` in Pages CI.
