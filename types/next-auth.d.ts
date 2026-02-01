import NextAuth from "next-auth"

/**
 * Расширение типов NextAuth для добавления userId в сессию
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
