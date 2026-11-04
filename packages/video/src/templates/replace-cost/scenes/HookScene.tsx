import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { rcColors, rcPalette } from "../palette";
import { lineAt } from "../timeline";
import { FACE, faceSeconds, faceSrc } from "../face";
import { Face, Glitch, Kinetic, SceneShell, ScrimWide, Stamp, ramp } from "../ui";

// Beat 1 — the face says it, the frame stamps it. Face full-bleed from the
// first frame; the headline is the hidden first caption page.
export const HookScene: React.FC<{ face: boolean }> = ({ face }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voice = Math.round(lineAt("hook") * fps);
  const g = 1 - ramp(frame, 0, 8);
  return (
    <SceneShell>
      <Sequence from={face ? voice : 0} layout="none">
        <Face
          live={face}
          src={faceSrc("hook")}
          id={FACE.hook.id}
          says={FACE.hook.says}
          seconds={faceSeconds("hook")}
        />
      </Sequence>
      <ScrimWide left={0.75} bottom={0.92} top={0.2} />
      <div style={{ position: "absolute", left: 96, top: 560, width: 1100 }}>
        <Glitch amount={g * 0.8}>
          <Kinetic text="ТЕБЯ УЖЕ ЗАМЕНИЛИ." size={104} per={4} delay={voice} mode="snap" hero={[2]} />
        </Glitch>
      </div>
      <div style={{ position: "absolute", right: 120, top: 520 }}>
        <Stamp delay={voice + 30} tone="bad" size={58} rotate={-8}>
          ЗАМЕНЁН
        </Stamp>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 520,
          width: 180,
          height: 4,
          background: rcPalette.primary,
          boxShadow: `0 0 18px ${rcColors.line}`,
          transform: `scaleX(${ramp(frame, voice, voice + 14)})`,
          transformOrigin: "left",
        }}
      />
    </SceneShell>
  );
};
