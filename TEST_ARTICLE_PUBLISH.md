# Тестирование публикации статей

## Проблема
Endpoint `/api/rss-publish` недоступен или статья не публикуется.

## Решение

### Вариант 1: Проверка переменных окружения на Vercel

1. Открой Vercel Dashboard: https://vercel.com/dashboard
2. Выбери проект `tm-agency` (или как называется твой проект)
3. Перейди в **Settings** → **Environment Variables**
4. Убедись, что установлены:
   - `OPENAI_API_KEY` - ключ OpenAI API
   - `GITHUB_TOKEN` - токен GitHub (нужен для публикации статей)
   - `GITHUB_REPO` - репозиторий (например, `MasyaLebedeva/tm-agency`)
   - `GITHUB_BRANCH` - ветка (обычно `main`)
   - `GITHUB_AUTHOR_NAME` - имя автора (опционально)
   - `GITHUB_AUTHOR_EMAIL` - email автора (опционально)

5. После добавления переменных:
   - Нажми **"Redeploy"** в проекте
   - Подожди завершения деплоя

### Вариант 2: Тестирование локально

1. Убедись, что у тебя установлены переменные в `.env.local`:
   ```bash
   OPENAI_API_KEY=твой_ключ
   GITHUB_TOKEN=твой_токен
   GITHUB_REPO=MasyaLebedeva/tm-agency
   GITHUB_BRANCH=main
   ```

2. Запусти локальный сервер:
   ```bash
   npm run dev
   ```

3. Открой в браузере:
   ```
   http://localhost:3000/api/rss-publish?count=1
   ```

4. Проверь результат - должен вернуться JSON:
   ```json
   {
     "ok": true,
     "added": 1,
     "queries": ["реклама в телеграм"],
     "ai": true
   }
   ```

### Вариант 3: Проверка логов Vercel

1. Открой Vercel Dashboard → проект → **Deployments**
2. Выбери последний деплой
3. Открой **Functions** → найди `/api/rss-publish`
4. Проверь логи на наличие ошибок

### Вариант 4: Прямой вызов через curl

Если у тебя есть доступ к терминалу с curl:

```bash
curl "https://tmads.ru/api/rss-publish?count=1"
```

Это покажет точную ошибку, если она есть.

## Частые ошибки

### "Missing env vars"
- **Причина:** Не установлены `GITHUB_TOKEN` или `GITHUB_REPO`
- **Решение:** Добавь переменные в Vercel → Settings → Environment Variables

### "OPENAI_API_KEY is required"
- **Причина:** Не установлен ключ OpenAI
- **Решение:** Добавь `OPENAI_API_KEY` в переменные окружения

### "GH get file failed" или "GH put failed"
- **Причина:** Неправильный `GITHUB_TOKEN` или нет доступа к репозиторию
- **Решение:** 
  1. Проверь, что токен правильный
  2. Убедись, что токен имеет права на запись в репозиторий
  3. Проверь, что `GITHUB_REPO` указан правильно (формат: `username/repo`)

## После успешной публикации

1. Проверь GitHub репозиторий:
   - Открой `src/app/blog/blog-data.ts`
   - Должна появиться новая статья в начале массива

2. Проверь сайт:
   - Открой https://www.tmads.ru/blog
   - Новая статья должна быть вверху списка

3. Если статья не появилась сразу:
   - Подожди 1-2 минуты (Vercel может кешировать)
   - Попробуй обновить страницу с Ctrl+F5 (жесткая перезагрузка)

