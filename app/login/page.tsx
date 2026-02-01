import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { SignInButton } from "@/components/SignInButton"

/**
 * Страница входа
 * НЕ проверяем сессию здесь - это может вызвать цикл редиректов
 * Если пользователь авторизован, он может просто перейти на /dashboard
 * Middleware защитит /dashboard и редиректнет неавторизованных на /login
 */
export default async function LoginPage() {
  // НЕ проверяем сессию здесь, чтобы избежать циклов редиректов
  // Просто показываем форму входа

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#1a202c",
          }}
        >
          Recovery Fitness
        </h1>
        <p
          style={{
            color: "#718096",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          Войдите, чтобы продолжить
        </p>

        <SignInButton />
      </div>
    </div>
  )
}
