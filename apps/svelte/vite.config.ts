import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const port = 3007;

export default defineConfig({
  // Served behind the proxy at the /svelte canonical path.
  base: "/svelte/",
  plugins: [svelte()],
  server: {
    host: "0.0.0.0",
    port,
    strictPort: true,
    // HMR connects straight to the dev server, bypassing the proxy.
    hmr: {
      clientPort: port,
    },
    allowedHosts: [".localhost"],
  },
});
