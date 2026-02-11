import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { LikeButton } from "@/components/dashboard/LikeButton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ResultPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  const result = await prisma.result.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      ...(currentUserId ? {
        likes: {
          where: {
            userId: currentUserId,
          },
          select: {
            id: true,
          },
        },
      } : {}),
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  if (!result) {
    notFound()
  }

  // Если результат приватный и пользователь не владелец - 404
  if (!result.isPublic && result.userId !== currentUserId) {
    notFound()
  }

  // Форматируем результат
  // Проверяем наличие likes (может быть undefined, если currentUserId отсутствует)
  const likesArray = currentUserId && 'likes' in result && Array.isArray(result.likes) 
    ? result.likes 
    : []
  const likedByMe = likesArray.length > 0
  
  // _count всегда включен в запрос, используем type assertion для обхода проблемы типизации
  const likesCount = (result as any)._count?.likes ?? 0
  
  const formattedResult = {
    ...result,
    likesCount,
    likedByMe,
    likes: undefined,
    _count: undefined,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {result.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            {result.user && (
              <div className="flex items-center gap-2">
                {result.user.image && (
                  <img
                    src={result.user.image}
                    alt={result.user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{result.user.name || "Неизвестно"}</span>
              </div>
            )}
            <span>
              {new Date(result.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {result.content}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t">
            {currentUserId && result.isPublic && (
              <LikeButton
                resultId={result.id}
                initialLiked={formattedResult.likedByMe || false}
                initialCount={formattedResult.likesCount || 0}
              />
            )}
            {!currentUserId && result.isPublic && (
              <div className="text-sm text-gray-600">
                {formattedResult.likesCount || 0} лайков
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

