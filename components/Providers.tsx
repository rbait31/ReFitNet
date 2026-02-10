"use client"

import { SessionProvider } from "next-auth/react"

/**
 * Провайдер для NextAuth Session
 * Обеспечивает доступ к сессии на клиенте
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Проверяем сессию каждые 5 минут
      refetchOnWindowFocus={true} // Обновляем при фокусе окна
      basePath="/api/auth" // Указываем базовый путь для API
    >
      {children}
    </SessionProvider>
  )
}
