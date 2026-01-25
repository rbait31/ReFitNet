import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReFitNet',
  description: 'Next.js + Prisma + NeonDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


