// 06 outro — the reel finishes the sentence the recording cut off.
//
// The source ends mid-phrase on «…чтобы дальше». Nothing was re-recorded to
// patch it: the footage stops, the picture cuts to black, and the answer
// arrives as type. That is the whole idea of the piece, so this is the only
// beat with no footage in it and the only one that gets the big magenta.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { useIn } from "../../../reel";
import { theme } from "../../../theme";
import { ucColors, ucPalette } from "../palette";
import { MaskLines, Mono, Rule, Wide } from "../ui";

export const OutroScene: React.FC<{
  payoff: string[];
  cta: string[];
  brand: string;
  brandNote: string;
}> = ({ payoff, cta, brand, brandNote }) => {
  const frame = useCurrentFrame();
  const ctaIn = useIn(42, "smooth");
  const brandIn = useIn(56, "smooth");
  // The block breathes so the last three seconds are not a freeze-frame.
  const breathe = 1 + Math.sin(frame / 24) * 0.006;

  return (
    <AbsoluteFill>
      <BgMesh palette={ucPalette} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transform: `scale(${breathe})`,
        }}
      >
        {/* The last caption page clears at 14.72s — frame 18 of this beat.
            The bone line starts under it at 14 so the cut to black is never
            empty, and the magenta line only crosses zero at frame 21, after
            the caption's own magenta word is gone. */}
        <MaskLines
          lines={payoff}
          size={124}
          delay={14}
          per={6}
          align="center"
          accentIndex={payoff.length - 1}
        />

        <div style={{ marginTop: 54, opacity: ctaIn }}>
          <Rule width={220} delay={36} thickness={2} />
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [30, 0])}px)`,
          }}
        >
          {cta.map((line) => (
            <Wide key={line} size={52} weight={700} color={ucColors.bone}>
              {line}
            </Wide>
          ))}
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: brandIn,
          transform: `translateY(${interpolate(brandIn, [0, 1], [22, 0])}px)`,
        }}
      >
        <Mono size={30} color={ucColors.bone} style={{ letterSpacing: "0.3em" }}>
          {brand}
        </Mono>
        <Wide size={22} weight={500} color={ucColors.dim} style={{ letterSpacing: "0.04em" }}>
          {brandNote}
        </Wide>
      </div>
    </AbsoluteFill>
  );
};
