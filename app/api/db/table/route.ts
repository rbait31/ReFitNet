import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, TableName } from '@/lib/db-factory'

const ITEMS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'
    const tableName = searchParams.get('table') as TableName
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

    if (!tableName) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 })
    }

    const prisma = getPrismaClient(dbType as 'local' | 'production')
    const model = (prisma as any)[tableName]

    if (!model) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const [data, total] = await Promise.all([
      model.findMany({
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
      }),
      model.count(),
    ])

    return NextResponse.json({
      data,
      pagination: {
        page,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        totalItems: total,
        itemsPerPage: ITEMS_PER_PAGE,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'
    const tableName = searchParams.get('table') as TableName
    const body = await request.json()

    if (!tableName) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 })
    }

    const prisma = getPrismaClient(dbType as 'local' | 'production')
    const model = (prisma as any)[tableName]

    if (!model) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const result = await model.create({ data: body })

    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'
    const tableName = searchParams.get('table') as TableName
    const body = await request.json()
    const { id, ...updateData } = body

    if (!tableName || !id) {
      return NextResponse.json({ error: 'Table name and id are required' }, { status: 400 })
    }

    const prisma = getPrismaClient(dbType as 'local' | 'production')
    const model = (prisma as any)[tableName]

    if (!model) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const result = await model.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = searchParams.get('db') || 'local'
    const tableName = searchParams.get('table') as TableName
    const id = searchParams.get('id')

    if (!tableName || !id) {
      return NextResponse.json({ error: 'Table name and id are required' }, { status: 400 })
    }

    const prisma = getPrismaClient(dbType as 'local' | 'production')
    const model = (prisma as any)[tableName]

    if (!model) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    await model.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

