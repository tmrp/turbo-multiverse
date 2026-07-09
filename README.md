# Turbo Multiverse

One website, seven web frameworks. A pnpm + Turborepo monorepo where a **Hono
reverse proxy** stitches independent apps: Astro, Next.js, Vite (React),
TanStack Start, Vue, Svelte, and NestJS: into a single site. Canonical URLs are
**path-based** (`/next`, `/start`, …); **subdomain aliases redirect** to them
(`start.example.com` → `example.com/start`). Each app deploys as its own
Vercel project, and navigating between them feels like one website.

```
  example.com/       ─┐                        ┌─► apps/web    Astro           :3001
  example.com/next   ─┤                        ├─► apps/next   Next.js         :3002
  example.com/vite   ─┤   apps/proxy           ├─► apps/vite   Vite + React    :3003
  example.com/start  ─┼─► Hono reverse proxy ──┼─► apps/start  TanStack Start  :3004
  example.com/vue    ─┤   :3000                ├─► apps/vue    Vue 3           :3005
  example.com/svelte ─┤                        ├─► apps/svelte Svelte 5        :3007
  example.com/api    ─┘                        └─► apps/api    NestJS          :3006

  start.example.com/foo ──► 307 ──► example.com/start/foo   (subdomain aliases)
```

## Quick start

```bash
pnpm install
pnpm dev        # builds shared packages, then starts the proxy + all seven apps
```

Then browse through the proxy:

| URL                               | App             |
| --------------------------------- | --------------- |
| <http://localhost:3000>           | Astro (home)    |
| <http://localhost:3000/next>      | Next.js         |
| <http://localhost:3000/vite>      | Vite + React    |
| <http://localhost:3000/start>     | TanStack Start  |
| <http://localhost:3000/vue>       | Vue 3           |
| <http://localhost:3000/svelte>    | Svelte 5        |
| <http://localhost:3000/api>       | NestJS          |
| <http://localhost:3000/api/hello> | NestJS JSON API |

Subdomain aliases work too: browsers resolve `*.localhost` to `127.0.0.1`,
so <http://start.localhost:3000> redirects to `http://localhost:3000/start`.

Other useful commands:

```bash
pnpm build                    # turbo build for every workspace
pnpm check-types              # typecheck everything
pnpm --filter @apps/next dev  # run a single app
```

### Troubleshooting

- **`Cannot find module '@repo/site-config'`**: the shared packages build to
  `dist/`, which apps resolve at runtime. `pnpm install` builds them (root
  `prepare` script) and `pnpm dev` / `pnpm build` keep them fresh, but if the
  dist folders were deleted manually, run `pnpm build --filter=./packages/*`.
- **Next.js dev errors after config changes** (e.g. "not in the React Client
  Manifest"): stale Turbopack cache; delete `apps/next/.next` and restart.

## How it works

### Routing (`apps/proxy`)

The Hono proxy is the only public entry point. For every request it:

1. **Canonicalizes subdomains**: if the host's first label matches an app
   subdomain (`start.`, `next.`, …), it 307-redirects to the matching path on
   the base host, preserving deep paths and query strings
   (`start.example.com/foo?q=1` → `example.com/start/foo?q=1`).
2. **Routes by path prefix**: the first path segment picks the app
   (`/next/*` → Next.js); everything else falls through to the Astro app.
3. **Proxies the request** with `x-forwarded-host` / `x-forwarded-proto` /
   `x-forwarded-prefix` set, hop-by-hop headers stripped, and redirect
   `Location` headers rewritten back to the canonical origin so upstream
   deployment URLs never leak.

Each app serves itself under its prefix natively: Next.js `basePath: "/next"`,
Vite/Vue/Svelte `base: "/vite/" | "/vue/" | "/svelte/"`, TanStack Router `basepath: "/start"`, and
NestJS `setGlobalPrefix("api")`: so the proxy forwards paths unchanged and
apps also work when accessed directly on their own ports.

### One site, many frameworks (`packages/site-config`)

`@repo/site-config` is the single source of truth all eight workspaces share:

- **App registry**: id, name, subdomain, canonical path, dev port, accent
  color per app. The proxy routes with it; every app renders its navigation
  from it.
- **Shared stylesheet**: every app injects the same CSS, so pages look
  identical regardless of the framework that rendered them.
- **Navigation**: since everything lives under one canonical origin, nav
  links are plain root-relative paths (`/`, `/next`, `/vue`, …) that work
  identically in every framework, on localhost and in production.
- **API demo widget**: every page fetches `/api/hello` (same origin, no
  CORS needed) from the NestJS app after load/hydration.

### Workspaces

| Workspace              | What it is                                                     |
| ---------------------- | -------------------------------------------------------------- |
| `apps/proxy`           | Hono reverse proxy: canonical router + subdomain redirects     |
| `apps/web`             | Astro site served at the root path                             |
| `apps/next`            | Next.js (App Router) under `/next`                             |
| `apps/vite`            | Vite + React SPA under `/vite`                                 |
| `apps/start`           | TanStack Start (SSR via Nitro) under `/start`                  |
| `apps/vue`             | Vue 3 SPA (Vite) under `/vue`                                  |
| `apps/svelte`          | Svelte 5 SPA (Vite) under `/svelte`                            |
| `apps/api`             | NestJS under `/api`; serves an HTML page plus `GET /api/hello` |
| `packages/site-config` | Shared app registry, routing helpers, styles, API demo script  |
| `packages/vercel`      | Upstream origin resolution per environment                     |
| `packages/*-config`    | Shared TypeScript / ESLint presets                             |

## Deploying to Vercel

Create **eight Vercel projects**, one per `apps/*` directory (set each
project's Root Directory accordingly). Then:

1. **Domains**: point the apex domain _and_ the `*` wildcard subdomain at the
   **proxy** project. The other seven projects keep their default
   `*.vercel.app` domains; only the proxy talks to them.
2. **Origins**: the proxy resolves each upstream as
   `https://<prefix>-<app>.vercel.app` with `<prefix>` from
   `VERCEL_PROJECT_PREFIX` (default `tmwf`). Name the projects to match
   (e.g. `tmwf-next`), or set explicit overrides: `WEB_ORIGIN`, `NEXT_ORIGIN`,
   `VITE_ORIGIN`, `START_ORIGIN`, `VUE_ORIGIN`, `SVELTE_ORIGIN`, `API_ORIGIN`.
3. **Preview deployments** (optional): give the proxy project `VERCEL_TOKEN`,
   `VERCEL_TEAM_ID`, and per-app `<APP>_PROJECT_ID` variables and it will
   route each preview branch to that branch's preview deployment of every app,
   falling back to production for apps the branch didn't change. If the other
   projects use deployment protection, also set
   `VERCEL_AUTOMATION_BYPASS_SECRET` ("Protection Bypass for Automation").
4. **Static SPA prefixes**: `apps/vite`, `apps/vue`, and `apps/svelte` build
   to root-level static files; their `vercel.json` rewrites map `/vite/*`,
   `/vue/*`, and `/svelte/*` back onto them. `apps/start` ships the equivalent rewrites for its assets, and
   `apps/api` rewrites everything to its serverless handler.

## Notes & trade-offs

- **HMR in dev** goes straight to each app's port (`hmr.clientPort`), bypassing
  the proxy, because the fetch-based proxy doesn't forward WebSocket upgrades.
- **Cross-app navigation is a full page load** by design: each path prefix is
  a different framework. The shared header/styles make it feel seamless.
- **Bare-prefix requests** (`/vite` without a trailing slash) are normalized by
  the proxy for the static Vite/Vue apps, which only serve their index under
  `<prefix>/`.
