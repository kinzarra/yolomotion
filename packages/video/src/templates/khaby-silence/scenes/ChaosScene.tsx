import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ksColors } from "../palette";
import { SceneShell, useRamp } from "../ui";

// 17–23.5s. A sheet of instructions on the black page: three absurd
// life-hack diagrams draw themselves in, then STEP tags, arrows and
// annotations pile on at an accelerating rate, more sheets slide in behind,
// the stack starts to shake — and at CUT_AT everything is gone. No fade.
const SHEET = { left: 56, top: 150, w: 968, h: 1140 };
const CUT_AT = 174;

const STEP_TAGS: [number, number, number][] = [
  // [frame, x, y] inside the sheet
  [28, 40, 52],
  [44, 600, 60],
  [58, 120, 460],
  [70, 700, 440],
  [80, 330, 760],
  [90, 30, 1060],
  [98, 760, 1070],
  [106, 420, 600],
  [113, 160, 300],
  [120, 820, 250],
  [126, 560, 980],
  [132, 260, 1000],
  [138, 700, 820],
  [144, 40, 640],
  [150, 880, 660],
  [155, 420, 180],
];

const NOTES = [
  "ROTATE 37°",
  "WAIT 4 MIN",
  "ATTACH CLAMP B",
  "REPEAT ×3",
  "CALIBRATE",
  "SEE FIG. 12",
  "DO NOT SKIP",
  "TIGHTEN",
  "INVERT",
  "HOLD 12 SEC",
  "ALIGN TO MARK",
  "OPTIONAL*",
  "CRITICAL",
  "MEASURE TWICE",
  "RE-CHECK",
  "PHASE 2",
  "LOOSEN",
  "ADD WATER",
  "REMOVE WATER",
  "CONSULT MANUAL",
  "STEP 7B",
  "WARNING",
  "IMPORTANT",
  "VERY IMPORTANT",
  "…",
  "???",
  "SEE ABOVE",
  "SEE BELOW",
];

// Arrow spawn frames: the interval shrinks, so the sheet fills faster and faster.
const ARROW_AT = [
  56, 66, 75, 83, 90, 96, 102, 107, 112, 116, 120, 124, 127, 130, 133, 136, 139,
  142, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163,
];

const ink = ksColors.paperInk;

const Draw: React.FC<{
  d: string;
  p: number;
  width?: number;
  dash?: string;
  fill?: string;
}> = ({ d, p, width = 3, dash, fill = "none" }) => (
  <path
    d={d}
    fill={fill}
    stroke={ink}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash ?? 1}
    pathLength={dash ? undefined : 1}
    strokeDashoffset={dash ? undefined : 1 - p}
    opacity={dash ? p : 1}
  />
);

const Label: React.FC<{ x: number; y: number; p: number; size?: number; children: React.ReactNode }> = ({
  x,
  y,
  p,
  size = 15,
  children,
}) => (
  <text
    x={x}
    y={y}
    fill={ink}
    fontFamily={theme.fonts.mono}
    fontSize={size}
    fontWeight={600}
    letterSpacing="0.12em"
    opacity={p}
  >
    {children}
  </text>
);

const Diagrams: React.FC<{ a: number; b: number; c: number }> = ({ a, b, c }) => (
  <svg width={SHEET.w} height={SHEET.h} viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <marker id="ks-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={ink} />
      </marker>
    </defs>

    {/* FIG. 1 — banana opening apparatus */}
    <Label x={30} y={36} p={a}>FIG. 1 — BANANA OPENING APPARATUS</Label>
    <circle cx={700} cy={150} r={62} fill="none" stroke={ink} strokeWidth={3} opacity={a} />
    <circle cx={700} cy={150} r={80} fill="none" stroke={ink} strokeWidth={18} strokeDasharray="16 12" opacity={a} />
    <circle cx={700} cy={150} r={8} fill={ink} opacity={a} />
    <Draw d="M752,188 L820,262 M648,188 L582,262" p={a} />
    <circle cx={840} cy={300} r={30} fill="none" stroke={ink} strokeWidth={3} opacity={a} />
    <Draw d="M870,300 L870,420 L846,420 L846,440" p={a} />
    <Draw d="M300,382 L620,302" p={a} width={4} />
    <Draw d="M430,352 L460,400 L400,400 Z" p={a} />
    <rect x={586} y={252} width={44} height={44} fill="none" stroke={ink} strokeWidth={3} opacity={a} />
    <Draw d="M120,330 C160,240 280,220 360,262 C300,252 200,282 150,352 Z" p={a} width={4} />
    <Draw d="M640,118 Q560,40 470,110" p={a} />
    <Draw d="M830,262 Q790,220 752,206" p={a} />
    <Draw d="M300,392 Q230,420 180,360" p={a} />
    <path d="M640,118 Q560,40 470,110" fill="none" stroke="none" markerEnd="url(#ks-arrow)" opacity={a} />
    <Label x={400} y={470} p={a} size={13}>TORQUE ≥ 4.2 NM · DO NOT TOUCH THE BANANA</Label>

    {/* FIG. 2 — single cut, five tools */}
    <Label x={30} y={520} p={b}>FIG. 2 — SINGLE CUT (5 TOOLS MIN.)</Label>
    <rect x={380} y={600} width={220} height={90} rx={6} fill="none" stroke={ink} strokeWidth={3} opacity={b} />
    <Draw d="M490,580 L490,710" p={b} dash="8 8" />
    <Label x={448} y={740} p={b} size={12}>CUT HERE</Label>
    {/* scissors */}
    <Draw d="M180,560 L260,620 M180,620 L260,560" p={b} />
    <circle cx={172} cy={552} r={12} fill="none" stroke={ink} strokeWidth={3} opacity={b} />
    <circle cx={172} cy={628} r={12} fill="none" stroke={ink} strokeWidth={3} opacity={b} />
    <Draw d="M270,590 L370,620" p={b} />
    {/* saw */}
    <Draw d="M720,560 L760,560 L770,580 L790,560 L810,580 L830,560 L850,580 L870,560 L890,580" p={b} />
    <Draw d="M710,590 L612,620" p={b} />
    {/* knife */}
    <Draw d="M160,760 L300,720 L300,740 Z" p={b} />
    <Draw d="M300,730 L370,680" p={b} />
    {/* axe */}
    <Draw d="M760,780 L880,720" p={b} width={4} />
    <Draw d="M860,700 L900,740 L880,770 L840,730 Z" p={b} />
    <Draw d="M740,760 L612,680" p={b} />
    {/* laser */}
    <circle cx={490} cy={500} r={14} fill="none" stroke={ink} strokeWidth={3} opacity={b} />
    <Draw d="M490,514 L490,590" p={b} dash="3 7" />

    {/* FIG. 3 — jar protocol */}
    <Label x={30} y={830} p={c}>FIG. 3 — JAR PROTOCOL v2.3</Label>
    {[
      ["GRIP JAR", 40],
      ["ROTATE 37°", 230],
      ["WAIT 4 MIN", 430],
      ["HEAT 40°C", 630],
    ].map(([label, x], i) => (
      <React.Fragment key={label}>
        <rect x={Number(x)} y={870} width={160} height={60} rx={4} fill="none" stroke={ink} strokeWidth={3} opacity={c} />
        <Label x={Number(x) + 16} y={906} p={c} size={13}>{label}</Label>
        {i < 3 && <Draw d={`M${Number(x) + 162},900 L${Number(x) + 226},900`} p={c} />}
      </React.Fragment>
    ))}
    <Draw d="M880,860 L920,900 L880,940 L840,900 Z" p={c} />
    <Label x={858} y={905} p={c} size={12}>OPEN?</Label>
    <Draw d="M880,942 L880,1000 L120,1000 L120,934" p={c} />
    <Label x={820} y={980} p={c} size={12}>NO</Label>
    <Label x={930} y={905} p={c} size={12}>YES → STEP 12</Label>
    <Draw d="M440,1040 L560,1040" p={c} dash="6 6" />
    <Label x={580} y={1045} p={c} size={12}>IF STILL CLOSED: SEE FIG. 1</Label>
  </svg>
);

export const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useRamp(2, 32, theme.ease.out);
  const b = useRamp(20, 52, theme.ease.out);
  const c = useRamp(40, 72, theme.ease.out);
  const settle = useRamp(0, 12, theme.ease.out);
  const back1 = useRamp(110, 124, theme.ease.out);
  const back2 = useRamp(132, 146, theme.ease.out);
  const shakeAmt = interpolate(frame, [148, CUT_AT], [0, 7], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sx = (random(`cs-x-${frame}`) - 0.5) * shakeAmt * 2;
  const sy = (random(`cs-y-${frame}`) - 0.5) * shakeAmt * 2;

  // The hard cut: nothing on the page from CUT_AT on, not even the top light.
  if (frame >= CUT_AT) return <SceneShell exit={false} light={0}>{null}</SceneShell>;

  const sheetStyle = (rot: number, dx: number, dy: number, p: number, tone: string): React.CSSProperties => ({
    position: "absolute",
    left: SHEET.left + dx,
    top: SHEET.top + dy,
    width: SHEET.w,
    height: SHEET.h,
    borderRadius: 6,
    background: tone,
    boxShadow: ksColors.shadow,
    opacity: p,
    transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
  });

  return (
    <SceneShell exit={false}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {/* the pile grows behind */}
        <div style={sheetStyle(4.5, 34, 26, back2, "#DCD6CB")} />
        <div style={sheetStyle(-4, -30, 30, back1, "#E4DFD5")} />

        <div style={{ ...sheetStyle(-1.2, 0, 0, 1, ksColors.paper), transform: `rotate(-1.2deg) scale(${0.97 + settle * 0.03})` }}>
          <Diagrams a={a} b={b} c={c} />

          {/* annotation arrows, drawn on one after another */}
          <svg width={SHEET.w} height={SHEET.h} viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} style={{ position: "absolute", inset: 0 }}>
            {ARROW_AT.map((at, i) => {
              if (frame < at) return null;
              const p = interpolate(frame, [at, at + 8], [0, 1], {
                easing: theme.ease.out,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const r = (k: string) => random(`arrow-${i}-${k}`);
              const x1 = 40 + r("x1") * 880;
              const y1 = 60 + r("y1") * 1040;
              const x2 = 40 + r("x2") * 880;
              const y2 = 60 + r("y2") * 1040;
              const cx = (x1 + x2) / 2 + (r("c") - 0.5) * 300;
              const cy = (y1 + y2) / 2 + (r("d") - 0.5) * 300;
              return (
                <g key={i}>
                  <path
                    d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
                    fill="none"
                    stroke={ink}
                    strokeWidth={2.5}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    markerEnd={p > 0.95 ? "url(#ks-arrow)" : undefined}
                  />
                  <Label x={x1 + 6} y={y1 - 8} p={p} size={14}>
                    {NOTES[i % NOTES.length]}
                  </Label>
                </g>
              );
            })}
          </svg>

          {/* STEP tags */}
          {STEP_TAGS.map(([at, x, y], i) => {
            if (frame < at) return null;
            const p = interpolate(frame, [at, at + 7], [0, 1], {
              easing: theme.ease.out,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  padding: "10px 16px",
                  border: `2px solid ${ink}`,
                  borderRadius: 3,
                  background: i % 4 === 3 ? ink : ksColors.paper,
                  color: i % 4 === 3 ? ksColors.paper : ink,
                  fontFamily: theme.fonts.mono,
                  fontSize: i < 6 ? 24 : 18,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  whiteSpace: "nowrap",
                  opacity: p,
                  transform: `scale(${interpolate(p, [0, 1], [1.5, 1])}) rotate(${(random(`tag-${i}`) - 0.5) * 8}deg)`,
                }}
              >
                STEP {i + 1}
                {i >= 5 ? "…" : ""}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
