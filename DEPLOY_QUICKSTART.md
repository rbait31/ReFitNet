# 🚀 Быстрый деплой на Vercel

## Шаг 1: Подготовка базы данных

```bash
# Примените схему к production базе
DATABASE_URL="your_production_connection_string" npx prisma db push
```

## Шаг 2: Настройка Google OAuth

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Добавьте в **Authorized redirect URIs**:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

## Шаг 3: Деплой на Vercel

### Через Dashboard:

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Нажмите **"Add New Project"**
3. Подключите ваш Git репозиторий
4. В разделе **Environment Variables** добавьте:

```
DATABASE_URL=your_production_neondb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=your_generated_secret
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

5. Нажмите **"Deploy"**

### Через CLI:

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите
vercel login

# Деплой
vercel --prod
```

## Шаг 4: Проверка

1. Откройте ваш домен Vercel
2. Перейдите на `/login`
3. Войдите через Google
4. Проверьте работу приложения

## ⚠️ Важно

- `NEXTAUTH_URL` должен быть вашим production доменом
- Используйте разные секреты для development и production
- Не коммитьте `.env` файл в Git

Подробная инструкция: см. `VERCEL_DEPLOY.md`

