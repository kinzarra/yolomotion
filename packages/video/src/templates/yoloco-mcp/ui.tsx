// Yoloco MCP kit. Re-exports the Yoloco brand kit (shell, type, marks) and
// adds what this promo needs: the animated cartoon, the snap + strobe, the
// Claude mark, and a Claude-style chat.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { mcpColors, mcpPalette } from "./palette";
import { Avatar, YolocoTile } from "../yoloco-audience-fit/ui";

// Every photograph in this reel is graded the same way: desaturated and
// cooled, so a real portrait can sit next to the one hero colour without
// stealing it. Applied by PhotoAvatar, PhoneCard and any footage after them.
export const PHOTO_GRADE = "saturate(0.34) contrast(1.07) brightness(1.02)";

export * from "../yoloco-audience-fit/ui";
export { Glitch } from "../digital-ruble/ui";

/* ------------------------------------------------------------- cartoon */

// Landmarks measured on the illustration (source px, 1672×941). The matte is
// the character on transparency at full extent; the bg is the illustration
// with the character region blur-filled, so the layers can drift apart.
export const ART = {
  w: 1122,
  h: 1402,
  center: { x: 561, y: 701 },
  face: { x: 690, y: 672 }, // Vision: 124px face box at (677, 693)
  neck: { x: 700, y: 790 },
  hand: { x: 778, y: 622 }, // the hand on the head — where the snap happens
} as const;

export type Pt = { x: number; y: number };
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/**
 * The illustration as two layers: a graded, dimmed background (the chaos) and
 * the character in colour on top — he is the one live element. `anchor` is a
 * source point, `at` is where it lands in the frame; the scene drives the
 * camera by moving those and `scale`. Bob/breathe keep a still drawing alive.
 */
export const Cartoon: React.FC<{
  scale: number;
  anchor: Pt;
  at: Pt;
  grade?: number; // 0–1 grayscale on the background
  dim?: number; // 0–1 darkening on the background
  tint?: number; // 0–1 hero-colour wash on the background
  parallax?: number; // px: character shifts, background shifts a third the other way
  bob?: number; // 0–1 head/body sway amplitude
  bgOpacity?: number;
  opacity?: number;
  radius?: number; // rounded corners on the plate
  fadeFrom?: number; // fraction of the art height where the character fades out (no desk)
}> = ({
  scale,
  anchor,
  at,
  grade = 0,
  dim = 0,
  tint = 0,
  parallax = 0,
  bob = 1,
  bgOpacity = 1,
  opacity = 1,
  radius = 0,
  fadeFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = ART.w * scale;
  const h = ART.h * scale;
  const layer: React.CSSProperties = {
    position: "absolute",
    left: at.x - anchor.x * scale,
    top: at.y - anchor.y * scale,
    width: w,
    height: h,
    maxWidth: "none",
    borderRadius: radius,
  };
  const fade =
    fadeFrom > 0
      ? `linear-gradient(180deg, #000 ${fadeFrom * 100}%, transparent ${Math.min(100, fadeFrom * 100 + 9)}%)`
      : undefined;
  const bobY = Math.sin(t * 1.7) * 7 * bob;
  const bobR = Math.sin(t * 1.15 + 0.6) * 1.3 * bob;
  const breathe = 1 + Math.sin(t * 1.9) * 0.007 * bob;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity }}>
      {bgOpacity > 0.001 && (
        <>
          <Img
            src={staticFile("footage/yoloco-mcp/collage-bg.png")}
            style={{
              ...layer,
              opacity: bgOpacity,
              filter: `grayscale(${grade}) brightness(${1 - dim * 0.5}) contrast(1.06)`,
              transform: `translateX(${-parallax * 0.35}px)`,
            }}
          />
          {tint > 0.001 && (
            <div
              style={{
                ...layer,
                background: mcpPalette.primary,
                mixBlendMode: "color",
                opacity: tint * bgOpacity,
              }}
            />
          )}
        </>
      )}
      <Img
        src={staticFile("footage/yoloco-mcp/collage-matte.png")}
        style={{
          ...layer,
          transformOrigin: `${ART.neck.x * scale}px ${ART.neck.y * scale}px`,
          transform: `translate(${parallax}px, ${bobY}px) rotate(${bobR}deg) scale(${breathe})`,
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />
    </div>
  );
};

/** The cartoon's face in a ring — the "user" in the chat, the author in a corner. */
export const FaceAvatar: React.FC<{ size?: number; ring?: string; style?: React.CSSProperties }> = ({
  size = 56,
  ring = mcpPalette.primary,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      border: `${Math.max(2, size * 0.05)}px solid ${ring}`,
      flexShrink: 0,
      ...style,
    }}
  >
    <Img
      src={staticFile("footage/yoloco-mcp/philipp-face.png")}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  </div>
);

/* ---------------------------------------------------------- snap/strobe */

/** Comic snap at a point: ring + rays + the word. Dead outside its window. */
export const SnapBurst: React.FC<{ at: number; x: number; y: number; life?: number }> = ({
  at,
  x,
  y,
  life = 26,
}) => {
  // The word sits to whichever side of the burst has room. Pinned right, it
  // ran off the frame edge and delivered "SNA".
  const left = x > 640;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Expansion decelerates (ease out); the fade holds, then drops (ease in) —
  // driving opacity off the same ease-out killed the word before it landed.
  const p = interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [at, at + life], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word = spring({ frame: frame - at - 1, fps, config: theme.spring.bouncy });
  if (frame < at || frame >= at + life) return null;
  const ring = 40 + p * 520;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      <div
        style={{
          position: "absolute",
          left: -ring / 2,
          top: -ring / 2,
          width: ring,
          height: ring,
          borderRadius: "50%",
          border: `${Math.round(16 * (1 - p) + 3)}px solid ${mcpPalette.text}`,
          opacity: fade,
        }}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 + 15) * (Math.PI / 180);
        const d = 70 + p * 230 + (i % 2) * 36;
        const len = 22 + (1 - p) * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(a) * d,
              top: Math.sin(a) * d,
              width: len,
              height: 10,
              marginTop: -5,
              borderRadius: 5,
              background: i % 3 === 0 ? mcpPalette.primary : mcpPalette.text,
              transform: `rotate(${i * 30 + 15}deg)`,
              transformOrigin: "0 50%",
              opacity: fade,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: left ? undefined : 40,
          right: left ? 1080 - x + 40 : undefined,
          top: -190,
          fontFamily: theme.fonts.display,
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: mcpPalette.text,
          opacity: fade * Math.min(1, word * 1.4),
          transform: `rotate(-8deg) scale(${interpolate(word, [0, 1], [0.4, 1])})`,
          textShadow: `0 6px 40px rgba(0,0,0,0.6), 0 0 40px ${mcpPalette.glow}`,
          whiteSpace: "nowrap",
        }}
      >
        SNAP!
      </div>
    </div>
  );
};

// TikTok-style flash: hard white frames alternating with the picture, decaying.
export const STROBE_OUT = [1, 0.12, 0.9, 0, 0.6, 0.08, 0.35, 0] as const;
export const STROBE_IN = [0.95, 0.15, 0.55, 0, 0.25, 0] as const;
export const strobeAt = (frame: number, at: number, seq: readonly number[]) => {
  const k = frame - at;
  return k < 0 || k >= seq.length ? 0 : seq[k];
};

export const Strobe: React.FC<{ amount: number }> = ({ amount }) =>
  amount <= 0.001 ? null : (
    <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: amount }} />
  );

/* ---------------------------------------------------------- claude mark */

/** Claude's sunburst, abstracted: twelve uneven spokes in clay. */
export const ClaudeMark: React.FC<{ size?: number; delay?: number; spin?: number; color?: string }> = ({
  size = 120,
  delay = 0,
  spin = 0.12,
  color = mcpColors.clay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const r = size / 2;
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 + 8) * Math.PI) / 180;
    const len = r * (0.72 + ((i * 7) % 4) * 0.07);
    return { x1: r + Math.cos(a) * r * 0.16, y1: r + Math.sin(a) * r * 0.16, x2: r + Math.cos(a) * len, y2: r + Math.sin(a) * len };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        display: "block",
        opacity: p,
        transform: `rotate(${(frame / fps) * spin * 60}deg) scale(${interpolate(p, [0, 1], [0.5, 1])})`,
      }}
    >
      {spokes.map((s, i) => (
        <line key={i} {...s} stroke={color} strokeWidth={size * 0.11} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** Dark rounded tile with the Claude mark inside — the agent's side of the link. */
export const ClaudeTile: React.FC<{ size?: number; delay?: number }> = ({ size = 220, delay = 0 }) => {
  const p = spring({ frame: useCurrentFrame() - delay, fps: useVideoConfig().fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: mcpColors.chatBg,
        border: `1px solid ${mcpColors.lineStrong}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        boxShadow: `0 ${size * 0.14}px ${size * 0.4}px -${size * 0.14}px ${mcpColors.clayGlow}`,
      }}
    >
      <ClaudeMark size={size * 0.56} delay={delay + 4} />
    </div>
  );
};

/* ------------------------------------------------------------ mono chip */

export const MonoChip: React.FC<{
  children: React.ReactNode;
  color?: string;
  border?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = mcpPalette.textDim, border = mcpColors.line, size = 24, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      border: `1px solid ${border}`,
      fontFamily: theme.fonts.mono,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "0.04em",
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/* -------------------------------------------------------------- chat */

// Shared frame geometry so the demo scenes and the timeline agree.
export const CHAT = { x: 60, y: 250, w: 960, h: 1090, head: 96, pad: 36 } as const;
export const CHAT_VIEW = CHAT.h - CHAT.head - CHAT.pad * 2;

export const ChatFrame: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const blink = Math.sin(frame / 8) > -0.2 ? 1 : 0.35;
  return (
    <div
      style={{
        position: "absolute",
        left: CHAT.x,
        top: CHAT.y,
        width: CHAT.w,
        height: CHAT.h,
        borderRadius: 44,
        background: mcpColors.chatBg,
        border: `1px solid ${mcpColors.chatLine}`,
        boxShadow: mcpColors.shadow,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
      }}
    >
      <div
        style={{
          height: CHAT.head,
          display: "flex",
          alignItems: "center",
          padding: `0 ${CHAT.pad}px`,
          gap: 16,
          borderBottom: `1px solid ${mcpColors.chatLine}`,
          fontFamily: theme.fonts.body,
        }}
      >
        <ClaudeMark size={30} spin={0} />
        <span style={{ fontSize: 30, fontWeight: 600, color: mcpColors.ivory, letterSpacing: "-0.02em" }}>
          Claude
        </span>
        <span style={{ flex: 1 }} />
        <MonoChip size={21} color={mcpPalette.text} border={mcpColors.lineStrong}>
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: mcpPalette.primary,
              opacity: blink,
              boxShadow: `0 0 12px ${mcpPalette.glow}`,
            }}
          />
          Yoloco MCP
        </MonoChip>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: CHAT.head, bottom: 0, overflow: "hidden" }}>
        {children}
      </div>
      {/* soft ceiling and floor so a scrolled message never hard-cuts on an edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CHAT.head,
          height: 44,
          background: `linear-gradient(180deg, ${mcpColors.chatBg}, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          background: `linear-gradient(180deg, transparent, ${mcpColors.chatBg})`,
        }}
      />
    </div>
  );
};

/** Entrance for one message: rises and settles once its frame comes. */
export const MsgIn: React.FC<{ at: number; height: number; children: React.ReactNode }> = ({
  at,
  height,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  return (
    <div
      style={{
        height,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
        transformOrigin: "50% 100%",
      }}
    >
      {children}
    </div>
  );
};

const Caret: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    style={{
      display: "inline-block",
      width: 3,
      height: "1em",
      marginLeft: 4,
      background: mcpColors.ivory,
      verticalAlign: "-0.15em",
      opacity: on ? 1 : 0,
    }}
  />
);

/** User bubble, right-aligned, typed out over `typing` frames from `at`. */
export const UserMsg: React.FC<{ at: number; text: string; typing?: number }> = ({ at, text, typing = 30 }) => {
  const frame = useCurrentFrame();
  const shown = typing <= 0 ? text.length : Math.round(
    interpolate(frame, [at, at + typing], [0, text.length], {
      easing: theme.ease.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const done = frame > at + typing + 2;
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 16 }}>
      <div
        style={{
          maxWidth: 700,
          padding: "20px 28px",
          borderRadius: "28px 28px 8px 28px",
          background: mcpColors.chatBubble,
          fontFamily: theme.fonts.body,
          fontSize: 32,
          lineHeight: 1.3,
          color: mcpColors.ivory,
          letterSpacing: "-0.01em",
        }}
      >
        {text.slice(0, shown)}
        <Caret on={!done && Math.floor(frame / 8) % 2 === 0} />
      </div>
      <FaceAvatar size={60} />
    </div>
  );
};

/** Claude speaks plainly — a mark and text, no bubble. */
export const ClaudeMsg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
    <ClaudeMark size={40} spin={0} />
    <div
      style={{
        flex: 1,
        paddingTop: 4,
        fontFamily: theme.fonts.body,
        fontSize: 32,
        lineHeight: 1.3,
        color: mcpColors.ivory,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </div>
  </div>
);

/** A tool call: spinner in clay while it runs, Yoloco check when it lands. */
export const ToolChip: React.FC<{ at: number; done: number; tool: string; note: string }> = ({
  at,
  done,
  tool,
  note,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finished = frame >= done;
  const check = spring({ frame: frame - done, fps, config: theme.spring.snappy });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, paddingLeft: 58 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 22px 12px 16px",
          borderRadius: 16,
          background: mcpColors.chatSurface,
          border: `1px solid ${finished ? mcpPalette.primary : mcpColors.chatLine}`,
        }}
      >
        {finished ? (
          <svg width={30} height={30} viewBox="0 0 30 30" style={{ transform: `scale(${check})` }}>
            <circle cx={15} cy={15} r={14} fill={mcpPalette.primary} />
            <path d="M8 15.5l4.5 4.5L22 11" stroke={mcpPalette.text} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width={30} height={30} viewBox="0 0 30 30" style={{ transform: `rotate(${(frame - at) * 14}deg)` }}>
            <circle cx={15} cy={15} r={11} stroke={mcpColors.claySoft} strokeWidth={4} fill="none" />
            <path d="M15 4a11 11 0 0 1 11 11" stroke={mcpColors.clay} strokeWidth={4} fill="none" strokeLinecap="round" />
          </svg>
        )}
        <span style={{ fontFamily: theme.fonts.body, fontSize: 27, fontWeight: 600, color: mcpColors.ivory, letterSpacing: "-0.01em" }}>
          {tool}
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: mcpColors.ivoryDim, letterSpacing: "0.04em" }}>
          Yoloco MCP
        </span>
      </div>
      <span
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 26,
          color: finished ? mcpColors.ivoryDim : mcpColors.ivoryFaint,
          opacity: finished ? check : 0.8,
        }}
      >
        {finished ? note : "running…"}
      </span>
    </div>
  );
};

// A demo creator. `photo` names a file in public/footage/yoloco-mcp/avatars/
// (real portraits, credited); `hue` is the fallback silhouette gradient.
export type Creator = { handle: string; followers: string; er: string; hue: string; photo?: string; quality?: number };

/** One creator in the results grid. `picked` / `flagged` are frames (or -1). */
export const CreatorCard: React.FC<{ c: Creator; at: number; picked?: number; flagged?: number; width?: number }> = ({
  c,
  at,
  picked = -1,
  flagged = -1,
  width = 282,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const tick = picked >= 0 ? spring({ frame: frame - picked, fps, config: theme.spring.bouncy }) : 0;
  const dead = flagged >= 0 ? spring({ frame: frame - flagged, fps, config: theme.spring.smooth }) : 0;
  const isPicked = picked >= 0 && frame >= picked;
  return (
    <div
      style={{
        width,
        padding: 18,
        borderRadius: 24,
        background: mcpColors.chatSurface,
        border: `1px solid ${isPicked && dead < 0.5 ? mcpPalette.primary : mcpColors.chatLine}`,
        position: "relative",
        opacity: p * (1 - dead * 0.6),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        filter: `saturate(${1 - dead})`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {c.photo ? (
          <PhotoAvatar photo={c.photo} size={64} ring={isPicked && dead < 0.5 ? mcpPalette.primary : undefined} muted={dead > 0.5} />
        ) : (
          <Avatar size={64} hue={c.hue} muted={dead > 0.5} />
        )}
        <div style={{ fontFamily: theme.fonts.body, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: mcpColors.ivory, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {c.handle}
          </div>
          <div style={{ fontSize: 21, color: mcpColors.ivoryDim, marginTop: 2, whiteSpace: "nowrap" }}>
            {c.followers} · ER {c.er}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <MonoChip size={17} color={mcpColors.ivoryDim} border={mcpColors.chatLine}>FL</MonoChip>
        <MonoChip size={17} color={mcpColors.ivoryDim} border={mcpColors.chatLine}>fitness</MonoChip>
      </div>
      {picked >= 0 && frame >= picked && (
        <svg
          width={40}
          height={40}
          viewBox="0 0 30 30"
          style={{ position: "absolute", right: -10, top: -10, transform: `scale(${tick})` }}
        >
          <circle cx={15} cy={15} r={14} fill={mcpPalette.primary} />
          <path d="M8 15.5l4.5 4.5L22 11" stroke={mcpPalette.text} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {flagged >= 0 && frame >= flagged && (
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 48,
            height: 3,
            background: mcpColors.ivoryDim,
            transform: `scaleX(${dead})`,
            transformOrigin: "0 50%",
          }}
        />
      )}
    </div>
  );
};


/** Audience-quality row: name, bar, verdict. Flagged rows sink and strike. */
export const QualityRow: React.FC<{ c: Creator; at: number; flagged?: number }> = ({ c, at, flagged = -1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const fill = interpolate(frame, [at + 4, at + 30], [0, c.quality ?? 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dead = flagged >= 0 ? spring({ frame: frame - flagged, fps, config: theme.spring.smooth }) : 0;
  const bad = (c.quality ?? 100) < 60;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        height: 64,
        paddingLeft: 58,
        opacity: p * (1 - dead * 0.55),
        transform: `translateX(${interpolate(p, [0, 1], [24, 0])}px)`,
        fontFamily: theme.fonts.body,
      }}
    >
      {c.photo ? <PhotoAvatar photo={c.photo} size={44} muted={dead > 0.5} /> : <Avatar size={44} hue={c.hue} muted={dead > 0.5} />}
      <span style={{ width: 230, fontSize: 25, fontWeight: 600, color: mcpColors.ivory, position: "relative" }}>
        {c.handle}
        {flagged >= 0 && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              width: "100%",
              height: 3,
              background: mcpColors.ivoryDim,
              transform: `scaleX(${dead})`,
              transformOrigin: "0 50%",
            }}
          />
        )}
      </span>
      <div style={{ flex: 1, height: 14, borderRadius: 7, background: mcpColors.chatBubble, overflow: "hidden" }}>
        <div
          style={{
            width: `${fill}%`,
            height: "100%",
            borderRadius: 7,
            background: bad ? mcpColors.ivoryFaint : mcpPalette.primary,
          }}
        />
      </div>
      <span
        style={{
          width: 210,
          fontSize: 22,
          fontFamily: theme.fonts.mono,
          color: bad ? mcpColors.ivoryDim : mcpPalette.accent,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {bad ? `bots ${100 - (c.quality ?? 0)}%` : `real ${c.quality}%`}
      </span>
    </div>
  );
};

/** The media plan: a compact table with totals counting up and a READY stamp. */
export const PlanCard: React.FC<{
  at: number;
  rows: { c: Creator; format: string; price: string }[];
  totals: { reach: string; cpm: string; budget: number };
  ready: number;
}> = ({ at, rows, totals, ready }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  const stamp = spring({ frame: frame - ready, fps, config: theme.spring.bouncy });
  const budget = interpolate(frame, [at + 12, at + 44], [0, totals.budget], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        marginLeft: 58,
        borderRadius: 24,
        border: `1px solid ${frame >= ready ? mcpPalette.primary : mcpColors.chatLine}`,
        background: mcpColors.chatSurface,
        padding: "22px 26px",
        position: "relative",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
        fontFamily: theme.fonts.body,
        boxShadow: frame >= ready ? `0 30px 90px -40px ${mcpPalette.glow}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <YolocoTile size={30} />
        <span style={{ fontSize: 27, fontWeight: 600, color: mcpColors.ivory }}>Media plan · Florida fitness</span>
      </div>
      {rows.map((r, i) => {
        const q = spring({ frame: frame - at - 6 - i * 4, fps, config: theme.spring.snappy });
        return (
          <div
            key={r.c.handle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              height: 58,
              borderTop: `1px solid ${mcpColors.chatLine}`,
              opacity: q,
              transform: `translateX(${interpolate(q, [0, 1], [20, 0])}px)`,
              fontSize: 24,
              color: mcpColors.ivory,
            }}
          >
            {r.c.photo ? <PhotoAvatar photo={r.c.photo} size={38} /> : <Avatar size={38} hue={r.c.hue} />}
            <span style={{ width: 240, fontWeight: 600 }}>{r.c.handle}</span>
            <span style={{ flex: 1, color: mcpColors.ivoryDim }}>{r.format}</span>
            <span style={{ fontFamily: theme.fonts.mono, color: mcpColors.ivory }}>{r.price}</span>
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          gap: 28,
          marginTop: 10,
          paddingTop: 16,
          borderTop: `1px solid ${mcpColors.lineStrong}`,
          fontFamily: theme.fonts.mono,
          fontSize: 23,
          color: mcpColors.ivoryDim,
          letterSpacing: "0.03em",
        }}
      >
        <span>REACH <b style={{ color: mcpColors.ivory }}>{totals.reach}</b></span>
        <span>CPM <b style={{ color: mcpColors.ivory }}>{totals.cpm}</b></span>
        <span style={{ marginLeft: "auto" }}>
          BUDGET <b style={{ color: mcpPalette.text }}>${Math.round(budget).toLocaleString("en-US")}</b>
        </span>
      </div>
      {frame >= ready && (
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 14,
            padding: "8px 18px",
            borderRadius: 999,
            background: mcpPalette.primary,
            color: mcpPalette.text,
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.14em",
            transform: `rotate(-6deg) scale(${stamp})`,
            boxShadow: `0 10px 30px -10px ${mcpPalette.glow}`,
          }}
        >
          READY ✓
        </div>
      )}
    </div>
  );
};


/* ------------------------------------------------------------- v2 kit */
// Added after the author's review (2026-09-16): no em dashes on screen, no
// snake_case tool names for a marketer audience, icons instead, denser frames.

import { getStaticFiles } from "remotion";
import { QR } from "./qr";

/** Mono eyebrow without the dash: a hero-coloured square, then the words. */
export const Label: React.FC<{ children: React.ReactNode; delay?: number; color?: string; size?: number }> = ({
  children,
  delay = 0,
  color = mcpPalette.accent,
  size = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.snappy });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-22, 0])}px)`,
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: 3, background: mcpPalette.primary, transform: `scale(${p})` }} />
      {children}
    </div>
  );
};

export type IconName = "search" | "chart" | "overlap" | "table" | "megaphone" | "robot" | "cube" | "blossom" | "code" | "list" | "spark" | "shield" | "calendar" | "dollar";

/** Line icons in the current colour. Drawn, not emoji (rule: palette-safe glyphs). */
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({
  name,
  size = 28,
  color = mcpPalette.text,
  stroke = 2.4,
}) => {
  const common = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const body: Record<IconName, React.ReactNode> = {
    search: (<><circle cx={11} cy={11} r={6.5} {...common} /><path d="M16 16l5 5" {...common} /></>),
    chart: (<><path d="M4 20V11" {...common} /><path d="M10 20V5" {...common} /><path d="M16 20v-7" {...common} /><path d="M22 20V9" {...common} /></>),
    overlap: (<><circle cx={9.5} cy={12} r={6.5} {...common} /><circle cx={15.5} cy={12} r={6.5} {...common} /></>),
    table: (<><rect x={3.5} y={4.5} width={17} height={15} rx={3} {...common} /><path d="M3.5 10h17M9.5 10v9.5" {...common} /></>),
    megaphone: (<><path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1z" {...common} /><path d="M18 9.5a3 3 0 0 1 0 5" {...common} /></>),
    robot: (<><rect x={4.5} y={8} width={15} height={11} rx={3.5} {...common} /><path d="M12 8V4.5M9.5 4.5h5" {...common} /><circle cx={9.3} cy={13.2} r={1.4} fill={color} /><circle cx={14.7} cy={13.2} r={1.4} fill={color} /><path d="M9.5 16.5h5" {...common} /></>),
    cube: (<><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" {...common} /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" {...common} /></>),
    blossom: (<>{Array.from({ length: 6 }, (_, i) => (<rect key={i} x={9.4} y={3} width={5.2} height={11} rx={2.6} {...common} transform={`rotate(${i * 60} 12 12)`} />))}</>),
    code: (<><path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5" {...common} /></>),
    list: (<><path d="M8 6.5h12M8 12h12M8 17.5h12" {...common} /><circle cx={4.2} cy={6.5} r={1.2} fill={color} /><circle cx={4.2} cy={12} r={1.2} fill={color} /><circle cx={4.2} cy={17.5} r={1.2} fill={color} /></>),
    spark: (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" {...common} /></>),
    shield: (<><path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6L12 3z" {...common} /><path d="M9 12l2 2 4-4.5" {...common} /></>),
    calendar: (<><rect x={3.5} y={5} width={17} height={15} rx={3} {...common} /><path d="M3.5 10h17M8 3v4M16 3v4" {...common} /></>),
    dollar: (<><path d="M12 3v18" {...common} /><path d="M16.5 7.5c0-1.7-2-3-4.5-3S7.5 5.8 7.5 7.5 9.5 10 12 10s4.5 1.3 4.5 3.5-2 3.5-4.5 3.5-4.5-1.3-4.5-3" {...common} /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      {body[name]}
    </svg>
  );
};

/** Human-named tool chip: icon tile + label. Replaces the snake_case chips. */
export const ToolPill: React.FC<{ icon: IconName; label: string; hero?: boolean; size?: number }> = ({
  icon,
  label,
  hero = false,
  size = 24,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.5,
      padding: `${size * 0.3}px ${size * 0.8}px ${size * 0.3}px ${size * 0.3}px`,
      borderRadius: 999,
      background: mcpColors.surfaceStrong,
      border: `1px solid ${hero ? mcpPalette.primary : mcpColors.lineStrong}`,
      fontFamily: theme.fonts.body,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: mcpPalette.text,
      whiteSpace: "nowrap",
      boxShadow: hero ? `0 12px 40px -16px ${mcpPalette.glow}` : "none",
    }}
  >
    <span
      style={{
        width: size * 1.55,
        height: size * 1.55,
        borderRadius: "50%",
        background: hero ? mcpPalette.primary : mcpColors.surfaceLift,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={size * 0.95} />
    </span>
    {label}
  </span>
);

/** A friendly robot head, blinking, for the agent side of the story. */
export const Robot: React.FC<{ size?: number; delay?: number }> = ({ size = 120, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const blink = frame % 84 < 5 ? 0.15 : 1;
  const s = size / 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)` }}
    >
      <rect x={3} y={7} width={18} height={13} rx={4.5} fill={mcpColors.chatBg} stroke={mcpColors.clay} strokeWidth={1.4} />
      <path d="M12 7V3.8" stroke={mcpColors.clay} strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={12} cy={3.2} r={1.3} fill={mcpColors.clay} />
      <rect x={5.5} y={10} width={13} height={6.5} rx={3} fill={mcpColors.chatSurface} />
      <ellipse cx={9.4} cy={13.2} rx={1.5} ry={1.6 * blink} fill={mcpColors.clay} />
      <ellipse cx={14.6} cy={13.2} rx={1.5} ry={1.6 * blink} fill={mcpColors.clay} />
      <path d="M9 18h6" stroke={mcpColors.clay} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M1.8 12.5h1.2M21 12.5h1.2" stroke={mcpColors.clay} strokeWidth={1.4} strokeLinecap="round" />
      <text x={0} y={0} fontSize={s} fill="none">{""}</text>
    </svg>
  );
};

/** A creator selfie from the collage, keyed off its phone screen, on a tilted card. */
export const PhoneCard: React.FC<{
  src: string;
  width?: number;
  tilt?: number;
  delay?: number;
  offsetY?: number;
  ring?: boolean;
  style?: React.CSSProperties;
}> = ({ src, width = 150, tilt = 0, delay = 0, offsetY = 0, ring = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  const t = frame / fps;
  const h = width * 2;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.16,
        overflow: "hidden",
        background: `linear-gradient(160deg, ${mcpColors.surfaceLift}, ${mcpColors.surfaceStrong})`,
        border: `1px solid ${ring ? mcpPalette.primary : mcpColors.lineStrong}`,
        boxShadow: mcpColors.shadow,
        opacity: p,
        transform: `rotate(${tilt + Math.sin(t * 1.2 + delay) * 1.2}deg) translateY(${offsetY + Math.sin(t * 1.6 + delay) * 5}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: -width * 0.06,
          top: -width * 0.04,
          width: width * 1.12,
          height: "auto",
          maxWidth: "none",
          // graded like every other photo in the reel, or the phone screen is
          // the most saturated thing in a frame built on one hero colour
          filter: PHOTO_GRADE,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: mcpPalette.primary, mixBlendMode: "soft-light", opacity: 0.3 }} />
    </div>
  );
};

/** Two audiences and what they share; the intersection is the only hero fill. */
export const Venn: React.FC<{ progress: number; width?: number; label?: string }> = ({ progress, width = 250, label }) => {
  const r = width * 0.3;
  const cy = width * 0.4;
  const gap = interpolate(progress, [0, 1], [r * 2.2, r * 1.05]);
  const cxA = width / 2 - gap / 2;
  const cxB = width / 2 + gap / 2;
  return (
    <svg width={width} height={width * 0.8} viewBox={`0 0 ${width} ${width * 0.8}`} style={{ display: "block" }}>
      <defs>
        <clipPath id="venn-a"><circle cx={cxA} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cxA} cy={cy} r={r} fill={mcpColors.surfaceLift} stroke={mcpColors.lineStrong} strokeWidth={2} />
      <circle cx={cxB} cy={cy} r={r} fill={mcpColors.surfaceLift} stroke={mcpColors.lineStrong} strokeWidth={2} />
      <circle cx={cxB} cy={cy} r={r} fill={mcpPalette.primary} clipPath="url(#venn-a)" opacity={progress} />
      {label && (
        <text
          x={width / 2}
          y={cy + 9}
          textAnchor="middle"
          fontFamily={theme.fonts.mono}
          fontSize={26}
          fontWeight={700}
          fill={mcpPalette.text}
          opacity={progress}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

/** The QR code, assembling from the centre outwards; dark modules on a light plate. */
export const QrCode: React.FC<{ size?: number; delay?: number }> = ({ size = 320, delay = 0 }) => {
  const frame = useCurrentFrame();
  const n = QR.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  const mid = (n - 1) / 2;
  const build = interpolate(frame, [delay, delay + 24], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (QR.bits[y * n + x] !== "1") continue;
      const d = Math.hypot(x - mid, y - mid) / (mid * 1.42);
      const s = Math.min(1, Math.max(0, (build - d * 0.85) / 0.15));
      if (s <= 0) continue;
      const px = (x + quiet) * cell;
      const py = (y + quiet) * cell;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={px + (cell * (1 - s)) / 2}
          y={py + (cell * (1 - s)) / 2}
          width={cell * s}
          height={cell * s}
          rx={cell * 0.18}
          fill={mcpColors.qrInk}
        />,
      );
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", borderRadius: 26, background: mcpColors.ivory, boxShadow: mcpColors.shadow }}
    >
      {cells}
    </svg>
  );
};

/** The author's drawing for a beat, if it has been delivered; else the fallback. */
export const hasStatic = (name: string): boolean =>
  getStaticFiles().some((f) => f.name === name || f.name === `/${name}`);

/* ------------------------------------------------------------- v3 kit */
// The author's review, round 2 (2026-09-16): his own voice, a real TikTok
// transition on the 11s cut, the illustrations he drew in Codex, and real
// faces in the demo instead of silhouettes.

/* ---------------------------------------------------------- transition */

/**
 * The modern TikTok cut: a white flash, a chromatic edge, and horizontal
 * bands that shear off the frame. `out` runs on the last frames of the
 * outgoing beat, `in` on the first frames of the incoming one, so the pair
 * reads as ONE cut across a scene boundary.
 *
 * Everything is driven off `k`, the frame offset from the cut, so the two
 * halves cannot drift apart when a beat is retimed.
 */
// The cut is 10 frames long and straddles the scene boundary: 5 on the
// outgoing beat, 5 on the incoming one. `k` is the frame offset from the
// START of each half, so the two cannot drift apart when a beat is retimed.
export const CUT_OUT = 5;
export const CUT_IN = 5;

/** 0 → 1 → 0 across the whole cut. Peaks exactly on the scene boundary. */
const cutT = (k: number, phase: "out" | "in"): number => {
  if (phase === "out") return k < 0 || k >= CUT_OUT ? 0 : (k + 1) / CUT_OUT;
  return k < 0 || k >= CUT_IN ? 0 : 1 - k / CUT_IN;
};

/**
 * The cut the author asked for: a camera flash, a chromatic tear and a few
 * hard light streaks. Ten frames end to end, which is the whole point — the
 * first version painted solid bands for half a second and read as a wipe.
 *
 * One flash, not two: it builds over the last 5 frames of the outgoing beat
 * and falls over the first 6 of the incoming one, so the white peak lands on
 * the boundary frame itself.
 */
export const TikTokCut: React.FC<{ k: number; phase: "out" | "in"; bands?: number }> = ({
  k,
  phase,
  bands = 5,
}) => {
  const e = cutT(k, phase);
  if (e <= 0.001) return null;
  const flash = Math.pow(e, 2.4);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* chromatic tear: clay on one edge, violet on the other */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(97deg, ${mcpColors.clay} 0%, transparent 26%, transparent 74%, ${mcpPalette.primary} 100%)`,
          opacity: e * 0.75,
          mixBlendMode: "screen",
        }}
      />
      {/* light streaks: thin, fast, alternating, gone before they read as bars */}
      {Array.from({ length: bands }, (_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const travel = (phase === "out" ? 1 - e : e) * 1500 * dir;
        const h = 6 + (i % 3) * 9;
        const top = [14, 33, 52, 68, 85][i % 5];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -200,
              right: -200,
              top: `${top}%`,
              height: h,
              transform: `translateX(${travel}px) skewX(-14deg)`,
              background: i % 2 === 0 ? mcpPalette.primary : mcpPalette.text,
              opacity: e * 0.95,
              filter: "blur(1px)",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash * 0.95 }} />
    </div>
  );
};

/** Zoom punch for the scene under a cut: it snaps in, then settles. */
export const cutZoom = (k: number, phase: "out" | "in"): number =>
  1 + cutT(k, phase) * (phase === "out" ? 0.1 : 0.14);

/* ------------------------------------------------------------ cutouts */

/**
 * A drawn asset on transparency, breathing. Everything the author draws in
 * Codex arrives as a cutout, so the scenes place it by height and let this
 * carry rule 7 (idle elements breathe) and the entrance.
 */
export const Cutout: React.FC<{
  src: string;
  height: number;
  delay?: number;
  float?: number;
  tilt?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ src, height, delay = 0, float = 1, tilt = 0, glow = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const t = frame / fps;
  return (
    <Img
      src={staticFile(src)}
      style={{
        height,
        width: "auto",
        maxWidth: "none",
        display: "block",
        opacity: p,
        transform:
          `translateY(${interpolate(p, [0, 1], [46, 0]) + Math.sin(t * 1.5 + delay * 0.1) * 6 * float}px) ` +
          `rotate(${tilt + Math.sin(t * 1.1 + delay * 0.07) * 0.8 * float}deg) ` +
          `scale(${interpolate(p, [0, 1], [0.86, 1])})`,
        filter: glow ? `drop-shadow(0 30px 60px ${mcpPalette.glow})` : "none",
        ...style,
      }}
    />
  );
};

/* ------------------------------------------------------- photo avatars */

// Real creator portraits (Pexels, free licence, credited in
// public/images/CREDITS.md). They arrive in colour and are graded here:
// desaturated and cooled into the violet field, because a full-colour photo
// grid next to the Yoloco hero colour is the fastest way to break the palette.
export const PhotoAvatar: React.FC<{
  photo: string;
  size?: number;
  ring?: string;
  muted?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ photo, size = 64, ring, muted = false, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = delay === undefined ? 1 : spring({ frame: frame - delay, fps, config: theme.spring.bouncy });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        background: mcpColors.surfaceLift,
        border: ring ? `${Math.max(2, size * 0.045)}px solid ${ring}` : `1px solid ${mcpColors.lineStrong}`,
        transform: delay === undefined ? undefined : `scale(${p})`,
        opacity: delay === undefined ? 1 : p,
        ...style,
      }}
    >
      <Img
        src={staticFile(`footage/yoloco-mcp/avatars/${photo}.png`)}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          filter: muted ? "saturate(0) contrast(1.05) brightness(0.72)" : PHOTO_GRADE,
        }}
      />
      {/* violet cast: ties the photo to the field without tinting the skin flat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: mcpPalette.primary,
          mixBlendMode: "soft-light",
          opacity: muted ? 0.15 : 0.32,
        }}
      />
    </div>
  );
};
