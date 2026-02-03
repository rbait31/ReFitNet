# Настройка переменных окружения в Vercel

## ✅ Миграции применены

Миграции успешно применены к production базе данных.

## 📋 Переменные окружения для Vercel

Все переменные окружения подготовлены в файле `vercel-env-variables.txt`.

### Как добавить переменные в Vercel:

#### Вариант 1: Через Dashboard (рекомендуется)

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте каждую переменную:
   - Нажмите **"Add New"**
   - Введите **Name** (например, `DATABASE_URL`)
   - Введите **Value** (скопируйте из `vercel-env-variables.txt`)
   - Выберите **Environment**: Production, Preview, Development (или все)
   - Нажмите **"Save"**

5. Повторите для всех переменных из `vercel-env-variables.txt`

#### Вариант 2: Через Vercel CLI

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Добавьте переменные (замените значения)
vercel env add DATABASE_URL production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add AUTH_SECRET production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

## ⚠️ Важные замечания

### 1. NEXTAUTH_URL

**КРИТИЧЕСКИ ВАЖНО:** После деплоя обновите `NEXTAUTH_URL` на ваш реальный домен:

```
# Замените на ваш домен:
NEXTAUTH_URL=https://your-project.vercel.app
# Или кастомный домен:
NEXTAUTH_URL=https://refitnet.com
```

### 2. Google OAuth Redirect URI

После деплоя добавьте в Google Console новый redirect URI:

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в **APIs & Services** → **Credentials**
3. Найдите ваш OAuth 2.0 Client ID
4. В разделе **Authorized redirect URIs** добавьте:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
   Замените `your-project.vercel.app` на ваш реальный домен Vercel

### 3. Секреты

- Используются **разные** секреты для production (сгенерированы новые)
- Development секреты остаются в локальном `.env`
- **НЕ коммитьте** секреты в Git

### 4. База данных

- Production база данных уже настроена
- Миграции применены
- Connection string указан в переменных окружения

## 🔄 После добавления переменных

1. **Перезапустите деплой:**
   - В Vercel Dashboard → Deployments → выберите последний деплой → "Redeploy"
   - Или сделайте новый commit и push

2. **Проверьте работу:**
   - Откройте ваш домен Vercel
   - Перейдите на `/login`
   - Попробуйте войти через Google
   - Проверьте, что все работает

## 📝 Список переменных

Все переменные из `vercel-env-variables.txt`:

- ✅ `DATABASE_URL` - Production connection string
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- ✅ `AUTH_SECRET` - Production secret (новый)
- ✅ `NEXTAUTH_SECRET` - Production secret (новый)
- ⚠️ `NEXTAUTH_URL` - **Нужно обновить на ваш домен!**

## 🚀 Готово к деплою!

После добавления всех переменных окружения проект готов к деплою на Vercel.


