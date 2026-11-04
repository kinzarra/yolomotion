# Как разработчики обманывали нас десятилетиями

- **id**: dev-myth
- **format**: landscape (1920×1080), YouTube, ~6 min planned; this file covers the first two beats
- **series**: «ДЕНЬГИ · ПРОСТО», kit chain digital-ruble → serbia-economy → dev-myth/ui (wide twins)
- **hero color**: lime (the current figure, the proof), red (the lie, the loss), thermal paper for labels
- **hook (first 9 s, v2 after the author's note)**: the series object first. Receipt 1 «ОДИН ПРОГРАММИСТ · 254 000 ₽» with the real Хабр Карьера article ringed → receipt 2 «ТА ЖЕ РАБОТА · 100 $» with the real claude.com/pricing card → the face confesses «Я 20 лет в IT. И да: мы вас обманывали. Сейчас докажу.»
- **face**: HeyGen photo look «Podcast host in blue hoodie», Avatar IV, 16:9, 3.9 s, 0.195 $ (author authorised 2026-10-31; variant A chosen, «20 лет» is the author's own figure)
- **full plan**: `PLAN-FRAMES.md` at the repo root (65 frames, 5 parts, fact check); the author's source text is `PLAN.md`

## Beats
1. **bill** (claim) — a thermal receipt prints for one programmer, 254 000 ₽ slams in lime as spoken, the Хабр Карьера article flies in with the median ringed
   - цифра: 254 000 ₽ (медиана backend, Хабр Карьера, 1-е полугодие 2026)
   - улика: `images/dev-myth/habr-salary.png` (screenshot of the article, 2026-10-31)
2. **today** (escalation) — receipt 1 struck through, receipt 2 prints for the same work, the Claude Max card flies in, 100 $ slams in lime
   - цифра: 100 $ (Claude Max; the EU page shows €90, labelled «≈ €90»)
   - улика: `images/dev-myth/claude-max.png` (screenshot of claude.com/pricing, 2026-10-31)
3. **hook** (confession) — the face from the scene's frame 0, type on the left: «Я 20 ЛЕТ В IT» → red stamp «МЫ ВАС ОБМАНЫВАЛИ» → lime stamp «СЕЙЧАС ДОКАЖУ»
   - улика: the HeyGen face, `public/presenter/dev-myth/hook.mp4`
4. **minutes** (escalation) — Claude Code flies in and types the task while its stopwatch races, the developer flies in with a paper month crossed out day by day, then he is crossed out on «месяц»
   - улика: `images/dev-myth/fig-dev.png` (Pexels 5926394, Sora Shimazaki, cut by matte), the terminal, stopwatch and calendar are drawn in the kit

## Voiceover
- `00-bill`: Вот сколько в среднем получал программист: двести пятьдесят четыре тысячи рублей в месяц.
- `00-today`: А вот сколько стоит та же работа сегодня: сто долларов.
- `01-hook`: Я 20 лет в айти. И да: мы вас обманывали. Сейчас докажу. (the face clip, never re-voiced)
- `02-minutes`: Машина делает за минуты то, за что человек брал месяц.

## Presenter
- character: ${HEYGEN_AVATAR_VIEW_ID} (photo, studio), shot `hook`, style `wide` (16:9, added to gen-heygen.mjs 2026-10-31)
- agreed price: 0.195 $ on avatar_iv, within the 0.25 $ cap

## Deviations
- The author's opening («Представьте себе профессию…») moves to beat 3: beat 2 must escalate, not set up (retention.md).
- «Каждый пятый не пишет код без ИИ» is not in the JetBrains 2026 data; replaced by «9 из 10 каждую неделю, 68% каждый день» in PLAN-FRAMES.md.
- Spoken «айти» in the manifest, «IT» on screen. The big number is spelled out in words (author's note 1, 2026-10-31: the clone reads exact digit strings badly); the rounding he first asked for was retracted, 254 000 stays.
- The author's text «За 100 долларов в месяц», «иногда за минуты» moved into the hook block (beats 2 and 4) so the opening escalates on evidence instead of setting up.
