import { PrismaClient, Visibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test data...')

  // Создаем тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })
  console.log('✓ Created user:', user)

  // Создаем категорию (опционально)
  const category = await prisma.category.upsert({
    where: { category: 'Fitness' },
    update: {},
    create: {
      category: 'Fitness',
    },
  })
  console.log('✓ Created category:', category)

  // Создаем тестовый промпт
  const prompt = await prisma.prompt.create({
    data: {
      title: 'Test Recovery Workout',
      content: 'This is a test recovery workout prompt content.',
      description: 'A sample recovery workout for testing purposes',
      ownerId: user.id,
      categoryId: category.id,
      visibility: Visibility.PUBLIC,
      publishedAt: new Date(),
    },
  })
  console.log('✓ Created prompt:', prompt)

  // Создаем голос (vote) для промпта
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      promptId: prompt.id,
      value: 1,
    },
  })
  console.log('✓ Created vote:', vote)

  // Создаем тестовую заметку
  const note = await prisma.note.create({
    data: {
      title: 'Test Note',
      ownerId: user.id,
    },
  })
  console.log('✓ Created note:', note)

  console.log('\n✅ Test data created successfully!')
  console.log('\nSummary:')
  console.log(`  User: ${user.email} (${user.id})`)
  console.log(`  Prompt: ${prompt.title} (${prompt.id})`)
  console.log(`  Vote: ${vote.value} (${vote.id})`)
  console.log(`  Note: ${note.title} (${note.id})`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error creating test data:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

