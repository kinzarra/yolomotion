# Образ рендер-воркера: Node + ffmpeg + Chrome Headless Shell. Один образ на
# все роли (api / worker / bot — по образцу etl: `command:` в compose решает,
# кем быть контейнеру). Джоб = npm run render -- <compositionId> --props … ;
# per-job аудио приезжает по URL через input props (см.
# .claude/skills/reel-production/references/engine.md, «Server-side
# parameterization»), поэтому бандл кешируется на весь деплой и образ не
# пересобирается под контент.
#
# Сборка ~идентична на amd64 (сервер) и arm64 (локальная проверка): и apt-пакеты,
# и chrome-headless-shell существуют под обе архитектуры.
FROM node:22-bookworm-slim

ENV NODE_ENV=production

# Системный слой: ffmpeg — замер/нормализация клипов (gen-voiceover) и всё,
# чем воркер будет резать аудио; дальше — runtime-библиотеки Chrome Headless
# Shell (официальный список Remotion для Debian); шрифты — эмодзи и fallback,
# основные гарнитуры (@remotion/google-fonts) браузер тянет по сети в рендере.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl ffmpeg \
        libnss3 libdbus-1-3 libatk1.0-0 libgbm1 libasound2 libxrandr2 \
        libxkbcommon0 libxfixes3 libxcomposite1 libxdamage1 \
        libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 \
        fonts-liberation fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && mkdir /app && chown app:app /app

# Всё дальше — под app: npm ci и скачивание браузера пишут в /app, и владеть
# этим должен пользователь, от которого пойдут рендеры (chown -R на готовый
# node_modules стоил бы дороже, чем просто не создавать его root-ом).
USER app
WORKDIR /app

# Слой зависимостей кешируется отдельно от исходников (как в etl): workspaces
# ставятся из корневого lock-файла, пересборка — только при его изменении.
COPY --chown=app:app package.json package-lock.json ./
COPY --chown=app:app packages/video/package.json packages/video/package.json
COPY --chown=app:app packages/renderer/package.json packages/renderer/package.json
RUN npm ci --no-audit --no-fund && npm cache clean --force

# Исходники. public/ в git отсутствует (ассеты не в репо) — образ этого не
# требует: сгенерированные durations.ts/presenter.ts закоммичены, а аудио
# джоба приходит по URL. Если собирать локально с наполненным public/, он
# просто запечётся и старые рилы будут рендериться и без URL-ов.
COPY --chown=app:app . .

# Вшиваем Chrome Headless Shell на сборке, а не при первом джобе: рендер не
# должен зависеть от доступности CDN браузера в момент, когда человек ждёт
# видео в чате.
RUN npx remotion browser ensure

# Смоук на живом образе (задать другой compositionId — --build-arg):
#   docker run --rm <image> npm run render -- logo-sting-reel --out /tmp/t.mp4
# В compose роль задаётся command:-ом; дефолт печатает usage рендер-CLI.
CMD ["npm", "run", "render"]
