// 04 television — 14.5–20.9s. The same show, three screens, one conclusion.
//
// One piece of content sits centre-stage and the device around it is replaced
// three times, each bigger than the last. Nothing about the content changes —
// that is the argument. Then the last device stops being a device and becomes
// the frame.
//
// Screenshot frame #1.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors, ynPalette } from "../palette";
import { Device, Folio, Kinetic, SceneShell, ramp, usePunch } from "../ui";

const PHONE_AT = 8;
const LAPTOP_AT = 54;
const TV_AT = 102;
const EXPAND_AT = 140;
const TYPE_AT = 152;

const STAGES = [
  { key: "PHONE", at: PHONE_AT, until: LAPTOP_AT },
  { key: "LAPTOP", at: LAPTOP_AT, until: TV_AT },
  { key: "TV", at: TV_AT, until: EXPAND_AT + 40 },
] as const;

// What is playing. The same block at every size, so the eye reads "same
// content" rather than "three different things".
const Playing: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const frame = useCurrentFrame();
  const tri = Math.round(Math.min(w, h) * 0.16);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(150deg, ${ynColors.screenLift}, ${ynColors.screen} 68%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 38% 34%, rgba(237,232,223,0.13), transparent 60%)`,
        }}
      />
      <svg width={tri} height={tri} viewBox="0 0 20 20" fill="none">
        <path d="M5 3L17 10L5 17V3Z" fill={ynColors.bone} opacity={0.85} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: Math.max(2, Math.round(h * 0.014)),
          background: "rgba(237,232,223,0.16)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${34 + (frame % 90) * 0.42}%`,
            background: "rgba(237,232,223,0.6)",
          }}
        />
      </div>
    </div>
  );
};

const Stage: React.FC<{
  kind: "phone" | "laptop" | "tv";
  screenW: number;
  at: number;
  until: number;
  scale: number;
  dim: number;
}> = ({ kind, screenW, at, until, scale, dim }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = ramp(frame, at, at + 18, theme.ease.out);
  const out = ramp(frame, until - 8, until - 1, theme.ease.in);
  const ratio = kind === "phone" ? 16 / 9 : 9 / 16;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: (1 - out) * dim,
        transform: `scale(${scale * interpolate(out, [0, 1], [1, 1.06])})`,
      }}
    >
      <Device kind={kind} screenW={screenW} progress={p}>
        <Playing w={screenW} h={screenW * ratio} />
      </Device>
    </div>
  );
};

export const TelevisionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const expand = ramp(frame, EXPAND_AT, EXPAND_AT + 26, theme.ease.in);
  const hit = usePunch(EXPAND_AT + 18, 20);

  return (
    <SceneShell light={0.4}>
      <Folio left="03 · CREATORS BECOME TV" right="THE SAME SHOW" delay={-6} />

      {/* the stage — one show, three devices, each hop bigger than the last */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(-70px)` }}>
        <Stage kind="phone" screenW={300} at={PHONE_AT} until={LAPTOP_AT} scale={1} dim={1} />
        <Stage kind="laptop" screenW={580} at={LAPTOP_AT} until={TV_AT} scale={1} dim={1} />
        {/* The television is cut the moment the expansion has covered the
            frame: at 3.4× its stand and bezel become two stray bars across the
            type. */}
        {expand < 0.86 && (
          <Stage
            kind="tv"
            screenW={820}
            at={TV_AT}
            until={EXPAND_AT + 40}
            scale={1 + expand * 2.4}
            dim={1 - expand}
          />
        )}
      </div>

      {/* …and then the television stops being an object in the room. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ynColors.screen,
          opacity: expand,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: expand,
          background: `radial-gradient(ellipse at 50% 38%, rgba(237,232,223,0.10), transparent 62%)`,
        }}
      />

      {/* the chain, so the hops read as an escalation and not as three shots */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1290,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          opacity: (1 - Math.min(1, expand * 2.2)) * ramp(frame, 12, 30),
          fontFamily: theme.fonts.mono,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "0.2em",
        }}
      >
        {STAGES.map((s, i) => (
          <React.Fragment key={s.key}>
            {i > 0 && <span style={{ color: ynColors.dim }}>→</span>}
            <span
              style={{
                color: frame >= s.at ? ynColors.bone : ynColors.dim,
                borderBottom: `2px solid ${frame >= s.at && frame < s.until ? ynPalette.primary : "transparent"}`,
                paddingBottom: 8,
              }}
            >
              {s.key}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* the frame's own conclusion, set inside the screen it just became */}
      <div style={{ position: "absolute", left: 62, right: 62, top: 636 }}>
        <Kinetic text="CREATORS" delay={TYPE_AT} size={152} align="flex-start" weight={700} />
        <Kinetic text="ARE" delay={TYPE_AT + 5} size={152} align="flex-start" weight={700} />
        {/* The one serif-italic word this register allows, and the only red on
            the page — the frame it lands in has nothing else in it. */}
        <Kinetic
          text="TELEVISION."
          delay={TYPE_AT + 10}
          size={152}
          align="flex-start"
          weight={700}
          italic={[0]}
          italicColor={ynPalette.primary}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: ynColors.white,
          opacity: hit.energy * 0.12,
        }}
      />
    </SceneShell>
  );
};
