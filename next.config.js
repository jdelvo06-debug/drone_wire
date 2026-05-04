/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore specific directories if needed, not all builds
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
