import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, Cut, Rise, YMark, useHit, useRampSec, useSpringAt } from "../ui";

// «Кроме Yoloco»: violet bursts out of the black, the mark slams with a ring.
export const ExceptScene: React.FC = () => {
  const logo = useSpringAt(0.28, "bouncy");
  const ring = useRampSec(0.3, 1.0);
  const hit = useHit(0.3, 0.5);
  return (
    <Cut shake={hit.shake}>
      <Backdrop intensity={2} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}>
        <Rise at={0} y={40}>
          <Big size={120} color={sp.violetTint}>КРОМЕ</Big>
        </Rise>
        <div style={{ position: "relative", marginTop: 50, display: "flex", alignItems: "center", gap: 40, transform: `scale(${interpolate(logo, [0, 1], [0.3, 1]) + hit.pop * 0.08})`, opacity: logo }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 190,
              height: 190,
              borderRadius: 999,
              border: `8px solid ${sp.violetTint}`,
              transform: `scale(${interpolate(ring, [0, 1], [0.8, 3.2])})`,
              opacity: 1 - ring,
            }}
          />
          <YMark size={190} glow={1.2} />
          <Big size={170} color={sp.white}>Yoloco</Big>
        </div>
      </AbsoluteFill>
    </Cut>
  );
};
