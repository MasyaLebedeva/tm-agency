/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false, // Всегда без trailing slash
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Редирект с www на без www - только если запрос идет с www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.tmads.ru',
          },
        ],
        destination: 'https://tmads.ru/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 