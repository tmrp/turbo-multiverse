import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const port = 3003;

export default defineConfig({
  // Served behind the proxy at the /vite canonical path.
  base: "/vite/",
  plugins: [react()],
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
