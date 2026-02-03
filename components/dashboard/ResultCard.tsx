"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Star,
  Pencil,
  Trash2,
  Globe,
  Lock,
} from "lucide-react"
import { toggleFavorite, togglePublic, deleteResult } from "@/app/actions/result-actions"
import { useRouter } from "next/navigation"
import { ResultDialog } from "./ResultDialog"
import { cn } from "@/lib/utils"

interface ResultCardProps {
  result: {
    id: string
    title: string
    content: string
    isPublic: boolean
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
  }
  currentUserId: string
  onUpdate?: () => void
}

export function ResultCard({ result, currentUserId, onUpdate }: ResultCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Превью контента (первые 100 символов)
  const preview = result.content.length > 100
    ? result.content.substring(0, 100) + "..."
    : result.content

  const handleToggleFavorite = async () => {
    const response = await toggleFavorite(result.id)
    if (response.success) {
      onUpdate?.()
      router.refresh()
    }
  }

  const handleTogglePublic = async () => {
    const response = await togglePublic(result.id)
    if (response.success) {
      onUpdate?.()
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот результат?")) {
      return
    }

    setIsDeleting(true)
    const response = await deleteResult(result.id)
    setIsDeleting(false)

    if (response.success) {
      onUpdate?.()
      router.refresh()
    } else {
      alert(response.error || "Ошибка при удалении")
    }
  }

  const canEdit = result.userId === currentUserId

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {/* Иконка */}
          <div className="flex-shrink-0 mt-1">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              {result.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {preview}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                {new Date(result.updatedAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Избранное */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="h-8 w-8"
            >
              <Star
                className={cn(
                  "w-4 h-4",
                  result.isFavorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                )}
              />
            </Button>

            {canEdit && (
              <>
                {/* Редактировать */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDialogOpen(true)}
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                </Button>

                {/* Публичность */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTogglePublic}
                  className="h-8 w-8"
                  title={result.isPublic ? "Сделать приватным" : "Сделать публичным"}
                >
                  {result.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </Button>

                {/* Удалить */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {canEdit && (
        <ResultDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          result={result}
          onSuccess={() => {
            setIsDialogOpen(false)
            onUpdate?.()
            router.refresh()
          }}
        />
      )}
    </>
  )
}

