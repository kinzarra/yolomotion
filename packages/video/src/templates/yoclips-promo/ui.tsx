// Scene primitives for the YoClips promo.
//
// The whole «ЧЕК × ПИКСЕЛЬ» kit is re-exported from `digital-ruble` — receipt,
// stamp, kinetic type, chips, counter, glitch, scene shell. Only what the
// product promo needs and the series does not have is added below: the
// wordmark, the screencast container, the pipeline chain and the price tag.
export * from "../digital-ruble/ui";

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { ycColors, ycPalette } from "./palette";
import { FOOTAGE, FootageShot } from "./footage";

/* ----------------------------------------------------------- screencast */

// Every clip is the same shape: the receipt column lifted out of a desktop
// capture (see scripts/footage/yoclips-promo.json), 1080×1678.
const SHOT_W = 1080;
const SHOT_H = 1678;

/* ------------------------------------------------------------- the phone */

// The device is deliberately WIDER than a phone silhouette that would fit in
// frame. A whole 19.5:9 handset inside the clear band (262…1380) would be
// ~500px wide, and the cabinet's type inside it would land near 12px — a
// screenshot of a screenshot. So the shot is pushed INTO the phone instead:
// the top bezel, the corners and both sides read, and the body runs off the
// bottom of the frame. It is unmistakably a phone and the interface stays
// legible, which a correctly-proportioned mock cannot do at 1080×1920.
const DEV_W = 1010;
const DEV_TOP = 300;
const BEZEL = 15;
const SCREEN_W = DEV_W - BEZEL * 2; // 980
const URLBAR_H = 78;

// Where the thing being talked about lands, in the screen's own coordinates.
// The screen starts at frame y=393 and captions start at 1416, so the clear
// band inside the device is 0…987 of screen space and its middle is here.
const ATTENTION = 496;

/** Safari-ish address bar. The URL is real, and showing it here is the only
 *  place the address appears before the closing card. */
const UrlBar: React.FC<{ url: string; delay: number }> = ({ url, delay }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: URLBAR_H,
        background: ycColors.surfaceStrong,
        borderBottom: `1px solid ${ycColors.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 30px",
          borderRadius: 22,
          background: ycColors.surfaceLift,
          fontFamily: theme.fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: ycPalette.textDim,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: ycPalette.primary,
            boxShadow: `0 0 12px ${ycPalette.glow}`,
          }}
        />
        {url}
      </div>
    </div>
  );
};

/**
 * The handset the cabinet is shown on. Enters once per beat, breathes while
 * it is held, and clips whatever is inside to the screen's rounded rectangle.
 */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  delay?: number;
  url?: string;
}> = ({ children, delay = 0, url = "clips.yoloco.io" }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, "smooth");
  // Held in a hand, not bolted to a rig.
  const float = Math.sin(frame / 34) * 5;
  const tilt = Math.sin(frame / 52) * 0.35;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: (1080 - DEV_W) / 2,
          top: DEV_TOP,
          width: DEV_W,
          // Past the bottom of the frame on purpose — see the note above.
          height: 1720,
          borderRadius: 84,
          background: ycColors.surfaceLift,
          border: `2px solid ${ycColors.lineStrong}`,
          boxShadow: `0 40px 120px -30px rgba(0,0,0,0.95), 0 0 90px -30px ${ycPalette.glow}`,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [90, float])}px) scale(${interpolate(
            p,
            [0, 1],
            [0.96, 1],
          )}) rotate(${tilt}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: BEZEL,
            borderRadius: 70,
            overflow: "hidden",
            background: ycPalette.bg,
          }}
        >
          <UrlBar url={url} delay={delay + 6} />
          <div style={{ position: "absolute", left: 0, right: 0, top: URLBAR_H, bottom: 0, overflow: "hidden" }}>
            {children}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * A screencast of the real cabinet, rendered into the phone's screen.
 *
 * `focus` + `zoom` are the "Ken Burns with a destination" rule — the push ENDS
 * on the row the voice is naming, never on the centre.
 *
 * The clip is drawn at its NATURAL aspect and only translated vertically. An
 * earlier version cover-fitted it, which meant a permanent 8% horizontal crop:
 * the receipt lost both torn edges and every line started mid-word. Vertical is
 * the only axis with pixels to spare, so vertical is the only axis that gets
 * cropped.
 */
export const Screencast: React.FC<{
  shot: FootageShot;
  /** Which point of the CLIP (0 = its top, 1 = its bottom) lands on ATTENTION. */
  focus?: number;
  /** Scale at the first and last frame of this clip's window. */
  zoom?: [number, number];
  /** Frames this clip is on screen; the push is spread across them. */
  len: number;
  /** Width to draw the clip at. Defaults to the phone screen. */
  viewW?: number;
  /** Where in this container the focus point lands. */
  attention?: number;
  style?: React.CSSProperties;
}> = ({ shot, focus = 0.5, zoom = [1, 1.12], len, viewW = SCREEN_W, attention = ATTENTION, style }) => {
  const frame = useCurrentFrame();
  const fit = viewW / SHOT_W;
  const h = SHOT_H * fit;
  const push = interpolate(frame, [0, len], zoom, {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The settle is SCALE ONLY. An opacity fade here put a black frame on every
  // scene boundary — the outgoing beat was already lifting away under
  // SceneShell's exit, and two fades back to back read as a dropped frame
  // rather than a cut. Footage cuts hard and settles.
  const settle = useIn(0, "smooth");
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: ycPalette.bg, ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: attention - focus * h,
          width: viewW,
          height: h,
          transform: `scale(${push * interpolate(settle, [0, 1], [1.04, 1])})`,
          transformOrigin: `50% ${focus * 100}%`,
        }}
      >
        <OffthreadVideo
          src={staticFile(`footage/yoclips-promo/${shot}.mp4`)}
          muted
          style={{
            width: "100%",
            height: "100%",
            // The capture is a browser at 60fps on a bright panel; a touch of
            // contrast seats the paper into the reel's grade without tinting
            // it. Lime belongs to the digital layer and is left alone.
            filter: "contrast(1.06) saturate(0.98) brightness(0.97)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Seconds a cut clip runs — so a scene never types a footage length. */
export const shotFrames = (shot: FootageShot, fps: number) =>
  Math.floor(FOOTAGE[shot].seconds * fps);

/**
 * Dark wash so type keeps its contrast over a bright receipt.
 *
 * `solid` is the part that is genuinely opaque before the gradient starts.
 * A pure gradient was not enough: the receipt paper is #F1EDE2, and a label
 * sitting a third of the way down a soft ramp was unreadable in the stills.
 */
export const Scrim: React.FC<{
  from?: "top" | "bottom";
  height?: number;
  solid?: number;
  strength?: number;
}> = ({ from = "bottom", height = 620, solid = 0.3, strength = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [from]: 0,
      height,
      background: `linear-gradient(${from === "bottom" ? 0 : 180}deg, ${ycPalette.bg} 0%, ${
        ycPalette.bg
      } ${Math.round(solid * 100)}%, ${ycPalette.bg}00 100%)`,
      opacity: strength,
      pointerEvents: "none",
    }}
  />
);

/**
 * The label band over a screencast: an opaque plate, a hairline under it, and
 * the eyebrow inside. Every footage beat wears one, so the step numbering sits
 * in the same place all reel and never fights the interface behind it.
 */
export const TopBar: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 2,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 262 }}>
      <div style={{ position: "absolute", inset: 0, background: ycPalette.bg }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 262,
          height: 130,
          background: `linear-gradient(180deg, ${ycPalette.bg}, ${ycPalette.bg}00)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 34,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 18,
          height: 2,
          background: ycColors.lineStrong,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------- wordmark */

/** YOCLIPS as the product draws it: bone «YO», lime «CLIPS». */
export const Wordmark: React.FC<{
  delay?: number;
  size?: number;
  glow?: boolean;
}> = ({ delay = 0, size = 132, glow = true }) => {
  const p = useIn(delay, "snappy");
  const q = useIn(delay + 5, "snappy");
  const common: React.CSSProperties = {
    fontFamily: theme.fonts.display,
    fontSize: size,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    display: "inline-block",
  };
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.34)}px ${ycPalette.glow})` : undefined,
      }}
    >
      <span
        style={{
          ...common,
          color: ycPalette.text,
          opacity: p,
          transform: `translateX(${interpolate(p, [0, 1], [-34, 0])}px)`,
        }}
      >
        YO
      </span>
      <span
        style={{
          ...common,
          color: ycPalette.primary,
          opacity: q,
          transform: `translateX(${interpolate(q, [0, 1], [34, 0])}px)`,
        }}
      >
        CLIPS
      </span>
    </div>
  );
};

/* ------------------------------------------------------------ price tag */

/**
 * The number the whole reel is for. Mono, because it is a figure off a
 * receipt and not a headline — Unbounded has no `$` worth showing at this
 * size and would letter-space the decimal apart.
 */
export const Price: React.FC<{
  value: string;
  delay?: number;
  size?: number;
  tone?: "hero" | "ink";
  /** Anchor for the slam. In a receipt row use "right": the overshoot then
   *  travels into the dotted leader rather than over the label. */
  origin?: string;
}> = ({ value, delay = 0, size = 190, tone = "hero", origin = "center" }) => {
  const p = useIn(delay, "snappy");
  const color = tone === "hero" ? ycPalette.primary : ycColors.ink;
  return (
    <span
      style={{
        fontFamily: theme.fonts.mono,
        fontSize: size,
        fontWeight: 800,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color,
        display: "inline-block",
        opacity: Math.min(1, p * 1.7),
        transform: `scale(${interpolate(p, [0, 1], [2.1, 1])})`,
        transformOrigin: origin,
        filter: tone === "hero" ? `drop-shadow(0 0 ${Math.round(size * 0.2)}px ${ycPalette.glow})` : undefined,
      }}
    >
      {value}
    </span>
  );
};

/* -------------------------------------------------------- pipeline chain */

/**
 * The stages the worker actually runs, as a chain that fills left→right.
 * Names match `packages/worker/src/stages/` — the graphic is the product's
 * own ORDER list, not an illustration of one.
 */
export const StageChain: React.FC<{
  stages: string[];
  delay?: number;
  /** Frames per stage — the fill walks the chain at this rate. */
  per?: number;
  width?: number;
}> = ({ stages, delay = 0, per = 7, width = 900 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width }}>
      {stages.map((stage, i) => {
        // One frame read, one eased ramp per row: `useRamp` is a hook and
        // cannot be called inside this map body.
        // Rows list themselves almost at once — a chain that arrives one
        // row per fill-step left the cut into this beat sitting on a single
        // dim word. The WALK is the animation; the list is context.
        const at = delay + i * per;
        const p = interpolate(frame, [delay + i * 2, delay + i * 2 + 8], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const done = interpolate(frame, [at + 8, at + 20], [0, 1], {
          easing: theme.ease.out,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={stage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: ycPalette.primary,
                opacity: done,
                boxShadow: `0 0 18px ${ycPalette.glow}`,
                flex: "none",
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: done > 0.6 ? ycPalette.text : ycPalette.textDim,
                whiteSpace: "nowrap",
              }}
            >
              {stage}
            </span>
            <span
              style={{
                flex: 1,
                height: 2,
                background: ycColors.line,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background: ycPalette.primary,
                  transform: `scaleX(${done})`,
                  transformOrigin: "left",
                }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- cursor */

/** Blinking text caret — the only thing the operator actually does. */
export const Caret: React.FC<{ height?: number; delay?: number }> = ({ height = 44, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame < delay ? 0 : Math.floor(((frame - delay) / fps) * 2) % 2;
  return (
    <span
      style={{
        display: "inline-block",
        width: 4,
        height,
        background: ycPalette.primary,
        opacity: on,
        transform: "translateY(0.12em)",
        boxShadow: `0 0 14px ${ycPalette.glow}`,
      }}
    />
  );
};

/** Hairline rule that draws itself left→right. */
export const DrawRule: React.FC<{
  from: number;
  to: number;
  color?: string;
  thickness?: number;
}> = ({ from, to, color = ycColors.lineStrong, thickness = 2 }) => {
  const p = useRamp(from, to);
  return (
    <div
      style={{
        height: thickness,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: "left",
        width: "100%",
      }}
    />
  );
};
