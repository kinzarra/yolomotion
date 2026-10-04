# Short format: 15–25 s for the TikTok feed

A reel cut for TikTok follows these rules instead of the YouTube defaults in
`retention.md`. On YouTube Shorts the default stays at 45–60 s: there, reels
of 45 s or less lose the swipe (37 % stayed to watch). The TikTok feed
measures the opposite. Decide which feed the reel is for in step 1, and
write it in the scenario's **format** line.

## Why: the measurement

TikTok @kinzarra, read 2026-10-04 (`docs/tiktok/TZ-800-ceiling.md`): 88 reels
in 45 days, two a day, made by YoClips.

| | value |
|---|---|
| Views, median / max | 752 / **832**, a flat ceiling since 25 August |
| Average view | **9–14 s at any length** (32 s or 85.5 s) |
| Watched to the end | 5–7 % |
| TikTok Studio, «Госдолг США» | «Most viewers stopped watching at 0:01»; ~50 % gone by 1–2 s, ~20 % left at 10 s |
| Length, topic, face | no effect on views: the median is ~750 in every bucket |

~800 is the size of TikTok's first test audience. A reel that does not earn
enough signal from it never gets a second wave. **Every published hook opened
on an empty frame 0**: a face with no text, a dark plate with the headline
still typing in, one reel on pure black. The claim arrived at 0.3–1.5 s, by
which point the viewer had already left.

## The rules

### Scenario
- **3–4 beats, each one a new claim:** claim → turn → number → question.
  There are no setup beats. A fact that does not fit is dropped whole, never
  squeezed or sped up.
- ~50–65 spoken words for the whole reel.
- **The first word of the hook is already the claim.** Rejected openings
  from the channel: a date («Шестнадцатого сентября OpenAI…»), a list
  («Вклад. Квартира. Посылка из-за границы.»), a softener («Плохая
  новость.», which also cost a 0.65 s breath before the claim). The number
  goes in the first sentence, and that sentence is ≤ 8 words.
- The hook carries a **`кадр 0:`** line: the 2–4 words on screen before a
  single word is heard (`кадр 0: **5 ЛЕТ КОЛОНИИ**`).
- The last beat is a question that leads back into the hook's claim, so the
  reel loops.

### Template
- **Frame 0 of the hook:** the claim is drawn WHOLE on the first frame. No
  word-by-word entrance, no counter running up to the number, no date plate.
  Size the type by measuring it, not by estimating. Unbounded ran off the
  plate twice at sizes that «looked» right.
- **Frame 0 already moves:** the face pushes in at full speed from frame 0
  (ease-out over twice its life), and photos drift. The punch lands on the
  frame of the spoken number, found from the clip's RMS envelope (50 ms
  windows), never guessed.
- **The hook line has lead 0:** the first word is the first frame.
- **The face starts with its voice.** Each HeyGen slice is lip-synced from 0
  of its clip. A face dropped on the cut while the voice waits for a
  0.12–0.2 s lead moves its lips 4–6 frames before the sound; the YoClips
  reels v97, v66 and v53 all shipped that way. Put the face's
  `<Sequence from>` on the line's lead.
- **The loop:** the last 0.4 s of the reel is hook frame 0, frozen (`<Freeze
  frame={0}>` around the hook scene inside a final `<Sequence>`).
- 3–4 scenes, each still carrying its kit's graphics. Short does not mean
  bare type.

### First-frame variants
The pilot rotates three, so the numbers can say which holds better:
(а) face + claim, (б) full-screen type with no face, (в) a video clip as the
evidence (`fetch-footage`).

## Where the code is

The engine pieces (`shortTimeline`, `Face` with `from`, `Claim` that measures
and fits, `LoopHold`) live in **YoClips**, `packages/video/src/reel/short.tsx`
(branch `short-format-video-astra`). They are not ported here because the two
engines have diverged: `Claim` needs YoClips' `components/Type`. The four
reference cuts are reels, so they are not in either repo. Their code is in
`yoclips/out/reels-code-2026-10-04.tgz`.

| short | from | length | frame 0 |
|---|---|---|---|
| `portnyagin-sentence-short` | v97, 84 s | 17.0 s | (а) face + «5 ЛЕТ КОЛОНИИ» |
| `ai-starts-war-short` | v66, 44.5 s | 19.0 s | (а) face + «OPENAI ПРИЗНАЛА: 6 ТРЕВОЖНЫХ СЛУЧАЕВ» |
| `ai-superpowers-short` | v71, 83 s | 24.0 s | (б) «$286 МЛРД ЗА ГОД», no face |
| `gpt-6-astra-office-jobs-short` | v53, 66.5 s | 21.0 s | (а) face + «ПЛОХАЯ НОВОСТЬ: ASTRA ДЕЛАЕТ ОФИСНУЮ РАБОТУ САМА» |

To re-cut another published YoClips reel:
`node packages/video/scripts/yoclips-pull.mjs vN --into <yoclips checkout>`.

Pilot success, read from TikTok Studio → Video analysis: average view ≥ 50 %
of length, watched to the end ≥ 25 %, more than 832 views on at least 2 of
10. Log each reel in `retention.md` → «TikTok».
