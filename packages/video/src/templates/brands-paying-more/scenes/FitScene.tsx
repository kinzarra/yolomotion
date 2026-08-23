// 06 fit — 31.5–39s. The Yoloco beat. 8.2M owns the page, then the camera
// pulls out and it is only one row of three. Five more dimensions stack in,
// the ranking re-sorts on audience fit, and the smallest creator takes the
// frame. BIGGEST ≠ BEST.
//
// All three creators are conceptual and the footnote says so in frame.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { bpmColors, bpmPalette } from "../palette";
import {
  Avatar,
  Eyebrow,
  Footnote,
  Kinetic,
  Mono,
  Rule,
  Slam,
  SceneShell,
  Tag,
  ramp,
  useIn,
} from "../ui";

const ROWS = [
  { name: "Creator A", followers: "8.2M", fit: "34%", fBar: 1, fitBar: 0.34 },
  { name: "Creator B", followers: "1.4M", fit: "61%", fBar: 0.17, fitBar: 0.61 },
  { name: "Creator C", followers: "380K", fit: "93%", fBar: 0.046, fitBar: 0.93 },
];
const DIMS = ["Sentiment", "Brand affinity", "Content fit", "Engagement quality", "Demographics"];

const HERO_AT = 0;
const ZOOM_AT = 48;
const ROWS_AT = 56;
const TAGS_AT = 96;
const FLIP_AT = 142;
const WIN_AT = 158;
const LINE_AT = 188;

const ROW_TOP = 552;
const ROW_H = 168;
const BAR_X = 128;
const BAR_W = 808;

const FitRow: React.FC<{
  row: (typeof ROWS)[number];
  index: number;
  flip: number;
  winner: boolean;
  win: number;
}> = ({ row, index, flip, winner, win }) => {
  const p = useIn(ROWS_AT + index * 7, "smooth");
  const grow = useIn(ROWS_AT + 6 + index * 7, "smooth");
  const out = Math.max(0, Math.min(1, flip * 2)); // old value leaves first
  const back = Math.max(0, Math.min(1, (flip - 0.5) * 2)); // new one arrives after
  const bar = interpolate(flip, [0, 1], [row.fBar * grow, row.fitBar]);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: ROW_TOP + index * ROW_H,
        height: 150,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 6 }}>
        <Avatar size={88} accent={winner && win > 0.5} />
      </div>
      <div style={{ position: "absolute", left: BAR_X, top: 0 }}>
        <Mono size={19}>{row.name}</Mono>
      </div>
      <div style={{ position: "absolute", left: BAR_X, top: 26, height: 78 }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: bpmColors.bone,
            opacity: 1 - out,
            transform: `translateY(${out * -24}px)`,
          }}
        >
          {row.followers}
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
            color: winner ? bpmPalette.primary : bpmColors.bone,
            opacity: back,
            transform: `translateY(${(1 - back) * 24}px)`,
          }}
        >
          {row.fit}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: BAR_X,
          top: 122,
          width: BAR_W,
          height: 8,
          borderRadius: 2,
          background: bpmColors.surface,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: Math.max(0, bar) * BAR_W,
            borderRadius: 2,
            background: bpmColors.bone,
            opacity: 0.82,
          }}
        />
        {winner && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: Math.max(0, bar) * BAR_W,
              borderRadius: 2,
              background: bpmPalette.primary,
              opacity: win,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const FitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const heroOut = ramp(frame, ZOOM_AT, ZOOM_AT + 14, theme.ease.in);
  const zoomIn = ramp(frame, ROWS_AT, ROWS_AT + 22, theme.ease.out);
  const flip = ramp(frame, FLIP_AT, FLIP_AT + 24, theme.ease.inOut);
  const win = ramp(frame, WIN_AT, WIN_AT + 12);

  return (
    <SceneShell>
      {/* one creator, filling the page — the way a media kit sells them */}
      {heroOut < 1 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            // The labels ride in with the number. Left static they were two
            // orphan words floating in an otherwise black frame for the eight
            // frames the Slam's spring takes to become visible.
            opacity: (1 - heroOut) * ramp(frame, 0, 10),
            transform: `translateY(${-90 + heroOut * -30}px) scale(${1 + heroOut * 0.22})`,
          }}
        >
          <Mono size={24} style={{ marginBottom: 26 }}>
            Creator A
          </Mono>
          <Slam text="8.2M" at={HERO_AT} size={258} font={theme.fonts.wide} weight={800} />
          <Mono size={24} style={{ marginTop: 30 }}>
            Followers
          </Mono>
        </AbsoluteFill>
      )}

      {/* pull out: it was only one row */}
      {frame >= ROWS_AT - 2 && (
        <AbsoluteFill
          style={{
            opacity: zoomIn,
            transform: `scale(${interpolate(zoomIn, [0, 1], [1.7, 1])})`,
            transformOrigin: "34% 36%",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 452,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Eyebrow delay={ROWS_AT + 4}>Ranked by</Eyebrow>
            <div style={{ position: "relative", height: 34 }}>
              <div style={{ opacity: 1 - Math.min(1, flip * 2) }}>
                <Mono size={26} color={bpmColors.bone}>
                  Followers
                </Mono>
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  opacity: Math.max(0, (flip - 0.5) * 2),
                }}
              >
                <Mono size={26} color={bpmColors.bone}>
                  Audience fit
                </Mono>
              </div>
            </div>
          </div>
          <Rule
            width={936}
            delay={ROWS_AT + 8}
            color={bpmColors.line}
            style={{ position: "absolute", left: 72, top: 506 }}
          />

          {ROWS.map((row, i) => (
            <FitRow
              key={row.name}
              row={row}
              index={i}
              flip={flip}
              winner={i === 2}
              win={win}
            />
          ))}

          <Footnote delay={ROWS_AT + 20} style={{ position: "absolute", left: 72, top: 1046 }}>
            Conceptual creators — illustrative figures
          </Footnote>

          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              top: 1088,
              display: "flex",
              gap: 11,
              flexWrap: "wrap",
            }}
          >
            {DIMS.map((d, i) => (
              <Tag key={d} delay={TAGS_AT + i * 6} size={18}>
                {d}
              </Tag>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* the line */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 1196,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Slam text="BIGGEST" at={LINE_AT} size={86} />
        <Slam
          text="≠"
          at={LINE_AT + 3}
          size={78}
          font={theme.fonts.mono}
          weight={700}
          color={bpmPalette.textDim}
          tracking="0"
        />
        <Slam text="BEST" at={LINE_AT + 6} size={86} />
      </div>
    </SceneShell>
  );
};
