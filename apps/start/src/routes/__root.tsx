import { useEffect } from "react";

import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import {
  appPath,
  getAppById,
  GITHUB_URL,
  hydrateApiDemo,
  ROOT_APP,
  SITE_APPS,
  SITE_NAME,
  SITE_STYLES,
} from "@repo/site-config";

const app = getAppById("start")!;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${app.name} · ${SITE_NAME}` },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateApiDemo();
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: SITE_STYLES }} />
      </head>
      <body style={{ "--accent": app.accent } as React.CSSProperties}>
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
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          {SITE_NAME} — one site, many frameworks. This page is served by{" "}
          {app.framework}.{" "}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            Source on GitHub
          </a>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}
