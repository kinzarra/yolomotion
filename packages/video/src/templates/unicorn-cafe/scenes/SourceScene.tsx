// 04 source — the jump cut, and the file that came out of it.
//
// 1.05 seconds of dead air were removed between this beat and the last one,
// so the picture lurches. The edit owns it: a one-frame white hit, a snap
// zoom that settles in eight frames, and the running timecode in the HUD
// visibly skipping from 00:08.45 to 00:09.50.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useIn } from "../../../reel";
import { theme } from "../../../theme";
import { ucColors } from "../palette";
import { Flash, Footage, Mono, Rule, Scrim, useExit } from "../ui";

// Its own component so each column gets its own spring — a hook cannot be
// called inside a .map() body.
const Fact: React.FC<{ label: string; value: string; delay: number }> = ({
  label,
  value,
  delay,
}) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
      }}
    >
      <Mono size={20}>{label}</Mono>
      <Mono size={28} color={ucColors.bone} style={{ letterSpacing: "0.04em" }}>
        {value}
      </Mono>
    </div>
  );
};

export const SourceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = useExit(9);
  const snap = interpolate(frame, [0, 9], [1.17, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hit = interpolate(frame, [0, 5], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const facts: [string, string][] = [
    ["size", "592 × 1280"],
    ["rate", "30 fps"],
    ["length", "00:15.46"],
  ];

  return (
    <AbsoluteFill>
      <Footage shot="source" focus={0.42} zoom={[1, 1.05]} scale={snap} />
      <Scrim from="bottom" height={860} strength={0.72} />

      <div style={{ position: "absolute", left: 90, top: 1010, width: 900, ...exit }}>
        <Rule width={900} delay={8} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 20 }}>
          <Mono size={40} color={ucColors.bone} style={{ letterSpacing: "0.06em" }}>
            source.mp4
          </Mono>
          <Mono size={22}>on disk</Mono>
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 22 }}>
          {facts.map(([label, value], i) => (
            <Fact key={label} label={label} value={value} delay={14 + i * 4} />
          ))}
        </div>
      </div>

      <Flash amount={hit} />
    </AbsoluteFill>
  );
};
