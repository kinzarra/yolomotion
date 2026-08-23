// 11 yoloco — 54.2–57.8s. Black, and nothing that is not the brand.
//
// No red at all: the two platforms have left the frame, and the last thing the
// viewer sees is monochrome. That is what makes the ending read as the answer
// rather than as one more alarm.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ynColors } from "../palette";
import { Kinetic, Mono, Rule, SceneShell, YolocoMark, YolocoWordmark, ramp } from "../ui";

export const YolocoScene: React.FC<{ ctaLabel: string; url: string }> = ({ ctaLabel, url }) => {
  const frame = useCurrentFrame();
  const [line1, line2] = ctaLabel.split(/\s+(?=WORTH)/);

  return (
    <SceneShell exit={false} light={0.7}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <YolocoMark size={112} delay={0} />
        <div style={{ height: 34 }} />
        <YolocoWordmark delay={10} size={84} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
        <Rule width={220} delay={26} color={ynColors.lineStrong} />
      </div>

      <div style={{ position: "absolute", left: 76, right: 76, top: 950 }}>
        <Kinetic text={line1 ?? ctaLabel} delay={32} size={78} align="center" weight={700} />
        {line2 ? <Kinetic text={line2} delay={38} size={78} align="center" weight={700} /> : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1210,
          display: "flex",
          justifyContent: "center",
          opacity: ramp(frame, 56, 74, theme.ease.out),
        }}
      >
        <Mono size={30} color={ynColors.bone} style={{ letterSpacing: "0.22em" }}>
          {url}
        </Mono>
      </div>
    </SceneShell>
  );
};
