import { getAppBySubdomain, ROOT_APP, type SiteApp } from "./apps.js";

export function splitHost(host: string): { hostname: string; port: string } {
  const [hostname = "", port = ""] = host.split(":");
  return { hostname: hostname.toLowerCase(), port };
}

/**
 * Resolve which app a request host belongs to.
 *
 * The first label of the hostname is matched against the known app
 * subdomains; anything else (bare domain, www, unknown labels) falls back to
 * the root app. This works for any base domain depth, e.g. both
 * `next.example.com` and `next.localhost`.
 */
export function resolveAppByHost(host: string): SiteApp {
  const { hostname } = splitHost(host);
  const firstLabel = hostname.split(".")[0] ?? "";
  return getAppBySubdomain(firstLabel) ?? ROOT_APP;
}

/**
 * Resolve which app a canonical path belongs to: the first path segment is
 * matched against the known app subdomains (`/next/*` → next), everything
 * else falls back to the root app.
 */
export function resolveAppByPath(pathname: string): SiteApp {
  const firstSegment = pathname.split("/")[1] ?? "";
  return getAppBySubdomain(firstSegment) ?? ROOT_APP;
}

/**
 * Strip a known app subdomain (or `www`) from a host, keeping the port. The
 * result is the canonical host every page is served from.
 */
export function getBaseHost(host: string): string {
  const { hostname, port } = splitHost(host);
  const labels = hostname.split(".");
  const firstLabel = labels[0] ?? "";
  const isAppLabel =
    getAppBySubdomain(firstLabel) !== undefined || firstLabel === "www";
  const base =
    isAppLabel && labels.length > 1 ? labels.slice(1).join(".") : hostname;
  return port ? `${base}:${port}` : base;
}

/**
 * Canonical path for a request that arrived on an app subdomain, or `null`
 * when the host is already canonical (bare domain / unknown label).
 *
 * `start.example.com/` → `/start`, `start.example.com/foo` → `/start/foo`,
 * and paths that already carry the prefix are kept as-is.
 */
export function getCanonicalPath(host: string, pathname: string): string | null {
  const app = resolveAppByHost(host);

  if (app.subdomain === null) {
    return null;
  }

  const prefix = `/${app.subdomain}`;

  if (pathname === "/" || pathname === prefix) {
    return prefix;
  }

  if (pathname.startsWith(`${prefix}/`)) {
    return pathname;
  }

  return `${prefix}${pathname}`;
}
