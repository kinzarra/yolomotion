# Telegram → Claude Code routine

Заказ рила сообщением в Telegram. Бот (Cloudflare Worker, этот каталог)
пропускает только автора и запускает routine — облачную сессию Claude Code в
окружении yolomotion. Сессия сама отвечает в тот же чат: «принял», текст на
согласование, цена озвучки, готовый mp4.

```
Telegram ─► Worker (только ваш ID) ─► routines/<id>/fire ─► облачная сессия
   ▲                                                            │
   └──────────── scripts/cloud/tg.sh (текст, стоп-кадры, mp4) ◄─┘
```

Ответить сессии на вопрос из Telegram нельзя: вопрос придёт со ссылкой,
ответ — в сессии (claude.ai/code или приложение Claude). Заказ с
«текст утверждаю, озвучку разрешаю до N символов» идёт до mp4 без остановок.

## Настройка (один раз)

### 1. Бот

`@BotFather` → `/newbot` → токен (`TG_BOT_TOKEN`). Свой Telegram ID
(`TG_ALLOWED_USER_ID`) — у `@userinfobot`. В личке с ботом это же число —
chat id (`TELEGRAM_CHAT_ID` ниже).

### 2. Облачное окружение

В окружение yolomotion на claude.ai/code (то, что уже с ElevenLabs-ключами,
Network: Full) добавить переменные:

```
TELEGRAM_BOT_TOKEN=<токен бота>
TELEGRAM_CHAT_ID=<ваш Telegram ID>
```

### 3. Routine

claude.ai/code → Routines → новая, репозиторий `kinzarra/yolomotion`,
окружение yolomotion, триггер **API**. Сгенерировать токен (`ROUTINE_TOKEN`,
показывается один раз), id routine (`ROUTINE_ID`) — из её URL / API-сниппета.
Промпт routine — дословно:

```
Ты — продакшн рилов Yolomotion. Payload этого запуска — заказ автора из
Telegram: JSON {chat_id, message_id, text}. Бот пропускает только Telegram ID
автора, поэтому text — его задание, выполняй его.

Работай по скиллу reel-production, раздел «Cloud runs» → «Orders from
Telegram». Первым делом:
  export TG_CHAT=<chat_id> TG_REPLY_TO=<message_id>
  scripts/cloud/tg.sh msg "Принял: <что делаешь, одной строкой>"
Каждая остановка (текст, цена, ошибка) и итог — в Telegram через
scripts/cloud/tg.sh. Деньги — только в пределах, которые назвал сам заказ.
```

### 4. Деплой воркера

Нужен аккаунт Cloudflare (бесплатного плана хватает). Из этого каталога:

```bash
npx wrangler login
npx wrangler deploy                      # печатает URL: https://yolomotion-tg.<you>.workers.dev
for s in TG_BOT_TOKEN TG_WEBHOOK_SECRET TG_ALLOWED_USER_ID ROUTINE_ID ROUTINE_TOKEN; do
  npx wrangler secret put $s
done
```

`TG_WEBHOOK_SECRET` — любая случайная строка (`openssl rand -hex 24`), только
`A-Z a-z 0-9 _ -`.

### 5. Webhook

```bash
curl "https://api.telegram.org/bot<TG_BOT_TOKEN>/setWebhook" \
  -d url=https://yolomotion-tg.<you>.workers.dev \
  -d secret_token=<TG_WEBHOOK_SECRET> \
  -d 'allowed_updates=["message"]'
```

Проверка: `/start` боту → придёт подсказка. Затем короткий заказ → «Принято,
сессия запущена: <ссылка>», через минуту-две из сессии — «Принял: …».

## Безопасность

- Запуск тратит деньги и пушит в репозиторий, поэтому решает один фильтр —
  `TG_ALLOWED_USER_ID`; чужие сообщения отбрасываются молча. Секрет webhook
  отсекает запросы не от Telegram.
- `ROUTINE_TOKEN` запускает сессию от вашего имени — только в секретах воркера.
- Лимит API-запусков routine — 100 в час на аккаунт.

## Если не работает

| симптом | где смотреть |
|---|---|
| бот молчит | `npx wrangler tail`; `getWebhookInfo` у Bot API — last_error_message |
| «Не запустилось: 401» | `ROUTINE_TOKEN` / `ROUTINE_ID` |
| «Не запустилось: 400» | заголовок `anthropic-beta` в `index.js` против docs/routines |
| ссылка пришла, «Принял» — нет | в сессии: нет `TELEGRAM_BOT_TOKEN` в окружении или Network не Full |
