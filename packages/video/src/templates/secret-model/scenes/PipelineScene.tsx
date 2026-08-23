// Beat 5 — the pipeline, drawn vertically because a 9:16 frame has height to
// spend and no width. TRAINED → TESTED → SAFETY EVALS → RELEASED, with a
// playhead falling down the rail.
//
// The whole argument of the reel is the distance the playhead covers before it
// reaches the last node: three of the four steps happen with nobody watching.
// The orange playhead is the only lit element while it moves; it hands the
// glow to the blue RELEASED node and dies, so the frame never holds two.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { smColors, smPalette } from "../palette";
import { BrandBar, Chip, Eyebrow, SceneShell } from "../ui";

const RAIL_X = 214;
const TOP = 470;
const PITCH = 190;
const RUN_FROM = 20;
const RUN_TO = 80;

const NODES = [
  { label: "TRAINED", sub: "the model exists" },
  { label: "TESTED", sub: "internally" },
  { label: "SAFETY EVALS", sub: "still internal" },
  { label: "RELEASED", sub: "you get an API key" },
];

const SPAN = PITCH * (NODES.length - 1);

export const PipelineScene: React.FC<{ brandName: string; chapter: string }> = ({
  brandName,
  chapter,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Local, not `useRamp`: the node list is mapped over, and a hook inside a
  // map is a rule-of-hooks trap waiting for someone to make the list dynamic.
  const ramp = (from: number, to: number, easing = theme.ease.out) =>
    interpolate(frame, [from, to], [0, 1], {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const run = ramp(RUN_FROM, RUN_TO, theme.ease.inOut);
  const head = TOP + run * SPAN;
  // The playhead exists only while it is travelling: it fades up as the run
  // starts and is spent once it arrives, handing the glow to the last node.
  const headFade = ramp(RUN_FROM - 7, RUN_FROM) * (1 - ramp(RUN_TO - 4, RUN_TO + 8));
  const arrived = ramp(RUN_TO, RUN_TO + 12);
  const railDraw = ramp(-10, 8);
  const breathe = 1 + Math.sin((frame / fps) * 3.1) * 0.03;

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />

      <AbsoluteFill style={{ paddingLeft: 82, paddingTop: 330 }}>
        <Eyebrow delay={-6}>How a model reaches you</Eyebrow>
      </AbsoluteFill>

      <AbsoluteFill>
        {/* rail — unlit track, then the travelled part */}
        <div
          style={{
            position: "absolute",
            left: RAIL_X - 2,
            top: TOP,
            width: 4,
            height: SPAN * railDraw,
            background: smColors.lineStrong,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: RAIL_X - 3,
            top: TOP,
            width: 6,
            height: SPAN * run,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${smPalette.primary}00, ${smPalette.primary})`,
            boxShadow: `0 0 26px ${smPalette.glow}`,
            // Backs off once the run lands, so the closing chip is the only
            // orange thing competing with the lit RELEASED node.
            opacity: 1 - arrived * 0.45,
          }}
        />

        {NODES.map((node, i) => {
          const y = TOP + i * PITCH;
          const isLast = i === NODES.length - 1;
          // A node lights as the head crosses it, so the light looks handed
          // over rather than switched on.
          const cross = RUN_FROM + (i / (NODES.length - 1)) * (RUN_TO - RUN_FROM);
          const lit = ramp(cross - 3, cross + 6);
          const enter = ramp(-10 + i * 4, 6 + i * 4);
          const color = isLast ? smPalette.accent : smPalette.text;
          return (
            <React.Fragment key={node.label}>
              <div
                style={{
                  position: "absolute",
                  left: RAIL_X - 15,
                  top: y - 15,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  border: `3px solid ${lit > 0.5 ? color : smColors.lineStrong}`,
                  background: lit > 0.5 ? color : smPalette.bg,
                  boxShadow:
                    isLast && lit > 0.5 ? `0 0 ${34 * arrived}px 4px ${color}` : undefined,
                  opacity: enter,
                  transform: `scale(${(0.7 + enter * 0.3) * (isLast ? 1 + arrived * (breathe - 1) : 1 + lit * 0.12)})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: RAIL_X + 56,
                  top: y - 44,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [-24, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 56,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: lit > 0.5 ? color : smPalette.textDim,
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: theme.fonts.mono,
                    fontSize: 25,
                    letterSpacing: "0.1em",
                    color: smPalette.textDim,
                    opacity: 0.25 + lit * 0.75,
                  }}
                >
                  {node.sub}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* the falling playhead */}
        {headFade > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: RAIL_X - 13,
              top: head - 13,
              width: 26,
              height: 26,
              borderRadius: 13,
              background: smPalette.primary,
              boxShadow: `0 0 38px 9px ${smPalette.glow}`,
              opacity: headFade,
            }}
          />
        ) : null}

        {/* "you are here" — the last node is the only one you ever witness.
            Beside the RELEASED label, not under it: under it lands on top of
            that node's own sub-label. */}
        <div
          style={{
            position: "absolute",
            left: RAIL_X + 404,
            top: TOP + SPAN - 31,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: arrived,
            transform: `translateX(${interpolate(arrived, [0, 1], [-18, 0])}px)`,
            fontFamily: theme.fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: smPalette.accent,
          }}
        >
          <span
            style={{
              width: 34,
              height: 2,
              background: smPalette.accent,
              transform: `scaleX(${arrived})`,
              transformOrigin: "left",
            }}
          />
          YOU ARE HERE
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1214,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Chip delay={100} tone="hero" size={30}>
            YOU ONLY EVER SEE STEP 4
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
