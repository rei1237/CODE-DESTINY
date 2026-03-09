# Cloudflare OpenNext Deployment

Use this project with OpenNext on Cloudflare Pages.

## Required Pages Settings

- Build command: `npm run build:cf`
- Build output directory: `.open-next/assets`

## Required Environment Variables

- `NODE_VERSION=20`
- `NEXT_VERSION=15.0.0`

## Notes

- The `build:cf` script already sets `NEXT_VERSION=15.0.0` via `cross-env`.
- `package.json` enforces Node 20 (`>=20 <21`) to match Next.js 15 requirements.
- If you changed settings before, clear old build/deploy commands that used `build:cf:static`.
