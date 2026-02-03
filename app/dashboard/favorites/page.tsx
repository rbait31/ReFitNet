import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import { getFavoriteResults } from "@/app/actions/result-actions"
import { ResultsList } from "@/components/dashboard/ResultsList"

export const dynamic = "force-dynamic"

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const page = parseInt(searchParams.page || "1", 10)
  const search = searchParams.search || undefined

  const result = await getFavoriteResults(page, 10, search)

  if (!result.success || !result.data) {
    return (
      <div className="p-8">
        <p className="text-red-500">Ошибка: {result.error || "Неизвестная ошибка"}</p>
      </div>
    )
  }

  const { results, pagination } = result.data

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Избранное
          </h1>
          <p className="text-gray-600">
            Ваши избранные результаты
          </p>
        </div>

        <ResultsList
          results={results}
          currentUserId={session.user.id}
          pagination={pagination}
          search={search}
        />
      </div>
    </div>
  )
}

