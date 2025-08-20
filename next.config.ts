import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
  config.resolve.alias["@" ] = path.resolve(__dirname);
  return config;
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
