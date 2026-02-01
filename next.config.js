/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Для работы с Prisma на Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig


