"use server"

import { prisma } from "@/lib/prisma"

/**
 * Получить новые публичные результаты (за последние 24 часа)
 */
export async function getRecentPublicResults(limit: number = 20, currentUserId?: string) {
  try {
    // Вычисляем дату 24 часа назад
    const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const results = await prisma.result.findMany({
      where: {
        isPublic: true,
        createdAt: {
          gte: date24HoursAgo, // Только результаты за последние 24 часа
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        ...(currentUserId && {
          likes: {
            where: {
              userId: currentUserId,
            },
            select: {
              id: true,
            },
          },
        }),
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Получаем все resultIds для эффективной проверки likedByMe
    const resultIds = results.map((r) => r.id)
    let likedResultIds = new Set<string>()

    if (currentUserId && resultIds.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          resultId: { in: resultIds },
        },
        select: {
          resultId: true,
        },
      })
      likedResultIds = new Set(likes.map((l) => l.resultId))
    }

    // Форматируем результаты
    const formattedResults = results.map((result) => ({
      ...result,
      likesCount: result._count.likes,
      likedByMe: likedResultIds.has(result.id),
      likes: undefined,
      _count: undefined,
    }))

    return {
      success: true,
      data: formattedResults,
    }
  } catch (error) {
    console.error("Error fetching recent public results:", error)
    return { success: false, error: "Ошибка при загрузке результатов", data: [] }
  }
}

/**
 * Получить популярные публичные результаты
 */
export async function getPopularPublicResults(limit: number = 20, currentUserId?: string) {
  try {
    // Получаем все публичные результаты с подсчетом лайков
    const allResults = await prisma.result.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    // Фильтруем результаты с лайками > 0
    const resultsWithLikes = allResults.filter((result) => result._count.likes > 0)

    // Сортируем по количеству лайков (по убыванию), затем по дате создания
    resultsWithLikes.sort((a, b) => {
      const aCount = a._count.likes
      const bCount = b._count.likes
      if (bCount !== aCount) {
        return bCount - aCount
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Берем топ N
    const results = resultsWithLikes.slice(0, limit)

    // Получаем все resultIds для эффективной проверки likedByMe
    const resultIds = results.map((r) => r.id)
    let likedResultIds = new Set<string>()

    if (currentUserId && resultIds.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          resultId: { in: resultIds },
        },
        select: {
          resultId: true,
        },
      })
      likedResultIds = new Set(likes.map((l) => l.resultId))
    }

    // Форматируем результаты
    const formattedResults = results.map((result) => ({
      ...result,
      likesCount: result._count.likes,
      likedByMe: likedResultIds.has(result.id),
      likes: undefined,
      _count: undefined,
    }))

    return {
      success: true,
      data: formattedResults,
    }
  } catch (error) {
    console.error("Error fetching popular public results:", error)
    return { success: false, error: "Ошибка при загрузке результатов", data: [] }
  }
}

