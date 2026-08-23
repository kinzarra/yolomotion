// "Her" — the AI influencer, drawn procedurally in SVG. Porcelain monochrome
// so she reads synthetic on the black/white/red palette. One component, many
// modes: portrait, wireframe reveal (facial-landmark mesh), red/white ghost
// split, per-variant accessories, and a right-eye glitch for the finale.
import React, { useId } from "react";
import { random, useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import { aiColors, aiPalette } from "./palette";

export const HER_W = 400;
export const HER_H = 520;

export type HerVariant = "base" | "fashion" | "beauty" | "fitness" | "travel";

// Silhouette pieces (shared by portrait, ghosts and the wire clip).
const HAIR_BACK =
  "M96,470 C84,330 86,206 106,148 C130,84 168,56 200,56 C232,56 270,84 294,148 C314,206 316,330 304,470 Z";
const TORSO =
  "M40,520 C40,428 118,395 200,395 C282,395 360,428 360,520 Z";
const NECK = "M180,322 h40 v76 a20,20 0 0 1 -40,0 Z";
const HEAD =
  "M200,96 C142,96 118,152 118,224 C118,286 152,340 200,340 C248,340 282,286 282,224 C282,152 258,96 200,96 Z";
// Center-parted hairline: two lobes between the head's outer edge and an
// inner sweep, so the forehead actually reads as framed by hair.
const HAIR_FRONT_L =
  "M200,86 C148,88 118,128 115,228 C130,170 156,140 200,138 Z";
const HAIR_FRONT_R =
  "M200,86 C252,88 282,128 285,228 C270,170 244,140 200,138 Z";

// Facial-landmark net for the wireframe reveal — reads as "AI face scan".
const LANDMARKS: [number, number][] = [
  [200, 122], // forehead
  [160, 200], // brow L
  [240, 200], // brow R
  [161, 226], // eye L
  [239, 226], // eye R
  [200, 262], // nose tip
  [172, 300], // mouth L
  [228, 300], // mouth R
  [200, 336], // chin
  [132, 262], // cheek L
  [268, 262], // cheek R
];
const NET: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
  [5, 6],
  [5, 7],
  [6, 7],
  [6, 8],
  [7, 8],
  [1, 9],
  [3, 9],
  [6, 9],
  [2, 10],
  [4, 10],
  [7, 10],
];

// Flat single-color silhouette — used for the ghost-split copies.
const Silhouette: React.FC<{ fill: string }> = ({ fill }) => (
  <g>
    <path d={HAIR_BACK} fill={fill} />
    <path d={TORSO} fill={fill} />
    <path d={NECK} fill={fill} />
    <path d={HEAD} fill={fill} />
  </g>
);

const Portrait: React.FC<{
  variant: HerVariant;
  accessoryIn: number;
  closeup?: boolean;
}> = ({ variant, accessoryIn, closeup = false }) => {
  const a = accessoryIn;
  const pop = `scale(${0.8 + 0.2 * a})`;
  return (
    <g>
      <path d={HAIR_BACK} fill={aiColors.hair} stroke={aiColors.lineStrong} strokeWidth={2} />
      {/* neck sits behind the torso so the shoulders swallow its base */}
      <path d={NECK} fill={aiColors.skinShade} />
      <path d={TORSO} fill={aiColors.surfaceLift} stroke={aiColors.lineStrong} strokeWidth={2} />
      {/* collar notch so the top reads as clothing */}
      <path
        d="M170,398 C182,420 218,420 230,398 C220,412 180,412 170,398 Z"
        fill={aiColors.ink}
        opacity={0.6}
      />
      <path d={HEAD} fill={aiColors.skin} />
      {/* cheeks */}
      <ellipse cx={150} cy={264} rx={17} ry={9} fill={aiColors.skinShade} opacity={closeup ? 0.25 : variant === "beauty" ? 0.9 : 0.5} />
      <ellipse cx={250} cy={264} rx={17} ry={9} fill={aiColors.skinShade} opacity={closeup ? 0.25 : variant === "beauty" ? 0.9 : 0.5} />
      {/* brows */}
      <path d="M138,198 C150,189 168,187 182,193" stroke={aiColors.hair} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d="M218,193 C232,187 250,189 262,198" stroke={aiColors.hair} strokeWidth={7} strokeLinecap="round" fill="none" />
      {/* eyes */}
      <Eye cx={160} />
      <Eye cx={240} />
      {/* nose — kept faint; it scales up 6× in the finale close-up */}
      <path d="M202,238 C201,250 200,256 196,262" stroke={aiColors.skinLine} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={0.8} />
      <path d="M196,262 C200,265 205,265 208,262" stroke={aiColors.skinLine} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.8} />
      {/* lips */}
      <path
        d="M172,296 C182,289 192,289 200,293 C208,289 218,289 228,296 C220,311 206,315 200,315 C194,315 180,311 172,296 Z"
        fill={aiColors.lips}
      />
      {/* center-parted hairline */}
      <path d={HAIR_FRONT_L} fill={aiColors.hair} />
      <path d={HAIR_FRONT_R} fill={aiColors.hair} />
      {/* LED earrings — her one synthetic tell */}
      <circle cx={121} cy={296} r={5} fill={aiPalette.primary} opacity={0.85} />
      <circle cx={279} cy={296} r={5} fill={aiPalette.primary} opacity={0.85} />

      {/* --------------------------- accessories --------------------------- */}
      {variant === "fashion" && (
        <g opacity={a} transform={pop} style={{ transformOrigin: "200px 96px" }}>
          <ellipse cx={200} cy={104} rx={122} ry={22} fill={aiColors.ink} stroke={aiColors.lineStrong} strokeWidth={2} />
          <path d="M146,102 C146,54 254,54 254,102 C236,90 164,90 146,102 Z" fill={aiColors.ink} stroke={aiColors.lineStrong} strokeWidth={2} />
        </g>
      )}
      {variant === "beauty" && (
        <g opacity={a} transform={pop} style={{ transformOrigin: "200px 220px" }}>
          <Sparkle x={106} y={180} s={13} />
          <Sparkle x={296} y={160} s={10} />
          <Sparkle x={288} y={318} s={12} />
        </g>
      )}
      {variant === "fitness" && (
        <g opacity={a} transform={pop} style={{ transformOrigin: "200px 170px" }}>
          <path
            d="M118,180 C150,152 250,152 282,180 L282,202 C250,176 150,176 118,202 Z"
            fill={aiColors.white}
            stroke={aiColors.lineStrong}
            strokeWidth={2}
          />
        </g>
      )}
      {variant === "travel" && (
        <g opacity={a} transform={pop} style={{ transformOrigin: "200px 226px" }}>
          <rect x={132} y={210} width={58} height={30} rx={15} fill={aiColors.ink} stroke={aiColors.skinLine} strokeWidth={2} />
          <rect x={210} y={210} width={58} height={30} rx={15} fill={aiColors.ink} stroke={aiColors.skinLine} strokeWidth={2} />
          <path d="M190,222 C196,218 204,218 210,222" stroke={aiColors.ink} strokeWidth={5} fill="none" />
          <path d="M132,222 L118,214 M268,222 L282,214" stroke={aiColors.ink} strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

const Eye: React.FC<{ cx: number }> = ({ cx }) => (
  <g>
    <path
      d={`M${cx - 22},226 C${cx - 14},213 ${cx + 12},212 ${cx + 22},226 C${cx + 12},238 ${cx - 12},239 ${cx - 22},226 Z`}
      fill="#F7F7FB"
    />
    <circle cx={cx} cy={226} r={9.5} fill="#23232B" />
    <circle cx={cx} cy={226} r={4.2} fill={aiColors.ink} />
    <circle cx={cx - 3.2} cy={222.4} r={2.4} fill={aiColors.white} />
    <path
      d={`M${cx - 22},226 C${cx - 14},212 ${cx + 12},211 ${cx + 22},225`}
      stroke="#17171C"
      strokeWidth={5}
      strokeLinecap="round"
      fill="none"
    />
  </g>
);

const Sparkle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path
    d={`M${x},${y - s} C${x + s * 0.2},${y - s * 0.2} ${x + s * 0.2},${y - s * 0.2} ${x + s},${y} C${x + s * 0.2},${y + s * 0.2} ${x + s * 0.2},${y + s * 0.2} ${x},${y + s} C${x - s * 0.2},${y + s * 0.2} ${x - s * 0.2},${y + s * 0.2} ${x - s},${y} C${x - s * 0.2},${y - s * 0.2} ${x - s * 0.2},${y - s * 0.2} ${x},${y - s} Z`}
    fill={aiColors.white}
  />
);

export const Her: React.FC<{
  width?: number;
  variant?: HerVariant;
  accessoryIn?: number; // 0..1 accessory pop
  wire?: number; // 0..1 portrait → landmark wireframe
  split?: number; // px — red/white ghost offset
  eyeGlitch?: number; // 0..1 right-eye glitch burst
  closeup?: boolean; // finale zoom: tone down cheek shading
  style?: React.CSSProperties;
}> = ({
  width = 640,
  variant = "base",
  accessoryIn = 1,
  wire = 0,
  split = 0,
  eyeGlitch = 0,
  closeup = false,
  style,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const frame = useCurrentFrame();
  const clipId = `her-clip-${id}`;
  const tick = Math.floor(frame / 2);

  return (
    <svg
      width={width}
      height={(width / HER_W) * HER_H}
      viewBox={`0 0 ${HER_W} ${HER_H}`}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={HAIR_BACK} />
          <path d={TORSO} />
          <path d={HEAD} />
        </clipPath>
      </defs>

      {/* ghost split — red left, white right */}
      {split > 0.2 && (
        <>
          <g transform={`translate(${-split}, 0)`} opacity={0.55}>
            <Silhouette fill={aiPalette.primary} />
          </g>
          <g transform={`translate(${split}, 0)`} opacity={0.3}>
            <Silhouette fill={aiColors.white} />
          </g>
        </>
      )}

      {/* portrait, dimmed as the wireframe takes over */}
      <g opacity={1 - wire * 0.82}>
        <Portrait variant={variant} accessoryIn={accessoryIn} closeup={closeup} />
      </g>

      {/* wireframe: scan grid clipped to the silhouette + landmark net */}
      {wire > 0.01 && (
        <g opacity={wire}>
          <g clipPath={`url(#${clipId})`} opacity={0.4}>
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 34 + ((frame * 0.6) % 34)}
                x2={HER_W}
                y2={i * 34 + ((frame * 0.6) % 34)}
                stroke={aiPalette.primary}
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line
                key={`d${i}`}
                x1={i * 60 - 300}
                y1={0}
                x2={i * 60 - 40}
                y2={HER_H}
                stroke={aiPalette.primary}
                strokeWidth={0.8}
              />
            ))}
          </g>
          <path d={HEAD} fill="none" stroke={aiColors.redLine} strokeWidth={1.6} />
          <path d={HAIR_BACK} fill="none" stroke={aiColors.redLine} strokeWidth={1.2} opacity={0.7} />
          {NET.map(([a, b], i) => (
            <line
              key={`n${i}`}
              x1={LANDMARKS[a][0]}
              y1={LANDMARKS[a][1]}
              x2={LANDMARKS[b][0]}
              y2={LANDMARKS[b][1]}
              stroke={aiPalette.primary}
              strokeWidth={1.4}
              opacity={0.9}
            />
          ))}
          {LANDMARKS.map(([x, y], i) => (
            <circle key={`p${i}`} cx={x} cy={y} r={3} fill={aiPalette.primary} />
          ))}
        </g>
      )}

      {/* right-eye glitch: displaced red/white eye copies + noise bars */}
      {eyeGlitch > 0.01 && (
        <g>
          <g
            transform={`translate(${8 + random(`eg-${tick}-a`) * 10 * eyeGlitch}, ${(random(`eg-${tick}-b`) - 0.5) * 6})`}
            opacity={0.8 * eyeGlitch}
          >
            <path
              d="M218,226 C226,213 252,212 262,226 C252,238 228,239 218,226 Z"
              fill={aiPalette.primary}
            />
          </g>
          <g transform={`translate(${-7 * eyeGlitch}, 0)`} opacity={0.5 * eyeGlitch}>
            <path
              d="M218,226 C226,213 252,212 262,226 C252,238 228,239 218,226 Z"
              fill={aiColors.white}
            />
          </g>
          {Array.from({ length: 3 }).map((_, i) => (
            <rect
              key={i}
              x={210 + (random(`eb-${tick}-${i}`) - 0.5) * 40 * eyeGlitch}
              y={210 + i * 12 + random(`ey-${tick}-${i}`) * 8}
              width={60 + random(`ew-${tick}-${i}`) * 30}
              height={2.5}
              fill={i === 1 ? aiColors.white : aiPalette.primary}
              opacity={0.75 * eyeGlitch}
            />
          ))}
        </g>
      )}
    </svg>
  );
};

// Pixel breakup: the portrait is cloned into a coarse cell grid; each cell
// flies outward from the face with its own deterministic direction and delay.
// Only mounted while progress > 0 — 80 clipped clones are not free.
export const HerPixels: React.FC<{
  width: number;
  progress: number; // 0..1 breakup
  variant?: HerVariant;
}> = ({ width, progress, variant = "base" }) => {
  const height = (width / HER_W) * HER_H;
  const cols = 8;
  const rows = 10;
  const cw = width / cols;
  const ch = height / rows;
  if (progress <= 0.001) {
    return <Her width={width} variant={variant} />;
  }
  const cells: React.ReactNode[] = [];
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const x0 = cx * cw + cw / 2;
      const y0 = cy * ch + ch / 2;
      // Break spreads from the face center outwards.
      const dist = Math.hypot(x0 - width / 2, y0 - height * 0.44);
      // Wider stagger + slower per-cell flight so the debris stays readable
      // through the whole breakup instead of vanishing in ten frames.
      const delay = (dist / Math.hypot(width / 2, height / 2)) * 0.62;
      const p = interpolate(progress, [delay, Math.min(delay + 0.55, 1.02)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (p >= 0.999) continue; // fully gone
      const seed = `px-${cx}-${cy}`;
      const dirX = (x0 - width / 2) * 1.1 + (random(`${seed}-x`) - 0.5) * width * 0.35;
      const dirY =
        (y0 - height * 0.44) * 0.8 + random(`${seed}-y`) * height * 0.35 + height * 0.14;
      const rot = (random(`${seed}-r`) - 0.5) * 120;
      cells.push(
        <div
          key={seed}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${cy * ch}px ${width - (cx + 1) * cw}px ${height - (cy + 1) * ch}px ${cx * cw}px)`,
            transform: `translate(${dirX * p}px, ${dirY * p}px) rotate(${rot * p}deg) scale(${1 - p * 0.45})`,
            opacity: 1 - p * p, // ease the fade so late cells stay visible
          }}
        >
          <Her width={width} variant={variant} />
        </div>,
      );
    }
  }
  return <div style={{ position: "relative", width, height }}>{cells}</div>;
};
