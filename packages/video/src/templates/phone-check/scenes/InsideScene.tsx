// Beat 7 — what the check looks for. The phone in cutaway: three layers —
// the bank app, the protective contour (lime), the malware (red). ₽ tokens
// stream from the app toward СПИСАНИЕ; a red pulse climbs from the bottom
// layer to take the stream over; the contour lights, the pulse dies, and the
// lead token freezes a centimetre short of the exit inside lime brackets.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { pcColors, pcPalette } from "../palette";
import { BrandBar, Chip, CodeRain, Eyebrow, Flash, Kinetic, Pulse, SceneShell, Shockwave, Token, useExit } from "../ui";

const HEAD = 8;
const L1 = 14;
const L2 = 26;
const L3 = 38;
const PORT = 48;
const THREAT = 62; // «вредоносной программы»
const RISE = 118; // the pulse climbs
const CAUGHT = 154; // the contour lights
const FREEZE = 176; // the tokens stop
const BRACKET = 182;
const SWAP = 186; // «перехватить управление» → ОБНАРУЖИТЬ ДО СПИСАНИЯ

const X0 = 150;
const W = 780;
const H = 150;
const Y = [640, 830, 1020];
const PORT_X = 985;
const PORT_Y = 560;
const SPEED = 0.00665;

type Pt = { x: number; y: number };
const PATH: Pt[] = [
  { x: X0 + 60, y: Y[0] + 75 },
  { x: X0 + W - 90, y: Y[0] + 75 },
  { x: PORT_X, y: Y[0] + 10 },
  { x: PORT_X, y: PORT_Y + 30 },
];
const segLen = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const TOTAL = PATH.slice(1).reduce((s, p, i) => s + segLen(PATH[i], p), 0);
const pointAt = (p: number): Pt => {
  let d = p * TOTAL;
  for (let i = 1; i < PATH.length; i += 1) {
    const l = segLen(PATH[i - 1], PATH[i]);
    if (d <= l) {
      const k = d / l;
      return { x: PATH[i - 1].x + (PATH[i].x - PATH[i - 1].x) * k, y: PATH[i - 1].y + (PATH[i].y - PATH[i - 1].y) * k };
    }
    d -= l;
  }
  return PATH[PATH.length - 1];
};

const Layer: React.FC<{ y: number; delay: number; tone: "app" | "guard" | "bad"; label: string; lit?: number; children?: React.ReactNode }> = ({
  y,
  delay,
  tone,
  label,
  lit = 0,
  children,
}) => {
  const p = useIn(delay, "smooth");
  const color = tone === "guard" ? pcPalette.primary : tone === "bad" ? pcColors.bad : pcColors.lineStrong;
  return (
    <div
      style={{
        position: "absolute",
        left: X0,
        top: y,
        width: W,
        height: H,
        borderRadius: 22,
        border: `${tone === "app" ? 2 : 3}px solid ${color}`,
        background: tone === "app" ? `linear-gradient(160deg, ${pcColors.surfaceLift}, ${pcColors.surfaceStrong})` : `${color}0D`,
        boxShadow: tone === "guard" ? `0 0 ${70 * lit}px ${pcPalette.glow}, inset 0 0 ${60 * lit}px ${pcPalette.primary}22` : pcColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 16,
          fontFamily: theme.fonts.mono,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};

export const InsideScene: React.FC<{ series: string; episode: string; amount: string }> = ({ series, episode, amount }) => {
  const frame = useCurrentFrame();
  const t = Math.min(frame, FREEZE);
  const headOut = useExit(SWAP - 10, 10);
  const port = useIn(PORT, "snappy");
  const rise = useRamp(RISE, CAUGHT, theme.ease.in);
  const caught = usePunch(CAUGHT, 20);
  const die = useRamp(CAUGHT + 4, CAUGHT + 16, theme.ease.in);
  const lit = interpolate(frame, [CAUGHT, CAUGHT + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  const bracket = useIn(BRACKET, "snappy");
  const pulseY = interpolate(rise, [0, 1], [Y[2] + 75, Y[1] + 75]);
  const lead = pointAt(((SPEED * FREEZE + 0.75) % 1));

  return (
    <SceneShell shake={caught.shake * 0.35}>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Что ищет проверка</Eyebrow>
        <div style={{ position: "relative", width: 980, marginTop: 20, minHeight: 110 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 40}px)` }}>
              <Kinetic text="ТЕЛЕФОН В РАЗРЕЗЕ" delay={HEAD} per={4} size={72} align="center" mode="snap" style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= SWAP && (
            <Kinetic text="ОБНАРУЖИТЬ ДО СПИСАНИЯ" delay={SWAP} per={4} size={66} align="center" mode="snap" hero={[0]} style={{ justifyContent: "center" }} />
          )}
        </div>
        {frame >= THREAT && frame < SWAP && (
          <div style={{ marginTop: 14 }}>
            <Chip delay={THREAT} tone="bad" size={24}>
              ВРЕДОНОСНОЕ ВОЗДЕЙСТВИЕ
            </Chip>
          </div>
        )}
      </AbsoluteFill>

      {/* the exit port */}
      <div
        style={{
          position: "absolute",
          left: PORT_X - 90,
          top: PORT_Y - 40,
          width: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: port,
          transform: `translateY(${(1 - port) * 20}px)`,
          fontFamily: theme.fonts.mono,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: pcPalette.textDim,
        }}
      >
        <span>СПИСАНИЕ ↑</span>
        <div style={{ width: 80, height: 3, background: pcColors.lineStrong }} />
      </div>

      {/* the layers */}
      <Layer y={Y[0]} delay={L1} tone="app" label="ПРИЛОЖЕНИЕ БАНКА">
        <div style={{ position: "absolute", right: 26, top: 16, fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`, fontSize: 22, fontWeight: 800, color: pcPalette.textDim }}>
          {amount} → АЛЕКСЕЙ К.
        </div>
      </Layer>
      <Layer y={Y[1]} delay={L2} tone="guard" label="ЗАЩИТНЫЙ КОНТУР" lit={lit}>
        {/* sweep inside the contour once it wakes */}
        {lit > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 120,
              left: ((frame - CAUGHT) * 16) % (W + 120) - 120,
              background: `linear-gradient(90deg, transparent, ${pcPalette.primary}55, transparent)`,
            }}
          />
        )}
      </Layer>
      <Layer y={Y[2]} delay={L3} tone="bad" label="ВРЕДОНОС">
        <div style={{ position: "absolute", inset: 0, opacity: 0.7 }}>
          <CodeRain amount={1} />
        </div>
      </Layer>

      {/* the stream, along the path */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <polyline points={PATH.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={pcColors.lineStrong} strokeWidth={3} strokeDasharray="4 14" opacity={port} />
        {/* the malware's reach */}
        <line x1={540} y1={Y[2] + 75} x2={540} y2={pulseY} stroke={pcColors.bad} strokeWidth={4} strokeDasharray="10 8" opacity={rise > 0 ? 0.8 * (1 - die) : 0} />
      </svg>
      {[0, 1, 2, 3].map((i) => {
        const p = ((SPEED * t + i * 0.25) % 1 + 1) % 1;
        const pt = pointAt(p);
        const edge = Math.min(1, Math.min(p, 1 - p) * 12);
        return (
          <div key={i} style={{ position: "absolute", left: pt.x - 26, top: pt.y - 26, opacity: edge }}>
            <Token size={52} tone="dark" delay={L1 + 8 + i * 3} />
          </div>
        );
      })}

      {/* the red pulse, climbing — and dying at the contour */}
      {frame >= RISE && die < 1 && (
        <Pulse size={70} on={1 - die} style={{ left: 540 - 35, top: pulseY - 35, transform: `scale(${1 - die * 0.7})` }} />
      )}
      <div style={{ position: "absolute", left: 540 - 540, top: Y[1] + 75 - 960, width: 1080, height: 1920, pointerEvents: "none" }}>
        <Shockwave at={CAUGHT} life={22} size={700} />
      </div>

      {/* the brackets around the stopped token */}
      {frame >= BRACKET && (
        <div style={{ position: "absolute", left: lead.x - 58, top: lead.y - 58, width: 116, height: 116, opacity: bracket, transform: `scale(${interpolate(bracket, [0, 1], [1.8, 1])})` }}>
          {[
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ].map(([cx, cy]) => (
            <div
              key={`${cx}${cy}`}
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                left: cx ? undefined : 0,
                right: cx ? 0 : undefined,
                top: cy ? undefined : 0,
                bottom: cy ? 0 : undefined,
                borderTop: cy ? undefined : `5px solid ${pcPalette.primary}`,
                borderBottom: cy ? `5px solid ${pcPalette.primary}` : undefined,
                borderLeft: cx ? undefined : `5px solid ${pcPalette.primary}`,
                borderRight: cx ? `5px solid ${pcPalette.primary}` : undefined,
              }}
            />
          ))}
        </div>
      )}

      <Flash amount={caught.pop * 0.35} />
    </SceneShell>
  );
};
