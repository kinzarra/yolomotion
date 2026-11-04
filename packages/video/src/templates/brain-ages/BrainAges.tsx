// brain-ages: one life, one brain. The brain turns all the time and ages from
// birth to 85: it grows, folds, then thins. Each life event lights up the part
// that is changing, with one fact, a cut-out photo of the moment and the age in
// serif italic; the four turning points (9, 32, 66, 83) get a stamp. Silent
// render (author 2026-10-26: no voice), sound added at upload.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Vignette } from "../../components/Layers";
import { Sky } from "../life-lines/LifeLines";
import { ageText, BEAT, BEATS, bodyAt, FINALE, HOOK, momentAt, TURNS, yawAt } from "./ages";
import { Brain3D, BrainPose, project, useBrain } from "./Brain3D";
import { BrainMeshes, isDeep } from "./brainData";
import { ease, fonts, LOBES, palette, Part, PART_NAME, springs } from "./palette";
import { BrainAgesProps } from "./schema";
import { Subscribe } from "./Subscribe";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hex = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

/** anchor points per part: lobe centroids per hemisphere, deep structure centres */
const useAnchors = (brain: BrainMeshes | null) =>
  useMemo(() => {
    if (!brain) return null;
    const out = {} as Record<Part, THREE.Vector3[]>;
    LOBES.forEach((l, li) => {
      out[l] = [brain.cortex_lh, brain.cortex_rh].map((m) => {
        const c = new THREE.Vector3();
        let s = 0;
        for (let i = 0; i < m.pos.length / 3; i++) {
          const w = m.w[i * 6 + li] ** 4;
          c.x += m.pos[i * 3] * w;
          c.y += m.pos[i * 3 + 1] * w;
          c.z += m.pos[i * 3 + 2] * w;
          s += w;
        }
        return c.divideScalar(s || 1);
      });
    });
    for (const id of ["cerebellum", "brainstem", "hippocampus", "amygdala", "callosum", "ventricles"] as const)
      if (isDeep(id)) out[id] = [brain[id].centre];
    return out;
  }, [brain]);

// ---------- timeline ----------
const AXIS = { x0: 150, x1: 930, y: 1575, max: 85 };
const axisX = (age: number) => AXIS.x0 + (AXIS.x1 - AXIS.x0) * Math.sqrt(age / AXIS.max);

const Timeline: React.FC<{ age: number; opacity: number }> = ({ age, opacity }) => {
  const x = axisX(age);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", opacity }}>
      <line x1={AXIS.x0} y1={AXIS.y} x2={AXIS.x1} y2={AXIS.y} stroke={palette.axis} strokeWidth={2} />
      <line x1={AXIS.x0} y1={AXIS.y} x2={x} y2={AXIS.y} stroke={palette.now} strokeOpacity={0.65} strokeWidth={2} />
      {BEATS.map((b) => (
        <line key={b.age} x1={axisX(b.age)} y1={AXIS.y - 6} x2={axisX(b.age)} y2={AXIS.y + 6} stroke={age >= b.age - 0.3 ? palette.now : palette.axisText} strokeOpacity={0.7} strokeWidth={1.5} />
      ))}
      {[0, ...TURNS].map((a) => {
        const turn = TURNS.includes(a);
        return (
          <g key={a}>
            {turn ? <circle cx={axisX(a)} cy={AXIS.y} r={5} fill={age >= a - 0.3 ? palette.now : palette.axisText} /> : null}
            <text x={axisX(a)} y={AXIS.y + 44} fill={turn ? palette.now : palette.axisText} fillOpacity={turn ? 0.9 : 1} fontFamily={fonts.label} fontWeight={600} fontSize={26} textAnchor="middle">
              {a}
            </text>
          </g>
        );
      })}
      <circle cx={x} cy={AXIS.y} r={9} fill={palette.now} style={{ filter: `drop-shadow(0 0 10px ${palette.now})` }} />
    </svg>
  );
};

// ---------- hook ----------
const Hook: React.FC<{ sec: number }> = ({ sec }) => {
  const out = interpolate(sec, [HOOK - 0.45, HOOK], [1, 0], clamp);
  if (out <= 0) return null;
  // frame 0 is the cover: everything is already on screen, the numbers then pulse in turn
  const pulse = (i: number) => {
    const t = sec - (0.5 + i * 0.4);
    return 1 + Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, t) * 7))) * 0.22 * (t > 0 ? 1 : 0);
  };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 200, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 140, color: palette.text, lineHeight: 1 }}>Твой мозг</div>
        <div style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 56, color: palette.text, marginTop: 18 }}>перестраивается 4 раза</div>
      </div>
      <div style={{ position: "absolute", top: 1215, width: "100%", display: "flex", justifyContent: "center", gap: 46 }}>
        {TURNS.map((a, i) => (
          <div
            key={a}
            style={{
              fontFamily: fonts.label,
              fontWeight: 600,
              fontSize: 104,
              color: palette.now,
              transform: `scale(${pulse(i)})`,
              textShadow: `0 0 30px ${palette.now}66`,
            }}
          >
            {a}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1370, width: "100%", textAlign: "center", fontFamily: fonts.label, fontWeight: 500, fontSize: 28, letterSpacing: 8, color: palette.textDim }}>
        НАЙДИ СВОЙ ВОЗРАСТ
      </div>
    </AbsoluteFill>
  );
};

// ---------- one beat: label + photo ----------
const LABEL = { x: 140, y: 1195, w: 540 };
const PHOTO = { x: 700, y: 1150, w: 260, h: 320 };

const BeatCard: React.FC<{ i: number; local: number; on: number; at: [number, number] | null; color: string; partName: string | null }> = ({ i, local, on, at, color, partName }) => {
  const { fps } = useVideoConfig();
  const b = BEATS[i];
  const f = Math.round(local * fps);
  const inP = spring({ frame: f - Math.round(0.35 * fps), fps, config: springs.soft });
  const photoP = spring({ frame: f - Math.round(0.45 * fps), fps, config: springs.pop });
  const exit = interpolate(local, [BEAT - 0.28, BEAT], [1, 0], clamp);
  const drift = interpolate(local, [0, BEAT], [1, 1.07], clamp);
  return (
    <AbsoluteFill>
      {at ? (
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: on }}>
          <line x1={at[0]} y1={at[1]} x2={LABEL.x + 6} y2={LABEL.y - 18} stroke={color} strokeOpacity={0.5} strokeWidth={1.5} />
          <circle cx={at[0]} cy={at[1]} r={6} fill={color} />
          <circle cx={at[0]} cy={at[1]} r={16 + Math.sin(local * 5) * 2} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={1.5} />
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: LABEL.x,
          top: LABEL.y,
          width: LABEL.w,
          opacity: Math.min(inP, exit),
          transform: `translateY(${(1 - inP) * 26}px)`,
        }}
      >
        {partName ? (
          <div style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 24, letterSpacing: 5, color, textTransform: "uppercase", marginBottom: 6 }}>{partName}</div>
        ) : null}
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 76, lineHeight: 1.02, color: palette.text }}>{b.event}</div>
        <div style={{ fontFamily: fonts.label, fontWeight: 500, fontSize: 36, lineHeight: 1.25, color: palette.textDim, marginTop: 12 }}>{b.fact}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: PHOTO.x,
          top: PHOTO.y,
          width: PHOTO.w,
          height: PHOTO.h,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          opacity: Math.min(photoP, exit),
          transform: `translateY(${(1 - photoP) * 50}px) scale(${(0.85 + 0.15 * photoP) * drift}) rotate(${(1 - photoP) * 6 - 2}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <Img
          src={staticFile(`images/brain-ages/${b.photo}.png`)}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.55)) saturate(0.9)" }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- turning point stamp ----------
const Turn: React.FC<{ n: number; local: number }> = ({ n, local }) => {
  const { fps } = useVideoConfig();
  const f = Math.round(local * fps);
  const p = spring({ frame: f - Math.round(0.4 * fps), fps, config: springs.pop });
  const exit = interpolate(local, [BEAT - 0.28, BEAT], [1, 0], clamp);
  const ring = interpolate(local, [0.4, 1.4], [0, 1], { ...clamp, easing: ease.out });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 780,
          width: 760 * (0.6 + ring * 0.6),
          height: 760 * (0.6 + ring * 0.6),
          marginLeft: -380 * (0.6 + ring * 0.6),
          marginTop: -380 * (0.6 + ring * 0.6),
          borderRadius: "50%",
          border: `2px solid ${palette.now}`,
          opacity: (1 - ring) * 0.6,
        }}
      />
      <div style={{ position: "absolute", top: 410, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "10px 26px",
            borderRadius: 40,
            border: `1.5px solid ${palette.now}`,
            color: palette.now,
            fontFamily: fonts.label,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 6,
            opacity: Math.min(p, exit),
            transform: `scale(${0.8 + 0.2 * p})`,
            background: "rgba(10,14,32,0.55)",
          }}
        >
          ПОВОРОТ {n} ИЗ 4
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- finale ----------
const Finale: React.FC<{ local: number }> = ({ local }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.round(local * fps) - Math.round(0.3 * fps), fps, config: springs.soft });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 84, color: palette.text, lineHeight: 1 }}>На 11% легче,</div>
        <div style={{ fontFamily: fonts.label, fontWeight: 500, fontSize: 36, color: palette.textDim, marginTop: 14 }}>чем мозг в 19 лет. Но он меняется всю жизнь</div>
      </div>
      <Subscribe at={Math.round((FINALE + 1.2) * fps)} question="Какой у тебя поворот?" top={1300} />
    </AbsoluteFill>
  );
};

export const BrainAges: React.FC<BrainAgesProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brain = useBrain();
  const anchors = useAnchors(brain);
  const sec = frame / fps;
  const m = momentAt(sec);
  const beat = m.beat >= 0 && m.beat < BEATS.length ? BEATS[m.beat] : null;

  const pose: BrainPose = {
    rotX: 0.18 + Math.sin(sec * 0.7) * 0.03,
    rotY: yawAt(sec),
    body: bodyAt(m.age),
    parts: m.parts,
    glass: m.glass,
    time: sec,
  };

  // the part this beat is about: colour, name, where it sits on screen
  const top = beat
    ? (Object.entries(beat.parts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0] as [Part, number] | undefined)
    : undefined;
  const subject = top?.[0];
  const color = subject ? palette[subject] : palette.now;
  let at: [number, number] | null = null;
  if (anchors && subject) {
    const pts = anchors[subject].map((p) => project(p, pose)).sort((p, q) => q[2] - p[2]);
    at = [pts[0][0], pts[0][1]];
  }
  const multi = beat && Object.keys(beat.parts).filter((k) => LOBES.includes(k as never)).length >= 4;
  const partName = subject ? (multi ? "вся кора" : PART_NAME[subject]) : null;
  const ui = interpolate(sec, [HOOK - 0.3, HOOK + 0.3], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.skyBottom }}>
      <Sky />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 42% 24% at 50% 42%, ${color}${hex(m.label * 0.2 * (subject ? 1 : 0))} 0%, transparent 70%), radial-gradient(ellipse 58% 32% at 50% 42%, rgba(140,130,255,0.13) 0%, transparent 72%)`,
        }}
      />
      {brain ? <Brain3D brain={brain} pose={pose} /> : null}

      <Hook sec={sec} />

      {/* age */}
      <div style={{ position: "absolute", top: 205, width: "100%", textAlign: "center", opacity: ui }}>
        <div style={{ fontFamily: fonts.label, fontWeight: 500, fontSize: 26, letterSpacing: 8, color: palette.axisText }}>ВОЗРАСТ</div>
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 150, lineHeight: 1.05, color: palette.text }}>{ageText(m.age)}</div>
      </div>

      {beat ? <BeatCard i={m.beat} local={m.local} on={m.label} at={at} color={color} partName={partName} /> : null}
      {beat?.turn ? <Turn n={beat.turn} local={m.local} /> : null}
      {m.beat === BEATS.length ? <Finale local={m.local} /> : null}

      <Timeline age={m.age} opacity={ui} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
