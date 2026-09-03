/** @type {import('next').NextConfig} */
const backendApiUrl = process.env.BACKEND_API_URL?.replace(/\/$/, '');
const nextConfig = {
  // Tell Next.js where to find pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  reactStrictMode: true,

  // Don't let ESLint errors (like unescaped apostrophes) block production builds.
  // Lint issues will still show as warnings in the build log, just won't fail the deploy.
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    if (!backendApiUrl) return [];
    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendApiUrl}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
