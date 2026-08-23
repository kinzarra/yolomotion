// Beat 5 — the fear, then the scratch. БАНК ПРОЧИТАЕТ ПЕРЕПИСКУ? over a swarm
// of photos, messages, contacts and documents arriving faster and faster; the
// headline creeps closer. On «но это не так» everything freezes: a red bar
// strikes the claim, НЕТ stamps over it, and the tiles are locked inside a
// transparent lime safe. Nothing moves after that.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { pcColors } from "../palette";
import { BrandBar, DataTile, Eyebrow, Flash, Kinetic, Safe, SceneShell, Stamp, TileKind, rnd } from "../ui";

const HEAD = 4;
const SWARM = 14;
const ZOOM = 90;
const FREEZE = 172; // «но»
const STRIKE = 174;
const NO = 180;
const SAFE = 188;

const KINDS: TileKind[] = ["photo", "message", "contact", "doc"];
const N = 16;
const TILES = Array.from({ length: N }, (_, i) => ({
  kind: KINDS[i % 4],
  x: 70 + ((i * 211) % 760) + (rnd(i * 3 + 1) - 0.5) * 60,
  y: 680 + ((Math.floor(i / 4) * 165 + (i % 2) * 40) % 560),
  rot: (rnd(i * 5 + 2) - 0.5) * 22,
  size: 130 + Math.round(rnd(i * 7 + 3) * 40),
  // accelerating stagger: the gaps shrink as the swarm builds
  at: SWARM + Math.round(145 * Math.sqrt(i / (N - 1))),
}));

export const FearScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const t = Math.min(frame, FREEZE);
  const zoom = interpolate(t, [ZOOM, FREEZE], [1, 1.12], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strike = useRamp(STRIKE, STRIKE + 7, theme.ease.out);
  const scratch = usePunch(FREEZE, 10);
  const dimTiles = useRamp(SAFE, SAFE + 12, theme.ease.inOut);
  const drift = interpolate(t, [0, FREEZE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.inOut });
  const safe = useIn(SAFE, "snappy");

  return (
    <SceneShell shake={scratch.shake * 0.4}>
      <BrandBar series={series} episode={episode} />

      {/* the swarm */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - dimTiles * 0.5 }}>
        {TILES.map((tile, i) => {
          if (frame < tile.at) return null;
          const bob = Math.sin((t + i * 9) / 16) * 7 - drift * 30 * ((i % 3) - 1);
          return (
            <div key={i} style={{ position: "absolute", left: tile.x, top: tile.y, transform: `translateY(${bob}px) rotate(${tile.rot}deg)` }}>
              <DataTile kind={tile.kind} size={tile.size} delay={tile.at} />
            </div>
          );
        })}
      </div>

      {/* the safe closes over them */}
      {frame >= SAFE && <Safe width={940} height={700} delay={SAFE} style={{ left: 70, top: 660 }} />}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2} color={pcColors.bad}>
          Заголовки
        </Eyebrow>
        <div style={{ position: "relative", width: 980, marginTop: 20, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
          <Kinetic text="БАНК ПРОЧИТАЕТ ПЕРЕПИСКУ?" delay={HEAD} per={5} size={88} align="center" mode="snap" bad={[1]} style={{ justifyContent: "center" }} />
          {/* the strike */}
          {frame >= STRIKE && (
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: "48%",
                height: 16,
                background: pcColors.bad,
                transform: `rotate(-3deg) scaleX(${strike})`,
                transformOrigin: "left center",
                boxShadow: `0 0 30px ${pcColors.badGlow}`,
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {frame >= NO && (
        <div style={{ position: "absolute", left: 560, top: 520, opacity: safe >= 0 ? 1 : 1 }}>
          <Stamp delay={NO} tone="bad" size={130} rotate={8}>
            НЕТ
          </Stamp>
        </div>
      )}

      <Flash amount={scratch.pop * 0.5} color={pcColors.bad} />
    </SceneShell>
  );
};
