import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} ReFitNet. Все права защищены.
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/policy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Политика
            </Link>
            <Link
              href="/contacts"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

