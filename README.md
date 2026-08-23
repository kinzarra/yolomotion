# Yolomotion

Programmatic video/motion-graphics platform built on [Remotion](https://remotion.dev)
(React + TypeScript rendered frame-by-frame into video). Structured as the base
for a future SaaS: templates are parameterized compositions, and rendering is a
job function that can sit behind an API/queue.

## Layout

```
.claude/skills/reel-production/            The pipeline: scenario → finished reel
.claude/skills/remotion-motion-graphics/   Motion-design skill (rules, patterns, theme)
packages/
├── video/          @yolomotion/video — the Remotion project
│   ├── scripts/
│   │   ├── new-reel.mjs        Scaffolds a reel: template + manifest + registry entry
│   │   ├── gen-voiceover.mjs   ElevenLabs TTS → -16 LUFS → measured durations.ts
│   │   ├── scenarios/          The brief each reel was built from
│   │   └── voiceover/          TTS manifests (voice id + spoken lines)
│   └── src/
│       ├── theme.ts            Single source of truth: colors, easings, springs
│       ├── fonts.ts            Google Fonts (Space Grotesk / Inter / JetBrains Mono)
│       ├── formats.ts          Output presets: reel 1080×1920, landscape 1920×1080, square
│       ├── components/         Motion primitives (Entrance, WordReveal, SceneLayers…)
│       ├── reel/               ← the reel engine, shared by every voiceover short
│       │   ├── Reel.tsx        Shell: bg + voiceover + scenes + captions + grade/grain
│       │   ├── Captions.tsx    Word-synced karaoke captions, timing derived from the clips
│       │   └── timeline.ts     buildScenes(), defineVoiceover(), scene→frame conversion
│       ├── templates/          ← the product catalog
│       │   ├── types.ts        defineTemplate(): id + zod schema + component + formats
│       │   ├── index.ts        Registry; every entry auto-registers per format
│       │   └── logo-sting/     Demo template (brandName, tagline, brand colors)
│       └── Root.tsx            Registers Composition per (template × format)
└── renderer/       @yolomotion/renderer — programmatic rendering (SaaS worker seed)
    └── src/
        ├── render.ts           renderJob({compositionId, inputProps, outPath})
        ├── stills.ts           Batch still extraction — the verification loop
        └── cli.ts              CLI wrapper with the same call shape
```

## Setup

Requirements: **Node 20+** (developed on 25), **ffmpeg/ffprobe** on `PATH`
(`brew install ffmpeg` — the voiceover pass measures and loudness-normalises
with it), and Chrome, which Remotion downloads itself on the first render.

```bash
git clone <repo-url> yolomotion && cd yolomotion
npm install            # npm workspaces — installs both packages
cp .env.example .env   # only needed to regenerate voiceover / presenter footage
npm run studio         # Remotion Studio, the whole template catalog
```

Studio, stills and rendering need no API keys. The media they play is not in
git, though — see [Assets are not in git](#assets-are-not-in-git).

## Quickstart

```bash
# Interactive editor (props editable live via zod schemas)
npm run studio

# Render a template with custom brand props — the future API call, today as CLI
echo '{"brandName":"Acme","tagline":"Ship faster","primary":"#F97316"}' > props.json
npm run render -- logo-sting-reel --props props.json --out out/acme.mp4

# Synthesize the SFX/music kit (no asset downloads, deterministic WAVs)
npm run sfx
```

Composition ids are `<template>-<format>`: `logo-sting-reel`,
`logo-sting-landscape`, `logo-sting-square`.

## Assets are not in git

`packages/video/public/` is gitignored: the repo carries code, scenarios and
manifests, not the media those manifests produced. After a fresh clone:

| folder | how to get it back | cost |
|---|---|---|
| `public/sfx/` | `npm run sfx` | free, deterministic |
| `public/voiceover/<id>/` | `npm run voiceover -- scripts/voiceover/<id>.json` | ElevenLabs credits |
| `public/presenter/<id>/` | `npm run heygen -- scripts/presenter/<id>.json --dry-run`, then `--generate` | HeyGen seconds — quote before generating |
| `public/images/` | re-source from the links in `public/images/CREDITS.md`, cut out with `scripts/matte.swift` | free, manual |

The generated `durations.ts` / `presenter.ts` beside each template **are**
tracked, so beat lengths and caption timing survive without the audio — a reel
still renders, silent and with missing images, and re-running `npm run voiceover`
reproduces the same durations from the same manifest. To re-render an existing
reel exactly as shipped, ask the repo owner for a copy of `public/` rather than
paying for the voice and the avatar again.

## Producing a reel from a scenario

The repeatable path — a vertical voiceover short, which is what this repo
mostly makes. Full pipeline in `.claude/skills/reel-production/SKILL.md`;
Claude Code follows it automatically when handed a scenario.

```bash
# 1. Scaffold: template wired to the reel engine + TTS manifest + registry entry
npm run new-reel -- my-reel --name "My Reel" --beats hook,problem,fix,finale

# 2. Put the spoken lines in packages/video/scripts/voiceover/my-reel.json, then
npm run voiceover -- scripts/voiceover/my-reel.json   # mp3s + measured durations.ts

# 3. Set beat lengths and caption pages in templates/my-reel/timeline.ts,
#    build the scenes, then verify and render
npm run stills -- my-reel-reel
npm run render -- my-reel-reel --out out/my-reel.mp4
```

What the engine already handles, so a template never re-implements it: the
voiceover track, word-synced captions (timing derived from the measured
clips, not authored), scene start arithmetic, composition duration, and the
grade/grain/vignette stack.

## Adding a template

For anything that is not a voiceover reel:

1. `packages/video/src/templates/<id>/` — `schema.ts` (zod, `zColor()` for brand
   colors), the component, and an `index.ts` with `defineTemplate({...})`.
2. Add it to the array in `templates/index.ts`. Done — Studio and the renderer
   pick it up for every declared format.

Follow the motion rules in `.claude/skills/remotion-motion-graphics/SKILL.md`
(no linear easing, staggered entrances, five-layer stack, verify renders by
extracting frames). Claude Code applies them automatically via the skill.

## Path to SaaS

The architecture is already shaped for it — each piece maps onto a service:

| Today | SaaS |
|---|---|
| Template registry (`templates/index.ts`) | Product catalog / template gallery API |
| zod schema per template | Public API contract + generated UI forms |
| `renderJob()` in `@yolomotion/renderer` | Render worker behind a queue (BullMQ/SQS) |
| CLI `--props file.json` | `POST /renders {templateId, inputProps}` |
| `out/` directory | S3/GCS + CDN, webhook on completion |
| Local Chrome render | [@remotion/lambda](https://remotion.dev/lambda) for elastic scale |

Next steps in order: `apps/api` (Fastify/Nest: enqueue job, validate inputProps
against the template schema), a worker process wrapping `renderJob()`, object
storage for outputs, then swap local rendering for Remotion Lambda when volume
demands it. Note: commercial use of Remotion requires a
[company license](https://remotion.pro/license) past the free tier — budget for
it before launch.
