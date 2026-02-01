import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { SignOutButton } from "@/components/SignOutButton"

/**
 * Страница личного кабинета (dashboard)
 * Защищена middleware - неавторизованные пользователи редиректятся на /login
 * Middleware уже проверил авторизацию, поэтому просто получаем сессию для отображения данных
 */
export default async function DashboardPage() {
  // Получаем сессию на сервере
  // Middleware уже проверил авторизацию, поэтому session должна быть
  const session = await getServerSession(authOptions)

  // Если сессии нет (не должно произойти, т.к. middleware защищает),
  // то просто показываем сообщение об ошибке вместо редиректа
  if (!session) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Ошибка авторизации</h1>
        <p>Сессия не найдена. Пожалуйста, войдите снова.</p>
        <a href="/login" style={{ color: "#4285f4" }}>Войти</a>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Личный кабинет
        </h1>
        <SignOutButton />
      </div>

      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
          Добро пожаловать!
        </h2>

        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p>
            <strong>Имя:</strong> {session.user?.name || "Не указано"}
          </p>
          <p>
            <strong>Email:</strong> {session.user?.email}
          </p>
          <p>
            <strong>User ID:</strong> {session.user?.id}
          </p>
        </div>
      </div>
    </div>
  )
}
