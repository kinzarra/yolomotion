// The bottom and the top of a look's layer stack: what the scenes sit on, and
// what is laid over everything after the captions (rule 5 of the motion
// skill, one implementation per look instead of per template).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Look } from "./presets";
import { useLook } from "./context";

const NOISE = (freq: number, opacity: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`;

const blob = (
  color: string,
  size: number,
  x: number,
  y: number,
  blur: number,
  alpha = "66",
): React.CSSProperties => ({
  position: "absolute",
  width: size,
  height: size,
  left: x - size / 2,
  top: y - size / 2,
  borderRadius: "50%",
  filter: `blur(${blur}px)`,
  background: `radial-gradient(circle, ${color}${alpha}, transparent 64%)`,
});

// ── Backdrops ────────────────────────────────────────────────────────────────

const Paper: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p } = look;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      {/* two misprinted ink clouds drifting off the drums */}
      <div style={{ ...blob(p.primary, 900, 880 + Math.sin(f / 70) * 40, 260, 30, "2a") }} />
      <div style={{ ...blob(p.accent, 1000, 160, 1680 + Math.cos(f / 80) * 50, 40, "22") }} />
      {/* paper fibre */}
      <AbsoluteFill
        style={{
          backgroundImage: NOISE(0.65, 0.55),
          backgroundSize: "260px",
          mixBlendMode: "multiply",
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

const Void: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p, c } = look;
  const sweep = ((f * 4) % 2600) - 700;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 42%, ${p.bgAlt}, ${p.bg} 70%)` }}>
      {/* horizon light */}
      <div
        style={{
          position: "absolute",
          left: -100,
          right: -100,
          top: 1180,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${p.primary}, transparent)`,
          boxShadow: `0 0 60px 12px ${p.glow}`,
          opacity: 0.55 + Math.sin(f / 22) * 0.1,
        }}
      />
      {/* floor grid, converging */}
      <svg width={1080} height={740} style={{ position: "absolute", top: 1180, left: 0, opacity: 0.35 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <line key={i} x1={540} y1={0} x2={-1200 + i * 248} y2={740} stroke={c.line} strokeWidth={1.4} />
        ))}
        {Array.from({ length: 9 }, (_, i) => {
          const t = ((i + (f / 40) % 1) / 9) ** 2;
          return <line key={`h${i}`} x1={0} x2={1080} y1={t * 740} y2={t * 740} stroke={c.line} strokeWidth={1.4} />;
        })}
      </svg>
      {/* diagonal specular sweep */}
      <div
        style={{
          position: "absolute",
          top: -400,
          left: sweep,
          width: 260,
          height: 2800,
          transform: "rotate(24deg)",
          background: `linear-gradient(90deg, transparent, ${c.line}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Grid: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p, c } = look;
  const cols = 6;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      {Array.from({ length: cols + 1 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 72 + (i * 936) / cols,
            width: 1,
            background: c.line,
          }}
        />
      ))}
      {[220, 1880].map((y) => (
        <div key={y} style={{ position: "absolute", left: 72, right: 72, top: y, height: 1, background: c.line }} />
      ))}
      {/* registration mark breathing in the corner */}
      <svg width={60} height={60} style={{ position: "absolute", right: 48, top: 120, transform: `rotate(${Math.sin(f / 40) * 6}deg)` }}>
        <circle cx={30} cy={30} r={13} fill="none" stroke={c.ink} strokeWidth={2} />
        <line x1={30} y1={4} x2={30} y2={56} stroke={c.ink} strokeWidth={2} />
        <line x1={4} y1={30} x2={56} y2={30} stroke={c.ink} strokeWidth={2} />
      </svg>
    </AbsoluteFill>
  );
};

const Aurora: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p, c } = look;
  return (
    <AbsoluteFill style={{ background: p.bg, overflow: "hidden" }}>
      <div style={blob(p.accent, 1500, 300 + Math.sin(f / 60) * 160, 420 + Math.cos(f / 75) * 80, 60, "aa")} />
      <div style={blob(p.primary, 1200, 900 + Math.cos(f / 52) * 140, 900 + Math.sin(f / 64) * 160, 70, "88")} />
      <div style={blob(c.second, 1100, 260 + Math.sin(f / 48) * 120, 1600 + Math.cos(f / 58) * 90, 80, "66")} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 40%, ${p.bg}cc)` }} />
    </AbsoluteFill>
  );
};

const News: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p } = look;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${p.bgAlt} 0 22px, transparent 22px 44px)`,
          backgroundPosition: `${f * 0.8}px 0`,
          opacity: 0.6,
        }}
      />
      {/* halftone falloff from the top-right corner */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${p.primary} 1.6px, transparent 2.2px)`,
          backgroundSize: "14px 14px",
          WebkitMaskImage: "radial-gradient(circle at 100% 0%, black, transparent 55%)",
          maskImage: "radial-gradient(circle at 100% 0%, black, transparent 55%)",
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

const Noir: React.FC<{ look: Look }> = ({ look }) => {
  const f = useCurrentFrame();
  const { palette: p } = look;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 55% at ${50 + Math.sin(f / 90) * 6}% 18%, ${p.bgAlt}, ${p.bg} 75%)`,
      }}
    />
  );
};

const BACKDROPS: Record<Look["backdrop"], React.FC<{ look: Look }>> = {
  paper: Paper,
  void: Void,
  grid: Grid,
  aurora: Aurora,
  news: News,
  noir: Noir,
};

export const Backdrop: React.FC = () => {
  const look = useLook();
  const B = BACKDROPS[look.backdrop];
  return <B look={look} />;
};

// ── Finish: grade → halftone → scanlines → grain → vignette ─────────────────

export const Finish: React.FC = () => {
  const look = useLook();
  const f = useCurrentFrame();
  const { finish: x, palette: p } = look;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {x.grade > 0 && (
        <AbsoluteFill style={{ backgroundColor: p.primary, mixBlendMode: "soft-light", opacity: x.grade }} />
      )}
      {x.halftone > 0 && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, ${p.text} 1px, transparent 1.6px)`,
            backgroundSize: "7px 7px",
            mixBlendMode: "overlay",
            opacity: x.halftone,
          }}
        />
      )}
      {x.scanlines > 0 && (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${p.bg} 0 2px, transparent 2px 5px)`,
            backgroundPosition: `0 ${(f * 0.5) % 5}px`,
            opacity: x.scanlines * 2.5,
            mixBlendMode: "multiply",
          }}
        />
      )}
      <AbsoluteFill
        style={{
          backgroundImage: NOISE(0.9, 0.5),
          backgroundSize: "260px",
          backgroundPosition: `${(f * 7) % 260}px ${(f * 13) % 260}px`,
          opacity: x.grain,
          mixBlendMode: "overlay",
        }}
      />
      {x.vignette > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,${x.vignette}) 100%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
