# proxy

Hono reverse proxy — the single public entry point for the whole site.

Canonical URLs are **path-based**; every request is routed by its first path
segment. Requests arriving on an app **subdomain** are 307-redirected to the
matching canonical path first:

| Request                      | Result                              |
| ---------------------------- | ----------------------------------- |
| `example.com/`               | proxied → `apps/web` (Astro)        |
| `example.com/next/*`         | proxied → `apps/next`               |
| `example.com/vite/*`         | proxied → `apps/vite`               |
| `example.com/start/*`        | proxied → `apps/start`              |
| `example.com/vue/*`          | proxied → `apps/vue`                |
| `example.com/api/*`          | proxied → `apps/api` (NestJS)       |
| `start.example.com/foo`      | 307 → `example.com/start/foo`       |
| `next.example.com/`          | 307 → `example.com/next`            |

Each app is built/configured to serve under its prefix (Next `basePath`, Vite
`base`, TanStack Router `basepath`, Nest global prefix), so the proxy forwards
paths unchanged. Upstream origins are resolved by `@repo/vercel`: localhost
ports in dev, per-branch preview deployments on Vercel previews, and the apps'
production Vercel projects in production. Redirect `Location` headers that
point at upstream origins are rewritten back to the canonical origin.

## Local development

`pnpm dev` from the repo root starts the proxy on `http://localhost:3000`
alongside every app:

- <http://localhost:3000> → Astro
- <http://localhost:3000/next> → Next.js
- <http://localhost:3000/vite> → Vite (React)
- <http://localhost:3000/start> → TanStack Start
- <http://localhost:3000/vue> → Vue
- <http://localhost:3000/api> → NestJS (JSON at `/api/hello`)

Subdomain aliases redirect: <http://start.localhost:3000> →
`http://localhost:3000/start` (browsers resolve `*.localhost` to `127.0.0.1`).

## Vercel

Deploy `apps/proxy` as its own Vercel project (Hono framework preset picks up
`src/index.ts`). Point the apex domain **and** the `*` wildcard subdomain at
this project; each framework app is deployed as its own Vercel project that
only the proxy talks to.
