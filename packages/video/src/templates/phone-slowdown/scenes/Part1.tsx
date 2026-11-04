// The hook (face → ×1000 → the bank spinner → 257 000 ₽ → face) and part 1
// «Куда делась скорость»: 4 MB → 4 GB, 23 MB → 537 MB, Facebook ×12, «мы её съели».
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { psColors as colors, psPalette as palette } from "../palette";
import { Burst, Flash, WIDE, cl, media } from "../../dev-myth/ui";
import { MediaCard } from "../../dev-myth/fx2";
import { rnd } from "../../digital-ruble/ui";
import { cue } from "../timeline";
import { Shot, BarChart, Big, Box, Face, FitStamp, Handset, Head, Hits, I, Icon, IconChip, IconDisc, L, Logo, MemBar, Seconds, Shell, Spinner, Tag, V, at } from "../kit";
import { Img } from "remotion";

/* ------------------------------------------------------------------ hook */

export const FaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const yrs = at(cue("01-face", "Я"));
  const slow = at(cue("01-face", "твой"));
  const us = at(cue("01-face", "из-за"));
  const p = usePunch(slow, 16);
  const tear = interpolate(frame - slow, [0, 2, 9], [0, 1, 0], cl);
  return (
    <Shell part="hook" shake={p.shake * 0.7}>
      <Face shot="face" from={at(0)} glitch={tear} fallback="v-dev-headphones.mp4" />
      <Tag at={yrs} x={96} y={230}>ПРИЗНАНИЕ</Tag>
      <Head text="Я 20 ЛЕТ В IT" at={yrs} x={96} y={300} w={860} size={112} hero={[1, 2]} oneLine />
      <FitStamp text="ТВОЙ ТЕЛЕФОН" at={slow} x={96} y={470} maxW={820} size={96} rotate={-3} />
      <FitStamp text="ТОРМОЗИТ" at={slow + 6} x={120} y={600} maxW={820} size={110} rotate={-3} />
      <Tag at={us} x={110} y={760} tone="lime" size={40}>ИЗ-ЗА НАС</Tag>
      <Flash amount={p.energy} color={colors.bad} />
    </Shell>
  );
};

export const FastScene: React.FC = () => {
  const n = at(cue("02-fast", "1000"));
  return (
    <Shell part="hook" bg="v-board.mp4" dim={0.55}>
      <Tag at={4} x={96} y={200}>ЖЕЛЕЗО · ЗА 20 ЛЕТ</Tag>
      <Big text="×1000" at={4} x={96} y={290} maxW={820} size={250} roll={{ from: 1, to: 1000, prefix: "×" }} />
      <Tag at={n + 8} x={110} y={560} tone="lime" size={34}>МОЩНЕЕ</Tag>
      <MediaCard src={V + "v-cpu.mp4"} at={2} x={1060} y={170} w={720} h={430} tilt={-6} label="ПРОЦЕССОР" meta="4K · МАКРО" />
      <IconChip at={n - 6} x={1000} y={680} icon="cpu-fill" text="ПРОЦЕССОР" tone="lime" />
      <IconChip at={n} x={1330} y={700} icon="memory-fill" text="ПАМЯТЬ" tone="lime" />
      <IconChip at={n + 6} x={1600} y={640} icon="hard-drives-fill" text="ДИСК" tone="lime" />
      <Burst at={n} x={420} y={420} />
      <Hits at={[n]} />
    </Shell>
  );
};

export const BankScene: React.FC = () => {
  const frame = useCurrentFrame();
  const open = at(cue("03-bank", "открывается"));
  const five = at(cue("03-bank", "5"));
  const go = at(cue("03-bank", "засеки"));
  return (
    <Shell part="hook" bg="v-waiting.mp4" dim={0.62}>
      <Head text="ПРИЛОЖЕНИЕ БАНКА" at={2} x={96} y={200} w={820} size={84} />
      <Box x={96} y={420}><Seconds at={open} to={5} dur={(five - open) / 30 + 0.6} size={210} /></Box>
      <Tag at={go} x={110} y={700} tone="lime" size={40}>ЗАСЕКИ ПРЯМО СЕЙЧАС</Tag>
      <Box x={1290} y={110} z={8}>
        <div style={{ transform: `rotate(${Math.sin(frame / 40) * 2 - 4}deg)` }}>
          <Handset w={330} glow={palette.glow}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#21A038 0%,#0d6b2a 55%,#063d18 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 70 }}>
              <Img src={media(L + "sber-mark.svg")} style={{ width: 130, filter: "brightness(0) invert(1)" }} />
              <Spinner s={64} c="#ffffff" />
            </div>
          </Handset>
        </div>
      </Box>
      <IconDisc at={go} x={1000} y={560} icon="timer-fill" d={150} tone="bad" />
      <Hits at={[]} bad={[five]} />
    </Shell>
  );
};

export const BillScene: React.FC<{ loss: number }> = ({ loss }) => {
  const n = at(cue("04-bill", "257"));
  const pay = at(cue("04-bill", "платишь"));
  return (
    <Shell part="hook" bg="v-money-counter.mp4" dim={0.6}>
      <Head text="ЗА ЭТИ СЕКУНДЫ ТЫ ПЛАТИШЬ" at={pay} x={96} y={190} w={1100} size={78} bad={[4]} />
      <Big text={`${loss.toLocaleString("ru-RU")} ₽`} at={n} x={96} y={420} maxW={1050} size={190} bad roll={{ from: 0, to: loss, suffix: " ₽" }} />
      <Tag at={n + 10} x={110} y={650} size={32}>ЗА ЖИЗНЬ · МОЙ РАСЧЁТ</Tag>
      <MediaCard src={V + "v-cash.mp4"} at={4} x={1290} y={200} w={520} h={560} tilt={-7} label="ПЕРЕПЛАТА" meta="ЖЕЛЕЗО" />
      <Burst at={n} x={500} y={500} color={colors.bad} />
      <Hits at={[]} bad={[n]} />
    </Shell>
  );
};

export const ProveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const show = at(cue("05-prove", "покажу"));
  const sp = at(cue("05-prove", "специально"));
  const p = usePunch(sp, 16);
  const tear = interpolate(frame - sp, [0, 2, 9], [0, 1, 0], cl);
  return (
    <Shell part="hook" shake={p.shake * 0.6}>
      <Face shot="prove" from={at(0)} glitch={tear} fallback="v-code-screen.mp4" />
      <Head text="СЕЙЧАС ПОКАЖУ" at={show} x={96} y={250} w={800} size={100} hero={[1]} />
      <Tag at={show + 10} x={100} y={490} size={30}>КУДА УХОДЯТ ДЕНЬГИ</Tag>
      <FitStamp text="СПЕЦИАЛЬНО" at={sp} x={96} y={600} maxW={820} size={120} rotate={-4} />
      <Flash amount={p.energy} color={colors.bad} />
    </Shell>
  );
};

/* ------------------------------------------------------------------ part 1 */

const Screen: React.FC<{ src: string; at: number; x: number; y: number; w: number; label: string; meta: string; tilt?: number }> = (p) => (
  <MediaCard src={I + p.src} at={p.at} x={p.x} y={p.y} w={p.w} h={Math.round(p.w * (p.src.includes("95") ? 0.75 : 0.624))} tilt={p.tilt ?? -5} label={p.label} meta={p.meta} grade={false} />
);

export const Win95Scene: React.FC = () => {
  const n = at(cue("06-win95", "4"));
  return (
    <Shell part="p1" bg="v-crt-loading.mp4" dim={0.5}>
      <Logo at={2} src={L + "windows95.svg"} x={96} y={170} w={440} h={190} light />
      <Big text="4 МБ" at={n} x={96} y={430} maxW={700} size={230} />
      <Tag at={n + 8} x={110} y={680} size={30}>ПАМЯТИ · МИНИМУМ · 1995</Tag>
      <Screen src="win95-screen.png" at={6} x={1000} y={190} w={820} label="WINDOWS 95" meta="1995" />
      <Hits at={[n]} />
    </Shell>
  );
};

export const Win11Scene: React.FC = () => {
  const n = at(cue("07-win11", "4"));
  const k = at(cue("07-win11", "1000"));
  return (
    <Shell part="p1" bg="v-code-desk.mp4" dim={0.72}>
      <Logo at={2} src={L + "windows11.svg"} x={96} y={170} w={440} h={190} light />
      <Big text="4 ГБ" at={n} x={96} y={430} maxW={700} size={230} bad />
      <FitStamp text="В 1000 РАЗ БОЛЬШЕ" at={k} x={96} y={690} maxW={860} size={80} rotate={-3} />
      <Screen src="win11-screen.png" at={6} x={1000} y={190} w={820} label="WINDOWS 11" meta="2021" />
      <Box x={1000} y={760} w={820}><MemBar at={n} w={820} h={26} label="ПАМЯТЬ" value="×1024" bad /></Box>
      <Hits at={[]} bad={[n, k]} />
    </Shell>
  );
};

export const SameScene: React.FC = () => {
  const items: [string, string, string][] = [["app-window-fill", "ОКНО", "окно"], ["folder-fill", "ПАПКА", "папка"], ["globe-fill", "БРАУЗЕР", "браузер"]];
  return (
    <Shell part="p1">
      <Head text="ТО ЖЕ САМОЕ" at={2} x={96} y={150} w={1728} size={96} align="center" hero={[2]} />
      <Screen src="win95-screen.png" at={4} x={150} y={330} w={720} label="1995" meta="4 МБ" tilt={6} />
      <Screen src="win11-screen.png" at={8} x={1050} y={330} w={720} label="2026" meta="4 ГБ" tilt={-6} />
      {items.map(([icon, text, w], i) => (
        <IconChip key={w} at={at(cue("08-same", w))} x={560 + i * 290} y={862} icon={icon} text={text} tone="lime" size={30} />
      ))}
    </Shell>
  );
};

export const Apps2012Scene: React.FC = () => {
  const n = at(cue("09-apps2012", "6"));
  return (
    <Shell part="p1" bg="v-iphone5-open.mp4" dim={0.6}>
      <MediaCard src={V + "v-phone-dial.mp4"} at={2} x={110} y={160} w={560} h={660} tilt={7} label="СМАРТФОН · 2012" meta="ВИДЕО" />
      <Logo at={4} src={L + "android.svg"} x={790} y={160} w={420} h={170} light />
      <Tag at={6} x={800} y={380} size={30}>СРЕДНЕЕ ПРИЛОЖЕНИЕ ANDROID · 2012</Tag>
      <Big text="6 МБ" at={n} x={790} y={470} maxW={900} size={260} />
      <Tag at={n + 10} x={810} y={760} size={22}>ABI RESEARCH · СЕНТЯБРЬ 2012</Tag>
      <Hits at={[n]} />
    </Shell>
  );
};

/** 20 lime cells, one per 2012 app, turning red. */
const Cells: React.FC<{ at: number; eat: number }> = ({ at: a, eat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 74px)", gap: 14 }}>
      {Array.from({ length: 20 }, (_, i) => {
        const p = spring({ frame: frame - a - i * 2, fps, config: theme.spring.bouncy });
        const e = interpolate(frame - eat - i, [0, 8], [0, 1], { easing: theme.ease.in, ...cl });
        return <div key={i} style={{ width: 74, height: 74, borderRadius: 16, background: e > 0.5 ? colors.bad : palette.primary, opacity: frame < a + i * 2 ? 0 : 1, transform: `scale(${interpolate(p, [0, 1], [0.2, 1]) * (1 - e * 0.15)})`, boxShadow: `0 0 18px ${e > 0.5 ? colors.badGlow : palette.glow}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="app-window-fill" s={40} c={colors.ink2} /></div>;
      })}
    </div>
  );
};

export const Bank537Scene: React.FC = () => {
  const n = at(cue("10-bank537", "120"));
  const c = at(cue("10-bank537", "20"));
  const d = at(cue("10-bank537", "загрузка"));
  return (
    <Shell part="p1" bg="v-phone-scroll.mp4" dim={0.78}>
      <Logo at={2} src={L + "sber.svg"} x={96} y={160} w={520} h={170} light />
      <Big text="120 МБ" at={n} x={96} y={390} maxW={640} size={190} bad />
      <Tag at={d} x={110} y={600} tone="bad" size={28}>И ЭТО ТОЛЬКО ЗАГРУЗКА</Tag>
      <Tag at={c} x={900} y={170} tone="lime" size={30}>×20 = 20 ПРИЛОЖЕНИЙ 2012 ГОДА</Tag>
      <Box x={960} y={250}><Cells at={c - 12} eat={c + 20} /></Box>
      <Shot src="sber-appstore.png" at={8} x={1000} y={660} w={820} ratio={1600 / 380} label="RUSTORE · СБЕРБАНК ОНЛАЙН" meta="ОКТЯБРЬ 2026" tilt={-3} />
      <Hits at={[]} bad={[n]} />
    </Shell>
  );
};

export const FacebookScene: React.FC = () => {
  const n = at(cue("11-facebook", "12"));
  const a = at(cue("11-facebook", "вырос"));
  return (
    <Shell part="p1" bg="v-phone-night.mp4" dim={0.78}>
      <Logo at={2} src={L + "facebook.svg"} x={96} y={170} w={180} h={180} />
      <Big text="×12" at={n} x={320} y={180} maxW={420} size={170} bad />
      <Tag at={n + 8} x={110} y={390} size={26}>ЗА 4 ГОДА · SENSOR TOWER</Tag>
      <Box x={110} y={500}><BarChart at={a} w={640} h={220} every={20} items={[{ label: "2013", value: 32, text: "32 МБ" }, { label: "2017", value: 388, text: "388 МБ", bad: true }]} /></Box>
      <Shot src="sensortower-facebook.png" at={8} x={900} y={190} w={920} ratio={1450 / 920} label="SENSOR TOWER" meta="ТОП-10 IOS · 2013–2017" />
      <Hits at={[]} bad={[n]} />
    </Shell>
  );
};

export const WhereScene: React.FC = () => {
  const w = at(cue("12-where", "ждать"));
  const q = at(cue("12-where", "куда"));
  return (
    <Shell part="p1" bg="v-crowd-phones.mp4" dim={0.6}>
      <IconChip at={4} x={96} y={200} icon="cpu-fill" text="ЖЕЛЕЗО ×1000" tone="lime" size={36} />
      <IconChip at={w} x={96} y={300} icon="hourglass-medium-fill" text="ОЖИДАНИЕ ×1" tone="bad" size={36} />
      <Head text="КУДА ДЕЛАСЬ СКОРОСТЬ?" at={q} x={96} y={470} w={1500} size={120} bad={[2]} />
    </Shell>
  );
};

export const AteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePunch(at(0.5), 16);
  return (
    <Shell part="p1" shake={p.shake}>
      <Face shot="ate" from={at(0)} glitch={interpolate(frame - at(0.5), [0, 2, 8], [0, 1, 0], cl)} fallback="v-phone-dark.mp4" />
      <Head text="МЫ ЕЁ" at={at(0)} x={96} y={300} w={800} size={130} />
      <FitStamp text="СЪЕЛИ" at={at(0.5)} x={96} y={480} maxW={800} size={170} rotate={-4} />
      <Flash amount={p.energy} color={colors.bad} />
    </Shell>
  );
};
