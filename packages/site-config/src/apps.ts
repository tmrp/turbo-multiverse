/**
 * The single source of truth for every app that makes up the site.
 *
 * The proxy uses `subdomain` to route requests, the apps use it to build
 * cross-app navigation, and `devPort` keeps local dev ports consistent.
 */
export interface SiteApp {
  /** Workspace id — also the `apps/<id>` directory name. */
  id: string;
  /** Human-readable name shown in the navigation. */
  name: string;
  /** Framework the app is built with. */
  framework: string;
  /** One-line description shown on the app's landing page. */
  description: string;
  /** Subdomain the app is served from; `null` means the bare/base domain. */
  subdomain: string | null;
  /** Port the app's dev server listens on locally. */
  devPort: number;
  /** Accent color used by the shared stylesheet. */
  accent: string;
  /**
   * The app only serves its index under `<prefix>/` with a trailing slash
   * (Vite's static/dev servers) — the proxy normalizes bare-prefix requests.
   */
  trailingSlash?: boolean;
}

/** Port the Hono proxy listens on during local development. */
export const PROXY_DEV_PORT = 3000;

export const SITE_APPS: SiteApp[] = [
  {
    id: "web",
    name: "Home",
    framework: "Astro",
    description:
      "The landing site, served from the bare domain and built with Astro.",
    subdomain: null,
    devPort: 3001,
    accent: "#ff5d01",
  },
  {
    id: "next",
    name: "Next.js",
    framework: "Next.js",
    description: "A Next.js App Router app served from the next subdomain.",
    subdomain: "next",
    devPort: 3002,
    accent: "#0070f3",
  },
  {
    id: "vite",
    name: "Vite",
    framework: "Vite + React",
    description: "A client-rendered React SPA served from the vite subdomain.",
    subdomain: "vite",
    devPort: 3003,
    accent: "#646cff",
    trailingSlash: true,
  },
  {
    id: "start",
    name: "TanStack Start",
    framework: "TanStack Start",
    description:
      "A server-rendered TanStack Start app served from the start subdomain.",
    subdomain: "start",
    devPort: 3004,
    accent: "#eab308",
  },
  {
    id: "vue",
    name: "Vue",
    framework: "Vue 3",
    description: "A Vue 3 single-page app served from the vue subdomain.",
    subdomain: "vue",
    devPort: 3005,
    accent: "#42b883",
    trailingSlash: true,
  },
  {
    id: "svelte",
    name: "Svelte",
    framework: "Svelte 5",
    description: "A Svelte 5 single-page app served from the svelte subdomain.",
    subdomain: "svelte",
    devPort: 3007,
    accent: "#ff3e00",
    trailingSlash: true,
  },
  {
    id: "api",
    name: "API",
    framework: "NestJS",
    description:
      "A NestJS HTTP API served from the api subdomain, consumed by every other app.",
    subdomain: "api",
    devPort: 3006,
    accent: "#e0234e",
  },
];

const APPS_BY_SUBDOMAIN = new Map(
  SITE_APPS.filter((app) => app.subdomain !== null).map((app) => [
    app.subdomain as string,
    app,
  ]),
);

export const ROOT_APP = SITE_APPS.find((app) => app.subdomain === null)!;

/** Subdomain labels the proxy and nav treat as app subdomains. */
export const APP_SUBDOMAINS = [...APPS_BY_SUBDOMAIN.keys()];

export function getAppById(id: string): SiteApp | undefined {
  return SITE_APPS.find((app) => app.id === id);
}

/** Canonical path an app is served under: `/next`, `/vue`, … (`/` for the root app). */
export function appPath(app: SiteApp): string {
  return app.subdomain ? `/${app.subdomain}` : "/";
}

export function getAppBySubdomain(subdomain: string): SiteApp | undefined {
  return APPS_BY_SUBDOMAIN.get(subdomain);
}
