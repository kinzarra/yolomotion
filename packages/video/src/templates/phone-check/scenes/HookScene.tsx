// Beat 1 — the tap. The transfer screen is already up (the reel loops into
// it), the finger presses, three ₽ lift off the button — and the screen slams
// red: ПЕРЕВОД ОТКЛОНЁН, УГРОЗА НА УСТРОЙСТВЕ, a red scan grid waking up
// around the phone. Readable without sound inside three seconds.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch, useRamp } from "../../../reel";
import { pcColors } from "../palette";
import { BrandBar, Chip, Flash, Glitch, Phone, ScanGrid, SceneShell, Shockwave, Stamp, Touch, TransferScreen } from "../ui";
import { BUTTON, PHONE } from "./shared";

const PRESS = 6; // the finger goes down
const LIFT = 12; // ₽ leave the button
const SLAM = 22; // the red wall
const STAMP = 25;
const CHIP = 40;
const GRID = 48;

export const HookScene: React.FC<{ series: string; episode: string; amount: string }> = ({ series, episode, amount }) => {
  const frame = useCurrentFrame();
  const punch = usePunch(SLAM, 22);
  const press = useRamp(PRESS, PRESS + 6, theme.ease.out);
  const release = useRamp(PRESS + 8, PRESS + 14, theme.ease.inOut);
  const lift = useRamp(LIFT, LIFT + 16, theme.ease.out);
  const rejected = useRamp(SLAM, SLAM + 5, theme.ease.out);
  const settled = useRamp(SLAM + 6, SLAM + 14, theme.ease.inOut);
  const grid = useRamp(GRID, GRID + 20, theme.ease.out);
  const glitch = interpolate(frame, [SLAM, SLAM + 2, SLAM + 12], [0, 0.9, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerOut = useRamp(SLAM + 2, SLAM + 10, theme.ease.in);
  const tremor = frame >= SLAM ? Math.sin(frame * 2.3) * 2 : 0;

  return (
    <SceneShell shake={punch.shake}>
      <BrandBar series={series} episode={episode} delay={-40} />

      {/* the scan grid wakes around the phone */}
      <ScanGrid amount={grid} width={PHONE.width + 200} height={PHONE.height + 200} style={{ left: PHONE.left - 100, top: PHONE.top - 100 }} />

      <div style={{ position: "absolute", left: PHONE.left, top: PHONE.top, transform: `translateX(${tremor}px)` }}>
        <Glitch amount={glitch} bands={6}>
          <Phone width={PHONE.width} height={PHONE.height} delay={-40}>
            <TransferScreen amount={amount} pressed={press * (1 - release)} lift={frame < SLAM ? lift : 0} rejected={rejected} settled={settled} />
          </Phone>
        </Glitch>
      </div>

      <Touch x={BUTTON.x} y={BUTTON.y} press={press * (1 - release)} opacity={1 - fingerOut} />

      {/* the verdict, over everything */}
      {frame >= STAMP && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 596, display: "flex", justifyContent: "center" }}>
          <Stamp delay={STAMP} tone="bad" size={88} rotate={-6}>
            <div style={{ textAlign: "center", lineHeight: 1.02 }}>
              ПЕРЕВОД
              <br />
              ОТКЛОНЁН
            </div>
          </Stamp>
        </div>
      )}
      {frame >= CHIP && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", transform: "rotate(2deg)" }}>
          <Chip delay={CHIP} tone="bad" filled size={28}>
            УГРОЗА НА УСТРОЙСТВЕ
          </Chip>
        </div>
      )}

      <Shockwave at={SLAM} life={26} color={pcColors.bad} size={1800} />
      <Flash amount={punch.pop} color={pcColors.bad} />
    </SceneShell>
  );
};
