/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily commenting out export mode for development
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;