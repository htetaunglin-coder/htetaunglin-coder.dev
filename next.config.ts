import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  webpack(config) {
    config.module.rules.push({
      // biome-ignore lint/performance/useTopLevelRegex: off
      test: /\.(glb|gltf|png|jpg|jpeg)$/i,
      type: "asset/resource",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
