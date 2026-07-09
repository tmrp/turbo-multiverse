import { useEffect } from "react";

import {
  appPath,
  getAppById,
  GITHUB_URL,
  hydrateApiDemo,
  ROOT_APP,
  SITE_APPS,
  SITE_NAME,
} from "@repo/site-config";

const app = getAppById("vite")!;

export function App() {
  useEffect(() => {
    hydrateApiDemo();
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href={appPath(ROOT_APP)}>
          <span className="site-brand-dot" />
          {SITE_NAME}
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <nav className="site-nav">
          {SITE_APPS.map((navApp) => (
            <a
              key={navApp.id}
              href={appPath(navApp)}
              aria-current={navApp.id === app.id ? "page" : undefined}
            >
              {navApp.name}
            </a>
          ))}
        </nav>
      </header>
      <main className="site-main">
        <span className="hero-badge">{app.framework}</span>
        <h1 className="hero-title">This page is Vite + React</h1>
        <p className="hero-subtitle">
          A fully client-rendered single-page app. The Hono proxy forwards every
          request under <code>/vite</code> here — the shared navigation makes
          hopping to the server-rendered apps feel seamless.
        </p>

        <ul className="fact-list">
          <li>
            <span className="fact-label">Framework</span>
            <code>{app.framework}</code>
          </li>
          <li>
            <span className="fact-label">Canonical path</span>
            <code>/{app.subdomain}</code>
          </li>
          <li>
            <span className="fact-label">Subdomain alias</span>
            <code>
              {app.subdomain}.* → /{app.subdomain}
            </code>
          </li>
          <li>
            <span className="fact-label">Dev port</span>
            <code>{app.devPort}</code>
          </li>
        </ul>

        <section className="api-demo">
          <h2>Live data from the NestJS app</h2>
          <p>
            Fetched in the browser from the <code>api</code> subdomain — a
            different framework, a different deployment, one site.
          </p>
          <pre data-api-demo>Loading…</pre>
        </section>
      </main>
      <footer className="site-footer">
        {SITE_NAME} — one site, many frameworks. This page is served by{" "}
        {app.framework}.{" "}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </>
  );
}
