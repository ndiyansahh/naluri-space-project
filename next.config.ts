import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "cdn.example.com"],
  },
  env: {
    NEXT_PUBLIC_API_KEY: process.env.PUBLIC_API_SECRET_KEY || '',
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
