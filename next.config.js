/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  compiler: {
    // Keep console logs in production for debugging
    removeConsole: false,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    serverComponentsExternalPackages: [],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable console output in production for debug purposes
  onDemandEntries: {
    // Enable webpack hot module replacement
    pagesBufferLength: 2,
    // Keep the pages in memory for 5 minutes (helps preserve logs)
    maxInactiveAge: 5 * 60 * 1000,
  },
}

module.exports = nextConfig 