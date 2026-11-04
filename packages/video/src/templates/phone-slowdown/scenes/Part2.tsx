// Part 2 «Закон Вирта»: Wirth 1995 and the law, 8 000 bytes ×100, today's
// editor, Brin's «Page's law», then the one time it was on purpose (Apple 2017,
// the fines), and the turn: «мы специально выбираем не ускорять».
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { psColors as colors, psPalette as palette } from "../palette";
import { Flash, WIDE, cl } from "../../dev-myth/ui";
import { MediaCard } from "../../dev-myth/fx2";
import { cue } from "../timeline";
import { Shot, Big, Box, Face, FitStamp, Head, Hits, I, IconChip, L, Logo, Shell, Tag, V, at } from "../kit";

export const WirthScene: React.FC = () => {
  const c = at(cue("14-wirth", "создатель"));
  const n = at(cue("14-wirth", "Никлаус"));
  return (
    <Shell part="p2" bg="v-crt-static.mp4" dim={0.75}>
      <Big text="1995" at={2} x={96} y={170} maxW={600} size={170} />
      <Head text="НИКЛАУС ВИРТ" at={n} x={96} y={380} w={900} size={110} />
      <Tag at={c} x={110} y={640} size={32}>СОЗДАТЕЛЬ ЯЗЫКА PASCAL</Tag>
      <MediaCard src={I + "wirth.jpg"} at={n - 4} x={1190} y={140} w={600} h={720} tilt={-6} label="НИКЛАУС ВИРТ" meta="1934–2024" grade={false} />
    </Shell>
  );
};

/** Two curves: hardware up (lime), software weight up faster (red), crossing. */
const Race: React.FC<{ at: number; w: number; h: number }> = ({ at: a, w, h }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - a, [0, 40], [0, 1], { easing: theme.ease.inOut, ...cl });
  const hw = Array.from({ length: 21 }, (_, i) => [i / 20, Math.pow(i / 20, 1.6) * 0.62]);
  const sw = Array.from({ length: 21 }, (_, i) => [i / 20, Math.pow(i / 20, 2.6) * 0.98]);
  const path = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * w).toFixed(1)} ${(h - y * h).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke={colors.line} />)}
      <path d={path(hw)} fill="none" stroke={palette.primary} strokeWidth={9} strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - p)} style={{ filter: `drop-shadow(0 0 12px ${palette.glow})` }} />
      <path d={path(sw)} fill="none" stroke={colors.bad} strokeWidth={9} strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - p)} style={{ filter: `drop-shadow(0 0 12px ${colors.badGlow})` }} />
      <text x={w - 10} y={h - 0.62 * h + 50} textAnchor="end" fill={palette.primary} style={{ font: `800 26px ${theme.fonts.mono}`, letterSpacing: 2, opacity: p }}>ЖЕЛЕЗО</text>
      <text x={w - 10} y={h - 0.98 * h - 18} textAnchor="end" fill={colors.bad} style={{ font: `800 26px ${theme.fonts.mono}`, letterSpacing: 2, opacity: p }}>ВЕС ПРОГРАММ</text>
    </svg>
  );
};

export const LawScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = at(cue("15-law", "программы"));
  return (
    <Shell part="p2">
      <MediaCard src={I + "wirth-paper.png"} at={2} x={96} y={150} w={520} h={700} tilt={6} label="IEEE COMPUTER" meta="ФЕВРАЛЬ 1995" grade={false} fit="cover" />
      <Tag at={4} x={700} y={160} tone="lime" size={30}>ЗАКОН ВИРТА</Tag>
      <Box x={700} y={240} w={1120}>
        <div style={{ padding: "30px 36px", background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, transform: `rotate(-1deg) translateY(${interpolate(frame - q, [0, 12], [40, 0], { easing: theme.ease.out, ...cl })}px)`, opacity: interpolate(frame - q, [0, 8], [0, 1], cl), fontFamily: WIDE, fontWeight: 900, fontSize: 50, lineHeight: 1.12 }}>
          ПРОГРАММЫ ЗАМЕДЛЯЮТСЯ <span style={{ color: colors.bad }}>БЫСТРЕЕ</span>, ЧЕМ УСКОРЯЕТСЯ ЖЕЛЕЗО
        </div>
      </Box>
      <Box x={760} y={520}><Race at={q + 10} w={1000} h={320} /></Box>
    </Shell>
  );
};

export const EditorScene: React.FC = () => {
  const a = at(cue("16-editor", "8000"));
  const b = at(cue("16-editor", "100"));
  return (
    <Shell part="p2" bg="v-crt-loading.mp4" dim={0.78}>
      <Tag at={4} x={96} y={170} size={28}>ТЕКСТОВЫЙ РЕДАКТОР · 1970-Е</Tag>
      <Big text="8 000 БАЙТ" at={a} x={96} y={250} maxW={880} size={150} />
      <FitStamp text="×100 К 1995" at={b} x={96} y={470} maxW={800} size={110} rotate={-3} />
      <Shot src="wirth-quote.png" at={8} x={1000} y={300} w={820} ratio={1240 / 330} label="«A PLEA FOR LEAN SOFTWARE»" meta="WIRTH · 1995" tilt={-3} />
      <Hits at={[a]} bad={[b]} />
    </Shell>
  );
};

export const TodayScene: React.FC = () => {
  const n = at(cue("17-today", "сотни"));
  return (
    <Shell part="p2" bg="v-code-screen.mp4" dim={0.6}>
      <Logo at={2} src={L + "vscode.svg"} x={96} y={170} w={210} h={210} />
      <Tag at={6} x={340} y={240} size={30}>МОЙ РЕДАКТОР КОДА · 2026</Tag>
      <Big text="СОТНИ МБ" at={n} x={96} y={450} maxW={980} size={190} bad />
      <MediaCard src={V + "v-typing.mp4"} at={4} x={1300} y={170} w={520} h={340} tilt={-6} label="РАБОЧЕЕ МЕСТО" meta="2026" />
      <Hits at={[]} bad={[n]} />
    </Shell>
  );
};

export const GoogleScene: React.FC = () => {
  const law = at(cue("18-google", "законом"));
  const adm = at(cue("18-google", "признают"));
  return (
    <Shell part="p2" bg="v-server.mp4" dim={0.75}>
      <Logo at={2} src={L + "google.svg"} x={96} y={160} w={420} h={170} light />
      <Tag at={6} x={96} y={360} size={28}>GOOGLE I/O · 2009</Tag>
      <Head text="«ЗАКОН ПЕЙДЖА»" at={law} x={96} y={420} w={950} size={88} />
      <FitStamp text="ПРИЗНАЮТ САМИ" at={adm} x={96} y={700} maxW={900} size={96} tone="hero" rotate={-3} />
      <MediaCard src={I + "brin.jpg"} at={at(cue("18-google", "Сергей"))} x={1210} y={140} w={600} h={720} tilt={-5} label="СЕРГЕЙ БРИН" meta="СООСНОВАТЕЛЬ GOOGLE" grade={false} />
    </Shell>
  );
};

export const OnceScene: React.FC = () => {
  const sp = at(cue("19-once", "специальным"));
  return (
    <Shell part="p2" bg="v-hourglass.mp4" dim={0.5}>
      <Head text="ОДИН РАЗ" at={2} x={96} y={260} w={1728} size={210} align="center" />
      <Box x={0} y={560} w={1920} style={{ display: "flex", justifyContent: "center" }}>
        <FitStamp text="ПО-НАСТОЯЩЕМУ СПЕЦИАЛЬНО" at={sp} x={260} y={0} maxW={1400} size={90} rotate={-2} />
      </Box>
      <Hits at={[]} bad={[sp]} />
    </Shell>
  );
};

export const AppleScene: React.FC = () => {
  const y = at(cue("20-apple", "2017"));
  const b = at(cue("20-apple", "батареей"));
  const s = at(cue("20-apple", "замедляет"));
  return (
    <Shell part="p2" bg="v-iphone-red-open.mp4" dim={0.6}>
      <Logo at={2} src={L + "apple.svg"} x={96} y={160} w={190} h={190} light />
      <Big text="2017" at={y} x={330} y={185} maxW={500} size={150} />
      <FitStamp text="ЗАМЕДЛЯЕТ IPHONE" at={s} x={96} y={430} maxW={900} size={96} rotate={-3} />
      <IconChip at={b} x={110} y={620} icon="battery-warning-fill" text="СТАРАЯ БАТАРЕЯ" tone="bad" size={34} />
      <Shot src="apple-news.png" at={6} x={1000} y={220} w={820} ratio={2220 / 1100} label="THE VERGE" meta="20 ДЕКАБРЯ 2017" />
      <Hits at={[]} bad={[s]} />
    </Shell>
  );
};

const Fine: React.FC<{ at: number; x: number; flag: string; who: string; value: string }> = ({ at: a, x, flag, who, value }) => (
  <>
    <Logo at={a} src={L + flag} x={x} y={170} w={330} h={220} pad={0} />
    <Tag at={a + 4} x={x} y={420} size={26}>{who}</Tag>
    <Big text={value} at={a + 6} x={x} y={490} maxW={460} size={110} bad />
  </>
);

export const FinesScene: React.FC = () => {
  const us = at(cue("21-fines", "США"));
  const fr = at(cue("21-fines", "Франции"));
  const it = at(cue("21-fines", "Италии"));
  return (
    <Shell part="p2" bg="v-gavel.mp4" dim={0.7}>
      <Fine at={us} x={110} flag="flag-usa.svg" who="США · СОГЛАШЕНИЕ" value="$500 МЛН" />
      <Fine at={fr} x={700} flag="flag-france.svg" who="ФРАНЦИЯ · ШТРАФ" value="€25 МЛН" />
      <Fine at={it} x={1290} flag="flag-italy.svg" who="ИТАЛИЯ · ШТРАФ" value="€10 МЛН" />
      <Shot src="apple-settlement.png" at={us + 10} x={460} y={680} w={1000} ratio={1460 / 330} label="9TO5MAC" meta="2 МАРТА 2020" tilt={-2} />
      <Hits at={[]} bad={[us + 6, fr + 6, it + 6]} />
    </Shell>
  );
};

export const TurnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const faceAt = at(4.45);
  const evil = at(cue("22-turn", "не со зла"));
  const ch = at(cue("22-turn", "выбираем"));
  const ch2 = at(cue("22-turn", "дешевле"));
  const p = usePunch(ch2, 16);
  return (
    <Shell part="p2" bg="v-server.mp4" dim={0.7} shake={p.shake * 0.6}>
      {frame < faceAt && (
        <>
          <Head text="НО ПРАВДА СТРАШНЕЕ" at={2} x={96} y={280} w={1300} size={130} bad={[2]} />
          <Tag at={evil} x={110} y={620} size={40} tone="paper">НЕ СО ЗЛА</Tag>
        </>
      )}
      {frame >= faceAt && (
        <>
          <Face shot="turn" from={faceAt} fallback="v-office.mp4" />
          <Head text="МЫ СПЕЦИАЛЬНО ВЫБИРАЕМ НЕ УСКОРЯТЬ" at={Math.max(faceAt, ch)} x={96} y={220} w={820} size={86} hero={[3, 4]} />
          <FitStamp text="ЭТО ДЕШЕВЛЕ" at={ch2} x={96} y={660} maxW={820} size={110} rotate={-4} />
        </>
      )}
      {frame >= faceAt && <Flash amount={interpolate(frame - faceAt, [0, 8], [0.8, 0], cl)} />}
      <Flash amount={p.energy} color={colors.bad} />
    </Shell>
  );
};
