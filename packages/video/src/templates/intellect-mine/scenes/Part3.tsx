// Parts 4–6: electricity (Japan, Three Mile Island, the 11× bill), the token
// (a word in pieces, 0,3 Wh, 3,2 quadrillion, 60 $ → under 1 $), and the
// quota (the limit, «our GPUs are melting», the 220 000-GPU deal, rent).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { imColors as colors, imPalette as palette } from "../palette";
import { BeatShell, Bars, ChatMock, DropChart, GlassChip, I, Kinetic, L, Label, LogoPlate, MediaCard, QuoteCard, Stamp, StatPlate, Strike, TokenStream, V, WIDE, cl, mono, useSec } from "../ui";
import { SceneKey, cue } from "../timeline";
import { Fig, bar } from "./common";

type P = { series: string; episode: string };
const useCue = (k: SceneKey) => {
  const s = useSec();
  return (w: string, n = 0) => s(cue(k, w, n));
};

/* ---------------------------------------------------------------- energy */

export const PowerScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("power");
  const el = at("электричество");
  return (
    <BeatShell series={series} bar={bar(4, episode)} bg={V + "v-powerlines.mp4"} dim={0.6}>
      <div style={{ position: "absolute", left: 96, top: 170, width: 900, zIndex: 9 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Kinetic text="НЕ ДЕНЬГИ" size={100} delay={4} per={3} mode="snap" color={palette.textDim} />
          <Strike at={at("деньги")} width={560} style={{ left: -10, top: 52 }} />
        </div>
        {frame >= el && <div style={{ marginTop: 30 }}><Stamp tone="bad" size={110} rotate={-3} delay={el}>ЭЛЕКТРИЧЕСТВО</Stamp></div>}
      </div>
      <MediaCard src={V + "v-meter.mp4"} at={el} x={1180} y={180} w={640} h={420} tilt={-6} label="СЧЁТЧИК" meta="КВТ·Ч" />
      <GlassChip at={el + 8} x={1200} y={680} text="ГЛАВНАЯ ПРОБЛЕМА ИИ" size={30} />
    </BeatShell>
  );
};

export const IeaScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("iea");
  return (
    <BeatShell series={series} bar={bar(4, episode)} bg={V + "v-tokyo.mp4"} dim={0.75}>
      <Bars at={at("2024")} x={1080} y={140} w={620} h={540} every={14} title="ДАТА-ЦЕНТРЫ МИРА, ТВТ·Ч В ГОД" source="IEA «ENERGY AND AI», 04.2025" items={[
        { label: "2024", value: 415, text: "415", tone: "dim" },
        { label: "2030", value: 945, text: "945", tone: "bad" },
      ]} />
      <Fig x={96} y={160} at={at("945")} value="×2,3" size={170} bad kicker="ЗА 6 ЛЕТ" source="415 → 945 ТВТ·Ч" />
      <StatPlate at={at("япония")} x={96} y={520} w={700} value="= ВСЯ ЯПОНИЯ" caption="ГОДОВОЕ ПОТРЕБЛЕНИЕ СТРАНЫ · IEA" bad />
      <GlassChip at={at("япония") + 6} x={96} y={760} text="ЯПОНИЯ" icon={L + "flag-jp.png"} />
    </BeatShell>
  );
};

export const NuclearScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("nuclear");
  const atom = at("атомную");
  const crash = at("авария");
  return (
    <BeatShell series={series} bar={bar(4, episode)} bg={V + "v-nuclear.mp4"}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 880, zIndex: 9 }}>
        <Kinetic text="IT-ГИГАНТЫ ПОКУПАЮТ АТОМ" size={80} delay={atom} per={3} mode="snap" hero={[3]} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 390, zIndex: 9, display: "flex", flexDirection: "column", gap: 16 }}>
        <GlassChip at={atom + 6} x={0} y={0} text="MICROSOFT · THREE MILE ISLAND · 835 МВТ" />
        <GlassChip at={atom + 12} x={0} y={80} text="AMAZON · SUSQUEHANNA · 1,92 ГВТ" />
        <GlassChip at={atom + 18} x={0} y={160} text="GOOGLE · МАЛЫЕ РЕАКТОРЫ KAIROS" />
        <GlassChip at={atom + 24} x={0} y={240} text="META · ДО 6,6 ГВТ К 2035" />
      </div>
      <MediaCard src={I + "tmi.jpg"} at={at("перезапускает")} x={1060} y={140} w={760} h={460} tilt={-5} label="ТРИ-МАЙЛ-АЙЛЕНД" meta="ПЕНСИЛЬВАНИЯ, США" />
      <LogoPlate at={at("microsoft")} src={L + "microsoft.png"} x={1120} y={650} w={320} caption="ПЕРЕЗАПУСК НА 20 ЛЕТ" />
      {frame >= crash && <div style={{ position: "absolute", left: 1480, top: 640, zIndex: 11 }}><Stamp tone="bad" size={66} rotate={-6} delay={crash}>АВАРИЯ 1979</Stamp></div>}
      <div style={{ position: "absolute", left: 96, top: 740, zIndex: 9 }}><Label at={atom + 30} size={18}>CARNEGIE, 06.2026</Label></div>
    </BeatShell>
  );
};

export const BillsScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("bills");
  return (
    <BeatShell series={series} bar={bar(4, episode)} bg={V + "v-meter.mp4"} startFrom={2} dim={0.78}>
      <Bars at={at("цена")} x={1100} y={150} w={620} h={520} every={14} title="ЦЕНА МОЩНОСТИ PJM, $ ЗА МВТ В СУТКИ" source="PJM: 13 ШТАТОВ США · UTILITY DIVE" items={[
        { label: "2024/25", value: 28.92, text: "$28,92", tone: "dim" },
        { label: "2026/27", value: 329.17, text: "$329", tone: "bad" },
      ]} />
      <Fig x={96} y={170} at={at("11")} value="×11" size={220} bad kicker="ЗА 2 ГОДА" source="ДАТА-ЦЕНТРЫ ДАЛИ 63% РОСТА · РЫНОЧНЫЙ МОНИТОР PJM" />
      <GlassChip at={at("платят")} x={96} y={640} text="СЧЕТА ДОМОХОЗЯЙСТВ США: +1,5-5%" size={30} />
    </BeatShell>
  );
};

/* ----------------------------------------------------------------- token */

export const TokenScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("token");
  return (
    <BeatShell series={series} bar={bar(5, episode)} bg={V + "v-data.mp4"}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}>
        <Kinetic text="ТОКЕН" size={150} delay={at("токен")} per={3} mode="snap" hero={[0]} glow />
        <div style={{ marginTop: 10 }}><Label at={at("кусочек")} size={30}>КУСОЧЕК СЛОВА</Label></div>
      </div>
      <TokenStream at={at("кусочек")} x={96} y={460} w={900} tokens={["Как", "добы", "ва", "ют", "интел", "лект", "?"]} every={5} size={62} />
      <ChatMock at={at("нейросеть")} x={1080} y={180} w={740} question="Как добывают интеллект?" answer="Всё начинается с песка. Из кварца делают кремний, на кремнии печатают чип…" />
      <GlassChip at={at("одному")} x={1100} y={720} text="1 ТОКЕН ЗА РАЗ" hero />
    </BeatShell>
  );
};

export const QueryScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("query");
  return (
    <BeatShell series={series} bar={bar(5, episode)} bg={V + "v-phone-chat.mp4"} dim={0.78}>
      <Fig x={96} y={170} at={at("0,3")} value="0,3 ВТ·Ч" size={170} kicker="ОДИН ПРОСТОЙ ВОПРОС" source="GOOGLE: 0,24 ВТ·Ч НА ЗАПРОС GEMINI · OPENAI: 0,34" />
      <MediaCard src={V + "v-tv.mp4"} at={at("10")} x={1120} y={160} w={700} h={420} tilt={-6} label="ТЕЛЕВИЗОР" meta="≈ 10 СЕКУНД" />
      <StatPlate at={at("10")} x={96} y={560} w={600} value="≈ 10 СЕКУНД" caption="РАБОТЫ ТЕЛЕВИЗОРА" />
    </BeatShell>
  );
};

export const ScaleScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("scale");
  return (
    <BeatShell series={series} bar={bar(5, episode)} bg={V + "v-data.mp4"} startFrom={3} dim={0.8}>
      <Bars at={at("google")} x={960} y={150} w={860} h={520} every={7} title="ТОКЕНОВ В МЕСЯЦ У GOOGLE" source="SUNDAR PICHAI, GOOGLE I/O · 2024-2026" items={[
        { label: "05.2024", value: 9.7, text: "9,7 ТРЛН", tone: "dim" },
        { label: "05.2025", value: 480, text: "480 ТРЛН", tone: "dim" },
        { label: "07.2025", value: 980, text: "980 ТРЛН", tone: "dim" },
        { label: "10.2025", value: 1300, text: "1,3 КВДР", tone: "dim" },
        { label: "05.2026", value: 3200, text: "3,2 КВДР" },
      ]} />
      <Fig x={96} y={160} at={at("3,2")} value="3,2 КВАДРИЛЛИОНА" size={92} kicker="ТОКЕНОВ В МЕСЯЦ · ОДИН GOOGLE" />
      <Fig x={96} y={470} at={at("330")} value="×330" size={190} kicker="ЗА 2 ГОДА" />
      <LogoPlate at={at("google") + 4} src={L + "google.png"} x={96} y={800} w={220} />
    </BeatShell>
  );
};

export const CheapScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("cheap");
  const old = at("60");
  const now = at("меньше");
  return (
    <BeatShell series={series} bar={bar(5, episode)} bg={V + "v-money.mp4"} startFrom={3} dim={0.8}>
      <div style={{ position: "absolute", left: 1040, top: 180, zIndex: 8 }}>
        <DropChart at={old} w={780} h={420} points={[60, 36, 15, 5, 2, 0.8, 0.4]} label="$ ЗА 1 МЛН ТОКЕНОВ" value="$60 → <$1" source="BENCHLM, 09.2026" />
      </div>
      <Fig x={96} y={170} at={old} value="$60" size={160} bad kicker="GPT-4, 2023 · 1 МЛН ТОКЕНОВ" burst={false} />
      {frame >= old + 14 && <Strike at={old + 14} width={380} style={{ left: 86, top: 310, zIndex: 12 }} />}
      <Fig x={96} y={470} at={now} value="< $1" size={180} kicker="СЕГОДНЯ · ТОТ ЖЕ УРОВЕНЬ" source="В 100-300 РАЗ ДЕШЕВЛЕ" />
    </BeatShell>
  );
};

/* ----------------------------------------------------------------- quota */

export const LimitsScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("limits");
  return (
    <BeatShell series={series} bar={bar(6, episode)} bg={V + "v-phone-chat.mp4"} startFrom={2} dim={0.78}>
      <div style={{ position: "absolute", left: 96, top: 170, width: 880, zIndex: 9 }}>
        <Kinetic text="ПОЧЕМУ ЛИМИТ?" size={110} delay={at("лимиты")} per={3} mode="snap" bad={[1]} />
      </div>
      <ChatMock at={6} x={1040} y={170} w={780} question="Разбери мне договор аренды" limitAt={at("попробуйте")} />
      <GlassChip at={at("подписке")} x={96} y={500} text="ПЛАТНАЯ ПОДПИСКА" size={34} />
      <GlassChip at={at("5")} x={96} y={600} text="ЖДИ 5 ЧАСОВ" size={34} />
    </BeatShell>
  );
};

export const MeltingScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("melting");
  const short = at("не");
  return (
    <BeatShell series={series} bar={bar(6, episode)} bg={V + "v-hot.mp4"} dim={0.62}>
      <div style={{ position: "absolute", left: 96, top: 160, zIndex: 9 }}>
        {frame >= short && <Stamp tone="bad" size={96} rotate={-4} delay={short}>ВИДЕОКАРТ НЕ ХВАТАЕТ</Stamp>}
      </div>
      <GlassChip at={at("гибли")} x={96} y={380} text="МАРТ 2025 · КАРТИНКИ В СТИЛЕ ГИБЛИ" size={30} />
      <QuoteCard at={at("глава")} x={1000} y={200} w={800} quote="our GPUs are melting" ru="«наши видеокарты плавятся»" who="СЭМ АЛЬТМАН" meta="CEO OPENAI · X, 27.03.2025" photo={I + "altman.jpg"} tilt={-3} />
      <LogoPlate at={at("openai")} src={L + "openai.png"} x={1100} y={660} w={300} />
      <StatPlate at={at("плавятся")} x={96} y={520} w={640} value="3 КАРТИНКИ" caption="В ДЕНЬ: ЛИМИТ OPENAI ДЛЯ БЕСПЛАТНЫХ · FORTUNE" bad />
    </BeatShell>
  );
};

export const DealScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("deal");
  return (
    <BeatShell series={series} bar={bar(6, episode)} bg={V + "v-dc-aisle.mp4"} startFrom={3}>
      <Fig x={96} y={160} at={at("удвоила")} value="×2" size={200} kicker="ЛИМИТЫ CLAUDE CODE · 06.05.2026" burst={false} />
      <Fig x={96} y={480} at={at("220")} value="220 000" size={150} kicker="ВИДЕОКАРТ В АРЕНДУ У SPACEX" source="COLOSSUS 1 · ≈ $1,25 МЛРД В МЕСЯЦ · AXIOS" roll={{ from: 0, to: 220000 }} />
      <LogoPlate at={at("anthropic")} src={L + "anthropic.png"} x={1120} y={170} w={420} caption="ANTHROPIC, 06.05.2026" />
      <MediaCard src={I + "colossus.jpg"} at={at("арендовала")} x={1100} y={420} w={720} h={420} tilt={6} label="COLOSSUS 1" meta="МЕМФИС" />
    </BeatShell>
  );
};

/** A big ring: the share of capacity that exists, filling from 0 on its word. */
const Share: React.FC<{ at: number; x: number; y: number; d: number }> = ({ at, x, y, d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.smooth });
  if (frame < at) return null;
  const r = d / 2 - 20;
  const c = 2 * Math.PI * r;
  const slice = 0.12 * interpolate(p, [0, 1], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: d, height: d, zIndex: 8, transform: `rotate(${frame * 0.15}deg)` }}>
      <svg width={d} height={d}>
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke={colors.lineStrong} strokeWidth={34} strokeDasharray="6 10" />
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke={palette.primary} strokeWidth={40} strokeDasharray={`${c * slice} ${c}`} transform={`rotate(-90 ${d / 2} ${d / 2})`} style={{ filter: `drop-shadow(0 0 16px ${palette.glow})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${-frame * 0.15}deg)`, fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: palette.text, textAlign: "center", lineHeight: 1.1 }}>ТВОЯ<br />ДОЛЯ</div>
    </div>
  );
};

export const QuotaScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("quota");
  const greed = at("жадность");
  const quota = at("квота");
  return (
    <BeatShell series={series} bar={bar(6, episode)} bg={V + "v-queue.mp4"} dim={0.75}>
      <div style={{ position: "absolute", left: 96, top: 170, width: 900, zIndex: 9 }}>
        <div style={{ position: "relative", display: "inline-block", opacity: frame >= greed ? 1 : 0 }}>
          <Kinetic text="НЕ ЖАДНОСТЬ" size={90} delay={greed} per={3} mode="snap" color={palette.textDim} />
          <Strike at={greed + 10} width={640} style={{ left: -10, top: 44 }} />
        </div>
        {frame >= quota && <div style={{ marginTop: 26 }}><Stamp tone="hero" size={130} rotate={-3} delay={quota}>КВОТА</Stamp></div>}
      </div>
      <Share at={at("доля")} x={1180} y={170} d={560} />
      <div style={{ position: "absolute", left: 96, top: 560, zIndex: 9 }}><Label at={at("построить")} size={24}>МОЩНОСТЬ, КОТОРУЮ УСПЕЛИ ПОСТРОИТЬ, ДЕЛЯТ НА ВСЕХ</Label></div>
      <div style={{ position: "absolute", left: 96, top: 640, zIndex: 9, fontFamily: mono, fontWeight: 800, fontSize: 24, color: palette.textDim, letterSpacing: "0.1em" }}>{frame >= at("построить") ? "CoWoS, HBM, EUV, ТУРБИНЫ: ВСЁ РАСПРОДАНО" : ""}</div>
    </BeatShell>
  );
};

export const RentScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("rent");
  return (
    <BeatShell series={series} bar={bar(6, episode)} bg={V + "v-rack.mp4"} startFrom={3} dim={0.8}>
      <div style={{ position: "absolute", left: 1040, top: 200, zIndex: 8 }}>
        <DropChart at={at("2025")} w={780} h={400} points={[1.9, 1.8, 2.1, 2.4, 2.9]} label="АРЕНДА H100, $ ЗА ЧАС" value="$2,9" source="ORNN, SILICON DATA · 10.2026" />
      </div>
      <Fig x={96} y={160} at={at("2")} value="< $2" size={140} kicker="2025 · ЧАС АРЕНДЫ H100" burst={false} />
      <Fig x={96} y={450} at={at("3")} value="≈ $3" size={190} bad kicker="СЕЙЧАС" source="ОКТЯБРЬ 2026 · ЦЕНА СНОВА РАСТЁТ" />
      <MediaCard src={I + "h100.jpg"} at={at("видеокарты")} x={1300} y={680} w={420} h={220} tilt={-5} label="NVIDIA H100" meta="GPU" />
    </BeatShell>
  );
};
