import type { CSSProperties, ReactNode } from "react";

import {
  appPath,
  getAppById,
  GITHUB_URL,
  ROOT_APP,
  SITE_APPS,
  SITE_NAME,
  SITE_STYLES,
} from "@repo/site-config";

import { NavHydrator } from "./nav-hydrator";

const app = getAppById("next")!;

export const metadata = {
  title: `${app.name} · ${SITE_NAME}`,
  description: app.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: SITE_STYLES }} />
      </head>
      <body style={{ "--accent": app.accent } as CSSProperties}>
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
        <NavHydrator />
      </body>
    </html>
  );
}
