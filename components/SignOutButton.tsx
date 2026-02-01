"use client"

import { signOut } from "next-auth/react"

/**
 * Компонент кнопки выхода
 */
export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        padding: "0.5rem 1rem",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: "500",
      }}
    >
      Выйти
    </button>
  )
}
