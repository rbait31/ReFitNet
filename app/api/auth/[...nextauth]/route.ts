import NextAuth from "next-auth"
import { authOptions } from "@/auth"

/**
 * API Route для NextAuth.js
 * Обрабатывает все запросы к /api/auth/*
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
