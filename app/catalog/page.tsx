import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { getPublicResults } from "@/app/actions/result-actions"
import { PublicResultsList } from "@/components/dashboard/PublicResultsList"

export const dynamic = "force-dynamic"

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; sort?: string }
}) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  const page = parseInt(searchParams.page || "1", 10)
  const search = searchParams.search || undefined
  const sort = (searchParams.sort === "popular" ? "popular" : "recent") as "popular" | "recent"

  const result = await getPublicResults(page, 20, search, sort, currentUserId)

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-red-500">Ошибка: {result.error || "Неизвестная ошибка"}</p>
        </div>
      </div>
    )
  }

  const { results, pagination } = result.data

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Каталог результатов
          </h1>
          <p className="text-gray-600">
            Все публичные результаты пользователей
          </p>
        </div>

        <PublicResultsList
          results={results}
          currentUserId={currentUserId || ""}
          pagination={pagination}
          search={search}
          sort={sort}
        />
      </div>
    </div>
  )
}

