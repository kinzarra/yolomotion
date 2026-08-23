// Motion kit for the "secret model" Short. Every entrance moves 2–3 properties
// on a spring, every interpolate is eased and clamped, and all colors/easings
// come from theme + palette. Nothing is inlined per-scene.
//
// The kit encodes the reel's editorial rule as much as its look: `Status` has
// exactly three values, and each one hard-wires its border style, its color and
// whether the thing it labels is allowed to be legible. A rumor cannot be drawn
// as a fact by accident, because there is no prop combination that does it.
import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { smColors, smPalette, term } from "./palette";

/* -------------------------------------------------------------- shell */

/**
 * Background + exit for every beat. Grid, two drifting glows and a slow
 * scanline wash — the "document being scanned" texture the whole reel sits on.
 * `<Reel>` supplies grade/grain/vignette above this.
 */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: boolean;
}> = ({ children, exit = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  // Exit is 7 frames — faster than any entrance in the scene.
  const out = exit
    ? interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -90,
          opacity: 0.24,
          backgroundImage: `linear-gradient(${smColors.line} 1px, transparent 1px), linear-gradient(90deg, ${smColors.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          transform: `translate(${Math.sin(t * 0.75) * 10}px, ${Math.cos(t * 0.6) * 12}px)`,
        }}
      />
      {/* Scanlines — 4px pitch, drifting a fraction of a line per second so the
          texture is alive without ever reading as a moving element. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(120,160,220,0.05) 0px, rgba(120,160,220,0.05) 1px, transparent 1px, transparent 4px)",
          backgroundPosition: `0 ${(t * 9) % 4}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          left: -430,
          top: 90,
          background: `radial-gradient(circle, ${smPalette.accent}30, transparent 66%)`,
          transform: `translateY(${Math.sin(t * 0.85) * 30}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 880,
          height: 880,
          borderRadius: "50%",
          right: -410,
          bottom: 20,
          background: `radial-gradient(circle, ${smPalette.primary}24, transparent 68%)`,
          transform: `translateY(${Math.cos(t * 0.7) * 26}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - out * 0.8,
          transform: `translateY(${out * -34}px) scale(${1 + out * 0.024})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Full-frame colour flash, for impacts. Never longer than a few frames. */
export const Flash: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = smPalette.primary,
}) =>
  amount <= 0 ? null : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        mixBlendMode: "screen",
        opacity: amount * 0.26,
        pointerEvents: "none",
      }}
    />
  );

/** A bright line sweeping down the frame — the document being scanned. */
export const ScanSweep: React.FC<{
  from: number;
  to: number;
  color?: string;
}> = ({ from, to, color = smPalette.accent }) => {
  const p = useRamp(from, to, theme.ease.inOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${p * 100}%`,
        height: 190,
        marginTop: -95,
        pointerEvents: "none",
        background: `linear-gradient(180deg, ${color}00, ${color}2E 46%, ${color}CC 50%, ${color}2E 54%, ${color}00)`,
        opacity: Math.sin(p * Math.PI),
      }}
    />
  );
};

/* --------------------------------------------------------------- type */

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = smPalette.accent }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-28, 0])}px)`,
        fontFamily: theme.fonts.mono,
        color,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 28,
          height: 4,
          borderRadius: 2,
          background: color,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
      {children}
    </div>
  );
};

/**
 * Large kinetic type: each word rises out of its own clipping mask.
 *
 * Two extras this reel needs on top of the usual:
 *   `hero`   — word indices painted in the hero color (and glowed), so a
 *              headline can put exactly one word in orange without splitting
 *              into two components and losing the shared line wrapping.
 *   `redact` — word indices that start under a redaction bar which wipes off
 *              right-to-left, revealing the word in reading order.
 */
export const Kinetic: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: "flex-start" | "center";
  hero?: number[];
  heroColor?: string;
  redact?: { from: number; per?: number; color?: string };
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 3,
  size = 116,
  color = smPalette.text,
  weight = 800,
  align = "flex-start",
  hero,
  heroColor = smPalette.primary,
  redact,
  glow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        columnGap: Math.round(size * 0.24),
        rowGap: Math.round(size * 0.04),
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.02,
        letterSpacing: "-0.045em",
        color,
        // drop-shadow on a container, never text-shadow on the glyphs: each
        // word sits in an overflow:hidden mask so it can slide up, and a
        // text-shadow gets sliced into a visible rectangle at the mask edge.
        // A filter applies to the already-composited (already-clipped) result.
        filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.34)}px ${color}66)` : undefined,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        const isHero = hero?.includes(i) ?? false;
        // The bar retracts toward its right edge, so the glyphs surface from
        // the left — the direction the word is read in.
        const wipe = redact
          ? interpolate(
              frame,
              [
                delay + i * per + 12 + (i - redact.from) * (redact.per ?? 4),
                delay + i * per + 21 + (i - redact.from) * (redact.per ?? 4),
              ],
              [1, 0],
              {
                easing: theme.ease.inOut,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          : 0;
        const barred = redact != null && i >= redact.from;
        return (
          <span
            key={`${word}-${i}`}
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: Math.round(size * 0.11),
              marginBottom: Math.round(size * -0.11),
              // Filter on the mask, not the glyph: it runs after the clip, so
              // the glow spreads past the mask edge instead of being cut.
              filter: isHero
                ? `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${heroColor}77)`
                : undefined,
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: isHero ? heroColor : undefined,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [size * 1.05, 0])}px) skewY(${interpolate(p, [0, 1], [5, 0])}deg)`,
              }}
            >
              {word}
            </span>
            {barred && wipe > 0.001 ? (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: Math.round(size * 0.12),
                  bottom: Math.round(size * 0.14),
                  background: redact.color ?? smColors.redact,
                  // Faded in with its own word: a bar that arrives before the
                  // glyphs it covers reads as a stray rectangle, not as
                  // something covering anything up.
                  opacity: p,
                  transformOrigin: "right",
                  transform: `scaleX(${wipe})`,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ surfaces */

export type Tone = "neutral" | "hero" | "blue";

const toneBorder: Record<Tone, string> = {
  neutral: smColors.lineStrong,
  hero: smPalette.primary,
  blue: smPalette.accent,
};

const toneFill: Record<Tone, string> = {
  neutral: smColors.surface,
  hero: smColors.heroSoft,
  blue: smColors.blueSoft,
};

export const toneColor = (tone: Tone) => toneBorder[tone];

export const Panel: React.FC<{
  delay?: number;
  tone?: Tone;
  glow?: boolean;
  dashed?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, tone = "neutral", glow = false, dashed = false, style, children }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        borderRadius: 28,
        border: `${dashed ? "2px dashed" : "1px solid"} ${toneBorder[tone]}`,
        background: toneFill[tone],
        boxShadow: glow
          ? `0 0 66px -8px ${toneBorder[tone]}66, ${smColors.shadow}`
          : smColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: Tone;
  size?: number;
  dot?: boolean;
  dashed?: boolean;
}> = ({ children, delay = 0, tone = "neutral", size = 28, dot = true, dashed = false }) => {
  const p = useIn(delay, "snappy");
  const color = tone === "neutral" ? smPalette.textDim : toneBorder[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${Math.round(size * 0.45)}px ${Math.round(size * 0.82)}px`,
        borderRadius: 999,
        border: `${dashed ? "2px dashed" : "1px solid"} ${tone === "neutral" ? smColors.line : color}`,
        background: toneFill[tone],
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
      }}
    >
      {dot ? (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: color,
            boxShadow: tone === "neutral" ? undefined : `0 0 20px ${color}`,
            flexShrink: 0,
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

/* ------------------------------------------------------- the honesty grammar */

/**
 * The three states anything in this reel is allowed to be in. This is the
 * whole "don't present a rumor as a fact" rule, expressed once:
 *
 *   shipping — a model you can call today. Blue, solid border, crisp name.
 *   reported — attributed to reporting. Orange, DASHED border, blurred name.
 *   internal — acknowledged to exist but unseen. Orange, solid, name redacted.
 *
 * `blur` is not styling. It is the claim's confidence, drawn.
 */
export type Status = "shipping" | "reported" | "internal";

export const STATUS: Record<
  Status,
  { label: string; tone: Tone; dashed: boolean; blur: number }
> = {
  shipping: { label: "SHIPPING", tone: "blue", dashed: false, blur: 0 },
  reported: { label: "REPORTED", tone: "hero", dashed: true, blur: 13 },
  internal: { label: "INTERNAL", tone: "hero", dashed: false, blur: 0 },
};

export const StatusTag: React.FC<{ status: Status; delay?: number; size?: number }> = ({
  status,
  delay = 0,
  size = 22,
}) => {
  const s = STATUS[status];
  const p = useIn(delay, "snappy");
  const color = toneBorder[s.tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.62)}px`,
        borderRadius: 8,
        border: `${s.dashed ? "1.5px dashed" : "1px solid"} ${color}`,
        background: toneFill[s.tone],
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.16em",
        color,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`,
      }}
    >
      {s.label}
    </span>
  );
};

/** A block of covered-up text. Not black — see the note in palette.ts. */
export const Redacted: React.FC<{
  width: number;
  height?: number;
  delay?: number;
  tone?: Tone;
}> = ({ width, height = 26, delay = 0, tone = "neutral" }) => {
  const p = useRamp(delay, delay + 9, theme.ease.out);
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: width * p,
        height,
        borderRadius: 4,
        verticalAlign: "middle",
        background: smColors.redact,
        // A hairline of the tone along the bottom keeps the bar from reading
        // as an empty gap in the layout.
        boxShadow: `inset 0 -2px 0 ${toneBorder[tone]}44`,
        // Barely-there flicker: something is under there.
        opacity: 0.82 + Math.sin(frame * 0.7 + width) * 0.06,
      }}
    />
  );
};

/**
 * The star of the reel. A model card whose legibility is dictated by `status`,
 * so the frame can never claim more than the script does.
 */
export const ModelCard: React.FC<{
  // A node, not a string: an `internal` card's name is a redaction bar, and
  // "the name is a bar" is the honest rendering of a model nobody has seen.
  name: React.ReactNode;
  status: Status;
  delay?: number;
  rows?: { label: string; value?: string; redact?: number }[];
  width?: number;
  nameSize?: number;
  glow?: boolean;
  /** 0–1: extra blur/darkening while the card is still "loading". */
  reveal?: number;
}> = ({
  name,
  status,
  delay = 0,
  rows = [],
  width = 760,
  nameSize = 96,
  glow = false,
  reveal = 1,
}) => {
  const s = STATUS[status];
  const color = toneBorder[s.tone];
  const nameIn = useIn(delay + 6, "smooth");
  // A reported name never resolves below its floor blur, however far the
  // entrance animates.
  const blur = s.blur + (1 - reveal) * 22;
  return (
    <Panel
      delay={delay}
      tone={s.tone}
      dashed={s.dashed}
      glow={glow}
      style={{ width, padding: "30px 34px 34px", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 23,
            letterSpacing: "0.2em",
            color: smPalette.textDim,
          }}
        >
          MODEL CARD
        </span>
        <StatusTag status={status} delay={delay + 10} />
      </div>

      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: nameSize,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.04,
          color: status === "shipping" ? smPalette.text : color,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
          opacity: nameIn,
          transform: `translateY(${interpolate(nameIn, [0, 1], [22, 0])}px) scale(${interpolate(nameIn, [0, 1], [0.96, 1])})`,
        }}
      >
        {name}
      </div>

      {rows.length > 0 ? (
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 15 }}>
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                paddingTop: 13,
                borderTop: `1px solid ${smColors.line}`,
                fontFamily: theme.fonts.mono,
                fontSize: 27,
                letterSpacing: "0.06em",
                color: smPalette.textDim,
              }}
            >
              <span>{row.label}</span>
              {row.value ? (
                <span style={{ color: smPalette.text }}>{row.value}</span>
              ) : (
                <Redacted width={row.redact ?? 190} delay={delay + 18 + i * 4} tone={s.tone} />
              )}
            </div>
          ))}
        </div>
      ) : null}
    </Panel>
  );
};

/**
 * One line of the lineup stack. Same grammar as `ModelCard`, compressed to a
 * row so four shipping models and one unreleased slot fit one frame.
 * `highlight` 0–1 is the "…and it's shipping" beat: glow + a small lift.
 */
export const ModelRow: React.FC<{
  name: React.ReactNode;
  status: Status;
  delay?: number;
  highlight?: number;
  width?: number;
  size?: number;
  note?: string;
  /**
   * Overrides the status blur. Only ever lower it for a name that asserts
   * nothing — a literal "?" is not a claim, so blurring it would be theatre
   * rather than the confidence signal the blur is supposed to be.
   */
  blur?: number;
}> = ({ name, status, delay = 0, highlight = 0, width = 820, size = 52, note, blur }) => {
  const s = STATUS[status];
  const nameBlur = blur ?? s.blur;
  const color = toneBorder[s.tone];
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 26,
        padding: "22px 30px",
        borderRadius: 20,
        border: `${s.dashed ? "2px dashed" : "1px solid"} ${color}`,
        background: toneFill[s.tone],
        boxShadow:
          highlight > 0.02
            ? `0 0 ${46 * highlight}px -6px ${color}, ${smColors.shadow}`
            : smColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0]) - highlight * 6}px) scale(${interpolate(p, [0, 1], [0.95, 1]) + highlight * 0.025})`,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 18,
          fontFamily: theme.fonts.display,
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: status === "shipping" ? smPalette.text : color,
          filter: nameBlur > 0.2 ? `blur(${nameBlur}px)` : undefined,
        }}
      >
        {name}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        {note ? (
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              letterSpacing: "0.14em",
              color: smPalette.textDim,
            }}
          >
            {note}
          </span>
        ) : null}
        <StatusTag status={status} delay={delay + 5} size={21} />
      </span>
    </div>
  );
};

/**
 * The INTERNAL stamp. Slams down from above the frame at an angle: scale
 * collapses on ease.in (a fall, not a grow), the frame shake and flash come
 * off the same envelope in the scene.
 */
export const Stamp: React.FC<{
  text: string;
  at: number;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ text, at, color = smPalette.primary, size = 76, rotate = -11 }) => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [at, at + 9], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Settle: a 5-frame overshoot recovery after the hit.
  const settle = interpolate(frame, [at + 9, at + 20], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < at) return null;
  // 2.0, not more: the stamp scales about its own centre, and anything past
  // this runs off both sides of a 1080-wide frame during the fall.
  const scale = interpolate(drop, [0, 1], [2, 1.06]) - settle * 0.06;
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.46)}px`,
        border: `${Math.max(4, Math.round(size * 0.07))}px solid ${color}`,
        borderRadius: 14,
        fontFamily: theme.fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "0.12em",
        color,
        whiteSpace: "nowrap",
        opacity: drop,
        textShadow: `0 0 40px ${color}66`,
        boxShadow: `0 0 ${40 * settle + 10}px -6px ${color}88`,
        transform: `rotate(${rotate + (1 - drop) * -14}deg) scale(${scale})`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * One card of the opening barrage: a full-frame word that exists for ~8
 * frames. No entrance — a hard cut IS the effect. The only motion inside the
 * window is a slight scale drift, so the cut lands as an impact rather than
 * a slide.
 */
export const FlashCard: React.FC<{
  text: string;
  at: number;
  life?: number;
  color?: string;
  size?: number;
  sub?: string;
}> = ({ text, at, life = 9, color = smPalette.primary, size = 168, sub }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= at + life) return null;
  const t = (frame - at) / life;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        background: smPalette.bg,
        padding: "0 70px",
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 0.98,
          textAlign: "center",
          color,
          filter: `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${color}66)`,
          transform: `scale(${1 + t * 0.05})`,
        }}
      >
        {text}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.24em",
            color: smPalette.textDim,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------- terminal */

export type TermLine = {
  /** `$` prompt line, `·` log line, `>` result line. */
  kind?: "cmd" | "log" | "out";
  text: string;
  /** px of redaction bar rendered after the text — a value you can't see. */
  redact?: number;
  tone?: Tone;
};

/** Internal eval log. Lines land one at a time; the last one keeps a cursor. */
export const Terminal: React.FC<{
  title: string;
  lines: TermLine[];
  delay?: number;
  per?: number;
  width?: number;
  fontSize?: number;
}> = ({ title, lines, delay = 0, per = 7, width = 900, fontSize = 30 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        width,
        borderRadius: 24,
        border: `1px solid ${smColors.lineStrong}`,
        background: smColors.surfaceStrong,
        boxShadow: smColors.shadow,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 24px",
          borderBottom: `1px solid ${smColors.line}`,
          background: smColors.surfaceLift,
          fontFamily: theme.fonts.mono,
          fontSize: 23,
          letterSpacing: "0.14em",
          color: smPalette.textDim,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: smColors.lineStrong,
            }}
          />
        ))}
        <span style={{ marginLeft: 12 }}>{title}</span>
      </div>

      <div
        style={{
          padding: "24px 28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontFamily: theme.fonts.mono,
          fontSize,
          lineHeight: 1.25,
        }}
      >
        {lines.map((line, i) => {
          const at = delay + 8 + i * per;
          const lp = interpolate(frame, [at, at + 7], [0, 1], {
            easing: theme.ease.out,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const kind = line.kind ?? "log";
          const mark = kind === "cmd" ? "$" : kind === "out" ? ">" : "·";
          const markColor =
            kind === "cmd" ? term.prompt : kind === "out" ? toneBorder[line.tone ?? "neutral"] : term.dim;
          return (
            <div
              key={`${line.text}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: lp,
                transform: `translateX(${interpolate(lp, [0, 1], [-16, 0])}px)`,
              }}
            >
              <span style={{ color: markColor, flexShrink: 0 }}>{mark}</span>
              <span style={{ color: kind === "cmd" ? term.plain : term.ok }}>{line.text}</span>
              {line.redact ? (
                <Redacted width={line.redact} height={fontSize * 0.86} delay={at + 4} tone={line.tone ?? "hero"} />
              ) : null}
              {i === lines.length - 1 && lp > 0.9 ? (
                <span
                  style={{
                    width: 15,
                    height: fontSize * 0.9,
                    background: term.prompt,
                    // 15-frame blink — the only thing still moving once the
                    // log has finished landing.
                    opacity: frame % 15 < 8 ? 0.9 : 0.1,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- brand */

export const VibeMark: React.FC<{ size?: number; delay?: number }> = ({
  size = 56,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useIn(delay, "bouncy");
  const breathe = 1 + Math.sin((frame / fps) * 2.1) * 0.015;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        overflow: "hidden",
        flexShrink: 0,
        background: smPalette.text,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.6, breathe])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
      }}
    >
      <Img
        src={staticFile("images/vibe-cloud-logo.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // The source PNG has generous padding; crop in so the mark still
          // reads at brand-bar size.
          transform: "scale(1.22)",
        }}
      />
    </div>
  );
};

/** Persistent, deliberately quiet series strip — keeps the Short readable muted. */
export const BrandBar: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const p = useIn(-3, "smooth");
  return (
    <div
      style={{
        position: "absolute",
        left: 82,
        right: 82,
        top: 116,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: p * 0.85,
        transform: `translateY(${interpolate(p, [0, 1], [-18, 0])}px)`,
        fontFamily: theme.fonts.mono,
        fontSize: 23,
        letterSpacing: "0.14em",
        color: smPalette.textDim,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <VibeMark size={46} delay={-3} />
        <span
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: smPalette.text,
          }}
        >
          {brandName}
        </span>
      </span>
      <span>{chapter}</span>
    </div>
  );
};

export { useIn, useRamp };
