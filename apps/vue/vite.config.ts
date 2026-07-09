import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const port = 3005;

export default defineConfig({
  // Served behind the proxy at the /vue canonical path.
  base: "/vue/",
  plugins: [vue()],
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
