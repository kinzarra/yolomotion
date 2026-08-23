# Footage: photos, video, screenshots, faces

How a reel stops being "pure graphics" without turning into a stock-footage
reel. Graphics *illustrate*; footage *proves*. That difference decides every
choice below.

## The rule

**Footage is evidence, not wallpaper.** A shot goes in only when it proves a
specific spoken line — a job listing with the real number of applicants, a
terminal where the assistant is writing the test, a document with the figure
on it. A shot that proves nothing is decoration, and the graphics do
decoration better and cheaper.

Corollary: a shot lasts exactly as long as the line it proves. Graphics can
hold 8s because something keeps building inside them; a still or a stock clip
is read in 3s and is dead after that.

## Four roles

| role | what it is | example | on screen |
|---|---|---|---|
| **evidence** | screenshot, document, the real number | listing page showing «247 откликов»; a chart from a report; a terminal with autocomplete | 1.5–3s, exactly on its line |
| **presence** | a face, hands, a person | the HeyGen hook; a corner PiP on the opinionated lines | 3–5s |
| **texture** | atmosphere, place | empty open-plan office, server room, hands on a keyboard | ≤2s, always under a scrim |
| **spectacle** | AI video, an expensive render | "the bottom steps of the staircase dissolve" as a real scene | once per reel, on the main insight |

Cheapest and strongest: evidence. Most expensive and riskiest: spectacle.
A reel that adds footage should start with evidence and stop there unless the
brief explicitly asks for more.

## Scenario first

Footage is decided in the scenario, not in the scene. Every beat that wants a
shot gets one line:

```markdown
3. **numbers** — bars fall to red, résumés rain
   - улика: скриншот вакансии с числом откликов, печатается на чеке
```

If the brief has no evidence to offer for a beat, the beat stays graphic. Do
not go looking for "something visual" — that is how stock footage gets in.

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
| Wikimedia Commons, CC BY | presence of real people, texture | free | credit line on screen + `CREDITS.md`; photos only; cut subjects with `scripts/matte.swift` |
| Pexels / Pixabay | texture | free, no credit required | reads as stock unless graded and scrimmed; keep under 2s |
| Own phone footage | presence, texture | free | one light, one framing, shot vertical |
| HeyGen avatar | presence | per second, see CLAUDE.md | lip-sync to the house clips, never HeyGen TTS; agree the price first |
| AI video (Runway / Kling / Veo) | spectacle | $ per clip | artefacts at 1080 vertical; every generation is verified like a still; once per reel |
| HeyGen B-roll / image credits | to test | free credits sit in the quota | unknown quality — a free test, not a plan |

## Pipeline

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

- **Face-led hook or corner PiP.** A face-led hook (`no-it-in-russia`) is
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
- Footage in the first cut of a reel that the scenario never asked for. If
  the user says «чтобы не было чисто графики», the answer is evidence per
  beat, agreed in the scenario — not B-roll sprinkled in afterwards.
