import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { ksColors, ksPalette } from "../palette";
import { Eyebrow, Kinetic, Mono, Rise, SceneShell, Slam, Strike, Tag, useIn, useRamp } from "../ui";

// 45.5–53.5s. Three conceptual creator rows ranked by FOLLOWERS; the header is
// struck through and replaced by AUDIENCE FIT, the numbers and bars flip, the
// smallest creator wins. The dimensions stack in as tags, then REACH ≠
// RELEVANCE hard-cuts to THE RIGHT AUDIENCE WINS.
const ROWS = [
  { name: "CREATOR A", followers: "2.4M", fit: "31%", fBar: 1, fitBar: 0.31 },
  { name: "CREATOR B", followers: "850K", fit: "64%", fBar: 0.35, fitBar: 0.64 },
  { name: "CREATOR C", followers: "320K", fit: "92%", fBar: 0.13, fitBar: 0.92 },
];
const DIMS = ["Language", "Country", "Interests", "Engagement", "Audience"];
const STRIKE_AT = 96;
const FLIP_AT = 130;
const WIN_AT = 162;
const TAGS_AT = 150;
const REACH_AT = 186;
const WINS_AT = 214;

const ROW_TOP = 500;
const ROW_H = 190;
const BAR_X = 200;
const BAR_W = 808;

export const LessonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = useRamp(STRIKE_AT, STRIKE_AT + 12, theme.ease.out);
  // Old values leave fast, new ones arrive after — never both at once.
  const flip = useRamp(FLIP_AT, FLIP_AT + 6, theme.ease.in);
  const flipIn = useRamp(FLIP_AT + 6, FLIP_AT + 18, theme.ease.out);
  const morph = useRamp(FLIP_AT + 8, FLIP_AT + 34, theme.ease.inOut);
  const win = useRamp(WIN_AT, WIN_AT + 10, theme.ease.out);
  const fitIn = useIn(FLIP_AT + 6, "snappy");

  return (
    <SceneShell>
      {/* header */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 420,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Eyebrow delay={6}>Ranked by</Eyebrow>
        <div style={{ position: "relative", height: 40 }}>
          <div style={{ position: "relative", opacity: 1 - flip, transform: `translateY(${flip * -16}px)` }}>
            <Mono size={28} color={ksColors.bone}>
              Followers
            </Mono>
            <Strike progress={strike} thickness={6} tilt={-3} />
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              opacity: fitIn,
              transform: `translateY(${interpolate(fitIn, [0, 1], [18, 0])}px)`,
            }}
          >
            <Mono size={28} color={ksColors.bone}>
              Audience fit
            </Mono>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, top: 472, height: 1, background: ksColors.line }} />

      {/* rows */}
      {ROWS.map((r, i) => {
        const grow = useRamp(30 + i * 6, 60 + i * 6, theme.ease.out);
        const width = interpolate(morph, [0, 1], [r.fBar * grow, r.fitBar]) * BAR_W;
        const isWinner = i === 2;
        return (
          <Rise key={r.name} delay={10 + i * 6} distance={30} style={{ position: "absolute", left: 72, right: 72, top: ROW_TOP + i * ROW_H, height: 150 }}>
            {/* avatar — abstract, never a likeness */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: ksColors.surfaceStrong,
                border: `1.5px solid ${ksColors.line}`,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 30, top: 20, width: 36, height: 36, borderRadius: "50%", background: ksColors.dim }} />
              <div style={{ position: "absolute", left: 16, top: 62, width: 64, height: 50, borderRadius: "32px 32px 0 0", background: ksColors.dim }} />
            </div>
            <div style={{ position: "absolute", left: BAR_X - 72, top: 4 }}>
              <Mono size={20}>{r.name}</Mono>
            </div>
            <div style={{ position: "absolute", left: BAR_X - 72, top: 34, height: 80 }}>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 72,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: ksColors.bone,
                  opacity: 1 - flip,
                  transform: `translateY(${flip * -22}px)`,
                }}
              >
                {r.followers}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  fontFamily: theme.fonts.display,
                  fontSize: 72,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: isWinner ? ksPalette.primary : ksColors.bone,
                  opacity: flipIn,
                  transform: `translateY(${(1 - flipIn) * 22}px)`,
                }}
              >
                {r.fit}
              </div>
            </div>
            {/* bar */}
            <div style={{ position: "absolute", left: BAR_X - 72, top: 128, width: BAR_W, height: 8, background: ksColors.surface, borderRadius: 2 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width,
                  borderRadius: 2,
                  background: ksColors.bone,
                  opacity: 0.85,
                }}
              />
              {isWinner && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width,
                    borderRadius: 2,
                    background: ksPalette.primary,
                    opacity: win,
                  }}
                />
              )}
            </div>
          </Rise>
        );
      })}
      <div style={{ position: "absolute", left: 72, top: 1046 }}>
        <Mono size={15}>Conceptual data — not real creators</Mono>
      </div>

      {/* dimensions */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 1092, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {DIMS.map((d, i) => (
          <Tag key={d} delay={TAGS_AT + i * 5} size={19}>
            {d}
          </Tag>
        ))}
      </div>

      {/* the line */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 1180, display: "flex", justifyContent: "center" }}>
        {frame < WINS_AT ? (
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Slam text="REACH" at={REACH_AT} size={92} />
            <Slam text="≠" at={REACH_AT + 3} size={84} font={theme.fonts.mono} weight={700} color={ksPalette.textDim} tracking="0" />
            <Slam text="RELEVANCE" at={REACH_AT + 6} size={92} />
          </div>
        ) : (
          <Kinetic text="THE RIGHT AUDIENCE WINS." delay={WINS_AT} per={4} size={84} />
        )}
      </div>
    </SceneShell>
  );
};
