# Cloudflare OpenNext Deployment

Use this project with OpenNext on Cloudflare Pages.

## Required Pages Settings

- Build command: `npm run build` (routes to `build:cf`)
- Build output directory: `.open-next/assets`
- Deploy command (if your platform requires one): `npm run deploy:cf:static`

## Required Environment Variables

- `NODE_VERSION=20`
- `NEXT_VERSION=15.0.0`

## Notes

- The `build:cf` script already sets `NEXT_VERSION=15.0.0` via `cross-env`.
- `package.json` enforces Node 20 (`>=20 <21`) to match Next.js 15 requirements.
- `build:cf:static` is now wired to a real Pages deploy command (no longer a no-op).
- Commit a lock file (`package-lock.json`) to enable dependency/build caching.
