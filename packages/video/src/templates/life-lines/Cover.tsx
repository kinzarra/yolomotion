// Instagram cover for life-lines: a frozen mid-life frame of the reel and one
// hook line. Three variants side by side in time: frame 0, 30, 60.
import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { z } from "zod";
import { Grain, Vignette } from "../../components/Layers";
import { defineTemplate } from "../types";
import { AgeAxis, HeadsAndStars, SAFE_SCALE, Sky, Threads } from "./LifeLines";
import { fonts, palette } from "./palette";

const BG_FRAME = 1290; // ~45 years: three stars above, family below, the childhood friend back for a moment

type Hook = { top: string; accent: string; bottom: string; sub: string };
const HOOKS: Hook[] = [
  { top: "Вся твоя жизнь", accent: "за 90 секунд", bottom: "", sub: "досмотри, кто останется в небе" },
  { top: "Досмотри", accent: "и позвони", bottom: "маме", sub: "вся жизнь за 90 секунд" },
  { top: "Кто останется", accent: "в твоём небе?", bottom: "", sub: "вся жизнь за 90 секунд" },
];

export const LifeLinesCover: React.FC = () => {
  const frame = useCurrentFrame();
  const h = HOOKS[Math.min(HOOKS.length - 1, Math.floor(frame / 30))];
  return (
    <AbsoluteFill style={{ background: palette.skyBottom }}>
      <Freeze frame={BG_FRAME}>
        <Sky />
        <AbsoluteFill style={{ transform: `scale(${SAFE_SCALE})`, transformOrigin: "50% 50%" }}>
          <AgeAxis />
          <Threads />
          <HeadsAndStars />
        </AbsoluteFill>
      </Freeze>
      {/* dark band so the hook reads over the threads */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: 1060,
          width: 1480,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(4,6,16,0.92) 0%, rgba(4,6,16,0.75) 45%, transparent 72%)`,
        }}
      />
      <div style={{ position: "absolute", left: 110, right: 110, top: 1130, textAlign: "center" }}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 124,
            lineHeight: 1.0,
            color: palette.text,
            textShadow: "0 0 34px rgba(255,220,150,0.25), 0 4px 18px rgba(0,0,0,0.7)",
          }}
        >
          {h.top}
          <br />
          <span style={{ color: palette.now, textShadow: `0 0 40px ${palette.now}88, 0 4px 18px rgba(0,0,0,0.7)` }}>{h.accent}</span>
          {h.bottom ? (
            <>
              <br />
              {h.bottom}
            </>
          ) : null}
        </div>
        <div style={{ marginTop: 28, fontFamily: fonts.label, fontWeight: 600, fontSize: 36, color: palette.textDim }}>
          {h.sub}
        </div>
      </div>
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const lifeLinesCover = defineTemplate({
  id: "life-lines-cover",
  name: "Созвездие: обложка",
  description: "Instagram cover for life-lines: a frozen frame of the reel and a hook line (3 variants at frames 0, 30, 60).",
  schema: z.object({}),
  defaultProps: {},
  // long enough that <Freeze> can reach BG_FRAME (it clamps to the composition)
  durationInSeconds: 50,
  formats: ["reel"],
  component: LifeLinesCover,
});
