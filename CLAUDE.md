# Yolomotion — студия рилсов (Remotion)

npm-workspaces monorepo: `packages/video` — Remotion (движок `src/reel/` +
единственный шаблон `digital-ruble`, «ДЕНЬГИ · ПРОСТО»), `packages/studio` —
веб-панель, `packages/renderer` — рендер, `packages/worker` — очередь рендера
на сервере. Подробности команд, сервера и все накопленные уроки —
`.claude/skills/reel-production/references/handbook.md` (читать по нужде, не
целиком).

## Как приходит заказ

1. Автор заводит бриф в панели (`npm run panel` → http://127.0.0.1:4400).
   Панель кладёт его в `studio/briefs/<id>/`: `brief.md`, `files/` (фото,
   видео, скрины), `status.json`, `PROMPT.txt`.
2. Автор пишет здесь: «собери studio/briefs/<id>».
3. Порядок чтения: **`studio/PLAYBOOK.md` → `brief.md` → skill
   `reel-production`**. Playbook — инструкция автора, она главнее скиллов и
   справочников: при противоречии побеждает Playbook.
4. По ходу работы обновляй `status.json` брифа (`new → writing → review →
   rendering → done`, поле `note` — одна строка, что сейчас происходит);
   любой mp4 на проверку (и превью хука, и финал) — только `out/<id>.mp4`,
   автор смотрит его в панели. В `~/Downloads` не копировать.
5. Правки автор рисует прямо на кадрах в панели: `studio/briefs/<id>/notes/`
   — `notes.json` (время, кадр, текст, `done`) + `NN-t<сек>.png` (кадр
   1080×1920 с обводками). «Внеси правки» = открыть каждую открытую пометку
   картинкой, исправить, перерендерить `out/<id>.mp4`, поставить `done: true`.
6. `brief.md` панель пересобирает из полей формы при каждом сохранении —
   свои заметки (сценарий, факты, лицензии ассетов) Claude держит в
   `studio/briefs/<id>/WORK.md`, его панель не трогает.

## Правила

- Новый рилс = новый выпуск серии на ките `digital-ruble`
  (`export * from "../digital-ruble/ui"`, палитра ре-экспортом). Не изобретать
  новый ui-кит. Пайплайн: skill `reel-production`; перед любым кодом Remotion —
  `.claude/skills/remotion-motion-graphics/SKILL.md` (10 правил + цикл
  render → stills → inspect → fix).
- **Сначала текст**: сценарий на русском уходит в бриф/сценарий на правки
  автора до любой сборки. **Первый вопрос — лицо** (HeyGen / сам снимает / без
  лица), даже если бриф его не задаёт.
- **Каждый бит несёт что-то настоящее** — клип, фото или большое число; ≥ 4
  клипа на 60 с, фото всегда в движении, каждая произнесённая цифра на экране,
  эффект на каждой склейке (`references/footage.md`).
- **Всё платное (ElevenLabs, HeyGen, AI-видео) — сначала смета из dry run и
  подтверждение автора.** После — сказать, сколько списалось.
- Голос — только `${ELEVENLABS_VOICE_ID}` (клон автора). Только голос: без
  музыки и SFX.
- **Никаких длинных тире (—) и «ИИшности»** ни в кадре, ни в заголовках, описаниях,
  манифестах и заметках (автор, 2026-10-17): запятая, двоеточие, точка или перенос
  строки. Числа в манифесте озвучки — цифрами, не словами (ударение).
- Длительности клипов — только в генерируемом `templates/<id>/durations.ts`,
  руками не трогать. Цвета, изинги, пружины — только из `theme.ts` / палитры.
- Шаблон = папка `templates/<id>/` (zod `schema.ts`, компонент,
  `defineTemplate`), регистрация в `templates/index.ts`, id композиции
  `<template>-<format>`.
- Рилсы не коммитятся: код + mp4 + купленные ассеты уходят в S3
  (`npm run deliver -- <id>`). Бинарники в git — никогда.
- Unbounded (`theme.fonts.wide`) без `₽ ≠ − ↑↓` и шире, чем кажется
  (~0.78em на заглавную кириллицу): ставь `theme.fonts.mono` за ним и проверяй
  стиллом, не на глаз.
- Экономно: батч-чтения, стиллы контакт-листом, без лишних рендеров старого.

## Команды (из корня)

| команда | что делает |
|---|---|
| `npm run panel` | веб-панель студии (брифы, Playbook, готовые ролики) |
| `npm run studio` | Remotion Studio |
| `npm run new-reel -- <id> --name "…" --beats a,b,c` | каркас рилса |
| `npm run voiceover -- scripts/voiceover/<id>.json` | озвучка ElevenLabs → `durations.ts` (`--durations-only`, `--only=`) |
| `npm run stills -- <compId> --every 2.5` | кадры для проверки (один бандл) |
| `npm run render -- <compId> [--props f.json] [--out f.mp4]` | рендер локально |
| `npm run heygen -- scripts/presenter/<id>.json --dry-run` | смета/генерация аватара |
| `npm run fetch-footage -- search <id> "<q>"` | легальный футаж (Pexels/Pixabay/Commons) |
| `npm run tiktok -- …` | исследование TikTok (только анализ) |
| `npm run deliver -- <id> [--restore]` | рилс в S3 / обратно |
| `npm run worker*` | очередь рендера на сервере (handbook → Render worker) |

## Архив (чистка 2026-10-15)

Всё, кроме `digital-ruble`, удалено с диска и лежит в
`s3://yoclips/yolomotion/archive/2026-10-15/` (файлы по путям репо +
`code.patch` против `code.base`). Рилсы, названные в handbook/скиллах
«референсом», берутся оттуда в отдельный чекаут.
