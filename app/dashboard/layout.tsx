import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        user={{
          id: session.user.id,
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
        }}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

