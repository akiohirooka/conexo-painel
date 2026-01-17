import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.conexo.jp',
      },
      {
        protocol: 'https',
        hostname: 'conexo-app.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev', // Allow all R2 dev URLs
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },

};

export default nextConfig;
