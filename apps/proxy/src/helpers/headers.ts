import { getHost } from "./host.js";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

// Set by Vercel when "Protection Bypass for Automation" is enabled. Lets the
// proxy fetch protected preview deployments of the other apps server-side.
const PROTECTION_BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export function getRequestHeaders(
  request: Request,
  canonicalOrigin: string,
  prefix: string
): Headers {
  const headers = new Headers(request.headers);

  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

  headers.delete("host");
  headers.set("x-forwarded-host", getHost(request));
  headers.set(
    "x-forwarded-proto",
    new URL(canonicalOrigin).protocol.slice(0, -1)
  );
  headers.set("x-forwarded-prefix", prefix);

  if (PROTECTION_BYPASS) {
    headers.set("x-vercel-protection-bypass", PROTECTION_BYPASS);
  }

  return headers;
}

export function getResponseHeaders(response: Response): Headers {
  const headers = new Headers(response.headers);

  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

  return headers;
}
