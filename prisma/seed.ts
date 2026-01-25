import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Создаем или получаем тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: 'seed@example.com' },
    update: {},
    create: {
      email: 'seed@example.com',
      name: 'Seed User',
    },
  })

  const note1 = await prisma.note.create({
    data: {
      title: 'Welcome to ReFitNet',
      ownerId: user.id,
    },
  })

  const note2 = await prisma.note.create({
    data: {
      title: 'This is a sample note',
      ownerId: user.id,
    },
  })

  const note3 = await prisma.note.create({
    data: {
      title: 'Database connection is working!',
      ownerId: user.id,
    },
  })

  console.log('Created notes:', { note1, note2, note3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


