---
name: reel-production
description: Turn a written scenario into a finished Yolomotion reel (vertical voiceover short) end to end — scaffold the template, synthesise the voiceover in the house voice, build the timeline and scenes, verify by stills, render. Use this whenever the user brings a script, scenario, brief, or idea for a video/Short/Reel in this repo, or asks to change one that already exists. Read it BEFORE remotion-motion-graphics; that skill supplies the motion craft, this one supplies the pipeline.
---

# Reel production

The repo has a reel engine (`packages/video/src/reel/`) and a scaffolder, so
producing a reel from a scenario is a fixed sequence of steps. Everything
mechanical — scene start arithmetic, clip durations, caption plumbing, the
grade/grain/vignette stack, the voiceover track — is already solved. **The only
work per reel is the scenario: palette, beat lengths, and the scenes.**

Read `.claude/skills/remotion-motion-graphics/SKILL.md` before writing any
scene code. Its 10 rules apply in full, with one standing exception below.

## Standing decisions (do not re-litigate)

- **Voiceover only.** No music bed, no SFX. This overrides the motion skill's
  mandatory sound-design layer. The user's cloned voice carries the whole track.
- **The voice is always `C5E5SzeWkb4qtqn6iyao`** (listed in the ElevenLabs
  account as `yoclips-5b48065a`). Never pick from the voice list; `me_v3` looks
  like the personal clone and is the wrong one. `new-reel` writes the right id
  into the manifest for you.
- **Format**: `reel`, 1080×1920, 30fps, ~30s. Composition id is `<id>-reel`.
- **One hero color per reel**, at most one glowing element per frame. A second
  signal color (a "bad"/problem color) is allowed only if it is equally scarce.
- Colors, easings and springs come from `packages/video/src/theme.ts` and the
  reel's own `palette.ts`. Never inline a hex or an easing in a scene.
- **Footage is evidence, not wallpaper.** A photo, screenshot or clip goes in
  only when it proves a specific spoken line, lasts exactly that line, is
  graded into the palette, and was named in the scenario. Never sprinkle
  B-roll into a finished reel to make it "less graphic" —
  `references/footage.md`.
- **A face costs money; the price is agreed before it is spent.** Run the
  HeyGen dry run, quote the figure and the engine, wait for the answer. The
  avatar lip-syncs to the house clips, never to HeyGen TTS.
- **The turn lands in the first third.** The reel's strongest line goes by
  ~15–20s in a 60–70s Short, ~8s in a 30s one, with at most two consecutive
  setup beats (~10s) anywhere after it. Measured: `no-it-in-russia` put its
  turn at 31.5s and its CTA at 63.0s of 68.5s, and the average view ended at
  30s — `references/retention.md`.
- **Series membership is decided first.** A Russian-language finance/tech
  brief is the next «ДЕНЬГИ · ПРОСТО» episode unless the user says otherwise:
  same palette, kit re-exported from the previous episode, next `ВЫПУСК`
  number. Check CLAUDE.md for which episode is the current reference.

## Pipeline

Run every command from the repo root.

### 1. Write the scenario down

Normalise whatever the user brought — a paragraph, a bullet list, a rough
idea — into `packages/video/scripts/scenarios/<id>.md`. This file is the
brief of record and it is what step 2 is derived from. Shape:

```markdown
# Title

- **id**: audience-overlap
- **format**: reel (1080×1920), ~30s
- **series**: standalone | «ДЕНЬГИ · ПРОСТО» ВЫПУСК NN (kit re-exported from <prev>)
- **hero color**: electric green #00FF85 (fix), red #FF3B4D (problem)
- **hook (first 2s)**: five payment cards fan out, one per influencer
- **face**: none | face-led hook 0–5s | corner PiP on beats 2, 7 (see Presenter)

## Beats
1. **hook** — 5 cards + payments → 5 INFLUENCERS → 1 AUDIENCE
2. **overlap** — follower clouds converge, duplicates flip red
   - улика: скриншот отчёта с числом пересечений, печатается на чеке
...

## Voiceover
- `01-hook`: You just paid five different influencers. Congratulations — you
  may have bought the same audience five times.
...

## Presenter            (only if **face** is not "none")
- character: ${HEYGEN_AVATAR_VIEW_ID} (photo, studio) | Digital Twin
- shots: which beats, which lines, hero / corner / full-bleed
- agreed price: $0.xx on avatar_iv — quoted from --dry-run, confirmed by user

## CTA
ANALYZE BEFORE YOU SPEND

## Deviations
- what was changed against the brief, and why (hook rewritten, beats merged,
  duration vs the brief's clock, music/SFX cues carried visually)
```

Beat names become scene ids and clip names, so keep them short and kebab-safe.
If the user's scenario is thin (no hook, no CTA, vague beats), fill the gaps
and say what you decided — do not stall the pipeline asking.

**The hook is rewritten, not transcribed.** A brief's opening line is a
draft. Measure it against the face budget or the first two seconds: number
first, softeners («неужели», «а вы знали») cut, the harshest verb on the cut.
Record the rewrite under *Deviations* so the user sees what changed.

**The beat order is checked against the drop-off curve here**, while it is
still a list. Mark each beat as claim or setup: the turn must be in the first
third, no more than two setups may run back to back, one hard number is held
for the 40–50s window, and the discussion question appears on screen once
around the average-view mark as well as in the CTA. If the brief has no second
turn for the back half, cut the reel shorter instead of padding it, and say so
under *Deviations*. The numbers behind each of those are in
`references/retention.md`.

**Footage per beat is decided here** — an `улика:` line under the beat, or
nothing. A beat with nothing stays graphic. `references/footage.md` has the
roles, containers, sources and the pipeline for the files.

### 2. Scaffold

```bash
npm run new-reel -- <id> --name "Title" --beats hook,overlap,counter,tax,fix,finale
```

Creates the template folder wired to the engine, the voiceover manifest with
the house voice, a scenario stub (kept if you already wrote one), and the
registry entry. It is idempotent per registry; pass `--force` to re-scaffold.

### 3. Voiceover

Put the spoken lines into `packages/video/scripts/voiceover/<id>.json` — one
`[clipName, text]` pair per line, clip names matching the beats — then:

```bash
npm run voiceover -- scripts/voiceover/<id>.json
```

This synthesises the mp3s into `public/voiceover/<id>/`, normalises them to
-16 LUFS (two-pass, deliberately — see CLAUDE.md), measures each clip with
ffprobe, and writes `src/templates/<id>/durations.ts`. **Never type a duration
by hand.** If the mp3s already exist and you only need the numbers,
add `--durations-only` (costs no TTS credits, does not touch the audio).

Write the lines for the ear: short sentences, one idea each, an em dash where
the voice should breathe. Punctuation drives both the read and the caption
timing.

### 3a. Face (only when the scenario has one)

The avatar lip-syncs to slices of the mp3s from step 3, so it comes after
the voiceover and before the scenes. Write
`scripts/presenter/<id>.json` (copy `no-it-in-russia.json` for a face-led
hook, `dollar-wait.json` for corner PiPs), then:

```bash
npm run heygen -- scripts/presenter/<id>.json --generate --dry-run   # the quote
```

**Stop here and ask.** Quote the seconds, the engine, the per-second rate
and the total, with the cheaper engine as the alternative. Generate only
after the user picks. Then:

```bash
npm run heygen -- scripts/presenter/<id>.json --generate
```

→ `public/presenter/<id>/` + generated `presenter.ts`. Check the wallet
moved by the quoted amount and say so. CLAUDE.md has the pricing tables, the
`avatarKind` / `avatarId` rules and the crop measurements.

### 3b. Footage (only when a beat has an `улика:` line)

Collect, credit, normalise and measure the files per
`references/footage.md` before writing the scene that uses them. If the
primitives or the normalising script do not exist yet, build them now, in
the kit — not inline in the scene.

### 4. Timeline

`src/templates/<id>/timeline.ts` is the whole timing model. Open
`durations.ts` and set each beat's **length** so its line fits, then place the
line starts:

```ts
export const VO_RATE = 1.08;          // 1.05–1.10 tightens the read

export const SCENES = buildScenes({   // lengths only — starts are derived
  hook: 6,
  overlap: 4.5,
});

export const VOICEOVER = defineVoiceover(DURATIONS, [
  { file: "01-hook", start: 0.25, pages: ["YOU JUST PAID", "FIVE DIFFERENT INFLUENCERS."] },
]);
```

Rules that make timing hold together:

- A beat's length must be **≥ its clip's `raw / VO_RATE`**, plus the gap before
  the next line starts. Overrunning is what causes a caption to be cut off
  mid-word by the next scene.
- Line `start` sits ~0.15–0.25s after its scene start — the visual lands
  first, then the voice.
- Keep beat lengths on a 0.5s grid. Retiming is a one-number edit: change a
  length and every later beat moves with it.
- `DURATION` (exported from the timeline) feeds `durationInSeconds` in
  `index.ts`. Never hardcode 30.

**Caption pages** must cover the spoken text exactly, in order — the words are
what per-word timing is computed from. Markup:

| prefix | effect |
|---|---|
| `~PAGE` | page is hidden — a scene headline is showing those words, but they still consume their share of the clip's time |
| `+WORD` | word takes the hero color permanently once spoken |
| `!WORD` | word takes the signal/bad color permanently once spoken |

### 5. Palette and scenes

Set `palette.ts` from the scenario's colors, then build the beats in
`scenes/<Name>Scene.tsx`, with shared visual primitives in `ui.tsx`. This is
the creative work; apply the motion skill in full here. `<Reel>` already
supplies the background, grade, grain and vignette — a scene renders its own
`BgMesh` plus content, nothing else from the layer stack.

Scene rhythm: HIT → hold 15–20 still frames → build → HIT. Something moves in
the first 15 frames of every scene. Keep critical content inside the middle
75% vertically — platform UI covers the top and bottom of a 9:16 frame, and
captions sit at y=1408.

### 6. Verify, then render

Mandatory loop — never deliver an unverified render:

```bash
npm run stills -- <id>-reel                 # whole timeline on a 2.5s grid
npm run stills -- <id>-reel --times 5.5,12,19.4   # specific moments
```

One bundle, many frames, named by timestamp (`t12.5.png`). **Look at every
frame.** Fix, re-run, re-inspect. Check in this order: text overflowing or
touching edges, elements visible before their entrance or after their exit,
more than one hero-colored element in a frame, captions colliding with scene
type, layer-order mistakes.

Two passes, not one. The 2.5s grid finds layout faults; a second run at the
**moments that matter** — every cut ±2 frames, every footage in/out point,
the frame a headline finishes entering, the last frame of the hook — finds
the motion faults the grid skips (a word already torn apart four frames
after its split, a label travelling with the bar it was meant to stay under).
Expect the first grid pass to surface 5–10 defects on a ten-beat reel; that is
the loop working, not a reason to skip it.

After the render, pull three frames from the **mp4 itself** with ffmpeg and
look at them: the encode is what ships, and a still from the bundle does not
prove the encode.

Also read the console output: the engine prints `[reel]` warnings for a clip
with no measured duration, and for a voiceover that runs past the end of the
composition (which silently truncates the closing line in the mp4). Never
ship a reel that still warns.

```bash
npm run render -- <id>-reel --out out/<id>-reel.mp4
```

## Changing an existing reel

- Retime a beat → one number in `SCENES`.
- Reword a line → edit the manifest, re-run `npm run voiceover`, update that
  line's `pages` to match the new text.
- Restyle → `palette.ts`, or the scene.
- Caption look for all reels → `src/reel/Captions.tsx`.

## Delivery

A reel is delivered with: the mp4 path and its measured duration; what was
spent (avatar seconds × rate, wallet before → after); the duration against
the brief's clock; the *Deviations* list; and which scenes carry footage or a
face. If the user then asks for a title / description / tags, they are for
Shorts: the title restates the hook's first spoken line with the number in
the first 35 characters, the description's first two lines are the hook and
the answer, figures are phrased exactly as loosely as the reel phrases them,
and the CTA is a question that invites a one-word comment. Tell the user to
pin their own first comment under any reel that asks a question — measured, a
CTA in the last beat alone returned 0 comments (`references/retention.md`).

## Reference

`references/engine.md` — the reel engine API: `Reel`, `Scene`, `buildScenes`,
`defineVoiceover`, caption props, and what each generated file is for.

`references/retention.md` — analytics from the published reels mapped back
onto their beat timelines: where the audience actually leaves, and the
ordering rules that follow from it.

`references/footage.md` — photos, screenshots, clips and faces: the
evidence rule, the four roles, the three containers that keep the series
look, sources and their licences, the file pipeline, and what is not built
yet.
