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

### Channel-wide pull — 49 Shorts + 8 retention curves (2026-10-04)

Read from YouTube Studio for the whole channel's lifetime. The raw data is in
`out/youtube/*-2026-10-04.csv` (gitignored). The curves were scraped from the
`line-series` SVG path on each video's Engagement tab, scaled through
`getScreenCTM` against the % tick labels, which differ from video to video.

**The ceiling.** 81 342 views over 49 videos: median 982, max 1 586, no
breakout. 84% of the views come from the Shorts feed, where the average view
is 0:23. Search brings 8%, at 0:44. Every reel gets the test batch and none
earns a second one.

**Length vs. the two retention numbers:**

| length | n | stayed to watch | % viewed | likes / 1k views |
|---|---|---|---|---|
| ≤ 45s | 5 | 37% | ~60% | 4.1 |
| 45–65s | 18 | 52% | ~45% | 5.9 |
| 65–85s | 20 | 61% | ~45% | 9.5 |
| 85s + | 6 | 69% | ~50% | 10.5 |

Short reels lose the swipe and long ones lose the middle. The short end is
mostly old country chart-races, which also have the weakest topic. The only
reels that cleared both bars at once (≥ 73% stayed, ≥ 55% viewed) are
«Госдолг США $40 трлн», «90% чипов», «Литр бензина 78 ₽» and «Дрон ALMA».

**By topic.** AI/tech has the best stayed-to-watch (62%) and brought 17 of
the 41 subscribers. Russian-wallet topics (taxes, the rouble, gasoline,
Портнягин) collected 20 of the 37 comments and the most shares.
Country chart-races are the worst at 46%.

**The curves.** Values are % of the viewers who started. They open at
107–132% because the hook gets rewatched.

| video | length | steepest drop | below 50% at | last frame |
|---|---|---|---|---|
| Госдолг США $40 трлн | 86s | −15 at 4–9s | ~65s | 35% |
| 90% чипов | 79s | −21 at 4–8s | ~47s | 30% |
| Литр бензина 78 ₽ (`gasoline-inflation`) | 75s | −26 at 8–11s | ~30s | 36% |
| Дрон ALMA | 55s | −15 at 8–11s | ~27s | 27% |
| Самойлова / Хабиб | 34s | −14 at 3–5s | ~31s | 39% |
| 24 человека в IT (`no-it-in-russia`) | 69s | −24 at 3–7s | ~19s | 10% |
| Банк проверит телефон (`phone-check`) | 82s | −25 at 4–8s | ~23s | 9% |
| NVIDIA обошла Apple (chart-race) | 73s | −34 at 4–7s | **~11s** | 15% |

**On every curve the steepest drop is at 3–11s, the beat right after the
hook.** In each of our own reels that beat explains instead of escalating:

- `gasoline-inflation` `02-shortage`: «Когда топлива меньше… Это обычный
  дефицит», a textbook mechanism right after a personal hook. −26.
- `no-it-in-russia` `02-numbers`: the hook asks «Нейросети убили
  профессию?», and the next beat answers with a statistic. −24.
- `phone-check` `02-date`: an **11-second** sentence about when the law takes
  effect, straight after «Ваш перевод отклонён». −25.

The chart-race shows the same thing with no voice at all. An animated ranking
asks no question, so half the audience is gone by 11s.

The ending separates winners from losers: 30–39% are still there on the last
frame of the reels that hold, and 9–15% on the ones that don't. A question
in the closing beat reaches about one viewer in ten.

## Rules

- **Beat 2 (≈3–10s) escalates; it never explains.** The hook opens a gap,
  and the very next beat must widen it: a personal consequence, a sharper
  number, «и это не худшее». The mechanism («почему так», definitions, dates,
  sources) waits until after ~20s. This is the single largest loss on every
  curve measured. Check it in step 1 by reading beat 2 aloud after the hook:
  if it begins with «Когда…», «С 1 марта…» or a statistic that answers the
  hook's question, rewrite it.
- **No beat longer than 6s in the first third.** `phone-check`'s 11s
  `02-date` is the counter-example. Split a long line or move it later.
- **Don't answer the hook's question early.** Tease the answer, give evidence
  that sharpens it, and close it in the turn. A statistic that settles the
  question at 5s also settles whether to keep watching.
- **Default length is 45–60s.** Even the best curves are near 50% by 47–65s.
  Go past 60s only with a second turn in the back half (see «claim budget»
  below), and say so in *Deviations*.
- **Every hook speaks to the viewer** («Нет машины? Ты всё равно платишь…»,
  «почему дорожает ваша жизнь»). A third-person ranking («Китай обогнал…»)
  is the format with the worst retention on the channel. Use a ranking as
  evidence inside a reel, never as its premise.
- **Loop the last frame into the first, and keep the CTA inside the watched
  span.** Reels that hold end at 30–39%, so a loop turns their tail into
  rewatches. Put the question on screen before ~30s (see the next rule) and
  let the final beat reprise it.
- **Titles carry a searchable term** (a name, a law, an asset). Search
  viewers watch twice as long as feed viewers (0:44 vs 0:23).
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

## TikTok — a different feed, where the hook IS the variable

Read 2026-10-04 (TikTok @kinzarra, 88 YoClips reels in 45 days). Everything
above is YouTube Shorts, and it does not carry over:

| | YouTube Shorts | TikTok |
|---|---|---|
| First seconds | 52–61 % stayed to watch (45–85 s reels) | «Most viewers stopped watching at 0:01» |
| Average view | 0:23 from the feed | **9–14 s at any length** (32 s … 85.5 s) |
| Watched to the end | 30–39 % on the last frame of the reels that hold | 5–7 % |
| Views | median 982, max 1 586 | median 752, ceiling **832** |

| reel (TikTok) | length | average view | watched to end |
|---|---|---|---|
| Госдолг США $40 трлн (face + a counter running up) | 85.5 s | 13.7 s (16 %) | 5.19 % |
| «ИИ вошёл сам» (face) | 50.5 s | 10.8 s | 6.21 % |
| Беднейшие страны (chart, no face) | 45.2 s | 8.8 s | 6.91 % |

Every published hook opened on an empty frame 0, with the claim typing in
by 0.3–1.5 s. On TikTok, therefore, «do not answer a retention number by
re-cutting the hook» does not hold, and neither does «45–60 s by default».
A reel for the TikTok feed follows `short-format.md`: 15–25 s, the claim
whole on frame 0, a loop.

### TikTok pilot (short format, one reel a day)

| reel | posted | length | first frame | average view | to end | views | where they left |
|---|---|---|---|---|---|---|---|
| `portnyagin-sentence-short` | | 17.0 s | (а) face + claim | | | | |
| `ai-starts-war-short` | | 19.0 s | (а) face + claim | | | | |
| `ai-superpowers-short` | | 24.0 s | (б) full-screen type | | | | |
| `gpt-6-astra-office-jobs-short` | | 21.0 s | (а) face + claim | | | | |

## Delivery habit

Pin the first comment yourself — your own opinion or a sharper version of the
question — on any reel whose CTA asks for one. It is the cheapest fix on this
list and it is outside the render.
