import { defineConfig } from "astro/config";

const port = 3001;

// https://astro.build/config
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port,
  },
  vite: {
    server: {
      // HMR connects straight to the dev server, bypassing the proxy.
      hmr: {
        clientPort: port,
      },
      allowedHosts: [".localhost"],
    },
  },
});
