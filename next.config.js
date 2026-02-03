/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Для работы с Prisma на Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Разрешаем загрузку изображений от Google
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig


