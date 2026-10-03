# Yoloco Explorer — любые блогеры за 3 минуты

- **id**: yoloco-explorer (EN) + yoloco-explorer-ru (RU): одни биты, одни визуалы, разная озвучка
- **format**: reel (1080×1920), 51.0s, Shorts / Reels / TikTok
- **series**: standalone product promo; kit re-exported from `yoloco-mcp` (Yoloco brand)
- **hero color**: Yoloco violet #6071FF; Excel green only on the export button + sheet header
- **voice**: RU — house clone `C5E5SzeWkb4qtqn6iyao`; EN — the author's voice `vEwyfyXy2Qc8PnNvEdqA`
- **face**: none. The cartoon Philipp from `yoloco-mcp` appears softly in the CTA only
- **status**: ✅ RU text approved with the author's edits (2026-10-02) → EN translated → both cuts rendered (EN 57.5s, RU 51.5s): `out/yoloco-explorer-reel.mp4` (EN), `out/yoloco-explorer-ru-reel.mp4` (RU)

---

## ✏️ ТЕКСТ НА СОГЛАСОВАНИЕ (RU), правьте прямо здесь

Правьте строки после «Озвучка:» и «На экране:». Время в скобках — черновой замер.

### 1. hook — 0–7.5s (6.9s речи)
**Озвучка:** МЫ НАЙДЕМ ЛЮБЫХ блогеров за ТРИ минуты. Таксисты из Нигерии. Мамочки из Австралии. Финансисты из Нью-Йорка. Засекайте!
**На экране:** три запроса сменяют друг друга резкими склейками, вокруг каждого собирается рой блогеров → ЛЮБЫЕ БЛОГЕРЫ · 3:00

### 2. prompt — 7.5–15.5s (7.6s)
**Озвучка:** Это ёЛОКО ПОДБОР. Опишите своими словами, каких блогерво ищете. ИИ разберёт бриф и сам СОБЕРЕТ сам подборку блогеров.
**На экране:** карточка «Каких блогеров ищем?», печатается запрос → чипы «AI понял так»: страна, язык, размер, 4 соцсети → нажатие «Запустить поиск»

### 3. results — 15.5–23.5s (7.6s)
**Озвучка:** Он прочёсывает Инстаграм, ТикТок, Ютуб и Телеграм, и приносит блогеров к вам на БЛЮДЕЧКЕ. У каждого оценка и причина, почему он подходит.
**На экране:** этапы поиска + счётчики по сетям (276 кандидатов → 33) → карточки с кольцом оценки и строкой «почему подходит»

### 4. pick — 23.5–27s (2.6s)
**Озвучка:** Оставить или вычеркнуть. Одно касание. ЭТО ТИНДЕР для Маркетолога - свайпать влево или вправо! 
**На экране:** свайпы ✓ Оставить (фиолетовый) / ✕ Вычеркнуть (карточка гаснет и зачёркивается)

### 5. more — 27–33s (5.4s) ⭐ киллер-фича
**Озвучка:** Жмёте «Найти ещё». ИИ учится на вашем выборе, и каждый раунд точнее.
**На экране:** «AI учтёт ваш выбор: ✓ 3 · ✕ 2» → «Раунд 2» → новые карточки с бейджем НОВЫЙ, оценки выше

### 6. export — 33–37.5s (4.0s)
**Озвучка:** Выгрузка в Эксель, и почты уже внутри. Можно сразу писать.
**На экране:** «Выгрузить в Excel» → таблица, колонка Email заполняется построчно

### 7. cta — 37.5–43s (4.7s)
**Озвучка:** ёЛОКО Подбор. Любые блогеры за три минуты. Ссылка в профиле.
**На экране:** Yoloco + EXPLORER, app.yoloco.ru/explorer; мультяшный Филипп выглядывает сбоку

### Вопросы
- Ударение «Йо́у-ло́ко»: ок на слух?
- Ссылка: RU — app.yoloco.ru/explorer, EN — app.yoloco.io/explorer?

---

## EN cut (translation of the approved RU text)
1. We'll find any creators, in three minutes. Taxi drivers in Nigeria. Moms in Australia. Finance pros in New York. Start the clock!
2. This is Yoloco Explorer. Describe the creators you need, in your own words. The AI reads the brief and builds the shortlist for you.
3. It scans Instagram, TikTok, YouTube and Telegram, and serves the creators up on a plate. Each one with a score, and a reason why they fit.
4. Keep or reject. One tap. It's Tinder for marketers: swipe left, or swipe right!
5. Hit Find more. The AI learns from your picks, and every round gets sharper.
6. Export to Excel, with emails already inside. Ready for outreach.
7. Yoloco Explorer. Any creator, in three minutes. Link in bio.

## How it is built
- One template folder, two registry entries: `yoloco-explorer-reel` (EN) and `yoloco-explorer-ru-reel` (RU), `lang` prop. Beats = max(EN, RU clip) so the film is identical; `copy.ts` holds every on-screen string (the app's own i18n values).
- The UI is redrawn 1:1 from the app (`ExplorerBloggerCard`, `ExplorerRunProgress`, `Step1Brief`/`Step2Refine`, `ExplorerRefineDialog`, report header + tabs), at phone CSS px, scaled ×2.3 inside a browser card with the real URL. Reference screenshots taken from the live report on 2026-10-02.
- «Засекайте!» became a stopwatch that starts on the word, rides above the app and stops at 2:47 when the export lands (a real run measured ~2.5 min).
- QR: `qr-en.ts` → app.yoloco.io/explorer/new, `qr-ru.ts` → app.yoloco.ru/explorer/new, both decoded by `qrcheck` from frames of the mp4.

## Facts behind the copy (from the code, 2026-10-02)
- Networks: Instagram, TikTok, YouTube, Telegram (`core/schemas.py` platforms)
- Real run «мамочки-блогеры для рекламы подгузников»: ~2.5 min end to end, 276 candidates → 178 enriched → 82 scored → 33 results; UI says «обычно 1–4 минуты» → «3 минуты» is honest
- Score 0–100 + one-line reason per creator; Keep / Reject with reason codes; «Найти ещё» sends seeds / negatives / exclude to the next round
- Email: from bio, contacts and the last 5 posts; YouTube contacts lookup
- Export: Excel only

## Deviations
- Voice, round 3 (2026-10-02). EN: eleven_v3 + language_code en (the Russian-recorded clone lost its accent; ASR word error 17.5% → 8.8%), brand spelled «Yolocko» = «Йо́у-ЛО-ко» per the author. RU: eleven_v3 + language_code ru + audio tags and «!» for energy — pitch range 6.7 → 9.5 semitones on average; brand «Йо́у-ло́кко Подбо́р», «И И» for ИИ. 2–4 takes per line, kept by ASR accuracy, then by pitch range. Timing is per language now (beats derived from each cut's clips).
- Brand in RU is «Ёлоко Подбор» (author's edit). Spelled «Йо-ло́-ко Подбо́р» in the manifest: «Ёло́ко» and «Ё-ло́-ко» come back from ASR as «ёлка»; «Йо-ло́-ко» keeps three syllables. «ИИ» is spelled «И-И» (else one «и» is read). EN: «Yolo-co», «A.I.» (ASR heard «Yoko» / «the islands»). Captions show the real spelling. ASR cannot confirm stress or the brand fully — the author confirms by ear.
- 51s instead of ~43s: the author's edits lengthened the hook, results and pick lines; beats grew with the measured clips.
- Product colours kept as the app paints them (emerald kept ring, rose rejected, score tones green/lime/yellow, Excel green), because the brief asked for the real interface. The reel's own type and chrome stay one-hero violet.
- Demo brief is «fitness bloggers from Miami» rather than one of the hook's three slogans: the licensed portraits on hand (Pexels, from yoloco-mcp) fit it, and no third-party face is invented for a taxi driver.
- Demo creators: Pexels portraits reused from `yoloco-mcp`; only faceless photos get struck; handles invented.
