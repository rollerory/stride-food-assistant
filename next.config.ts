// next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "src/styles")],
        additionalData: `
      @use "vars" as *;
      @use "mixins" as *;
      @use "typography" as *;
    `,
    },
};

export default nextConfig;
