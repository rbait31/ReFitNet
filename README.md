# ReFitNet

Минимальный рабочий проект на Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Технологии

- **Next.js 14** (TypeScript, App Router)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (деплой)

## Структура проекта

```
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница с запросом к БД
│   └── globals.css     # Глобальные стили
├── lib/
│   └── prisma.ts       # Prisma Client (singleton)
├── prisma/
│   ├── schema.prisma   # Схема БД (модель Note)
│   └── seed.ts         # Seed скрипт для заполнения БД
├── .env.example        # Пример переменных окружения
├── package.json
├── tsconfig.json
└── vercel.json         # Конфигурация для Vercel
```

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

1. Создайте базу данных на [NeonDB](https://neon.tech)
2. Скопируйте connection string
3. Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 3. Настройка Prisma

Создайте миграцию и примените схему:

```bash
# Создать и применить миграцию
npm run db:migrate

# Или использовать db:push для разработки (без миграций)
npm run db:push
```

### 4. Заполнение базы данных (seed)

```bash
npm run db:seed
```

### 5. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Деплой на Vercel

### 1. Подготовка

1. Убедитесь, что проект закоммичен в Git
2. Создайте аккаунт на [Vercel](https://vercel.com)

### 2. Деплой

1. Импортируйте репозиторий в Vercel
2. Добавьте переменную окружения `DATABASE_URL` в настройках проекта:
   - Settings → Environment Variables
   - Добавьте `DATABASE_URL` со значением connection string от NeonDB
3. Vercel автоматически определит Next.js проект и выполнит сборку

### 3. После деплоя

После успешного деплоя выполните миграцию и seed на продакшен БД:

```bash
# Установите Prisma CLI глобально (если еще не установлен)
npm install -g prisma

# Выполните миграцию на продакшен БД
npx prisma migrate deploy

# Заполните БД данными (опционально)
DATABASE_URL="your-production-database-url" npm run db:seed
```

Или используйте Prisma Studio для управления данными:

```bash
npx prisma studio
```

## Доступные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск продакшен версии
- `npm run db:push` - применить схему Prisma к БД (без миграций)
- `npm run db:migrate` - создать и применить миграцию
- `npm run db:seed` - заполнить БД тестовыми данными

## Примечания

- Prisma Client генерируется автоматически при установке зависимостей (`postinstall`)
- На Vercel сборка включает генерацию Prisma Client (`buildCommand` в `vercel.json`)
- Используется singleton паттерн для Prisma Client для избежания множественных подключений
