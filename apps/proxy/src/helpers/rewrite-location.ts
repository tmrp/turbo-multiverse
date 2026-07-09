import { SITE_APPS } from "@repo/site-config";
import type { ResolvedOrigins } from "@repo/vercel";

/**
 * Rewrite redirect Locations that point at an internal upstream origin back
 * to the canonical origin, so redirects never leak the upstream deployment
 * URLs to the browser. Apps serve under their own path prefix, so the path
 * can be kept as-is; relative Locations pass through untouched.
 */
export function rewriteLocation(
  location: string,
  origins: ResolvedOrigins,
  canonicalOrigin: string
) {
  for (const app of SITE_APPS) {
    const origin = origins.apps[app.id];

    if (!origin || !location.startsWith(origin)) {
      break;
    }

    return `${canonicalOrigin}${location.slice(origin.length)}`;
  }

  return location;
}
