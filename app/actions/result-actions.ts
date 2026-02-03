"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Схемы валидации
const createResultSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(200, "Заголовок слишком длинный"),
  content: z.string().min(1, "Содержание обязательно"),
  isPublic: z.boolean().default(false),
})

const updateResultSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Заголовок обязателен").max(200, "Заголовок слишком длинный"),
  content: z.string().min(1, "Содержание обязательно"),
  isPublic: z.boolean(),
})

/**
 * Получить текущего пользователя из сессии
 */
async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Не авторизован")
  }
  return session.user.id
}

/**
 * Создать новый результат
 */
export async function createResult(data: z.infer<typeof createResultSchema>) {
  try {
    const userId = await getCurrentUser()
    const validatedData = createResultSchema.parse(data)

    const result = await prisma.result.create({
      data: {
        userId,
        title: validatedData.title,
        content: validatedData.content,
        isPublic: validatedData.isPublic,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating result:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Ошибка при создании результата" }
  }
}

/**
 * Обновить результат (только владелец)
 */
export async function updateResult(data: z.infer<typeof updateResultSchema>) {
  try {
    const userId = await getCurrentUser()
    const validatedData = updateResultSchema.parse(data)

    // Проверяем, что результат принадлежит пользователю
    const existing = await prisma.result.findFirst({
      where: { id: validatedData.id, userId },
    })

    if (!existing) {
      return { success: false, error: "Результат не найден или нет доступа" }
    }

    const result = await prisma.result.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        isPublic: validatedData.isPublic,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/public")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error updating result:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Ошибка при обновлении результата" }
  }
}

/**
 * Удалить результат (только владелец)
 */
export async function deleteResult(id: string) {
  try {
    const userId = await getCurrentUser()

    // Проверяем, что результат принадлежит пользователю
    const existing = await prisma.result.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return { success: false, error: "Результат не найден или нет доступа" }
    }

    await prisma.result.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/public")
    return { success: true }
  } catch (error) {
    console.error("Error deleting result:", error)
    return { success: false, error: "Ошибка при удалении результата" }
  }
}

/**
 * Переключить публичность результата
 */
export async function togglePublic(id: string) {
  try {
    const userId = await getCurrentUser()

    const existing = await prisma.result.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return { success: false, error: "Результат не найден или нет доступа" }
    }

    const result = await prisma.result.update({
      where: { id },
      data: {
        isPublic: !existing.isPublic,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/public")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error toggling public:", error)
    return { success: false, error: "Ошибка при изменении видимости" }
  }
}

/**
 * Переключить избранное
 */
export async function toggleFavorite(id: string) {
  try {
    const userId = await getCurrentUser()

    const existing = await prisma.result.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return { success: false, error: "Результат не найден или нет доступа" }
    }

    const result = await prisma.result.update({
      where: { id },
      data: {
        isFavorite: !existing.isFavorite,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/favorites")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, error: "Ошибка при изменении избранного" }
  }
}

/**
 * Получить результаты пользователя (с пагинацией и поиском)
 */
export async function getUserResults(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  try {
    const userId = await getCurrentUser()
    const skip = (page - 1) * limit

    const where = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.result.count({ where }),
    ])

    return {
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching user results:", error)
    return { success: false, error: "Ошибка при загрузке результатов" }
  }
}

/**
 * Получить публичные результаты
 */
export async function getPublicResults(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  try {
    const skip = (page - 1) * limit

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.result.count({ where }),
    ])

    return {
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching public results:", error)
    return { success: false, error: "Ошибка при загрузке публичных результатов" }
  }
}

/**
 * Получить избранные результаты пользователя
 */
export async function getFavoriteResults(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  try {
    const userId = await getCurrentUser()
    const skip = (page - 1) * limit

    const where = {
      userId,
      isFavorite: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.result.count({ where }),
    ])

    return {
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching favorite results:", error)
    return { success: false, error: "Ошибка при загрузке избранных результатов" }
  }
}

