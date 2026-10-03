// 04 port — where the oil money went. Coins fall and swerve away from the
// palace (crossed) into the port; then the evidence prints: Jebel Ali from
// orbit (Arirang-3 / KARI, KOGL), the largest man-made harbour.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import {
  BrandBar,
  Chip,
  Coin,
  Cross,
  Eyebrow,
  Kinetic,
  PrintedPhoto,
  SceneShell,
  Sweep,
  ramp,
  useExit,
} from "../ui";

export const PortScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const port = Math.round(2.6 * fps); // «а в порт»
  const name = Math.round(3.6 * fps); // «Джебель-Али»
  const out = useExit(name - 10, 9);
  const portOn = useIn(port, "bouncy");
  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={0}>КУДА ПОШЛИ НЕФТЕДОЛЛАРЫ</Eyebrow>
      </div>

      {/* act 1: coins choose the port over the palace */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
        <div style={{ position: "absolute", left: 90, right: 90, top: 350 }}>
          <Kinetic text="НЕ ВО ДВОРЦЫ, А В ПОРТ" delay={4} per={4} size={84} hero={[5]} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 900, display: "flex", alignItems: "center", gap: 18 }}>
          <Chip delay={20} size={46}>
            ДВОРЦЫ
          </Chip>
          <Cross delay={port - 14} size={70} thick={11} />
        </div>
        <div style={{ position: "absolute", right: 90, top: 900, transform: `scale(${0.8 + portOn * 0.2})` }}>
          <Chip delay={port} tone="hero" filled size={46}>
            ПОРТ
          </Chip>
        </div>
        {Array.from({ length: 9 }, (_, i) => {
          const start = 8 + i * 6;
          const t = ramp(frame, start, start + 34, theme.ease.inOut);
          const x = interpolate(t, [0, 0.45, 1], [500 + (i % 3) * 30, 430, 830]);
          const y = interpolate(t, [0, 1], [560, 900]) - Math.sin(t * Math.PI) * 60;
          const a = t > 0 && t < 0.98 ? 1 : 0;
          return <Coin key={i} size={66} style={{ position: "absolute", left: x, top: y, opacity: a, transform: `rotate(${t * 540}deg)` }} />;
        })}
      </div>

      {/* act 2: the evidence */}
      <div style={{ position: "absolute", left: 130, top: 360 }}>
        {frame >= name - 4 && (
          <PrintedPhoto
            file="04-port-jebel-ali.jpg"
            width={820}
            height={700}
            printFrom={name - 4}
            printFrames={26}
            len={durationInFrames - name}
            focus={[0.42, 0.5]}
            zoom={[1.0, 1.18]}
            caption="ДЖЕБЕЛЬ-АЛИ · ИЗ КОСМОСА"
            tilt={-2}
          >
            <Sweep at={name + 30} life={30} strength={0.3} />
          </PrintedPhoto>
        )}
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1200 }}>
        {frame >= name + 30 && (
          <Kinetic text="КРУПНЕЙШАЯ РУКОТВОРНАЯ ГАВАНЬ" delay={name + 34} per={4} size={50} mode="snap" hero={[0]} />
        )}
      </div>
    </SceneShell>
  );
};
