"use client"

import { useState, useEffect } from "react"
import { ResultCard } from "./ResultCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

interface Result {
  id: string
  title: string
  content: string
  isPublic: boolean
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user?: {
    id: string
    name: string | null
    image: string | null
  }
}

interface PublicResultsListProps {
  results: Result[]
  currentUserId: string
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  search?: string
}

export function PublicResultsList({
  results,
  currentUserId,
  pagination,
  search: initialSearch,
}: PublicResultsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch || "")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      const params = new URLSearchParams(searchParams.toString())
      if (debouncedSearch) {
        params.set("search", debouncedSearch)
      } else {
        params.delete("search")
      }
      params.set("page", "1")
      router.push(`?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams, initialSearch])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    if (search) {
      params.set("search", search)
    }
    router.push(`?${params.toString()}`)
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">
          {search
            ? "Результаты не найдены"
            : "Публичных результатов пока нет"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Поиск по заголовку или содержанию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Список результатов */}
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id}>
            <ResultCard
              result={result}
              currentUserId={currentUserId}
              onUpdate={() => router.refresh()}
            />
            {result.user && result.userId !== currentUserId && (
              <p className="text-xs text-gray-500 mt-1 ml-2">
                Автор: {result.user.name || "Неизвестно"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Назад
          </Button>
          <span className="text-sm text-gray-600">
            Страница {pagination.page} из {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  )
}

