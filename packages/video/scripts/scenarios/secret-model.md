# Claude Isn't Anthropic's Strongest Model?

- **id**: secret-model
- **format**: reel (1080×1920), ~30s
- **series**: VibeCloud — AI + CS for vibe coders, `AI LABS · REPORT`
- **hero color**: VibeCloud orange `#FF8A4C` = the model you *can't* use;
  electric blue `#4DA3FF` = the model you *can*. Nothing else is colored.
- **hook (first 2s)**: `CLAUDE ISN'T ANTHROPIC'S STRONGEST MODEL?` at full
  width, the last words redacted-then-revealed
- **feel**: breaking AI news for developers — leaked internal doc, terminal,
  model cards, redaction bars. Not a corporate ad. No product pitch beyond the
  quiet series brand bar.

## Visual grammar (the honesty rule, made visible)

The brief forbids presenting anything rumored as confirmed. Instead of writing
disclaimers, the reel encodes it in the design and never breaks it:

| status | how it is drawn |
|---|---|
| **confirmed** (shipping models) | solid 1px border, crisp text, blue |
| **reported / rumored** | dashed border, `blur()` on the name, a `REPORTED` tag, orange |
| **internal / unseen** | redaction bar over the glyphs + `INTERNAL` stamp |

So every unverified claim on screen is literally out of focus. `MYTHOS` is
never crisp; `FABLE` and the shipping lineup always are.

## Beats

1. **hook** — `CLAUDE ISN'T ANTHROPIC'S STRONGEST MODEL?` slams in; redaction
   bars wipe off `STRONGEST MODEL`, the `?` lands in orange
2. **internal** — under the eyebrow `WHAT YOU GET TO SEE`, a model card whose
   every field is a redaction bar (which is the literally true rendering of
   what the public knows about an unreleased model — the shot claims nothing),
   then `INTERNAL` slams down across its bottom edge, scan sweep
3. **ladder** — the shipping lineup stacked under a dashed `PUBLIC API`
   boundary: HAIKU 4.5 · SONNET 5 · OPUS 5 · FABLE 5 (solid, blue,
   `SHIPPING`), building bottom-up. Above the boundary, one slot holding a
   literal `?` — dashed, orange, `REPORTED` / `NOT PUBLIC`. The stack is an
   **availability** axis, never a capability ranking. FABLE lights on the word
   "Fable"; the slot stays unnamed until beat 4 attributes a name to it.
4. **testing** — rapid flash cuts `MYTHOS` / `FABLE` / `INTERNAL TESTING`, then
   a terminal streaming an internal eval run against a redacted checkpoint
5. **pipeline** — `TRAINED → TESTED → SAFETY EVALS → RELEASED` as a *vertical*
   rail (a 9:16 frame has height, not width) with an orange playhead falling
   down it; `RELEASED` is the last node, lights blue, tagged `YOU ARE HERE`,
   and the beat closes on `YOU ONLY EVER SEE STEP 4`
6. **gap** — hard split: `YOU USE TODAY'S MODEL` above,
   `THEY'RE ALREADY TESTING TOMORROW'S` below, divider tears the frame
7. **law** — `THE BEST AI MODEL MAY BE ONE YOU CAN'T USE YET.` +
   `AI + CS for vibe coders.` + the VibeCloud mark

Something changes every 0.7–1.2s. No stock footage, no talking heads.

## Voiceover

- `01-hook`: Anthropic may already have a model more powerful than the Claude
  you're using today.
- `02-internal`: And this isn't just random Twitter hype.
- `03-ladder`: The Claude lineup already goes past Opus, Sonnet and Haiku.
  Fable is real, and it's shipping.
- `04-testing`: Reports name others, like Mythos — and say newer versions are
  being tested internally.
- `05-pipeline`: The crazy part? Labs train the next generation long before you
  ever get access to it.
- `06-gap`: So while you're using today's best model… tomorrow's model may
  already exist.
- `07-law`: It's just not public yet.

Highlighted words: `MYTHOS`, `REPORTS`, `INTERNALLY` in orange (the unknown);
`FABLE`, `SHIPPING` in blue (the known). Pages carried by a scene headline are
hidden (`~`): the hook question, `INTERNAL TESTING`, and the closing law.

## CTA

Closing line: THE BEST AI MODEL MAY BE ONE YOU CAN'T USE YET.
Sign-off: AI + CS for vibe coders.

## Deviations from the brief

- **The Mythos/Fable claim was rewritten.** The brief's line — "Anthropic has
  already revealed models like Mythos and Fable that sit above parts of its
  regular Claude lineup" — states as revealed something only one half of which
  is. Fable is a shipping Claude model and is treated as fact; Mythos is only
  ever attributed ("reports name others, like Mythos") and is drawn under the
  reported grammar above. This is the brief's own labeling rule applied to the
  brief's own script.
- **No benchmark chart.** The brief asks for one, but every number that could
  go on it would be unverifiable — a fake chart is the one thing that would
  make the reel dishonest. The internal eval terminal in beat 4 carries the
  same "they are measuring something you can't see" beat, with the scores
  redacted rather than invented.
- **No music, no SFX.** The brief asks for UI clicks, a bass hit and a
  futuristic bed; this repo ships voiceover only (standing decision in the
  reel-production skill). The opening bass hit is carried visually — a hard
  scale punch, frame shake and a full-frame flash on the `INTERNAL` stamp.
