/**
 * Shared stylesheet injected by every app so the site looks and feels like a
 * single product regardless of which framework rendered the page.
 */
export const SITE_STYLES = /* css */ `
:root {
  --bg: #fafafa;
  --surface: #ffffff;
  --text: #18181b;
  --muted: #6b7280;
  --border: #e4e4e7;
  --accent: #6366f1;
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0c0c0e;
    --surface: #17171a;
    --text: #f4f4f5;
    --muted: #9ca3af;
    --border: #27272a;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
}

/* SPA mount points (Vite React, Vue) should not affect the body layout. */
#root,
#app {
  display: contents;
}

a {
  color: var(--accent);
  text-decoration: none;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.site-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}

.site-brand-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: var(--accent);
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-left: auto;
}

.site-nav a {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.9rem;
}

.site-nav a:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--text) 7%, transparent);
}

.site-nav a[aria-current="page"] {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  font-weight: 600;
}

.site-main {
  flex: 1;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.hero-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-title {
  margin: 1rem 0 0.5rem;
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.hero-subtitle {
  margin: 0 0 2rem;
  max-width: 42rem;
  color: var(--muted);
  font-size: 1.1rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.app-card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--surface);
  color: var(--text);
  transition: border-color 120ms ease, transform 120ms ease;
}

.app-card:hover {
  border-color: var(--card-accent, var(--accent));
  transform: translateY(-2px);
}

.app-card h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: var(--card-accent, var(--accent));
}

.app-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.fact-list {
  margin: 2rem 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.fact-list li {
  display: flex;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  font-size: 0.95rem;
}

.fact-list .fact-label {
  min-width: 8rem;
  color: var(--muted);
}

.fact-list code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
}

.api-demo {
  margin-top: 2.5rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--surface);
}

.api-demo h2 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.api-demo p {
  margin: 0 0 0.75rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.api-demo pre {
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--text) 6%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  white-space: pre-wrap;
}

.site-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
}
`;
