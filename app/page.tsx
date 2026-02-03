import { redirect } from 'next/navigation'

/**
 * Главная страница - редиректит на /login
 * После авторизации пользователи попадают в /dashboard
 */
export default function Home() {
  redirect('/login')
}

