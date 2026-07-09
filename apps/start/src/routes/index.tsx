import { createFileRoute } from "@tanstack/react-router";

import { getAppById } from "@repo/site-config";

const app = getAppById("start")!;

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <span className="hero-badge">{app.framework}</span>
      <h1 className="hero-title">This page is TanStack Start</h1>
      <p className="hero-subtitle">
        Server-rendered with TanStack Router and streamed through Nitro. The
        Hono proxy forwards every request under <code>/start</code> to this
        app&apos;s own deployment.
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
    </>
  );
}
