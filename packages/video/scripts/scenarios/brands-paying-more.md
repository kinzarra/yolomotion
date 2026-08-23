# Why brands are paying creators MORE to post AI ads

- **id**: brands-paying-more
- **format**: reel (1080×1920, 30fps), 60.0s
- **series**: standalone — editorial register, kit re-exported from
  `khaby-silence` (black / bone / one flat vermilion)
- **hero color**: vermilion `#E8481F` — and only ever one element per frame.
  It burns through the middle of the piece (HATE, RISK, the falling trust
  numbers) and is gone by the ending: the payoff beats are pure black + bone.
  No second signal color; the "green check" of the brief is set in bone.
- **hook (first 2s)**: the studio face, mid-sentence, and the word **HATE**
  already building behind the head. Number-free hook — the number lands in
  beat 02, so the first line can be the provocation.
- **face**: face-led hook 0–5.4s (photo avatar, studio). One insert, full
  bleed. No face after the hook.

## Beats

1. **hook** — presenter full-bleed in the studio. `AI BRANDS` → `PAY MORE?`
   slam over the shoulder, then **HATE** grows enormous behind the head, the
   camera pushes into the H, the letters lose their counters and become the
   comment cards of beat 04's flood. Hard cut on the tear.
2. **money** — black page. `$10,000` → `$100,000` → `$1,000,000+` fly up the
   frame and freeze. Mono folio: `CREATOR BRAND DEALS · REPORTED UPPER END`.
   Then the page clears and `BUT THERE'S A CATCH.` slams.
   *The disclaimer is on-screen type, not a caption: nothing here may read as
   "every AI deal is worth $1M".*
3. **trust** — a creator card, deliberately abstract (no likeness, no handle):
   `CREATOR · 2.8M FOLLOWERS`. `BRAND DEAL +$250,000` counts up in bone —
   then, under it, `AUDIENCE TRUST` falls 100 → 87 → 64 in vermilion. Card
   and numbers blow away; one word survives: **TRUST**, and it cracks.
   Footer line: `CONCEPTUAL — NOT RESEARCH DATA`.
4. **backlash** — an elegant fictional post: `PAID PARTNERSHIP`, a bone
   rectangle where the creative would be. Four original comments arrive one
   by one, then eighty at once until the page is illegible. Cut to silence:
   one comment left on black.
5. **economics** — the equation. `BRAND MONEY + CREATOR REACH` struck
   through, then re-set with a third term: `+ REPUTATION RISK`, RISK
   oversized in vermilion. Slow push in.
6. **fit** — three abstract creators. `A 8.2M` dominates the page. Zoom out:
   five dimensions stack in as print tags (sentiment, brand affinity, content
   fit, engagement quality, demographics), the bars re-sort, and `C 380K`
   takes the frame. `BIGGEST ≠ BEST`.
7. **shift** — the clean frame. `REACH` dissolves, `TRUST` becomes enormous,
   then the ladder: `ATTENTION ↓ TRUST ↓ INFLUENCE`. Typography only.
8. **measure** — `4,829,103` with a bone tick: easy. `TRUST ???` / `BRAND FIT
   ???` / `SENTIMENT ???`: not. Camera pulls back until the frame is a field
   of hundreds of tiny creator cards. `SO HOW DO YOU CHOOSE?`
9. **yoloco** — the field snaps from noise into a grid, cards dim, one card
   locks in the centre. Black. Mark + `Yoloco` + `FIND THE RIGHT CREATORS.` +
   `yoloco.io`. One-second hold.

No `улика:` lines: every beat is graphic. This story has no photograph that
proves it — the numbers are conceptual and the comments are written for the
video, so a screenshot would be the one thing the brief forbids.

## Voiceover

- `01-hook`: AI companies have a weird new problem. Influencers can charge
  more... because people hate their ads.
- `02-money`: And yes — this is actually happening. AI brand deals can be
  lucrative. Some reported offers reach seven figures. But there's a catch.
- `03-trust`: Promoting AI can make a creator money... and cost them
  something worth far more. Trust.
- `04-backlash`: Because audiences don't just judge the ad. They judge the
  creator who accepted it.
- `05-economics`: And that changes the economics of influencer marketing.
- `06-fit`: Suddenly, follower count isn't enough. A creator can have
  millions of followers... and still be completely wrong for your brand.
- `07-shift`: This might be the biggest shift in influencer marketing right
  now. Brands aren't buying reach anymore. They're buying trust.
- `08-measure`: And trust... is a lot harder to measure than followers. So
  how do you choose?
- `09-yoloco`: That's why influencer marketing needs data. Yoloco. Find
  creators who actually fit your brand.

## Presenter

- character: `${HEYGEN_AVATAR_VIEW_ID}` — photo avatar, podcast-studio look
  from the «Philipp» group (`1b80626e…`). `avatarKind: "photo"`.
- shots: one — `p1-hook`, full bleed, reel 0s, lip-synced to a slice of
  `01-hook.mp3`. Capped at **6.0s** by the user's budget; if the clip
  measures longer, the slice is trimmed and the tail of the line plays over
  the HATE push, which is where the cut wants to be anyway.
- engine: `avatar_iv` — the insert is full-frame 1080×1920, where the mimic
  is the point (CLAUDE.md: photo avatar full-frame → IV).
- agreed price: $0.28 quoted from `--generate --dry-run` (5.619s × $0.05),
  confirmed by the author before generating. Wallet moved $4.60 → $4.35,
  i.e. $0.25 — HeyGen billed the audio length, not the 5.64s it returned.

## CTA

FIND THE RIGHT CREATORS. — yoloco.io

## Captions

Shared `<Captions>`, white active word, vermilion for `+WORD`. Roughly half
the pages are `~hidden`: where a scene headline is already saying those words
(HATE, BUT THERE'S A CATCH., TRUST, RISK, BIGGEST ≠ BEST, SO HOW DO YOU
CHOOSE?, the Yoloco line) the caption stays out of the way, so the frame
never carries the same sentence twice. Exactly three words are painted
vermilion across the whole reel: `+SEVEN` (beat 02), `+TRUST` (beat 08 — the
one place the word is a caption rather than a headline) and `+DATA` (beat 09).
`+WRONG` was cut from beat 06: creator C's row already wears the accent at
that moment, and two in one frame breaks the rule.

## Deviations

- **Length**: the brief says 45–55s; the user asked for a one-minute Short.
  Built to 60.0s exactly — every block of the brief kept, none merged away.
  The extra five seconds are holds, not extra copy: the money column freezing
  before the catch, TRUST sitting cracked in silence, the comment field going
  quiet, and the brand card holding for the last 1.9s.
- **Hook rewritten as a face**: the brief's `<HNAvatarIntro />` placeholder is
  not a placeholder here — the shot is really generated (HeyGen photo avatar,
  studio) and lip-synced to the house voice, so `durations.ts` and every
  caption timing stay derived from the same mp3s. The three stacked headlines
  the brief wanted (`AI BRANDS` / `PAY MORE?` / `BECAUSE PEOPLE HATE THE
  ADS.`) are compressed to two slams plus **HATE**: at 1080 wide, three full
  headlines over a face either shrink below hook size or bury the studio that
  the avatar was chosen for.
- **Sound design**: the brief asks for restrained sound design and
  notification hits. This repo's reels are voiceover-only, so the
  "notification, notification, notification → SILENCE" beat is carried
  visually — comment cards accelerate to an illegible field, then a single
  frame of black with one comment left standing.
- **No stock, no likeness**: creators, comments and the post are drawn from
  the kit's primitives. Every number that is not a real reported figure
  carries `CONCEPTUAL` type in frame.
- **`$1M` framing**: `1,000,000+` is labelled `REPORTED UPPER END` on screen
  and the line says "some reported offers", never "AI deals pay $1M".

## Verified

Two stills passes (2.5s grid + every cut, every entrance, the flood peak and
the push) plus five frames pulled from the finished mp4. Defects found and
fixed along the way, for the record: `$1,000,000+` overran the right margin
and sat on top of its own footnote; audience trust showed 100% from frame 0,
before the voice said what was falling; the HATE push wiped the frame to flat
orange for most of a second (the ramp is `ease.in` now, so the camera
accelerates into the letterform instead of parking inside it); the caption's
`+WRONG` put a second vermilion in a frame that already had creator C's row;
the crack over TRUST read as scratches until it was redrawn in the page colour
over the word; and three beats opened on an orphan label or an empty frame off
the cut.
