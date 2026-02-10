import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/results/[id]/like
 * Toggle лайка для публичного результата
 * 
 * Требования:
 * - Пользователь должен быть авторизован
 * - Результат должен существовать и быть публичным
 * - Один пользователь = один лайк (уникальный индекс)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const resultId = params.id
    const userId = session.user.id

    // Проверка существования результата и его публичности
    const result = await prisma.result.findUnique({
      where: { id: resultId },
      select: {
        id: true,
        isPublic: true,
      },
    })

    if (!result) {
      return NextResponse.json(
        { error: "Результат не найден" },
        { status: 404 }
      )
    }

    if (!result.isPublic) {
      return NextResponse.json(
        { error: "Лайкать можно только публичные результаты" },
        { status: 403 }
      )
    }

    // Проверяем, есть ли уже лайк от этого пользователя
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_resultId: {
          userId,
          resultId,
        },
      },
    })

    let liked: boolean
    if (existingLike) {
      // Удаляем лайк
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
      liked = false
    } else {
      // Создаем лайк
      await prisma.like.create({
        data: {
          userId,
          resultId,
        },
      })
      liked = true
    }

    // Подсчитываем общее количество лайков
    const likesCount = await prisma.like.count({
      where: { resultId },
    })

    return NextResponse.json({
      liked,
      likesCount,
    })
  } catch (error) {
    console.error("Error toggling like:", error)

    // Обработка ошибки уникального индекса (не должно произойти, но на всякий случай)
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "Лайк уже существует" },
        { status: 409 }
      )
    }

    // Обработка ошибок базы данных
    return NextResponse.json(
      { error: "Ошибка при обработке запроса. Попробуйте позже." },
      { status: 500 }
    )
  }
}

