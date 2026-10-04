---
name: tiktok-research
description: Research TikTok and adapt what works into Yolomotion reels — pull a creator's posts, search a topic or hashtag, rank videos by views/ER/saves/shares, read top comments, download one video for frame-by-frame analysis, then turn the winning pattern into a scenario. Use whenever the user mentions TikTok, a tiktok.com link, a creator handle, «что залетает», trends, competitors, «адаптируй», «разбери ролик», or wants ideas for the next reel from real data.
---

# TikTok research → adaptation

Data comes from RapidAPI «Tiktok Scraper» (tikwm, host
`tiktok-scraper7.p.rapidapi.com`) through one script:
`packages/video/scripts/tiktok.mjs`, run as `npm run tiktok -- …` from the repo
root. Key: `RAPID_TIKTOK_KEY` (env or repo-root `.env`). Plan PRO — 3 000 000
requests a month, the remaining quota prints after every command. A command is
1–5 requests, so do not ration it, but do not loop hundreds of pages either.

Everything lands in `out/tiktok/` (gitignored): the full JSON of each call plus
a flat `rows` array — the fields an analysis needs.

## Commands

| what | command | requests |
|---|---|---|
| a creator: profile + posts | `user <handle> [--count 30] [--pages 3] [--sort hot]` | 1 + pages |
| a topic | `search "<query>" [--region ru] [--days 7\|30\|90] [--sort likes\|date] [--pages 2]` | pages |
| a hashtag | `hashtag <name> [--count 30] [--pages 2]` | 1 + pages |
| a sound | `music <url\|id>` | 2 |
| the For You feed | `fyp --region ru` | 1 |
| one video + comments | `video <url\|id> [--comments 100]` | 1 + ⌈n/50⌉ |
| one video to analyse | `grab <url\|id> [--every 0.5]` | 1 |
| anything else | `raw </route> key=value …` | 1 |

The table every list command prints, sorted by views:

```
    views    ER   save  share   dur  date        caption
★  115.0M  11.5%  0.45%  0.73%    6s  2026-09-20  scariest meal of my life …
```

- **★** — at least 3× the median views of that list. Outliers are the signal;
  the median is the creator's or the topic's baseline.
- **ER** = (likes + comments + shares + saves) / views.
- **save** = saves / views: «полезно, пересмотрю». High on explainers, lists,
  money advice — our genre. Above ~1% is strong.
- **share** = shares / views: «надо показать другу». Above ~1% means the idea
  travels on its own; that is what to borrow first.
- `dur 0s` is a photo carousel.

`grab` writes `out/tiktok/videos/<id>/`: `video.mp4` (original quality,
no watermark), `sheet.png` (one frame per `--every` seconds, 6 across),
`hook.png` (the first 3 s at 10 fps — where retention is won), `audio.wav`
(16 kHz mono, ready for `scripts/transcribe.swift` — see CLAUDE.md for the
.app-bundle requirement), `meta.json`.

## The analysis loop

1. **Find the outliers.** `user` for a competitor (`--pages 3` ≈ 90 posts),
   `search` / `hashtag` for a topic (`--days 30 --sort likes`). Note the
   median and every ★.
2. **Ask why each ★ won** — not «it is popular» but which lever:
   - *Hook* — what is on screen and said in the first 1–2 s (`hook.png`).
   - *Format* — talking head, faceless graphics, screen record, POV, list,
     before/after, reaction, duet. Length vs the creator's median.
   - *Promise* — the caption and the first line: a number, a conflict, a
     secret, «вы делаете это неправильно».
   - *Proof* — what makes it believable: a document, a chart, a famous face.
   - *Comments* — `video` prints the top comments by likes. The top comment is
     usually the real takeaway, the joke or the objection; it is the next
     reel's hook more often than the video itself.
   - *Sound* — original voice vs a trending sound (`music` shows how many
     videos use it).
3. **Look before you conclude.** `grab` the 2–3 strongest and read
   `sheet.png` / `hook.png` with the Read tool. Count the cuts, the seconds
   to the first number, where the face is, how big the type is.
4. **Write it down** in `packages/video/scripts/scenarios/<id>-research.md`:
   sources (URL, views, ER, save, share), the pattern in one sentence, what we
   keep, what we change. That file is the brief's evidence.

## Adapting into a reel

Adapt the **mechanism, never the material**:

- Keep: the hook structure («X — не Y, а Z»), the beat order, the pace (cuts
  per second), the kind of proof, the length band, the question at the end.
- Replace: the words (our text, in the author's voice), the visuals (our
  look — `src/looks` or the series kit), the footage (licensed — `npm run
  fetch-footage`), the face (HeyGen, full-screen by default).
- Then hand over to `reel-production`: the research file becomes the
  scenario's source, retention rules still apply (`references/retention.md`
  — the turn and the question before 30 s).

## Hard rules

- **A TikTok video is never footage.** No clip, frame, sound or screenshot
  of someone else's video goes into a reel — Content ID claims and strikes.
  `grab` exists only to look at it. If a reel needs to *cite* a TikTok, redraw
  the UI and show the numbers, as the series does with product UI.
- **No people's faces from research in a reel**, and no verdicts about named
  creators on screen («накрутка», «боты») — that is a claim about a person.
- **Numbers on screen come from the JSON**, with the date of the pull. TikTok
  counts move; write «на 4 октября 2026».
- Show the author the table and the 2–3 ★ with links before proposing a
  script; let them pick what to adapt.

## API notes (checked 2026-10-04)

- `ads/trends/videos | hashtag | sound | creators` answer «This endpoint has
  been deprecated» — there is no trend chart. Use `search --days 7 --sort likes`
  and `hashtag` instead.
- `/feed/list` (FYP) for `region=ru` returns old (2022) videos — weak signal.
- `/ads/top/ads` needs `page` in addition to the documented params.
- Search accepts Cyrillic; `region` biases results but does not filter.
- All 34 endpoints with their parameters: `references/endpoints.md`.
