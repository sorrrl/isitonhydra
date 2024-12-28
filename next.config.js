/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steampowered.com',
        pathname: '/steam/**',
      },
    ],
  },
}

module.exports = nextConfig 