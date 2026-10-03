// 05 use — «этот сурс используем для того, чтобы дальше…»
//
// The payoff beat, and the one place the reel shows its own working: the log
// lines are the actual steps that produced the file being watched, and the
// numbers in them are the ones the pipeline printed. Chrome stays bone —
// captions are running underneath and they own the magenta here.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { Bar, Brackets, Flash, Footage, Scrim, Typed, useExit } from "../ui";

const LOG = [
  "read source.mp4 · 15.46s",
  "transcribe ru-RU · 22 words",
  "cut 5 shots · 1 jump",
  "render 1080×1920 · 17.5s",
];

export const UseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = useExit(9);
  // The capture closes on the frame right before the cut to black.
  const clamp = interpolate(frame, [88, 100], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Footage shot="use" focus={0.42} zoom={[1, 1.07]} scale={1 - clamp * 0.05} />
      <Scrim from="top" height={720} strength={0.86} />
      <Scrim from="bottom" height={640} strength={0.6} />

      {/* The inset stays put. Closing the brackets inward looked like the
          capture tightening, but at 150px they run straight through the REC
          row of the HUD — the frame scale below carries that idea instead. */}
      <Brackets delay={0} inset={56} size={118} />

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 268,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          ...exit,
        }}
      >
        {/* 22 frames apart, so a line finishes before the next one starts —
            at 13 two cursors blinked at once and it read as a glitch. */}
        {LOG.map((line, i) => (
          <Typed key={line} text={line} delay={6 + i * 22} size={26} />
        ))}
      </div>

      {/* Low, above the captions: at mid-frame the bar cut across both faces. */}
      <div style={{ position: "absolute", left: 90, top: 1178, ...exit }}>
        <Bar from={14} to={96} width={900} />
      </div>

      <Flash amount={clamp * 0.7} />
    </AbsoluteFill>
  );
};
