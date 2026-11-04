import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, Glitch, clamp, useHit, useSpringAt } from "../ui";

// The drama beat, now voiced (author note 37): НИ. / У. / КОГО., one word per line, each slams
// with a glitch and a shake, on the same backdrop as the rest.
const WORDS = [
  { w: "НИ", at: 0.24 },
  { w: "У", at: 0.42 },
  { w: "КОГО.", at: 0.55 },
];

export const SilenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = [useHit(0.26, 0.3), useHit(0.44, 0.3), useHit(0.57, 0.5)];
  const shake = h[0].shake + h[1].shake + h[2].shake * 1.5;
  const z = interpolate(frame, [0, 1.5 * fps], [1.0, 1.1], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake * 16}px, ${shake * -10}px) scale(${z})` }}>
      <Backdrop intensity={0.8} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
        {WORDS.map((x, i) => (
          <Word key={x.w} {...x} amt={h[i].pop} last={i === 2} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Word: React.FC<{ w: string; at: number; amt: number; last: boolean }> = ({ w, at, amt, last }) => {
  const p = useSpringAt(at, "snappy");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at * fps) return <div style={{ height: 250 }} />;
  return (
    <div style={{ height: 250, display: "flex", alignItems: "center", transform: `scale(${interpolate(p, [0, 1], [2.4, 1])})`, opacity: interpolate(p, [0, 0.2], [0, 1], clamp) }}>
      <Glitch amt={amt * 1.4}>
        <Big size={last ? 270 : 250} color={last ? sp.violetTint : sp.white} style={{ textShadow: last ? `0 0 80px ${sp.violetGlow}` : undefined }}>
          {w}
        </Big>
      </Glitch>
    </div>
  );
};
