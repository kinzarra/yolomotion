// 04 tools — four capabilities as cards, each with its own small picture and
// its numbers, lit on the word that names it. Ghosted before, so the list is
// legible muted; alive when the voice reaches it.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { DURATIONS } from "../durations";
import { mcpColors, mcpPalette } from "../palette";
import { VO_RATE } from "../timeline";
import { BrandBar, Cutout, Icon, IconName, Label, MonoChip, PhotoAvatar, SceneShell, Venn } from "../ui";

const LEAD = 0.25;
const CLIP = DURATIONS["04-tools"] / VO_RATE;
const H = mcpColors.avatarHues;
// The same six portraits the chat demo uses, so the reel introduces its cast
// once and keeps it. Files + credits: public/images/CREDITS.md.
const FACES = ["miamifitkate", "coach_dre305", "tampa_lift", "orlandoyoga_j", "flbeachbody", "run_jax"];

type Card = { icon: IconName; title: string; line: string; chips: string[]; at: number };
const CARDS: Card[] = [
  { icon: "search", title: "FIND THE RIGHT CREATORS", line: "By niche, city, ER and audience fit", chips: ["ER > 4%", "97K to 412K", "12 matches"], at: 0.08 },
  { icon: "shield", title: "ANALYZE THEIR AUDIENCE", line: "Bots, spam and bought followers get flagged", chips: ["real 91%", "bots 59%", "2 flagged"], at: 0.28 },
  { icon: "overlap", title: "CHECK THE OVERLAP", line: "Never pay twice for the same audience", chips: ["23% shared", "3 creators"], at: 0.46 },
  { icon: "table", title: "BUILD THE MEDIA PLAN", line: "Formats, prices and dates in one table", chips: ["$8,400", "1.2M reach", "READY"], at: 0.62 },
];

const ease = (frame: number, from: number, len: number) =>
  interpolate(frame, [from, from + len], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* the small pictures — pure CSS/SVG, driven by the card's `lit` frame */
const SearchViz: React.FC<{ hit: number }> = ({ hit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width: 250, height: 180, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14, background: mcpColors.surfaceLift, border: `1px solid ${mcpColors.line}` }}>
        <Icon name="search" size={22} color={mcpPalette.textDim} />
        <span style={{ fontFamily: theme.fonts.mono, fontSize: 17, color: mcpPalette.text, whiteSpace: "nowrap" }}>fitness · Florida</span>
      </div>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {FACES.slice(0, 5).map((photo, i) => (
          <PhotoAvatar key={photo} photo={photo} size={34} delay={hit + 4 + i * 3} />
        ))}
        <span style={{ fontFamily: theme.fonts.mono, fontSize: 18, color: mcpPalette.accent, opacity: ease(frame, hit + 16, 10) }}>+7</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["FL", "fitness", "IG · TT"].map((c) => (
          <MonoChip key={c} size={15} color={mcpPalette.textDim} border={mcpColors.line}>{c}</MonoChip>
        ))}
      </div>
    </div>
  );
};

const AnalyzeViz: React.FC<{ hit: number }> = ({ hit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = ease(frame, hit + 4, 26);
  const b = ease(frame, hit + 10, 26);
  const stamp = spring({ frame: frame - hit - 30, fps, config: theme.spring.bouncy });
  const row = (name: string, fill: number, bad: boolean, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.mono, fontSize: 17 }}>
      <span style={{ width: 84, color: mcpPalette.text, whiteSpace: "nowrap", overflow: "hidden", textDecoration: bad ? "line-through" : "none", opacity: bad ? 0.55 : 1, fontSize: 15 }}>{name}</span>
      <div style={{ flex: 1, height: 12, borderRadius: 6, background: mcpColors.surfaceLift, overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: bad ? mcpColors.dim : mcpPalette.primary }} />
      </div>
      <span style={{ width: 74, textAlign: "right", whiteSpace: "nowrap", fontSize: 15, color: bad ? mcpPalette.textDim : mcpPalette.accent }}>{label}</span>
    </div>
  );
  return (
    <div style={{ width: 250, height: 180, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, position: "relative" }}>
      {row("@miamifitkate", a * 0.91, false, "91%")}
      {row("@coach_dre305", b * 0.41, true, "bots 59%")}
      {row("@flbeachbody", b * 0.37, true, "bots 63%")}
      <div
        style={{
          position: "absolute",
          right: 84,
          top: 66,
          padding: "6px 12px",
          border: `2px solid ${mcpPalette.textDim}`,
          borderRadius: 8,
          fontFamily: theme.fonts.mono,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: mcpPalette.textDim,
          transform: `rotate(-10deg) scale(${stamp})`,
          opacity: stamp,
        }}
      >
        FAKE
      </div>
    </div>
  );
};

const PlanViz: React.FC<{ hit: number }> = ({ hit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows: [string, string, string][] = [
    ["@miamifitkate", "$3,200", "miamifitkate"],
    ["@tampa.lift", "$2,400", "tampa_lift"],
    ["@run.jax", "$2,800", "run_jax"],
  ];
  const ready = spring({ frame: frame - hit - 30, fps, config: theme.spring.bouncy });
  return (
    <div style={{ width: 250, height: 180, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, fontFamily: theme.fonts.mono, fontSize: 17 }}>
      {rows.map(([n, v, photo], i) => {
        const p = spring({ frame: frame - hit - 4 - i * 4, fps, config: theme.spring.snappy });
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
            <PhotoAvatar photo={photo} size={24} />
            <span style={{ flex: 1, color: mcpPalette.text }}>{n}</span>
            <span style={{ color: mcpPalette.text }}>{v}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, paddingTop: 8, borderTop: `1px solid ${mcpColors.lineStrong}` }}>
        <Icon name="calendar" size={20} color={mcpPalette.textDim} />
        <span style={{ color: mcpPalette.textDim, whiteSpace: "nowrap" }}>2 weeks</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: theme.fonts.display, fontSize: 26, fontWeight: 700, color: mcpPalette.text }}>$8,400</span>
        <span style={{ padding: "4px 10px", borderRadius: 999, background: mcpPalette.primary, color: mcpPalette.text, fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", transform: `scale(${ready})` }}>READY</span>
      </div>
    </div>
  );
};

export const ToolsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell>
      <BrandBar chapter="02 · WHAT IT DOES" />
      <div style={{ position: "absolute", left: 90, top: 268 }}>
        <Label delay={3}>YOUR AGENT CAN NOW</Label>
      </div>
      {CARDS.map((c, i) => {
        const ghost = spring({ frame: frame - 4 - i * 3, fps, config: theme.spring.smooth });
        const hit = Math.round((LEAD + c.at * CLIP) * fps);
        const lit = spring({ frame: frame - hit, fps, config: theme.spring.snappy });
        const y = 328 + i * 248;
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: 90,
              width: 900,
              top: y,
              height: 232,
              borderRadius: 30,
              background: mcpColors.surface,
              border: `1px solid ${lit > 0.5 ? mcpPalette.primary : mcpColors.line}`,
              boxShadow: lit > 0.5 ? `0 24px 70px -40px ${mcpPalette.glow}` : mcpColors.shadow,
              opacity: ghost * interpolate(lit, [0, 1], [0.52, 1]),
              transform: `translateX(${interpolate(ghost, [0, 1], [side * 120, 0]) + interpolate(lit, [0, 1], [0, 0])}px) scale(${interpolate(lit, [0, 1], [0.985, 1])})`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 26px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div style={{ width: 250, flexShrink: 0, filter: `saturate(${interpolate(lit, [0, 1], [0.2, 1])})` }}>
              {i === 0 && <SearchViz hit={hit} />}
              {i === 1 && <AnalyzeViz hit={hit} />}
              {i === 2 && (
                <div style={{ width: 250, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Venn progress={ease(frame, hit + 4, 30)} width={240} label="23%" />
                </div>
              )}
              {i === 3 && (
                <div style={{ position: "relative", width: 250, height: 180 }}>
                  {/* the author's media-plan drawing sits behind its own data */}
                  <div style={{ position: "absolute", left: -10, top: -6, opacity: 0.3 }}>
                    <Cutout src="footage/yoloco-mcp/cut-media-plan.png" height={190} delay={hit} float={0.6} />
                  </div>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <PlanViz hit={hit} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: lit > 0.5 ? mcpPalette.primary : mcpColors.surfaceLift, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={c.icon} size={24} />
                </span>
                <span style={{ fontFamily: theme.fonts.mono, fontSize: 20, color: mcpPalette.textDim, letterSpacing: "0.1em" }}>0{i + 1}</span>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 44, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02, color: mcpPalette.text }}>
                {c.title}
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 23, lineHeight: 1.25, color: mcpPalette.textDim, marginTop: 8 }}>{c.line}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {c.chips.map((chip, k) => {
                  const p = spring({ frame: frame - hit - 8 - k * 4, fps, config: theme.spring.snappy });
                  return (
                    <span key={chip} style={{ opacity: Math.max(0.35, p), transform: `translateY(${(1 - p) * 10}px)` }}>
                      <MonoChip size={16} color={chip === "READY" ? mcpPalette.text : mcpPalette.accent} border={chip === "READY" ? mcpPalette.primary : mcpColors.lineStrong}>
                        {chip}
                      </MonoChip>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </SceneShell>
  );
};
