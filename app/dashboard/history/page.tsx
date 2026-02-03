import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            История
          </h1>
          <p className="text-gray-600">
            История ваших действий
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Скоро...
          </p>
        </div>
      </div>
    </div>
  )
}

