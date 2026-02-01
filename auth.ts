import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

/**
 * Конфигурация NextAuth.js для аутентификации через Google OAuth
 */

// Проверяем наличие обязательных переменных окружения
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
if (!authSecret) {
  throw new Error(
    "AUTH_SECRET или NEXTAUTH_SECRET должны быть установлены в переменных окружения"
  )
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID должен быть установлен в переменных окружения")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET должен быть установлен в переменных окружения")
}

// Проверяем NEXTAUTH_URL для корректной работы cookies
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ NEXTAUTH_URL не установлен. Это может вызвать проблемы с cookies в production.")
}

export const authOptions: NextAuthOptions = {
  // Используем Prisma Adapter для хранения сессий и аккаунтов в БД
  adapter: PrismaAdapter(prisma) as any,

  // Провайдеры OAuth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Настройки сессий - используем database sessions
  session: {
    strategy: "database", // Храним сессии в БД
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  // Callbacks для кастомизации данных пользователя
  callbacks: {
    async signIn({ user, account, profile }) {
      // Разрешаем вход для всех пользователей
      // Пользователь будет автоматически создан через PrismaAdapter
      console.log("[Auth] signIn callback - user:", user?.email, "account:", account?.provider)
      return true
    },
    async session({ session, user }: { session: any; user: any }) {
      // Добавляем userId в сессию для удобного доступа
      if (session.user && user) {
        session.user.id = user.id
      }
      console.log("[Auth] session callback - userId:", user?.id, "email:", session.user?.email)
      return session
    },
    async redirect({ url, baseUrl }) {
      // После успешного OAuth callback редиректим на dashboard
      // Всегда редиректим на dashboard, чтобы избежать циклов
      const dashboardUrl = `${baseUrl}/dashboard`
      console.log("[Auth] Redirect callback - url:", url, "baseUrl:", baseUrl, "→", dashboardUrl)
      return dashboardUrl
    },
  },

  // Настройка страниц
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Секретный ключ для шифрования
  // NextAuth v4 использует NEXTAUTH_SECRET, но также поддерживает AUTH_SECRET
  secret: authSecret,

  // Настройки cookies для работы в development
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
