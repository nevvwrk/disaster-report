import type { NextConfig } from "next";

const outputValue = process.env.NODE_ENV === "production" ? "standalone" : undefined;

const nextConfig: NextConfig = {
  output: outputValue,

};

export default nextConfig;
