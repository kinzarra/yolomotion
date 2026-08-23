# You Sold The Same Ticket Twice

- **id**: race-condition
- **format**: reel (1080×1920), ~30s
- **series**: VibeCloud — CS for vibe coders, `CONCURRENCY · 101`
- **hero color**: VibeCloud orange `#FF8A4C`; blue `#3E8FD0` as the structural
  accent; red `#FF5A5A` as the scarce failure signal, green `#4ADE9B` only on
  the corrected run
- **hook (first 2s)**: `1 TICKET LEFT` at full width, then two BUY buttons
  slam down at the exact same frame
- **feel**: premium dark developer, not an ad. No product pitch beyond the
  quiet brand bar the rest of the series carries.

## Beats

1. **hook** — `1 TICKET LEFT`, two users slam BUY on the same frame
2. **read** — screen splits, both requests reach the row together, both read
   `tickets = 1`
3. **sold** — both write `tickets = 0`, `SOLD TWICE` slams in with a skull mark
4. **race** — `RACE CONDITION` fills the frame while two request lines literally
   race for the same row; the wrong-order line lands under it
5. **lock** — the sequence rewinds: A enters a glowing `TRANSACTION / LOCK`,
   buys, the row goes to `0`, then B arrives and gets `SOLD OUT`
6. **law** — `IF IT CAN HAPPEN AT THE SAME TIME — IT WILL.`, then
   `CS for vibe coders.` and the brand mark

Something changes every 0.7–1.3s. No stock footage, no talking heads.

## Voiceover

- `01-hook`: There's one ticket left. Two users click Buy at the exact same time.
- `02-read`: Both check the database. Both see: one ticket available.
- `03-sold`: Both buy it. Congratulations — you just sold the same ticket twice.
- `04-race`: This is called a race condition. Your code worked perfectly… just
  in the wrong order.
- `05-lock`: Databases solve this with transactions and locking: one operation
  finishes before the other can change the same data.
- `06-law`: If two things can happen at the same time, assume someday they will.

Highlighted words: `TWICE`, `RACE CONDITION`, `WRONG ORDER` in red;
`TRANSACTION`, `LOCK` in hero orange. Pages carrying `SOLD TWICE`,
`RACE CONDITION` and the closing law are hidden (`~`) — the scene headlines
land those.

## CTA

Closing line: IF IT CAN HAPPEN AT THE SAME TIME — IT WILL.
Sign-off: CS for vibe coders.

## Deviations from the brief

- **No music, no SFX.** The brief asked for terminal sounds and an electronic
  bed; this repo ships voiceover only (see the standing decisions in the
  reel-production skill). The "bass impact" on SOLD TWICE is carried visually —
  a hard scale punch, a frame shake and a red flash.
- **No 💀 emoji.** Emoji render as full-colour platform glyphs that ignore the
  palette. The skull is drawn as SVG in the failure red.
