import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served behind the proxy at the /next canonical path.
  basePath: "/next",
  // Dev assets/HMR are requested via the proxy's public hosts.
  allowedDevOrigins: ["*.localhost"],
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
};

export default nextConfig;
