# LOCUS 2026: Campus Profile Hackathon Submisson

```
LOCUSCASE1
```

## Описание
Система для автоматического парсинга, профилирования и анализа кампусов университетов на основе открытых данных и AI. Включает 5 основных критериев, Честную неопределенность (Honest Uncertainty) и мощный алгоритм дедупликации.

## Архитектура и стек
- **Frontend**: React, Next.js (App Router), Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **AI Vision**: Google Gemini Flash 1.5, OpenAI GPT-4o-mini, эвристические фоллбеки.
- **Search APIs**: Serper.dev, Google Custom Search API.

## Особенности реализации
- **Deduplication Engine**: Использует алгоритмы локального хэширования (String-based Hash) для быстрой дедупликации контента вместо долгого пиксельного анализа, что позволяет уложиться в лимит 30 секунд.
- **Honest Uncertainty**: Интегрирован многослойный `trustScore`, который аппаратно отсеивает результаты из недостоверных источников (Pinterest, стоковые агрегаторы, соцсети) в категорию "Требует проверки", оставляя высший балл за `.edu` доменами.

## Запуск
1. `npm install`
2. Настройте ключи `GEMINI_API_KEY`, `OPENAI_API_KEY`, `SERPER_API_KEY` в `.env` (либо вводите через Settings UI).
3. `npm run dev` для локальной проверки или `npm run build && npm start` для теста продакшен-режима.
