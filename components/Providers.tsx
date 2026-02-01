"use client"

import { SessionProvider } from "next-auth/react"

/**
 * Провайдер для NextAuth Session
 * Обеспечивает доступ к сессии на клиенте
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
