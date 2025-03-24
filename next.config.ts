import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "lucide-react",
      "date-fns",
      "recharts",
    ],
  },
};

export default nextConfig;
