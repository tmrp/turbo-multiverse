import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const port = 3004;

export default defineConfig({
  // Served behind the proxy at the /start canonical path.
  base: "/start/",
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
  plugins: [
    tanstackStart({
      router: {
        basepath: "/start",
      },
    }),
    nitro(),
    viteReact(),
  ],
});
