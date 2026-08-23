// Beat 6 — the other side. The equation everyone runs in their head
// («ставка вниз, значит доллар вверх») is struck out, three things that can
// hold the ruble up rise in its place, and the next rate decision lands as a
// calendar page. The verdict is set as a comparison the viewer can read in one
// glance: risks exist, a forecast does not.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn } from "../../../reel";
import { dwColors, dwPalette } from "../palette";
import { Arrow, BrandBar, CalendarTile, Chip, Eyebrow, Kinetic, SceneShell, Strike } from "../ui";

const EQ = 4;
const CUT = 26;
const NOPE = 38;
const SUPPORT = 68;
const CAL = 124;
const VERDICT = 172;

export const CounterScene: React.FC<{
  series: string;
  episode: string;
  nextMeeting: string;
}> = ({ series, episode, nextMeeting }) => {
  const frame = useCurrentFrame();
  const verdict = useIn(VERDICT, "snappy");
  const [day, ...rest] = nextMeeting.split(" ");
  const month = rest.join(" ") || nextMeeting;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Eyebrow delay={0}>ВТОРАЯ СТОРОНА</Eyebrow>
      </div>

      {/* the equation that does not hold */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 372 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
          <Chip delay={EQ} size={34}>
            СТАВКА ↓
          </Chip>
          <Arrow width={88} delay={EQ + 6} color={dwPalette.textDim} thick={5} />
          <Chip delay={EQ + 10} size={34}>
            ДОЛЛАР ↑
          </Chip>
          {frame >= CUT && <Strike delay={CUT} thick={13} tilt={-3} />}
        </div>
      </AbsoluteFill>

      {frame >= NOPE && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 486,
            display: "flex",
            justifyContent: "center",
            transform: "rotate(-2deg)",
          }}
        >
          <Chip delay={NOPE} tone="bad" filled size={28}>
            ТАКОГО ПРАВИЛА НЕТ
          </Chip>
        </div>
      )}

      {/* what can hold the ruble up instead */}
      {frame >= SUPPORT - 6 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 616, display: "flex", justifyContent: "center" }}>
            <Chip delay={SUPPORT - 6} tone="paper" size={22}>
              ЧТО МОЖЕТ ПОДДЕРЖАТЬ РУБЛЬ
            </Chip>
          </div>
          <div
            style={{
              position: "absolute",
              left: 90,
              right: 90,
              top: 690,
              display: "flex",
              justifyContent: "center",
              gap: 18,
            }}
          >
            <Chip delay={SUPPORT} tone="hero" size={26}>
              НЕФТЬ
            </Chip>
            <Chip delay={SUPPORT + 6} tone="hero" size={26}>
              ЭКСПОРТ
            </Chip>
            <Chip delay={SUPPORT + 12} tone="hero" size={26}>
              РУБЛЁВАЯ ДОХОДНОСТЬ
            </Chip>
          </div>
        </>
      )}

      {/* the next decision */}
      {frame >= CAL && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 790 }}>
          <CalendarTile day={day} month={month} note="РЕШЕНИЕ ПО СТАВКЕ" delay={CAL} width={260} />
        </AbsoluteFill>
      )}

      {/* risks exist — a forecast does not */}
      {frame >= VERDICT && (
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1058,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Kinetic text="ЕСТЬ РИСКИ" delay={VERDICT} per={3} size={58} mode="snap" align="center" />
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1,
              color: dwColors.bad,
              opacity: Math.min(1, verdict * 1.6),
              transform: `scale(${0.6 + verdict * 0.4}) rotate(${(1 - verdict) * -12}deg)`,
            }}
          >
            ≠
          </span>
          <Kinetic
            text="ТОЧНЫЙ ПРОГНОЗ"
            delay={VERDICT + 10}
            per={3}
            size={58}
            mode="snap"
            align="center"
            color={dwColors.paper}
          />
        </div>
      )}
    </SceneShell>
  );
};
