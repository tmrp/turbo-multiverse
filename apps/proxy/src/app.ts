import { Hono } from "hono";

import {
  getBaseHost,
  getCanonicalPath,
  resolveAppByPath,
} from "@repo/site-config";
import { getOrigins, isDevelopment, type ResolvedOrigins } from "@repo/vercel";

import { getRequestHeaders, getResponseHeaders } from "./helpers/headers.js";
import { getHost } from "./helpers/host.js";
import { rewriteLocation } from "./helpers/rewrite-location.js";

const app = new Hono();

async function proxy(
  request: Request,
  target: URL,
  origins: ResolvedOrigins,
  canonicalOrigin: string,
  prefix: string
): Promise<Response> {
  const response = await fetch(target, {
    body: request.body,
    duplex: "half",
    headers: getRequestHeaders(request, canonicalOrigin, prefix),
    method: request.method,
    redirect: "manual",
  } as RequestInit & { duplex: "half" });

  const headers = getResponseHeaders(response);
  const location = headers.get("location");

  if (location) {
    headers.set(
      "location",
      rewriteLocation(location, origins, canonicalOrigin)
    );
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

app.get("/healthz", (c) => c.json({ ok: true }));

app.all("*", async (c) => {
  const request = c.req.raw;
  const publicHost = getHost(request);
  const protocol = isDevelopment() ? "http" : "https";
  const canonicalOrigin = `${protocol}://${getBaseHost(publicHost)}`;
  const url = new URL(request.url);

  // Requests on an app subdomain canonicalize to the matching path on the
  // base host: start.example.com/foo → example.com/start/foo.
  const canonicalPath = getCanonicalPath(publicHost, url.pathname);

  if (canonicalPath) {
    return c.redirect(`${canonicalOrigin}${canonicalPath}${url.search}`, 307);
  }

  // Path prefix → app. Everything without a known prefix is the root (web) app.
  const siteApp = resolveAppByPath(url.pathname);
  const origins = await getOrigins();
  const origin = origins.apps[siteApp.id];

  if (!origin) {
    return c.text(`No upstream origin configured for "${siteApp.id}"`, 502);
  }

  const prefix = siteApp.subdomain ? `/${siteApp.subdomain}` : "";
  const pathname =
    siteApp.trailingSlash && url.pathname === prefix
      ? `${prefix}/`
      : url.pathname;
  const target = new URL(`${pathname}${url.search}`, origin);

  return proxy(request, target, origins, canonicalOrigin, prefix);
});

export default app;
