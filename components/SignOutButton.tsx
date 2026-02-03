"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

/**
 * Компонент кнопки выхода
 */
export function SignOutButton() {
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full"
    >
      Выйти
    </Button>
  )
}
