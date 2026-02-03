# ⚡ Быстрый старт: Деплой на Vercel

## 🎯 Шаги для деплоя

### 1. Подготовка базы данных

```powershell
# Примените миграции к production базе
$env:DATABASE_URL="your_production_neondb_connection_string"
npx prisma db push
```

### 2. Настройка Google OAuth

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials** → Ваш OAuth Client
3. Добавьте в **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### 3. Генерация секретов

```powershell
# Сгенерируйте секрет (используйте для AUTH_SECRET и NEXTAUTH_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Деплой на Vercel

1. **Подключите репозиторий** в [Vercel Dashboard](https://vercel.com/dashboard)
2. **Добавьте переменные окружения:**
   ```
   DATABASE_URL=your_production_neondb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   AUTH_SECRET=your_generated_secret
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
3. **Нажмите Deploy**

### 5. После деплоя

1. Обновите `NEXTAUTH_URL` на реальный домен
2. Перезапустите деплой
3. Проверьте работу приложения

## ⚠️ Важно

- Используйте **разные** секреты для production и development
- `NEXTAUTH_URL` должен быть полным URL с `https://`
- Добавьте redirect URI в Google Console **до** первого деплоя

## 📖 Подробная инструкция

См. [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) для детальной информации.
