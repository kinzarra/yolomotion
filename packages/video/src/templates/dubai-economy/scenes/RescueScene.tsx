// 10 rescue — the hard number at ~62s: Abu Dhabi's $10bn. Then the evidence
// for «самую высокую башню мира» (Meandmybrix, CC0), pushed up the spire;
// the nameplate БУРДЖ ДУБАЙ is struck out and БУРДЖ-ХАЛИФА snaps in on the
// name.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useIn, usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { deColors, dePalette } from "../palette";
import {
  BigNum,
  BrandBar,
  Chip,
  Coin,
  Eyebrow,
  Flash,
  Photo,
  Scrim,
  SceneShell,
  Shockwave,
  Strike,
  ramp,
} from "../ui";

export const RescueScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const money = Math.round(0.9 * fps); // «дал десять миллиардов»
  const tower = Math.round(3.0 * fps); // «А самую высокую башню мира»
  const strike = Math.round(5.2 * fps); // «в честь спасителя»
  const name = Math.round(6.3 * fps); // «Бурдж-Халифа»
  const hit = usePunch(money, 16);
  const nameHit = usePunch(name, 14);
  const flash = interpolate(frame, [tower, tower + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plate = useIn(tower + 14, "snappy");

  if (frame < tower) {
    return (
      <SceneShell exit={false} shake={hit.shake}>
        <BrandBar series={series} episode={episode} />
        <div style={{ position: "absolute", left: 90, top: 300 }}>
          <Chip delay={0} size={30}>
            АБУ-ДАБИ → ДУБАЙ · 2009
          </Chip>
        </div>
        {Array.from({ length: 12 }, (_, i) => {
          const s = 4 + i * 3;
          const t = ramp(frame, s, s + 28, theme.ease.in);
          return t > 0 && t < 1 ? (
            <Coin key={i} size={60} style={{ position: "absolute", left: 780 + ((i * 97) % 220), top: 380 + t * 900, transform: `rotate(${t * 400}deg)` }} />
          ) : null;
        })}
        <div style={{ position: "absolute", left: 90, top: 560 }}>
          <BigNum size={330} color={dePalette.primary} delay={money - 4} glow={dePalette.glow}>
            $10
          </BigNum>
          <BigNum size={150} delay={money + 4}>
            МЛРД
          </BigNum>
        </div>
        <div style={{ position: "absolute", left: 300, top: 760, width: 0, height: 0 }}>
          <Shockwave at={money} size={1300} />
        </div>
        <Flash amount={hit.energy * 0.7} />
      </SceneShell>
    );
  }

  return (
    <SceneShell shake={nameHit.shake * 0.5}>
      <Photo file="10-rescue-burj.jpg" len={durationInFrames - tower} focus={[0.43, 0.2]} zoom={[1.45, 1.75]} />
      <Scrim top={0.8} mid={0.1} bottom={0.95} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={tower + 4}>828 М · ВЫШЕ НЕТ В МИРЕ</Eyebrow>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1020,
          opacity: plate,
          transform: `translateY(${(1 - plate) * 30}px)`,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <Chip size={56} tone="paper">
            БУРДЖ ДУБАЙ
          </Chip>
          {frame >= strike && <Strike delay={strike} thick={12} color={deColors.bad} />}
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1200 }}>
        {frame >= name && (
          <Chip delay={name} size={60} tone="hero" filled>
            БУРДЖ-ХАЛИФА
          </Chip>
        )}
      </div>
      <Flash amount={flash + nameHit.energy * 0.5} color={deColors.white} />
    </SceneShell>
  );
};
