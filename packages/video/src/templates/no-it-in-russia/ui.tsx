// Episode kit for «Нейросети убили IT?». The series look — paper that prints,
// digital that snaps — lives in ../digital-ruble/ui and is re-exported through
// ../dollar-wait/ui untouched; this file adds only what a labour-market
// episode needs: a queue of applicants, a résumé downpour, the falling
// vacancy bars, the four task cards an assistant takes over, an empty desk
// that turns into one, the career staircase with its bottom steps gone, and
// the scan over a listings database.
//
// Same rules as every episode: entrances move 2–3 properties on a spring,
// every ramp is eased and clamped, nothing is linear, and every color comes
// from the series palette.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { itColors, itPalette } from "./palette";
import { rnd } from "../digital-ruble/ui";

export * from "../dollar-wait/ui";

/**
 * Eased, clamped 0→1 ramp off an already-read frame. `useRamp` reads the frame
 * itself, which makes it a hook — unusable inside a `.map()` or behind a `?:`,
 * and several primitives here need exactly that (one ramp per bar, one per
 * step, one only when a card is taken). This is the same curve without the
 * hook, so the loop bodies stay honest.
 */
const ramp = (frame: number, from: number, to: number, easing = theme.ease.out) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/* ------------------------------------------------------------- people */

export type Tone = "bone" | "bad" | "dim" | "hero" | "paper";

const toneColor = (tone: Tone) =>
  tone === "bad"
    ? itColors.bad
    : tone === "hero"
      ? itPalette.primary
      : tone === "dim"
        ? itColors.inkFaded
        : tone === "paper"
          ? itColors.paper
          : itPalette.text;

/**
 * Person pictogram: a head and a shoulder arc, nothing else. Deliberately not
 * an emoji and not a stock silhouette — it has to take a palette color, and
 * twenty-four of them have to read as a crowd at 26px.
 *
 * `ghost` draws it as a dashed outline: the hire that was planned and never
 * happened. `breathe` is the idle micro-motion for the few figures that stay
 * on screen longer than two seconds; the crowd leaves it off, because
 * twenty-four sine waves read as noise.
 */
export const Figure: React.FC<{
  size?: number;
  tone?: Tone;
  delay?: number;
  ghost?: boolean;
  breathe?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size = 60, tone = "bone", delay = 0, ghost = false, breathe = false, opacity = 1, style }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const wobble = breathe ? Math.sin((frame + delay * 3) / 22) * 2.2 : 0;
  const color = toneColor(tone);
  const stroke = Math.max(2, Math.round(size * 0.075));
  return (
    <div
      style={{
        width: size,
        height: size * 1.28,
        position: "relative",
        opacity: p * opacity,
        transform: `translateY(${interpolate(p, [0, 1], [size * 0.4, wobble])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: size * 0.44,
          height: size * 0.44,
          marginLeft: -size * 0.22,
          borderRadius: "50%",
          background: ghost ? "transparent" : color,
          border: ghost ? `${stroke}px dashed ${color}` : undefined,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: size * 0.56,
          width: size,
          height: size * 0.72,
          borderRadius: `${size * 0.5}px ${size * 0.5}px ${size * 0.1}px ${size * 0.1}px`,
          background: ghost ? "transparent" : color,
          border: ghost ? `${stroke}px dashed ${color}` : undefined,
        }}
      />
    </div>
  );
};

/**
 * The hook's crowd: `count` figures packed into rows, each one snapping in on
 * its own offset so the block fills like a queue rather than appearing.
 * `heroIndex` is the single figure that gets the job — it stays bone while the
 * rest go dim, which is the whole point of the shot.
 */
export const Crowd: React.FC<{
  count: number;
  perRow?: number;
  size?: number;
  delay?: number;
  per?: number;
  tone?: Tone;
  heroIndex?: number;
  style?: React.CSSProperties;
}> = ({ count, perRow = 8, size = 60, delay = 0, per = 1.6, tone = "dim", heroIndex, style }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: Math.round(size * 0.34),
      width: perRow * size + (perRow - 1) * Math.round(size * 0.34),
      ...style,
    }}
  >
    {Array.from({ length: count }, (_, i) => (
      <Figure
        key={i}
        size={size}
        delay={delay + i * per}
        tone={i === heroIndex ? "bone" : tone}
      />
    ))}
  </div>
);

/* -------------------------------------------------------------- paper */

/**
 * Résumés coming down. Thermal-paper slips with three ink rules, each on its
 * own eased fall and its own drift, so the sheet never reads as a repeating
 * sprite. They fade as they land — a résumé that piles up would need a floor,
 * and the beat is about volume, not about the pile.
 */
export const ResumeRain: React.FC<{
  count?: number;
  from?: number;
  seed?: number;
  width?: number;
  top?: number;
  height?: number;
}> = ({ count = 22, from = 0, seed = 4, width = 1080, top = 0, height = 900 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top, width, height, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => {
        const start = from + rnd(seed + i * 3) * 46;
        const life = 40 + rnd(seed + i * 7) * 34;
        const p = interpolate(frame, [start, start + life], [0, 1], {
          easing: theme.ease.inOut,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (p <= 0) return null;
        const w = 46 + rnd(seed + i * 11) * 30;
        const x = rnd(seed + i * 13) * (width - w);
        const tilt = (rnd(seed + i * 17) - 0.5) * 34;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: -80,
              width: w,
              height: w * 1.34,
              background: itColors.paper,
              // Paper has to stay paper under the grade: fading it out linearly
              // with the fall turned the slips into grey smudges by mid-frame.
              opacity: 1 - p * 0.55,
              transform: `translateY(${p * (height + 120)}px) rotate(${tilt * (0.3 + p)}deg)`,
              padding: 6,
              boxSizing: "border-box",
            }}
          >
            {[0.8, 0.55, 0.66].map((wr, r) => (
              <div
                key={r}
                style={{
                  height: 3,
                  marginTop: r === 0 ? 4 : 7,
                  width: `${wr * 100}%`,
                  background: itColors.inkRule,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------- charts */

/**
 * Vacancies over a year: bars that GROW DOWN from a common top rule, so the
 * fall is the motion itself rather than a line to be read. The last bars go
 * red — the drop is the story, and it is the only red in the frame.
 */
export const FallingBars: React.FC<{
  values: number[];
  width?: number;
  height?: number;
  delay?: number;
  per?: number;
  badFrom?: number;
}> = ({ values, width = 900, height = 340, delay = 0, per = 2.4, badFrom = 0.62 }) => {
  const frame = useCurrentFrame();
  const gap = 10;
  const bw = (width - gap * (values.length - 1)) / values.length;
  const badIndex = Math.floor(values.length * badFrom);
  return (
    <div style={{ position: "relative", width, height }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: itColors.lineStrong }} />
      {values.map((v, i) => {
        const p = ramp(frame, delay + i * per, delay + i * per + 16);
        const bad = i >= badIndex;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * (bw + gap),
              top: 2,
              width: bw,
              height: height * v * p,
              background: bad
                ? `linear-gradient(180deg, ${itColors.bad}, ${itColors.bad}33)`
                : `linear-gradient(180deg, ${itPalette.textDim}, ${itPalette.textDim}22)`,
              transformOrigin: "top",
            }}
          />
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------- cards */

/**
 * One of the four routine tasks. It starts as a live card in bone and is
 * TAKEN: a lime sweep runs across it, then it settles greyed with a lime
 * «AI» tag. Two states, one number — `taken` is the frame the sweep starts.
 */
export const TaskCard: React.FC<{
  label: string;
  delay?: number;
  taken?: number;
  width?: number;
}> = ({ label, delay = 0, taken, width = 470 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "snappy");
  const sweep = taken === undefined ? 0 : ramp(frame, taken, taken + 12, theme.ease.inOut);
  const dead = taken === undefined ? 0 : ramp(frame, taken + 8, taken + 20);
  return (
    <div
      style={{
        position: "relative",
        width,
        padding: "26px 28px",
        overflow: "hidden",
        background: itColors.surface,
        border: `2px solid ${sweep > 0.5 ? itColors.line : itColors.lineStrong}`,
        opacity: p * (1 - dead * 0.55),
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          background: dead > 0.5 ? itPalette.primary : itPalette.textDim,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: theme.fonts.wide,
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          color: dead < 0.5 ? itPalette.text : itPalette.textDim,
          textDecoration: dead > 0.6 ? "line-through" : "none",
          textDecorationThickness: 3,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1 }} />
      {dead > 0.05 && (
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: itPalette.primary,
            opacity: dead,
            transform: `translateX(${interpolate(dead, [0, 1], [18, 0])}px)`,
          }}
        >
          AI
        </span>
      )}
      {/* the sweep itself — a lime edge crossing the card once */}
      {sweep > 0 && sweep < 1 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweep * 100}%`,
            width: 160,
            marginLeft: -160,
            background: `linear-gradient(90deg, transparent, ${itPalette.primary}44 70%, ${itPalette.primary})`,
          }}
        />
      )}
      {/* frame-height progress of the takeover, drawn under the label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 3,
          width: `${sweep * 100}%`,
          background: itPalette.primary,
        }}
      />
    </div>
  );
};

/* --------------------------------------------------------------- desk */

/**
 * A workstation seen head-on: a monitor slab on a stand. `state` is what the
 * beat is about — an occupied desk, the empty one next to it that was budgeted
 * for a second hire, and what that empty one becomes.
 */
export const Desk: React.FC<{
  state: "taken" | "empty" | "ai";
  delay?: number;
  width?: number;
  label?: string;
  labelDelay?: number;
}> = ({ state, delay = 0, width = 300, label, labelDelay = 0 }) => {
  const p = useIn(delay, "smooth");
  const lp = useIn(labelDelay, "snappy");
  const frame = useCurrentFrame();
  const h = width * 0.62;
  const ghost = state === "empty";
  const ai = state === "ai";
  const edge = ai ? itPalette.primary : ghost ? itColors.bad : itColors.lineStrong;
  return (
    <div
      style={{
        width,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width,
          height: h,
          border: `${ghost ? 3 : 2}px ${ghost ? "dashed" : "solid"} ${edge}`,
          background: ghost ? "transparent" : ai ? `${itPalette.primary}14` : itColors.surface,
          boxShadow: ai ? `0 0 ${width * 0.24}px ${itPalette.glow}` : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* code lines on a working machine, a dot matrix on the AI one */}
        {state === "taken" &&
          [0.66, 0.44, 0.78, 0.34].map((w, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width * 0.12,
                top: h * (0.2 + i * 0.16),
                width: width * w * 0.7,
                height: 6,
                background: itPalette.textDim,
                opacity: Math.sin(frame / 14 + i) > -0.4 ? 0.7 : 0.3,
              }}
            />
          ))}
        {ai && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(circle, ${itPalette.primary}40 1.4px, transparent 2px)`,
                backgroundSize: "18px 18px",
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.wide,
                fontSize: width * 0.26,
                fontWeight: 900,
                color: itPalette.primary,
                letterSpacing: "-0.02em",
                transform: `scale(${1 + Math.sin(frame / 18) * 0.02})`,
              }}
            >
              AI
            </span>
          </>
        )}
      </div>
      <div style={{ width: width * 0.16, height: h * 0.16, background: edge, opacity: ghost ? 0.5 : 1 }} />
      <div style={{ width: width * 0.5, height: 4, background: edge, opacity: ghost ? 0.5 : 1 }} />
      {label && (
        <div
          style={{
            marginTop: 18,
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: ai ? itPalette.primary : ghost ? itColors.bad : itPalette.textDim,
            opacity: lp,
            transform: `translateY(${interpolate(lp, [0, 1], [10, 0])}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- stairs */

/**
 * The career staircase. Steps rise left to right; `gone` is how many of the
 * bottom ones dissolve, which is the beat's whole argument — the entry rungs
 * are the ones the assistant took. A figure stands where the first step used
 * to be and cannot reach the next one.
 */
export const Stairs: React.FC<{
  steps?: number;
  gone?: number;
  goneAt?: number;
  labels?: string[];
  width?: number;
  height?: number;
  delay?: number;
}> = ({ steps = 5, gone = 2, goneAt = 40, labels = [], width = 840, height = 460, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sw = width / steps;
  const sh = height / steps;
  return (
    <div style={{ position: "relative", width, height }}>
      {Array.from({ length: steps }, (_, i) => {
        const p = spring({ frame: frame - delay - i * 4, fps, config: theme.spring.snappy });
        const isGone = i < gone;
        const fade = isGone ? ramp(frame, goneAt + i * 5, goneAt + i * 5 + 14, theme.ease.in) : 0;
        const h = sh * (i + 1);
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: i * sw,
                bottom: 0,
                width: sw - 6,
                height: h,
                background: isGone
                  ? `linear-gradient(180deg, ${itColors.bad}2E, ${itColors.bad}0A)`
                  : `linear-gradient(180deg, ${itColors.surfaceLift}, ${itColors.surfaceStrong})`,
                border: `2px solid ${isGone ? itColors.bad : itColors.lineStrong}`,
                opacity: p * (1 - fade),
                transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scaleY(${interpolate(1 - fade, [0, 1], [0.4, 1])})`,
                transformOrigin: "bottom",
              }}
            />
            {labels[i] && (
              <div
                style={{
                  position: "absolute",
                  left: i * sw,
                  bottom: h + 14,
                  width: sw - 6,
                  textAlign: "center",
                  fontFamily: theme.fonts.mono,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: isGone ? itColors.bad : itPalette.textDim,
                  opacity: p * (1 - fade * 0.85),
                }}
              >
                {labels[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- scan */

/**
 * The listings database being read: rows of redacted records with a lime scan
 * line running down them. The rows are noise on purpose — the number under
 * them is the content, and a legible fake job ad would only invite reading.
 */
export const ScanRows: React.FC<{
  rows?: number;
  width?: number;
  height?: number;
  delay?: number;
  seed?: number;
}> = ({ rows = 14, width = 900, height = 420, delay = 0, seed = 9 }) => {
  const frame = useCurrentFrame();
  const rh = height / rows;
  const scan = ((frame - delay) * 9) % (height + 200);
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        opacity: p,
        transform: `scaleY(${interpolate(p, [0, 1], [0.86, 1])})`,
      }}
    >
      {Array.from({ length: rows }, (_, i) => {
        const lit = frame - delay > 0 && Math.abs(i * rh - scan) < rh * 2.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: i * rh,
              width: "100%",
              height: rh - 6,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: lit ? 1 : 0.4,
            }}
          >
            {[0.1, 0.26, 0.14, 0.3, 0.12].map((w, c) => (
              <div
                key={c}
                style={{
                  width: `${w * (60 + rnd(seed + i * 5 + c) * 70)}%`,
                  height: rh * 0.34,
                  background: lit ? `${itPalette.primary}5C` : itColors.line,
                }}
              />
            ))}
          </div>
        );
      })}
      {frame - delay > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scan,
            height: 3,
            background: itPalette.primary,
            boxShadow: `0 0 26px ${itPalette.glow}`,
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------- shards */

/**
 * A word breaking into vertical shards that drift apart — the «ИИ» of the
 * third beat, which the script explicitly splits into three. Each shard is the
 * same text clipped to its own column, so the letterforms stay whole where
 * they are not cut.
 */
export const Shards: React.FC<{
  text: string;
  pieces?: number;
  at: number;
  size?: number;
  color?: string;
  spread?: number;
}> = ({ text, pieces = 3, at, size = 300, color = itPalette.text, spread = 62 }) => {
  // ease.inOut, not ease.out: easeOutExpo is so front-loaded that the word was
  // already 75% torn apart four frames after the split and never read as «ИИ».
  // The shards have to be a word first and a glitch second.
  const p = useRamp(at, at + 24, theme.ease.inOut);
  const entry = useIn(0, "snappy");
  return (
    <div
      style={{
        position: "relative",
        height: size * 1.16,
        opacity: entry,
        transform: `scale(${interpolate(entry, [0, 1], [1.3, 1])})`,
      }}
    >
      {Array.from({ length: pieces }, (_, i) => {
        const mid = (pieces - 1) / 2;
        const dir = i - mid;
        const top = (i / pieces) * 100;
        const bottom = 100 - ((i + 1) / pieces) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              clipPath: `inset(${top}% 0 ${bottom}% 0)`,
              transform: `translate(${dir * spread * p}px, ${Math.abs(dir) * 26 * p}px) rotate(${dir * 5 * p}deg)`,
              opacity: 1 - p * 0.25,
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.wide,
                fontSize: size,
                fontWeight: 900,
                lineHeight: 1.16,
                letterSpacing: "-0.03em",
                color,
              }}
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
