import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Flash, Kinetic, Rise, SceneShell, Slam, usePunch } from "../ui";

// 28–35.5s. Three slams over a tight, dim crop of the gesture — NO
// EXPLANATION. / NO VOICE. / NO LANGUAGE. — then the camera pulls out until
// he is a figure at the centre of a dot globe. The globe spins; countries
// light up as they pass the front and greetings gather around it. Then every
// word is gone, only the gesture remains, and NO TRANSLATION NEEDED.
const SLAMS = [
  { at: 6, until: 36, word: "EXPLANATION." },
  { at: 36, until: 66, word: "VOICE." },
  { at: 66, until: 98, word: "LANGUAGE." },
];
const ZOOM = { from: 96, to: 138 };
const SPIN = { from: 104, to: 186 };
const LIT_AT = 112;
const CLEAR_AT = 178;
const FINAL_AT = 186;

const GLOBE = { cx: 540, cy: 840, r: 400 };
const TILT = (22 * Math.PI) / 180;
const DOTS = 760;

const PLACES = [
  { name: "USA", lat: 40.7, lon: -74 },
  { name: "MEXICO", lat: 19.4, lon: -99 },
  { name: "BRAZIL", lat: -15.8, lon: -47.9 },
  { name: "FRANCE", lat: 48.9, lon: 2.4 },
  { name: "ITALY", lat: 41.9, lon: 12.5 },
  { name: "NIGERIA", lat: 9.1, lon: 7.4 },
  { name: "INDIA", lat: 28.6, lon: 77.2 },
  { name: "JAPAN", lat: 35.7, lon: 139.7 },
];

const GREETINGS = [
  { text: "HELLO", x: 96, y: 430 },
  { text: "CIAO", x: 790, y: 470 },
  { text: "HOLA", x: 70, y: 1020 },
  { text: "BONJOUR", x: 700, y: 1150 },
  { text: "こんにちは", x: 580, y: 330 },
  { text: "OLÁ", x: 150, y: 1220 },
];

// Unit sphere → screen, for a globe rotated to `viewLon` and tilted toward the
// camera by TILT. z > 0 faces us.
const project = (latDeg: number, lonDeg: number, viewLon: number) => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = ((lonDeg - viewLon) * Math.PI) / 180;
  const x = Math.cos(lat) * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = Math.cos(lat) * Math.cos(lon);
  const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
  const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
  return { sx: GLOBE.cx + GLOBE.r * x, sy: GLOBE.cy - GLOBE.r * y, z };
};

// Fibonacci-distributed lat/lon pairs, computed once.
const DOT_COORDS = Array.from({ length: DOTS }).map((_, i) => {
  const y = 1 - (i / (DOTS - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((i * 137.508) % 360) - 180;
  return { lat, lon };
});

const smooth = (v: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const SilenceScene: React.FC<{ photo: string }> = ({ photo }) => {
  const frame = useCurrentFrame();
  const hits = SLAMS.map((s) => usePunch(s.at, 10));
  const flash = Math.max(...hits.map((h) => h.energy));

  const zoom = interpolate(frame, [ZOOM.from, ZOOM.to], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const w = interpolate(zoom, [0, 1], [1500, 330]);
  const h = w * (1021 / 1100);
  // He stands left of centre in the crop (the hands reach right), so the
  // image centre sits right of the frame centre to put his face under the type.
  const cx = interpolate(zoom, [0, 1], [750, 566]);
  const cy = interpolate(zoom, [0, 1], [1020, 850]);
  const dim = interpolate(zoom, [0, 1], [0.42, 1]);
  const globeIn = interpolate(frame, [ZOOM.from + 6, ZOOM.from + 34], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const viewLon = interpolate(frame, [SPIN.from, SPIN.to], [-80, 140], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const words = interpolate(frame, [CLEAR_AT, CLEAR_AT + 7], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globeRest = interpolate(frame, [CLEAR_AT, CLEAR_AT + 14], [1, 0.45], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      {/* globe */}
      {globeIn > 0 && (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, opacity: globeIn * globeRest }}
        >
          {DOT_COORDS.map((d, i) => {
            const p = project(d.lat, d.lon, viewLon);
            if (p.z <= 0.02) return null;
            return (
              <circle
                key={i}
                cx={p.sx}
                cy={p.sy}
                r={1.4 + p.z * 1.9}
                fill={ksColors.bone}
                opacity={0.14 + p.z * 0.42}
              />
            );
          })}
          <circle
            cx={GLOBE.cx}
            cy={GLOBE.cy}
            r={GLOBE.r + 14}
            fill="none"
            stroke={ksColors.line}
            strokeWidth={1}
          />
          {frame >= LIT_AT &&
            PLACES.map((pl) => {
              const p = project(pl.lat, pl.lon, viewLon);
              const lit = smooth(p.z, 0.12, 0.34) * words;
              if (lit <= 0.01) return null;
              return (
                <g key={pl.name} opacity={lit}>
                  <circle cx={p.sx} cy={p.sy} r={16} fill="none" stroke={ksColors.bone} strokeWidth={1.5} opacity={0.5} />
                  <circle cx={p.sx} cy={p.sy} r={5} fill={ksColors.white} />
                  <text
                    x={p.sx + 26}
                    y={p.sy + 7}
                    fill={ksColors.bone}
                    fontFamily={theme.fonts.mono}
                    fontSize={21}
                    fontWeight={600}
                    letterSpacing="0.18em"
                  >
                    {pl.name}
                  </text>
                </g>
              );
            })}
        </svg>
      )}

      {/* Khaby — tight and dim under the slams, small and lit at the centre */}
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          WebkitMaskImage: `linear-gradient(180deg, #000 78%, transparent 100%)`,
          maskImage: `linear-gradient(180deg, #000 78%, transparent 100%)`,
        }}
      >
        <Img
          src={staticFile(`images/${photo}`)}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            filter: `${ksColors.photo} brightness(${dim})`,
          }}
        />
      </div>

      {/* the three slams */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 640,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {SLAMS.map((s) => (
            <React.Fragment key={s.word}>
              <Slam text="NO" at={s.at} until={s.until} size={112} color={ksPalette.text} tracking="-0.03em" />
              <Slam text={s.word} at={s.at + 2} until={s.until} size={168} />
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>

      {/* greetings around the globe */}
      {frame >= LIT_AT + 10 &&
        GREETINGS.map((g, i) => (
          <div
            key={g.text}
            style={{
              position: "absolute",
              left: g.x,
              top: g.y + Math.sin(frame / 26 + i) * 4,
              opacity: words,
            }}
          >
            <Rise delay={LIT_AT + 14 + i * 6} distance={22}>
              <div
                style={{
                  fontFamily: `${theme.fonts.display}, sans-serif`,
                  fontSize: 44,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: ksColors.bone,
                  whiteSpace: "nowrap",
                }}
              >
                {g.text}
              </div>
            </Rise>
          </div>
        ))}

      {/* the line */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1290,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Kinetic text="NO TRANSLATION" delay={FINAL_AT} per={5} size={100} />
        <Kinetic text="NEEDED." delay={FINAL_AT + 12} size={100} />
      </div>

      <Flash energy={flash} strength={0.12} />
    </SceneShell>
  );
};
