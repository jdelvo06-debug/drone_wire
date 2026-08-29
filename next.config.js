/** @type {import('next').NextConfig} */
const { withBotId } = require('botid/next/config');
const optimizedImageHosts = require('./config/optimized-image-hosts.json');

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' data: https://fonts.gstatic.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    // Only ignore specific directories if needed, not all builds
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: optimizedImageHosts.map((hostname) => ({
      protocol: 'https',
      hostname,
      pathname: '/**',
    })),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

// BotID's client instrumentation targets deployed builds and emits invalid local-dev
// bootstrap code without a configured development bypass. Keep production unchanged.
module.exports = process.env.NODE_ENV === 'production' ? withBotId(nextConfig) : nextConfig;
