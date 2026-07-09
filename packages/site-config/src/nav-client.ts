import { API_DEMO_PATH } from "./api.js";
import { appPath, getAppById } from "./apps.js";

/** Canonical, same-origin URL of the API demo endpoint (`/api/hello`). */
export const API_DEMO_URL = `${appPath(getAppById("api")!)}${API_DEMO_PATH}`;

/**
 * Runs in the browser after load/hydration. Fills `[data-api-demo]` elements
 * with a response from the NestJS api app — a same-origin fetch, since every
 * app lives under one canonical origin behind the proxy.
 *
 * Kept dependency-free and self-contained so it can be serialized with
 * `Function.prototype.toString` and inlined as a plain `<script>` in
 * frameworks that don't hydrate (Astro, NestJS-rendered HTML).
 */
function apiDemoClient(apiUrl: string): void {
  document.querySelectorAll("[data-api-demo]").forEach((el) => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data: unknown) => {
        el.textContent = JSON.stringify(data, null, 2);
      })
      .catch((error: unknown) => {
        el.textContent = `Could not reach the api app: ${String(error)}`;
      });
  });
}

/**
 * Call after mount/hydration in component frameworks
 * (React `useEffect`, Vue `onMounted`).
 */
export function hydrateApiDemo(): void {
  apiDemoClient(API_DEMO_URL);
}

/** Inline `<script>` body for HTML-first frameworks. */
export const API_DEMO_SCRIPT = `(${apiDemoClient.toString()})(${JSON.stringify(
  API_DEMO_URL,
)});`;
