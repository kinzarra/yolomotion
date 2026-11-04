// Beat 4, the machine against the month. Claude Code flies in and types the
// task while its stopwatch races through minutes; the developer flies in
// with a paper month that gets crossed out day by day, then he is crossed
// out himself on «месяц».
import React from "react";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { devMythColors as colors } from "../palette";
import { Burst, Calendar, Cross, Drift, Flash, FlyIn, Label, S, SceneShell, Stopwatch, Terminal, TopBar, cl, media } from "../ui";
import { MINUTES_T, T } from "../timeline";
import { BgVideo } from "../fx2";

const FIG = { src: "images/dev-myth/fig-dev.png", ratio: 867 / 1190 };

export const MinutesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const machineAt = S(T(MINUTES_T.machine), fps);
  const humanAt = S(T(MINUTES_T.human), fps);
  const monthAt = S(T(MINUTES_T.month), fps);
  const open = usePunch(0, 12);
  const human = usePunch(humanAt, 12);
  const month = usePunch(monthAt, 16);
  const figW = 440;
  const figH = figW / FIG.ratio;
  const day = interpolate(frame, [humanAt + 4, monthAt], [0, 30], cl);
  const dim = interpolate(frame - monthAt, [0, 10], [1, 0.4], cl);
  return (
    <SceneShell shake={open.shake * 0.4 + human.shake * 0.4 + month.shake * 0.8}>
      <BgVideo src="media/dev-myth/v-hacker.mp4" dim={0.78} tint={0.35} />
      <Drift items={["00:04", "30 ДНЕЙ", "×1", "2 НЕДЕЛИ", "МИНУТЫ", "МЕСЯЦ"]} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="МАШИНА ПРОТИВ ЧЕЛОВЕКА" />

      {/* the machine: the window, the racing stopwatch, the typed task */}
      <FlyIn from="bottom" at={machineAt} x={110} y={150} w={960} rot={-1.5} z={5} sticker={false}>
        <div style={{ position: "relative" }}>
          <Terminal
            at={machineAt}
            width={960}
            speed={2.6}
            lines={[
              { text: "$ claude", dim: true, instant: true },
              { text: "> Создай веб-приложение: регистрация, база данных, личный кабинет, оплата подписки. Напиши тесты." },
              { text: "✓ src/auth · src/db · src/billing · tests/ · 14 файлов", instant: true },
              { text: "✓ 38 тестов прошли", instant: true },
            ]}
          />
          <div style={{ position: "absolute", right: 22, top: 8 }}>
            <Stopwatch at={machineAt + 8} rate={52} size={40} />
          </div>
        </div>
      </FlyIn>
      {frame >= machineAt + 10 && (
        <div style={{ position: "absolute", left: 130, top: 640, zIndex: 9, display: "flex", gap: 14 }}>
          <Label at={machineAt + 10} size={28} tone="lime" rotate={-2}>МИНУТЫ</Label>
          <Label at={machineAt + 16} size={24}>МАШИНА · 100 $ В МЕСЯЦ</Label>
        </div>
      )}

      {/* the human: the cut-out, the month burning down, the cross */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, opacity: dim, filter: `grayscale(${1 - dim})` }}>
        <FlyIn from="right" at={humanAt} x={1420} y={140} w={figW} rot={3} z={3}>
          <Img src={media(FIG.src)} style={{ width: "100%", display: "block", filter: "brightness(1.35) contrast(1.05)" }} />
        </FlyIn>
      </div>
      <FlyIn from="right" at={humanAt + 3} x={1120} y={200} w={320} rot={-4} z={4} sticker={false}>
        <Calendar day={day} title="МЕСЯЦ РАБОТЫ" />
      </FlyIn>
      {frame >= monthAt && (
        <>
          <div style={{ position: "absolute", left: 1420 + figW / 2 - 110, top: 140 + figH / 2 - 160, zIndex: 6 }}>
            <Cross delay={monthAt} size={220} thick={24} />
          </div>
          <div style={{ position: "absolute", left: 1120, top: 640, zIndex: 9, display: "flex", gap: 14 }}>
            <Label at={monthAt} size={28} tone="bad" rotate={2}>МЕСЯЦ</Label>
            <Label at={monthAt + 5} size={24}>ЧЕЛОВЕК · 254 000 ₽ В МЕСЯЦ</Label>
          </div>
        </>
      )}
      <Burst at={monthAt} x={1640} y={420} color={colors.bad} count={22} />
      <Flash amount={open.energy * 0.7} />
      <Flash amount={human.energy * 0.5} />
      <Flash amount={month.energy} color={colors.bad} />
    </SceneShell>
  );
};
