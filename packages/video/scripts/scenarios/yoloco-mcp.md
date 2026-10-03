# Yoloco MCP — Influencer marketing runs on agents

- **id**: yoloco-mcp
- **format**: reel (1080×1920), 47.8s, English, for TikTok
- **series**: standalone product promo; kit re-exported from `yoloco-audience-fit` (Yoloco brand)
- **hero color**: Yoloco violet #6071FF; second (equally scarce) signal: Claude clay #D97757 — only on the Claude mark / agent side
- **hook (first 2s)**: cartoon Philipp fills the frame (the author's portrait collage `public/footage/yoloco-mcp/collage-portrait.png`, 4:5), alive: parallax matte, head bob, breathing, slow push, then full-bleed pull-back
- **face**: the cartoon, animated in Remotion. NO HeyGen (user decision 2026-09-16: «не нужно HeyGen — давай сам оживи»)
- **voice**: `vEwyfyXy2Qc8PnNvEdqA` — the author's own voice, chosen by him in round 3. It replaced Liam, which had replaced the accented house clone. VO_RATE 1.05
- **on-screen rules from the review**: no em dashes anywhere; no snake_case tool names, human names + icons instead; more information per frame; TikTok effects (strobe on the cut, shutter flash on tool completion, punch on the headline hit)

## Beats
1. **hook** (claim) — tight on the cartoon face → camera pulls back until the whole chaos desk is a 16:9 plate under «INFLUENCER MARKETING IS CHANGING». On the last word: SNAP burst at the hand on the head, then the TikTok strobe.
   - улика: the illustration itself (own artwork), background graded grey-violet, the character stays in colour — he is the one live element
2. **agents** (turn) — strobe resolves into a clean Yoloco world; the same cartoon, smaller, with agent nodes orbiting the head; «EVERYTHING RUNS ON AGENTS»
3. **mcp** (claim) — Claude mark ⟷ Yoloco tile, pulses flowing along the link, «MCP» between them; «YOLOCO MCP SERVER · LIVE»
4. **tools** (claim) — four rows land on the spoken words: FIND CREATORS `search_run` · ANALYZE `report_get` · AUDIENCE OVERLAP `overlap_create` · MEDIA PLAN `mediaplan_add` — real tool names from `mcp_servers/platform/README.md`
5. **ask** (proof) — Claude chat: user (cartoon avatar) types «Find me fitness instructors in Florida» → tool chip `search_run · Yoloco MCP` → 6 creator cards
6. **analyze** (proof) — user ticks 5 cards, «These fit — analyze them» → `report_get` → two flagged «low-quality audience» (dim + strike, no third colour)
7. **plan** (payoff) — «Add the rest to a media plan» → `mediaplan_add` → plan card: 3 creators, reach, CPM, budget, READY
8. **cta** — «MCP · powered by Yoloco», Claude/ChatGPT/Cursor chip, `yoloco.io/mcp`; cartoon thumbs-up (the phone thumbnail from the illustration) peeks in

## Voiceover (v2, no em dashes)
- `01-hook`: Hi, I'm Philipp, founder of Yoloco. Let me show you how influencer marketing is changing.
- `02-agents`: Welcome to the new era. The AI revolution. Today, everything runs on agents.
- `03-mcp`: And influencer marketing is not falling behind. At Yoloco, we launched an MCP server.
- `04-tools`: Your agent can now find the right creators, analyze their audience, check the overlap, and build the media plan. Straight from the chat.
- `05-ask`: Watch. Find me fitness instructors in Florida. The agent searches Yoloco and brings back creators.
- `06-analyze`: You pick the ones you like. It analyzes them, and flags the two with a fake audience.
- `07-plan`: Add the rest to a media plan. Done. Budget, reach, dates. In one message.
- `08-cta`: MCP. Powered by Yoloco. Scan the code, or grab the link in bio.

## CTA
MCP · POWERED BY YOLOCO · QR → https://app.yoloco.io/mcp · github.com/yoloco/mcp · mcpservers.org/servers/yoloco/mcp · hosts: Claude, Codex, Cursor

## Art from the author (Codex briefs)
`scenarios/yoloco-mcp-art-prompts.md` — one prompt per file. All six were delivered on 2026-09-16 and are in the reel:

| file | where |
|---|---|
| `collage-portrait.png` | hook, both camera phases (matte + blurred bg generated from it) |
| `philipp-agents.png` | agents beat, arms crossed under the orbit |
| `philipp-cta.png` | CTA, pointing at the QR |
| `robot.png` | agents beat (upper right) and MCP beat (left of the word) |
| `creator-selfie-1.png` | MCP beat, the phone card |
| `media-plan.png` | tools beat, behind card 04 |

They arrive with the transparency checkerboard drawn in as pixels, so each is
cut with `scripts/matte.swift` into `cut-<name>.png` before use.

## Demo creator portraits
Six real photographs from Pexels, square face-centred crops via
`scripts/facecrop.swift` (Vision), graded into the palette at render time.
Credited in `public/images/CREDITS.md`. **The two accounts the reel flags as
having a fake audience use faceless photographs on purpose** — see the note
there; it is a claim-about-a-real-person problem, not a styling choice.

## Publishing copy
`scenarios/yoloco-mcp-copy.md` — title, description, hashtags, YouTube tags and the pinned first comment, plus the line on which numbers may be repeated as fact.

## Deviations
- No HeyGen: the brief said «мой HeyGen бери самый топовый вариант», the user then switched to «сам оживи». The cartoon is animated in Remotion: Vision matte (`scripts/matte.swift`) → two layers (blur-inpainted background + character), parallax, head bob, breathing, push-in → pull-back, snap burst, strobe. $0 spent.
- The brief lists «add to media plan» twice (before and after overlap); the reel names four capabilities once: find → analyze → overlap → media plan.
- The snap is silent: voiceover-only is a standing decision of this repo. One click SFX can be added if wanted.
- «Плохая аудитория» → «fake audience» in the voice, «low-quality audience» on screen; flagged cards go dim + struck instead of red, so the reel keeps two colours (Yoloco violet, Claude clay).
- ~50s (v2) instead of ~30s: the author asked for more information per frame; the native voice reads slower than the clone, so the beats grew with the clips (measured). The turn («new era / everything runs on agents») still lands at 6–12s.
- v4 review (2026-09-16): the orbit in the agents beat was flat-out wrong — every chip painted over the author, so they read as stickers on glass rather than as things circling him. Rebuilt with real depth ordering (far half before the cutout, near half after, ring clipped in two), the ellipse flattened and dropped onto his chest so the far arc is actually occluded, spin raised to 40°/s so every chip crosses within the beat, and labels anchored by their inner edge so they stay inside the frame at the extremes.
- v3 review (2026-09-16): voice → the author's own (`vEwyfyXy2Qc8PnNvEdqA`), and every beat retimed to the re-measured clips; the 11.5s agents→MCP cut became a real TikTok flash cut (`TikTokCut`, 5 frames out + 5 in, one white peak on the boundary, chromatic tear, light streaks, zoom punch) and the same primitive now carries the 6.0s hook cut; all six Codex illustrations wired in; the demo cast became real photographs everywhere a silhouette used to be, including the tools beat.
- v2 review (2026-09-16): voice → Liam; em dashes removed from voice, captions and chat; `search_run`-style names replaced by Creator Search / Audience Analytics / Audience Overlap / Media Plans / Campaigns with icons; the MCP beat gained a robot, stat pills (58 tools from the server README, 91% real audience and 23% shared from the demo data) and creator phone cards cut from the collage; the tools beat became four illustrated cards with numbers; the CTA gained an animated QR (app.yoloco.io/mcp), GitHub + mcpservers.org chips, host tiles, and a slot for a new drawing of the author.
- The chat UI is a Claude-style mock (dark panel, clay mark), not a screenshot: no third-party names on screen beyond «Claude».
