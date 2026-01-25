import { PrismaClient } from '@prisma/client'

type DbType = 'local' | 'production'

// Кэш для Prisma клиентов
const prismaClients: Map<string, PrismaClient> = new Map()

function createPrismaClientWithUrl(url: string): PrismaClient {
  // Prisma Client читает DATABASE_URL из process.env при создании
  // Сохраняем оригинальное значение
  const originalUrl = process.env.DATABASE_URL
  
  // Временно устанавливаем нужный URL
  process.env.DATABASE_URL = url
  
  // Создаем клиент
  const prisma = new PrismaClient()
  
  // Восстанавливаем оригинальный URL
  if (originalUrl !== undefined) {
    process.env.DATABASE_URL = originalUrl
  } else {
    delete process.env.DATABASE_URL
  }
  
  return prisma
}

export function getPrismaClient(dbType: DbType = 'local'): PrismaClient {
  const cacheKey = dbType
  
  if (prismaClients.has(cacheKey)) {
    return prismaClients.get(cacheKey)!
  }

  // Для локальной БД используем DATABASE_URL из .env
  // Для рабочей БД можно использовать DATABASE_URL_PRODUCTION
  const databaseUrl = dbType === 'production' 
    ? process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL
    : process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL not found for ${dbType} database`)
  }

  const prisma = createPrismaClientWithUrl(databaseUrl)
  prismaClients.set(cacheKey, prisma)
  return prisma
}

export function disconnectPrisma(dbType?: DbType) {
  if (dbType) {
    const client = prismaClients.get(dbType)
    if (client) {
      client.$disconnect()
      prismaClients.delete(dbType)
    }
  } else {
    // Отключаем все клиенты
    prismaClients.forEach((client) => client.$disconnect())
    prismaClients.clear()
  }
}

// Список всех таблиц в схеме
export const TABLE_NAMES = [
  { name: 'users', label: 'Users', modelName: 'user' },
  { name: 'notes', label: 'Notes', modelName: 'note' },
  { name: 'categories', label: 'Categories', modelName: 'category' },
  { name: 'prompts', label: 'Prompts', modelName: 'prompt' },
  { name: 'tags', label: 'Tags', modelName: 'tag' },
  { name: 'votes', label: 'Votes', modelName: 'vote' },
] as const

export type TableName = typeof TABLE_NAMES[number]['name']

// Маппинг имени таблицы в имя модели Prisma
export function getModelName(tableName: TableName): string {
  const table = TABLE_NAMES.find(t => t.name === tableName)
  return table?.modelName || tableName
}

