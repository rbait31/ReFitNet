"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LikeButton } from "@/components/dashboard/LikeButton"
import { MessageSquare, ExternalLink, Calendar, User } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Форматирование даты
const formatDate = (date: Date) => {
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return new Date(date).toLocaleDateString("ru-RU")
  }
}

interface PublicResultCardProps {
  result: {
    id: string
    title: string
    content: string
    createdAt: Date
    userId: string
    likesCount?: number
    likedByMe?: boolean
    user?: {
      id: string
      name: string | null
      image: string | null
    }
  }
  currentUserId?: string
}

export function PublicResultCard({
  result,
  currentUserId,
}: PublicResultCardProps) {
  // Превью контента (первые 150 символов)
  const preview = result.content.length > 150
    ? result.content.substring(0, 150) + "..."
    : result.content

  const timeAgo = formatDate(new Date(result.createdAt))

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Иконка */}
        <div className="flex-shrink-0 mt-1">
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
            {result.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {preview}
          </p>

          {/* Метаданные */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
            {result.user && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{result.user.name || "Неизвестно"}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>
            {result.likesCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <span>{result.likesCount} лайков</span>
              </div>
            )}
          </div>

          {/* Действия */}
          <div className="flex items-center gap-3">
            <Link href={`/results/${result.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Открыть
              </Button>
            </Link>
            {currentUserId && (
              <LikeButton
                resultId={result.id}
                initialLiked={result.likedByMe || false}
                initialCount={result.likesCount || 0}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

