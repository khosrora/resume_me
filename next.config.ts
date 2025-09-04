import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://cvbuilder.storage.c2.liara.space/**")],
  },
};

export default nextConfig;
