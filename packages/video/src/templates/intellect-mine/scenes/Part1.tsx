// Part 1 «Песок и чип»: Spruce Pine quartz, the hurricane, nine nines,
// ASML's light printer, the plane-loads, Taiwan, the 30 000 $ wafer, memory
// sold out for three years. Every figure on screen with its source.
import React from "react";
import { useCurrentFrame } from "remotion";
import { imColors as colors } from "../palette";
import { BeatShell, GlassChip, I, Kinetic, L, Label, LogoPlate, MediaCard, Ring, Stamp, StatPlate, V, useSec } from "../ui";
import { SceneKey, cue } from "../timeline";
import { Fig, bar } from "./common";

type P = { series: string; episode: string };
const useCue = (k: SceneKey) => {
  const s = useSec();
  return (w: string, n = 0) => s(cue(k, w, n));
};

export const SandScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("sand");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-sand.mp4"} drift={["SIO₂", "КВАРЦ", "99,99%", "ПЕСОК", "70-90%"]}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 820, zIndex: 9 }}>
        <Kinetic text="ВСЁ НАЧИНАЕТСЯ С ПЕСКА" size={92} delay={4} per={3} mode="snap" hero={[3]} lineHeight={1.04} />
      </div>
      <MediaCard src={I + "quartz.jpg"} at={at("кварца")} x={1080} y={140} w={360} h={360} tilt={-8} label="СВЕРХЧИСТЫЙ КВАРЦ" meta="ДЛЯ ТИГЛЕЙ" />
      <MediaCard src={I + "spruce-pine.jpg"} at={at("одном")} x={1300} y={420} w={520} h={350} tilt={6} label="СПРУС-ПАЙН" meta="СЕВ. КАРОЛИНА, США" />
      <GlassChip at={at("северной")} x={1340} y={820} text="СЕВЕРНАЯ КАРОЛИНА" icon={L + "flag-us.png"} />
      <Fig x={96} y={470} at={at("большую")} value="70-90%" size={170} kicker="СВЕРХЧИСТОГО КВАРЦА В МИРЕ" source="ОДИН ГОРОДОК · TOM'S HARDWARE, BLOOMBERGNEF, 2024" />
    </BeatShell>
  );
};

export const HurricaneScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("hurricane");
  const storm = at("ураган");
  const stock = at("2");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-storm.mp4"} dim={0.6}>
      <div style={{ position: "absolute", left: 96, top: 160, zIndex: 9, display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
        <Label at={4} size={26}>СЕНТЯБРЬ 2024</Label>
        {frame >= storm && <Stamp tone="bad" size={74} rotate={-4} delay={storm}>УРАГАН «ХЕЛЕН»</Stamp>}
        {frame >= at("обе") && <Label at={at("обе")} size={28} tone="bad">ОБЕ ШАХТЫ ОСТАНОВЛЕНЫ</Label>}
      </div>
      <MediaCard src={V + "v-quarry.mp4"} at={8} x={1120} y={150} w={700} h={400} tilt={-6} label="КАРЬЕР КВАРЦА" meta="ПРОСТОЙ" />
      <Fig x={96} y={560} at={stock} value="2-3 МЕСЯЦА" size={120} bad kicker="ЗАПАС У ВСЕЙ ОТРАСЛИ" source="ПОТОМ ЧИПЫ ДЕЛАТЬ НЕ ИЗ ЧЕГО" />
    </BeatShell>
  );
};

export const SiliconScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("silicon");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-wafer.mp4"}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}>
        <Kinetic text="КВАРЦ → КРЕМНИЙ" size={86} delay={4} per={3} mode="snap" hero={[2]} />
      </div>
      <Fig x={96} y={330} at={at("девять")} value="99,9999999%" size={108} kicker="ЧИСТОТА КРЕМНИЯ" source="ДЕВЯТЬ ДЕВЯТОК: ОДИН ЧУЖОЙ АТОМ НА МИЛЛИАРД" />
      <MediaCard src={I + "wafer.jpg"} at={8} x={1180} y={170} w={620} h={620} tilt={8} label="КРЕМНИЕВАЯ ПЛАСТИНА" meta="Ø 300 ММ" />
      <GlassChip at={at("пиццу")} x={1020} y={760} text="Ø 300 ММ · РАЗМЕР ПИЦЦЫ" hero />
    </BeatShell>
  );
};

export const AsmlScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("asml");
  const light = at("светом");
  const one = at("одна");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-cleanroom.mp4"} drift={["EUV", "13,5 НМ", "СВЕТ", "ЛИТОГРАФИЯ", "ASML"]}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 860, zIndex: 9 }}>
        <Kinetic text="СХЕМУ ПЕЧАТАЮТ" size={84} delay={4} per={3} mode="snap" />
        {frame >= light && <div style={{ marginTop: 10 }}><Stamp tone="hero" size={110} rotate={-3} delay={light}>СВЕТОМ</Stamp></div>}
      </div>
      <MediaCard src={V + "v-laser.mp4"} at={8} x={1120} y={140} w={700} h={400} tilt={-6} label="ЛИТОГРАФИЯ" meta="ЭКСТРЕМАЛЬНЫЙ УЛЬТРАФИОЛЕТ" />
      <StatPlate at={one} x={96} y={560} w={640} value="1 КОМПАНИЯ" caption="ДЕЛАЕТ EUV-МАШИНЫ ДЛЯ ВСЕГО МИРА" />
      <LogoPlate at={at("нидерландская")} src={L + "asml.png"} x={1200} y={640} w={380} caption="НИДЕРЛАНДЫ · МОНОПОЛИЯ" />
      <GlassChip at={at("нидерландская") + 6} x={1620} y={660} text="NL" icon={L + "flag-nl.png"} />
    </BeatShell>
  );
};

export const EuvScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("euv");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-cargo.mp4"} dim={0.78}>
      <MediaCard src={I + "asml-visit.jpg"} at={4} x={1000} y={140} w={820} h={460} tilt={-5} label="МАШИНА ASML НА ЭКРАНЕ" meta="ВЕС ≈ 150 Т · 100 000 ДЕТАЛЕЙ" />
      <Fig x={96} y={160} at={at("350")} value="€350+ МЛН" size={104} kicker="ЦЕНА ОДНОЙ МАШИНЫ" source="HIGH-NA EUV · ОЦЕНКИ АНАЛИТИКОВ, 2025-2026" />
      <GlassChip at={at("40")} x={96} y={560} text="40 КОНТЕЙНЕРОВ" size={34} />
      <GlassChip at={at("трёх")} x={96} y={660} text="3 ГРУЗОВЫХ BOEING 747" size={34} hero />
      <MediaCard src={I + "asml-containers.jpg"} at={at("40")} x={1180} y={600} w={560} h={300} tilt={6} label="КОНТЕЙНЕРЫ ASML" meta="ТАЙНАНЬ, ТАЙВАНЬ" />
    </BeatShell>
  );
};

export const TaiwanScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("taiwan");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-taiwan.mp4"} drift={["TSMC", "3 НМ", "2 НМ", "ТАЙВАНЬ", "90%"]}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}>
        <Kinetic text="ОДИН ОСТРОВ" size={88} delay={4} per={3} mode="snap" hero={[0]} />
      </div>
      <StatPlate at={at("почти")} x={96} y={330} w={680} value=">90%" caption="САМЫХ ПЕРЕДОВЫХ ЧИПОВ МИРА · BCG / SIA" />
      <MediaCard src={I + "tsmc-fab.jpg"} at={8} x={1060} y={150} w={760} h={440} tilt={-6} label="ФАБРИКА TSMC" meta="СИНЬЧЖУ, ТАЙВАНЬ" />
      <LogoPlate at={at("компания")} src={L + "tsmc.png"} x={1180} y={640} w={340} caption="TSMC" />
      <GlassChip at={at("тайвань") + 4} x={96} y={600} text="ТАЙВАНЬ" icon={L + "flag-tw.png"} size={34} />
    </BeatShell>
  );
};

export const WaferScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("wafer");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-chip.mp4"}>
      <Fig x={96} y={150} at={at("30")} value="$30 000" size={150} kicker="ОДНА ПЛАСТИНА 2 НМ" source="TSMC N2 · TECHNODE, 10.2025" roll={{ from: 0, to: 30000, prefix: "$" }} />
      <GlassChip at={at("машина")} x={96} y={500} text="= НОВЫЙ АВТОМОБИЛЬ" size={34} hero />
      <StatPlate at={at("3")} x={96} y={620} w={560} value="3 МЕСЯЦА" caption="ОТ ЧИСТОЙ ПЛАСТИНЫ ДО ЧИПОВ · 700+ ОПЕРАЦИЙ" />
      <MediaCard src={V + "v-wafer.mp4"} at={6} x={1060} y={150} w={760} h={460} tilt={-6} label="ПЛАСТИНА С ЧИПАМИ" meta="СОТНИ КРИСТАЛЛОВ" startFrom={3} />
      <MediaCard src={V + "v-cleanroom.mp4"} at={at("3")} x={1320} y={560} w={500} h={300} tilt={7} label="ЧИСТАЯ КОМНАТА" meta="TSMC" startFrom={4} />
    </BeatShell>
  );
};

export const MemoryScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("memory");
  const sold = at("3");
  return (
    <BeatShell series={series} bar={bar(1, episode)} bg={V + "v-chip.mp4"} startFrom={3} drift={["HBM", "DRAM", "2029", "SOLD OUT"]}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 860, zIndex: 9 }}>
        <Kinetic text="ПАМЯТЬ HBM" size={100} delay={4} per={3} mode="snap" hero={[1]} />
        {frame >= at("пробка") && <div style={{ marginTop: 20 }}><Stamp tone="bad" size={84} rotate={-3} delay={at("пробка")}>НОВАЯ ПРОБКА</Stamp></div>}
      </div>
      <MediaCard src={I + "hbm.jpg"} at={at("память")} x={1080} y={140} w={740} h={420} tilt={-6} label="МОДУЛЬ ПАМЯТИ" meta="DRAM" />
      <LogoPlate at={at("корее")} src={L + "sk-hynix.png"} x={1160} y={630} w={380} caption="ЮЖНАЯ КОРЕЯ" />
      <GlassChip at={at("корее") + 5} x={1580} y={650} text="KR" icon={L + "flag-kr.png"} />
      <Fig x={96} y={520} at={sold} value="ДО 2029" size={140} bad kicker="ПАМЯТЬ ПРОДАНА НА 3 ГОДА ВПЕРЁД" source="SK HYNIX, 28.10.2026" />
      <Ring at={sold + 4} x={70} y={590} w={680} h={190} bad />
      {void colors}
    </BeatShell>
  );
};
