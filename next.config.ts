import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://cvbuilder.storage.c2.liara.space/**"),
      new URL("http://localhost:8000/**"),
      new URL("https://avatar.iran.liara.run/**"),
    ],
  },
};

export default nextConfig;
