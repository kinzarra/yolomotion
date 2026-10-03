// 05–07 chat — the proof. One Claude-style conversation across three spoken
// lines: ask → results, pick → analysis, plan → ready. The stack scrolls
// itself: each message knows its height, so the offset needed to keep the
// newest one in view is a sum of springs, one per arrival.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { mcpColors } from "../palette";
import { SCENES } from "../timeline";
import {
  BrandBar,
  Strobe,
  CHAT,
  CHAT_VIEW,
  ChatFrame,
  ClaudeMsg,
  Creator,
  CreatorCard,
  MsgIn,
  PlanCard,
  QualityRow,
  SceneShell,
  ToolChip,
  UserMsg,
} from "../ui";

const H = mcpColors.avatarHues;
// Real portraits (Pexels, free licence) so no card in the demo is a
// silhouette. Files and credits: public/images/CREDITS.md.
const CREATORS: Creator[] = [
  { handle: "@miamifitkate", followers: "412K", er: "4.8%", hue: H[0], photo: "miamifitkate", quality: 91 },
  { handle: "@coach_dre305", followers: "228K", er: "6.1%", hue: H[1], photo: "coach_dre305", quality: 41 },
  { handle: "@tampa.lift", followers: "154K", er: "5.2%", hue: H[2], photo: "tampa_lift", quality: 88 },
  { handle: "@orlandoyoga.j", followers: "97K", er: "7.4%", hue: H[3], photo: "orlandoyoga_j", quality: 90 },
  { handle: "@flbeachbody", followers: "310K", er: "3.9%", hue: H[4], photo: "flbeachbody", quality: 37 },
  { handle: "@run.jax", followers: "66K", er: "8.2%", hue: H[5], photo: "run_jax", quality: 93 },
];
const PICKED = [0, 1, 2, 4, 5];
const FLAGGED = [1, 4];
const KEPT = [0, 2, 5];

// Beat offsets inside the chat span, in seconds.
const A = SCENES.analyze.from - SCENES.ask.from;
const P = SCENES.plan.from - SCENES.ask.from;

// The script. `at` in seconds from the span start; `h` the space the message
// takes (content + gap) so the scroll can be computed without measuring DOM.
const SCRIPT = {
  ask: { at: 0.3, typing: 1.5, h: 110 },
  search: { at: 2.2, done: 3.4, h: 92 },
  found: { at: 3.7, h: 90 },
  cards: { at: 4.1, h: 3 * 172 + 2 * 16 + 26 },
  pick: { at: A + 1.3, typing: 0.5, h: 110 },
  reports: { at: A + 2.0, done: A + 2.8, h: 92 },
  verdict: { at: A + 3.0, h: 90 },
  rows: { at: A + 3.15, h: 5 * 64 + 26 },
  plan: { at: P + 0.3, typing: 0.7, h: 110 },
  mediaplan: { at: P + 1.3, done: P + 2.3, h: 92 },
  card: { at: P + 2.5, ready: P + 3.7, h: 380 },
  next: { at: P + 4.9, h: 90 },
} as const;
const ORDER = Object.values(SCRIPT);

export const ChatScene: React.FC<{ query: string }> = ({ query }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  // Scroll: the extra offset each arrival needs, eased in with its own spring.
  let total = 0;
  let scroll = 0;
  for (const m of ORDER) {
    const before = Math.max(0, total - CHAT_VIEW);
    total += m.h;
    const after = Math.max(0, total - CHAT_VIEW);
    if (after > before && frame >= f(m.at)) {
      scroll += (after - before) * spring({ frame: frame - f(m.at), fps, config: theme.spring.smooth });
    }
  }

  const pickAt = (i: number) => {
    const k = PICKED.indexOf(i);
    return k < 0 ? -1 : f(A + 0.3 + k * 0.16);
  };
  const flagAt = (i: number) => {
    const k = FLAGGED.indexOf(i);
    return k < 0 ? -1 : f(A + 3.55 + k * 0.35);
  };

  const shutter = [SCRIPT.search.done, SCRIPT.reports.done, SCRIPT.mediaplan.done, SCRIPT.card.ready]
    .map((s) => frame - f(s))
    .reduce((acc, k) => acc + (k === 0 ? 0.22 : k === 1 ? 0.08 : 0), 0);

  return (
    <SceneShell>
      <BrandBar chapter="03 · IN THE CHAT" />
      <ChatFrame delay={2}>
        <div
          style={{
            position: "absolute",
            left: CHAT.pad,
            right: CHAT.pad,
            top: CHAT.pad,
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${-scroll}px)`,
          }}
        >
          <MsgIn at={f(SCRIPT.ask.at)} height={SCRIPT.ask.h}>
            <UserMsg at={f(SCRIPT.ask.at)} text={query} typing={f(SCRIPT.ask.typing)} />
          </MsgIn>
          <MsgIn at={f(SCRIPT.search.at)} height={SCRIPT.search.h}>
            <ToolChip at={f(SCRIPT.search.at)} done={f(SCRIPT.search.done)} tool="Creator Search" note="12 creators" />
          </MsgIn>
          <MsgIn at={f(SCRIPT.found.at)} height={SCRIPT.found.h}>
            <ClaudeMsg>Found 12 fitness creators in Florida. Top matches:</ClaudeMsg>
          </MsgIn>
          <MsgIn at={f(SCRIPT.cards.at)} height={SCRIPT.cards.h}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, paddingLeft: 0 }}>
              {CREATORS.map((c, i) => (
                <CreatorCard
                  key={c.handle}
                  c={c}
                  at={f(SCRIPT.cards.at) + i * 4}
                  picked={pickAt(i)}
                  flagged={flagAt(i)}
                  width={432}
                />
              ))}
            </div>
          </MsgIn>
          <MsgIn at={f(SCRIPT.pick.at)} height={SCRIPT.pick.h}>
            <UserMsg at={f(SCRIPT.pick.at)} text="These fit. Analyze them" typing={f(SCRIPT.pick.typing)} />
          </MsgIn>
          <MsgIn at={f(SCRIPT.reports.at)} height={SCRIPT.reports.h}>
            <ToolChip at={f(SCRIPT.reports.at)} done={f(SCRIPT.reports.done)} tool="Audience Report ×5" note="quality checked" />
          </MsgIn>
          <MsgIn at={f(SCRIPT.verdict.at)} height={SCRIPT.verdict.h}>
            <ClaudeMsg>Two have a low-quality audience. Dropping them:</ClaudeMsg>
          </MsgIn>
          <MsgIn at={f(SCRIPT.rows.at)} height={SCRIPT.rows.h}>
            {PICKED.map((i, k) => (
              <QualityRow key={CREATORS[i].handle} c={CREATORS[i]} at={f(SCRIPT.rows.at) + k * 4} flagged={flagAt(i)} />
            ))}
          </MsgIn>
          <MsgIn at={f(SCRIPT.plan.at)} height={SCRIPT.plan.h}>
            <UserMsg at={f(SCRIPT.plan.at)} text="Add the rest to a media plan" typing={f(SCRIPT.plan.typing)} />
          </MsgIn>
          <MsgIn at={f(SCRIPT.mediaplan.at)} height={SCRIPT.mediaplan.h}>
            <ToolChip at={f(SCRIPT.mediaplan.at)} done={f(SCRIPT.mediaplan.done)} tool="Media Plan" note="3 creators added" />
          </MsgIn>
          <MsgIn at={f(SCRIPT.card.at)} height={SCRIPT.card.h}>
            <PlanCard
              at={f(SCRIPT.card.at)}
              ready={f(SCRIPT.card.ready)}
              rows={[
                { c: CREATORS[KEPT[0]], format: "Reel + Story", price: "$3,200" },
                { c: CREATORS[KEPT[1]], format: "Reel", price: "$2,400" },
                { c: CREATORS[KEPT[2]], format: "Reel ×2", price: "$2,800" },
              ]}
              totals={{ reach: "1.2M", cpm: "$7.0", budget: 8400 }}
            />
          </MsgIn>
          <MsgIn at={f(SCRIPT.next.at)} height={SCRIPT.next.h}>
            <ClaudeMsg>Plan is ready. Want me to set up the campaign next?</ClaudeMsg>
          </MsgIn>
        </div>
      </ChatFrame>
      <Strobe amount={shutter} />
    </SceneShell>
  );
};
