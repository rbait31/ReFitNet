"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SignOutButtonProps {
  className?: string
  variant?: "button" | "menu"
}

/**
 * Компонент кнопки выхода
 * После выхода пользователь перенаправляется на главную страницу
 */
export function SignOutButton({ className, variant = "button" }: SignOutButtonProps) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    // Используем redirect: false и затем вручную делаем редирект на главную
    await signOut({ 
      redirect: false,
      callbackUrl: "/" 
    })
    // Вручную перенаправляем на главную страницу
    router.push("/")
    router.refresh() // Обновляем данные страницы
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSignOut()
        }}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm w-full text-left",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        Выйти
      </button>
    )
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleSignOut}
      className={cn("w-full", className)}
    >
      Выйти
    </Button>
  )
}
