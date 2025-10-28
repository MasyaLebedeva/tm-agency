/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    quality: 95,
    formats: ['image/webp', 'image/avif'],
  },
  output: 'standalone',
}

module.exports = nextConfig 