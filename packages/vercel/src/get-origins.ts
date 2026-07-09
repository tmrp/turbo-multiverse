import { SITE_APPS, type SiteApp } from "@repo/site-config";

import { isDevelopment, isPreview } from "./env.js";

/** Map of app id → upstream origin the proxy should fetch from. */
export interface ResolvedOrigins {
    apps: Record<string, string>;
}

const VERCEL_API_URL = "https://api.vercel.com";
const VERCEL_API_TIMEOUT_MS = 3000;

function envFor(app: SiteApp, suffix: string): string | undefined {
    return process.env[`${app.id.toUpperCase()}_${suffix}`];
}

function devUrl(app: SiteApp): string {
    return `http://localhost:${app.devPort}`;
}

/**
 * Production origin of an app's dedicated Vercel project. Defaults to the
 * `<prefix>-<app>.vercel.app` convention; override per app with
 * `<APP>_ORIGIN`, or change the prefix with `VERCEL_PROJECT_PREFIX`.
 */
function prodUrl(app: SiteApp): string {
    const prefix = process.env.VERCEL_PROJECT_PREFIX ?? "tmwf";
    return `https://${prefix}-${app.id}.vercel.app`;
}

/**
 * On preview deployments, look up the matching preview deployment of another
 * app for the current branch via the Vercel API. Requires `VERCEL_TOKEN` and
 * per-app `<APP>_PROJECT_ID` variables on the proxy project.
 */
async function fetchPreviewDeploymentOrigin(
    projectId: string
): Promise<string | null> {
    const token = process.env.VERCEL_TOKEN;
    const branch = process.env.VERCEL_GIT_COMMIT_REF;

    if (!token || !branch) {
        return null;
    }

    const params = new URLSearchParams({
        projectId,
        target: "preview",
        state: "READY",
        limit: "1",
        "meta-githubCommitRef": branch,
    });

    const teamId = process.env.VERCEL_TEAM_ID;

    if (teamId) {
        params.set("teamId", teamId);
    }

    try {
        const response = await fetch(
            `${VERCEL_API_URL}/v6/deployments?${params}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                signal: AbortSignal.timeout(VERCEL_API_TIMEOUT_MS),
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as {
            deployments?: { url?: string; meta?: { branchAlias?: string } }[];
        };

        const url = data.deployments?.[0]?.meta?.branchAlias;

        return url ? `https://${url}` : null;
    } catch {
        return null;
    }
}

function trimTrailingSlash(value: string): string {
    return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function resolveAppOrigin(app: SiteApp): Promise<string> {
    const override = envFor(app, "ORIGIN");

    if (override) {
        return trimTrailingSlash(override);
    }

    if (isDevelopment()) {
        return devUrl(app);
    }

    if (isPreview()) {
        const projectId = envFor(app, "PROJECT_ID");
        const previewOrigin = projectId
            ? await fetchPreviewDeploymentOrigin(projectId)
            : null;

        // Fall back to production when the branch has no deployment for this app
        // (e.g. Vercel skipped it because nothing in its directory changed).
        return previewOrigin ?? prodUrl(app);
    }

    return prodUrl(app);
}

async function resolveOrigins(): Promise<ResolvedOrigins> {
    const entries = await Promise.all(
        SITE_APPS.map(async (app) => [app.id, await resolveAppOrigin(app)])
    );

    return { apps: Object.fromEntries(entries) as Record<string, string> };
}

let cached: Promise<ResolvedOrigins> | null = null;

/**
 * Resolve every upstream origin, memoised per process outside of local
 * development (preview lookups hit the Vercel API).
 */
export function getOrigins(): Promise<ResolvedOrigins> {
    if (isDevelopment()) {
        return resolveOrigins();
    }

    cached ??= resolveOrigins();
    return cached;
}
