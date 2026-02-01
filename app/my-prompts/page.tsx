import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * Страница "Мои промпты" (пример защищенной страницы)
 * Показывает только результаты текущего пользователя
 */
export default async function MyPromptsPage() {
  // Получаем сессию на сервере
  const session = await getServerSession(authOptions)

  // Если не авторизован - редирект на логин
  if (!session || !session.user?.id) {
    redirect("/login")
  }

  // Получаем результаты только текущего пользователя
  const myResults = await prisma.mresult.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Ограничиваем для примера
  })

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Мои результаты
      </h1>

      {myResults.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            background: "#f5f5f5",
            borderRadius: "8px",
            textAlign: "center",
            color: "#666",
          }}
        >
          <p>У вас пока нет результатов.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {myResults.map((result) => (
            <div
              key={result.id}
              style={{
                padding: "1.5rem",
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>
                {result.title}
              </h2>
              {result.description && (
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  {result.description}
                </p>
              )}
              <p style={{ fontSize: "0.875rem", color: "#999" }}>
                Создано: {new Date(result.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
