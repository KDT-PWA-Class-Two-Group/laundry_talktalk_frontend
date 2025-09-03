import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  eslint: {
    // 빌드 시 ESLint 오류를 경고로 처리
    ignoreDuringBuilds: false,
  },
  typescript: {
    // 빌드 시 TypeScript 오류를 무시하지 않음
    ignoreBuildErrors: false,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
