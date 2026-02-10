"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  resultId: string
  initialLiked: boolean
  initialCount: number
  onUpdate?: () => void
}

/**
 * Компонент кнопки лайка для публичных результатов
 * Поддерживает оптимистичное обновление UI
 */
export function LikeButton({
  resultId,
  initialLiked,
  initialCount,
  onUpdate,
}: LikeButtonProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLike = async () => {
    // Оптимистичное обновление
    const previousLiked = liked
    const previousCount = count

    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/results/${resultId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        
        // Откатываем оптимистичное обновление
        setLiked(previousLiked)
        setCount(previousCount)

        if (response.status === 401) {
          // Не авторизован - редирект на вход
          router.push("/login")
          return
        }

        setError(data.error || "Ошибка при обработке запроса")
        return
      }

      const data = await response.json()
      setLiked(data.liked)
      setCount(data.likesCount)

      // Вызываем callback для обновления родительского компонента
      onUpdate?.()
      router.refresh()
    } catch (error) {
      // Откатываем оптимистичное обновление
      setLiked(previousLiked)
      setCount(previousCount)
      
      console.error("Error toggling like:", error)
      setError("Ошибка соединения. Попробуйте позже.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "h-8 gap-1.5",
          liked && "text-blue-600 hover:text-blue-700"
        )}
        title={liked ? "Убрать лайк" : "Поставить лайк"}
      >
        <ThumbsUp
          className={cn(
            "w-4 h-4",
            liked && "fill-current"
          )}
        />
        <span className="text-sm font-medium">{count}</span>
      </Button>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

