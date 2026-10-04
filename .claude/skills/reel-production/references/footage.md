# Footage: photos, video, screenshots, faces

How a reel stops being "pure graphics" without turning into a stock-footage
reel. Graphics *illustrate*; footage *proves*. That difference decides every
choice below.

## The rule

**Every beat carries something real — a clip, a photo or a big number.**
(The author, 2026-10-03: «больше видео-фрагментов, эффектов, фото и цифр».)
A beat of pure abstract graphics is the exception now, not the default.
What has not changed: the shot is about the line under it, it is graded into
the palette, it sits in one of the three containers, and it lasts its line —
footage on topic and in the series look, never stock pasted full-frame.

Density for a ~60s reel (scale for other lengths):

| what | how much | how it moves |
|---|---|---|
| **video clips** | ≥ 4, about every third beat; prefer a clip over a still whenever a source has one | 1.5–3s each, hard cuts (`FlashCut` / `CutZoom`), scrim + grade |
| **photos** | on most remaining beats; 2–3 per beat is fine when they stack | never static: Ken Burns to a focus point, printed photo dropping in, stack/collage, before→after split, punch-in on a detail with a ring |
| **numbers** | every figure the voice says is on screen, big | counter roll-up to the value, odometer, bars that grow, % ring, a number stamped onto the photo it is about |
| **effects** | on every cut and every reveal | flash cut, cut zoom, scan sweep, glitch on the type (never on a scrim), whip between photos |

Corollary kept: a shot lasts as long as its line. A still read in 3s is dead
after that — cut to the next one or start the number moving over it.

`dubai-economy` (ВЫПУСК 07) is the working kit for all of this — `Photo`,
`Clip`, `PrintedPhoto`, `Scrim`, `Sweep`, `FlashCut`, `CutZoom` in its
`ui.tsx`. It lives in S3: `npm run deliver -- dubai-economy --restore`, then
re-export it like any earlier episode.

## Four roles

| role | what it is | example | on screen |
|---|---|---|---|
| **evidence** | screenshot, document, the real number | listing page showing «247 откликов»; a chart from a report; a terminal with autocomplete | 1.5–3s, exactly on its line |
| **presence** | a face, hands, a person | the HeyGen face full-screen on the hook and the opinionated lines (circle only on request) | 3–5s |
| **texture** | atmosphere, place | empty open-plan office, server room, hands on a keyboard | ≤2s, always under a scrim |
| **spectacle** | AI video, an expensive render | "the bottom steps of the staircase dissolve" as a real scene | once per reel, on the main insight |

Cheapest and strongest: evidence. Most expensive and riskiest: spectacle.
Evidence and texture together fill the density table above; spectacle stays
once per reel.

## Scenario first

Footage is decided in the scenario, not in the scene. Every beat that wants a
shot gets one line:

```markdown
3. **numbers** — bars fall to red, résumés rain
   - улика: скриншот вакансии с числом откликов, печатается на чеке
```

Every beat gets an `улика:` line (or a `цифра:` line when the beat is a
number). If the brief offers no evidence for a beat, find a shot of the thing
the line is about — the place, the object, the people doing it — from the
sources below, and name it in the scenario like any other.

## Three containers that keep the look

The «ЧЕК × ПИКСЕЛЬ» series holds together on two signal colors and paper as a
surface. Footage brings its own colors, and that is the main way it breaks the
look. Every shot goes into one of three containers, and every container
grades the shot into the palette.

**1. Paper — the photo is printed.** A still inside a `Receipt`: greyscale,
light dither (a thermal printer), torn edge, a tilt. The receipt already
prints top→down under the lime head, so a screenshot inside it arrives as *a
printed-out listing*. This is the most on-brand way to show a photo in the
series, not a compromise.

**2. Screen — the clip plays on a device.** Video inside `Phone` or the
`Desk` monitor. The scanlines and pixel grid are already drawn by
`SceneShell`, so a terminal recording inside the «РАЗРАБОТЧИК» monitor reads
as part of the kit rather than as an insert.

**3. Studio — full-bleed.** The shot fills the frame with scrims top and
bottom for the type, as in `no-it-in-russia`'s hook. For presence and the
rare texture shot. Transitions in and out go through `Glitch` — footage and
type in separate `<Glitch>` wrappers, scrims between them unwrapped (see
CLAUDE.md: an opaque layer inside `Glitch` lifts the frame to grey).

**Grade everything.** Greyscale or an ink/paper duotone, the way
`khaby-silence` and `mrbeast-100k` treat their Wikimedia photos. The only
shot that stays in color is a face the scenario has explicitly made the
"one live element" — the hook avatar. Never tint footage with the hero color:
lime belongs to the digital layer.

**Ken Burns with a destination.** Rule 6 of the motion skill makes the move
mandatory; this makes it mean something. The push ends on the part of the
frame the voice is talking about — the number of applicants, the line of
code — not on the centre.

## Sources

| source | for | cost | watch out |
|---|---|---|---|
| Screenshots (listings, GitHub, a terminal) | evidence | free, a minute to capture | blur names, logos, anything identifying a third party |
| Wikimedia Commons (CC BY / CC0) | places, objects, events, real people; **video too** (webm/ogv) | free | credit line on screen + `CREDITS.md`; cut subjects with `scripts/matte.swift` (Mac only) |
| Pexels video (`PEXELS_API_KEY`) | clips of places, work, cities, money; many vertical | free, no credit | graded and scrimmed, or it reads as stock |
| Pixabay video (`PIXABAY_API_KEY`) | same, plus drone shots | free, no credit | same |
| YouTube, **Creative Commons only** (`yt-dlp`) | real events, reportage, things stock does not have | free, **credit required** | the licence is checked per video before download; `--from/--to` fetches only the seconds you need |
| Own phone footage | presence, texture | free | one light, one framing, shot vertical |
| HeyGen avatar | presence | per second, see CLAUDE.md | lip-sync to the house clips, never HeyGen TTS; agree the price first |
| AI video (Runway / Kling / Veo) | spectacle | $ per clip | artefacts at 1080 vertical; every generation is verified like a still; once per reel |
| HeyGen B-roll / image credits | to test | free credits sit in the quota | unknown quality — a free test, not a plan |

## Pipeline

**Video first.** For every beat, search for a clip before settling for a photo:

```bash
npm run fetch-footage -- search <id> "<query in English>" [--source pexels,pixabay,commons,youtube-cc] [--count 5]
# read out/fetch-footage/<id>/thumbs/*.jpg — pick by the frame, not the title
npm run fetch-footage -- get <id> <source:id> --name 05-port [--from 12 --to 20]
```

Raw files land in `public/media/<id>/` with `credits.json` (source, author,
licence, and the exact on-screen `credit` when the licence requires one). Cut
them with `scripts/footage/<id>.json` (`"sourceDir": "../../public/media/<id>"`)
and `npm run footage`. Every `credit` goes into the closing beat's credit line.
Nothing from YouTube outside Creative Commons, nothing from news sites, TV or
other creators' channels — Content ID claims a Short within hours, and three
strikes delete the channel.


Same discipline as voiceover: measured numbers are generated, never typed.

1. **Scenario** names the shot per beat (`улика:` line) and its source.
2. **Files** go to `public/footage/<id>/`, named after the beat:
   `03-numbers-listing.png`, `05-tasks-terminal.mp4`. Screenshots are
   downscaled and stripped of metadata before they land.
3. **Credits**: anything CC BY is a row in `public/images/CREDITS.md` and a
   credit line in the closing scene. Screenshots of third-party products get a
   note in the scenario's *Deviations* saying what was blurred and why.
4. **Normalise** before the scene: 30 fps, 1080 wide, trimmed to `from/to`.
   HeyGen returned 25 fps; downloaded footage will be anything. Catch it here,
   not in the stills.
5. **Measure**: duration and fps into a generated `footage.ts` beside
   `durations.ts` / `presenter.ts`. A scene reads the module; it never hard-codes
   a clip length.
6. **Verify** with `npm run stills` at the shot's in-point, mid-point and
   out-point, plus the two frames either side of each cut. Footage fails in
   ways graphics cannot: a frame of the wrong clip, a black frame at the
   in-point, a letterbox bar at the edge of the crop.

**Tooling status.** The `Footage` primitive (cover-crop into a box, Ken Burns
to a target point, grade, scrim), the `PrintedPhoto` primitive (a still inside
`Receipt` with dither), the normalising script and the `footage.ts`
generator **do not exist yet**. Build them the first time a reel needs
footage — before the scene, in the kit (`ui.tsx` of the episode, promoted to
`digital-ruble/ui` once two episodes use them) and in `scripts/` — to the
contract above. Do not hand-roll `<OffthreadVideo>` in a scene and call it
done.

## Faces

The presenter pipeline is `npm run heygen` (CLAUDE.md has the manifest,
pricing and engine rules; `scripts/scenarios/dollar-wait-presenter.md` has
the geometry). What the scenario has to decide:

- **Full-screen by default.** The author wants the face big (2026-10-03):
  full-screen shots cut between the evidence beats. A corner circle is built
  only when the author asks for it by name. A face-led hook (`no-it-in-russia`) is
  composited *inside* the hook scene, full-bleed, and the reel does not loop.
  A corner PiP (`dollar-wait`) is a `<Presenter>` layer above every scene, and
  the scenes are designed with the band (110,1105)–(390,1385) free.
- **Which character.** The manifest names it — `"${HEYGEN_AVATAR_VIEW_ID}"`
  for the studio look, the Digital Twin otherwise — and sets `avatarKind`,
  because the two bill on different tables.
- **Price before spend.** `--generate --dry-run`, quote the figure and the
  engine choice, wait for the answer, then generate. One concatenated upload,
  never per shot.
- **Only the seconds on screen.** `from`/`to` per shot; a hero cut that shows
  the last six seconds of a clip does not pay for the first two.
- **What the face says.** Opinion, address, the question — «это классическая
  ошибка толпы», «а вы бы пошли?». Facts, numbers and the algorithm stay with
  the graphics. The face sells the take; the chart sells the number.

## What not to do

- Stock footage full-frame with text on top and no scrim. That is the reel
  the series exists to not be.
- A shot held past its line.
- A third signal color arriving inside a clip. Grade it out.
- A clip at 25 fps dropped into a 30 fps reel and "it looks fine".
- Footage the scenario never named. More footage is the rule now, but it is
  still planned beat by beat in the scenario, not sprinkled on afterwards.
- An identifiable person next to a negative claim (a «fake», «bot», «failed»
  verdict) — use faceless shots there.
