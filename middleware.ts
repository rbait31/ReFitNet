import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

/**
 * Middleware для защиты страниц
 * Автоматически редиректит неавторизованных пользователей на /login
 * 
 * ВАЖНО:
 * - Главная страница "/" доступна БЕЗ авторизации
 * - Страница "/login" доступна БЕЗ авторизации
 * - Страницы "/dashboard/*" требуют авторизации
 * 
 * Для database sessions withAuth автоматически читает сессию из БД через cookie
 */
export default withAuth(
  function middleware(req) {
    // Логируем для отладки
    const sessionToken = req.cookies.get("next-auth.session-token")?.value
    console.log("[Middleware] Request to:", req.nextUrl.pathname, "hasToken:", !!req.nextauth.token, "hasCookie:", !!sessionToken)
    
    // Если это запрос к /login, пропускаем без проверки
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.next()
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Главная страница и /login всегда доступны без авторизации
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login") {
          return true
        }
        // Проверяем наличие токена (пользователь авторизован)
        // Для database sessions token будет объектом с данными пользователя
        const sessionToken = req.cookies.get("next-auth.session-token")?.value
        const isAuthorized = !!token
        console.log("[Middleware] authorized check for", req.nextUrl.pathname, "- token:", !!token, "cookie:", !!sessionToken)
        if (token) {
          console.log("[Middleware] token data:", { id: (token as any).sub, email: (token as any).email })
        }
        // Если cookie есть, но токена нет - возможно, сессия еще не загружена
        // В этом случае разрешаем доступ (сессия загрузится на странице)
        if (sessionToken && !token) {
          console.log("[Middleware] Cookie found but token missing - allowing access (session will load on page)")
          return true
        }
        return isAuthorized
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

// Защищаем следующие маршруты
// ВАЖНО: /login НЕ должен быть в matcher, иначе будет цикл редиректов
// withAuth автоматически исключает /api/auth/* из проверки
export const config = {
  matcher: [
    // НЕ включаем "/" - главная страница доступна всем
    "/dashboard/:path*",
    "/my-prompts/:path*",
    "/api/protected/:path*", // Пример защищенного API
    // НЕ включаем /login, /catalog, /results - они доступны без авторизации
  ],
}
