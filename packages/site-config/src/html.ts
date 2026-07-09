import { appPath, ROOT_APP, SITE_APPS, type SiteApp } from "./apps.js";
import { API_DEMO_SCRIPT } from "./nav-client.js";
import { SITE_STYLES } from "./styles.js";

export const SITE_NAME = "Multiverse";

/** Public repository of this monorepo, linked from every nav and footer. */
export const GITHUB_URL = "https://github.com/tmrp/turbo-multiverse";

/**
 * Shared header markup as an HTML string, for apps that render plain HTML
 * (NestJS). Component frameworks re-create the same structure natively.
 */
export function renderNavHtml(currentAppId: string): string {
  const links = SITE_APPS.map((app) => {
    const current = app.id === currentAppId ? ' aria-current="page"' : "";

    return `<a href="${appPath(app)}"${current}>${app.name}</a>`;
  }).join("");

  return `<header class="site-header">
  <a class="site-brand" href="${appPath(ROOT_APP)}">
    <span class="site-brand-dot"></span>${SITE_NAME}
  </a>
  <a href="${GITHUB_URL}" target="_blank" rel="noreferrer">GitHub</a>
  <nav class="site-nav">${links}</nav>
</header>`;
}

/** Full HTML document shell for apps without their own templating (NestJS). */
export function renderShellHtml(options: {
  app: SiteApp;
  bodyHtml: string;
}): string {
  const { app, bodyHtml } = options;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${app.name} · ${SITE_NAME}</title>
    <style>${SITE_STYLES}</style>
  </head>
  <body style="--accent: ${app.accent}">
    ${renderNavHtml(app.id)}
    <main class="site-main">${bodyHtml}</main>
    <footer class="site-footer">${SITE_NAME} — one site, many frameworks. This page is served by ${app.framework}. <a href="${GITHUB_URL}" target="_blank" rel="noreferrer">Source on GitHub</a></footer>
    <script>${API_DEMO_SCRIPT}</script>
  </body>
</html>`;
}
