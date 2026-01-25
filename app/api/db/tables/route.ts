import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, TABLE_NAMES } from '@/lib/db-factory'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'

    if (dbType !== 'local' && dbType !== 'production') {
      return NextResponse.json({ error: 'Invalid database type' }, { status: 400 })
    }

    // Проверяем подключение к БД, получая количество записей в каждой таблице
    const prisma = getPrismaClient(dbType as 'local' | 'production')
    const tablesWithCounts = await Promise.all(
      TABLE_NAMES.map(async (table) => {
        try {
          const count = await (prisma as any)[table.name].count()
          return {
            name: table.name,
            label: table.label,
            count,
          }
        } catch (error) {
          return {
            name: table.name,
            label: table.label,
            count: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )

    return NextResponse.json({ tables: tablesWithCounts })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

