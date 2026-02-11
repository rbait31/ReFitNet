import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { getRecentPublicResults, getPopularPublicResults } from "@/app/actions/home-actions"
import { PublicResultCard } from "@/components/home/PublicResultCard"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  // Получаем данные параллельно
  const [recentResult, popularResult] = await Promise.all([
    getRecentPublicResults(20, currentUserId),
    getPopularPublicResults(20, currentUserId),
  ])

  const recentResults = recentResult.success ? recentResult.data : []
  const popularResults = popularResult.success ? popularResult.data : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero блок */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Добро пожаловать в ReFitNet
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Платформа для отслеживания результатов восстановления и фитнеса
            </p>
            {session?.user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
                  <Plus className="w-5 h-5" />
                  Добавить результат
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link href="/login">
                  <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
                    <Plus className="w-5 h-5" />
                    Добавить результат
                  </Button>
                </Link>
                <p className="text-sm text-blue-100">
                  Войдите, чтобы добавлять свои результаты
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Новые результаты */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Новые результаты (за 24 часа)</h2>
            </div>
            <Separator className="mb-6" />
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <PublicResultCard
                    key={result.id}
                    result={result}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Пока нет новых публичных результатов</p>
              </div>
            )}
          </section>

          {/* Популярные результаты */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Популярные результаты</h2>
            </div>
            <Separator className="mb-6" />
            {popularResults.length > 0 ? (
              <div className="space-y-4">
                {popularResults.map((result) => (
                  <PublicResultCard
                    key={result.id}
                    result={result}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Пока нет популярных результатов</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
