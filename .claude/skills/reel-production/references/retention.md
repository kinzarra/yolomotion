# Retention — what the published reels actually measured

Analytics from YouTube Shorts, mapped back onto the beat timeline that
produced them. This file is evidence, like `footage.md`: every rule below is
a number from a published video, not a best practice. Add a row when a reel
comes back with data.

## Measured

### `no-it-in-russia` — «24 человека на 1 вакансию в IT» (ВЫПУСК 05)

Published 2026-08-23, read on 2026-08-24, first hours after publication.

| | this reel | channel typical |
|---|---|---|
| Views | 1 242 | 1 225 |
| Stayed to watch (выбор в ленте) | 70.4% | 70.3% |
| Average view duration | 30s | 30s |
| Length | 68.5s | — |
| AVD as % of length | **44%** | — |
| Likes / comments | 20 / **0** | — |

The hook is not the problem. 70.4% stayed-to-watch is exactly the channel's
norm, and views are on trend. The loss is in the middle, and the AVD lands on
a specific frame.

**Where 30s falls.** Beat starts derived from `SCENES` in `timeline.ts`:

| beat | from → to | what it does |
|---|---|---|
| hook | 0.0 → 5.0 | face + «24 ЧЕЛОВЕКА НА 1 ВАКАНСИЮ» |
| numbers | 5.0 → 11.5 | −32%, résumés rain — **claim** |
| break | 11.5 → 15.5 | «виноват не только ИИ» — setup |
| economy | 15.5 → 23.0 | заморозка найма — setup |
| tasks | 23.0 → 31.5 | код / тесты / доки — setup ← **AVD 30s lands here** |
| insight | 31.5 → 40.5 | «ИИ отменяет вакансию второго» — **the turn** |
| junior | 40.5 → 49.0 | лестница без нижних ступеней |
| factcheck | 49.0 → 56.5 | 700 000 вакансий, лаймовый штамп |
| answer | 56.5 → 63.0 | IT НЕ УМЕР / ПЛАНКА ВЫРОСЛА |
| cta | 63.0 → 68.5 | ПОШЛИ БЫ В IT? ДА / НЕТ |

Two facts follow directly from that table:

1. **The best line in the reel starts at 31.5s — after the average viewer has
   left.** «ИИ не увольняет программиста, он отменяет вакансию второго» is the
   whole reason the video exists, and roughly half the audience never heard it.
2. **The CTA sits at 63.0s — 92% of the way in.** 0 comments under an explicit
   «напишите да или нет» is not an audience that ignored the question; it is an
   audience that was never shown it.

Between them, `break + economy + tasks` = **20 seconds (29% of the reel) of
consecutive setup with no new claim**. That stretch is the drop-off.

## Rules

- **The turn lands before the average exit.** The single strongest line — the
  reveal, the reframe, the thing the reel is for — belongs in the first third:
  by ~15–20s in a 60–70s Short, by ~8s in a 30s one. In `no-it-in-russia`
  `insight` should have been beat 3 (≈13s), not beat 6.
- **Two setup beats maximum in a row, ~10s.** After that the reel owes the
  viewer another claim, number or turn. Count consecutive explanatory beats in
  step 1 before the beats are sized, not after the render.
- **Plant the question before the drop-off, close on it at the end.** Put the
  reel's discussion prompt on screen once around the AVD mark (~25–30s in a
  70s reel) and keep the CTA scene as the reprise. A question asked only in
  the last beat is asked of half the audience.
- **Hold one hard number for the 40–50s window.** The tail needs a reason to
  exist. `factcheck` at 49.0s is the shape to keep — the fix is to pair it
  with an earlier turn, not to move it.
- **Length is a claim budget, not a clock.** 68.5s carried one turn. If a
  brief cannot supply a second turn for the back half, cut the reel to ~45s so
  the CTA falls inside the watched span. Say which in *Deviations*.
- **Do not answer a retention number by re-cutting the hook.** When
  stayed-to-watch is at norm, the hook is working; changing it trades a
  measured strength for a guess.
- **Do not answer a retention number with B-roll.** Platform advice will
  suggest "визуальные перебивки" for a slow middle. The footage rule stands
  (`footage.md`): B-roll is evidence for a specific line or it does not go in.
  A sagging middle is an ordering problem in the scenario, and it is fixed
  there.

## Delivery habit

Pin the first comment yourself — your own opinion or a sharper version of the
question — on any reel whose CTA asks for one. It is the cheapest fix on this
list and it is outside the render.
