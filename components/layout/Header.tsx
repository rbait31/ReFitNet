import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/SignOutButton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogIn } from "lucide-react"

export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип и название */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ReFitNet Logo"
                width={48}
                height={48}
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">ReFitNet</span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Каталог
            </Link>
            {session?.user && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Мои результаты
              </Link>
            )}
          </nav>

          {/* Правая часть: авторизация/профиль */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user.name || "Пользователь"}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Личный кабинет
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton variant="menu" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Войти</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

