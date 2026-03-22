import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:3001/api/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://api:3001/socket.io/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://api:3001/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
