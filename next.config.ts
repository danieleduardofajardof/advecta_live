import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Vercel build hangs at "Creating an optimized production build"
  // with default Turbopack on Next 16.1.6. Disabled via build script
  // flag `--webpack` in package.json (kept Turbopack for local `next dev`).
};

export default nextConfig;
