/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.cloudflare.steamstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
        pathname: '/steam/**',
      },
    ],
  },
}

module.exports = nextConfig 