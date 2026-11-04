// Parts 2 and 3: the card, the 72-chip cabinet and what it costs, the money
// NVIDIA makes; then the data center, Colossus, the gigawatt, Big Tech capex.
import React from "react";
import { useCurrentFrame } from "remotion";
import { BeatShell, Bars, GlassChip, I, Kinetic, L, Label, LogoPlate, MediaCard, Stamp, StatPlate, V, useSec } from "../ui";
import { SceneKey, cue } from "../timeline";
import { Fig, bar } from "./common";

type P = { series: string; episode: string };
const useCue = (k: SceneKey) => {
  const s = useSec();
  return (w: string, n = 0) => s(cue(k, w, n));
};

export const GpuScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("gpu");
  return (
    <BeatShell series={series} bar={bar(2, episode)} bg={V + "v-gpu.mp4"} drift={["GB300", "NVL72", "72 GPU", "HBM3E", "$"]}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 860, zIndex: 9 }}>
        <Kinetic text="ВИДЕОКАРТА" size={104} delay={4} per={3} mode="snap" hero={[0]} />
        {frame >= at("игровая") && <div style={{ marginTop: 14 }}><Stamp tone="bad" size={70} rotate={-3} delay={at("игровая")}>НЕ ИГРОВАЯ</Stamp></div>}
      </div>
      <MediaCard src={I + "nvidia-rack.jpg"} at={at("72")} x={1120} y={140} w={700} h={560} tilt={-6} label="ШКАФ NVIDIA" meta="72 ЧИПА · ЖИДКОСТНОЕ ОХЛАЖДЕНИЕ" />
      <StatPlate at={at("72")} x={96} y={420} w={460} value="72 ЧИПА" caption="В ОДНОМ ШКАФУ · GB300 NVL72" />
      <Fig x={96} y={620} at={at("4")} value="$4-6 МЛН" size={120} kicker="ЦЕНА ОДНОГО ШКАФА" source="MORGAN STANLEY, СМИ · 2026" />
      <LogoPlate at={at("nvidia")} src={L + "nvidia.png"} x={1300} y={740} w={330} />
    </BeatShell>
  );
};

export const RackScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("rack");
  return (
    <BeatShell series={series} bar={bar(2, episode)} bg={V + "v-rack.mp4"}>
      <Fig x={96} y={160} at={at("100")} value="100 ДОМОВ" size={130} kicker="СТОЛЬКО ЖЕ ЭЛЕКТРИЧЕСТВА" source="ОДИН ШКАФ: 120-140 КВТ · ДОМ В США: ≈1,2 КВТ" />
      <MediaCard src={V + "v-cooling.mp4"} at={6} x={1100} y={140} w={720} h={400} tilt={-6} label="ЖИДКОСТНОЕ ОХЛАЖДЕНИЕ" meta="ТРУБЫ, НАСОСЫ, ТЕПЛООБМЕННИКИ" />
      <MediaCard src={I + "tesla-y.jpg"} at={at("тесла")} x={1200} y={570} w={520} h={300} tilt={6} label="TESLA MODEL Y" meta="≈ $50 000" />
      <StatPlate at={at("охлаждение")} x={96} y={560} w={620} value="$50 000" caption="ОХЛАЖДЕНИЕ ОДНОГО ШКАФА · TECHRADAR" />
    </BeatShell>
  );
};

export const NvidiaScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("nvidia");
  return (
    <BeatShell series={series} bar={bar(2, episode)} bg={V + "v-money.mp4"} drift={["$96,2 МЛРД", "NVDA", "+106%", "$5 ТРЛН"]}>
      <Fig x={96} y={160} at={at("миллиарда")} value="$1 МЛРД" size={170} kicker="NVIDIA ЗАРАБАТЫВАЕТ" source="В ДЕНЬ · $96,2 МЛРД ЗА КВАРТАЛ, NVIDIA 26.08.2026" />
      <MediaCard src={I + "jensen.jpg"} at={6} x={1200} y={140} w={560} h={560} tilt={6} label="ДЖЕНСЕН ХУАНГ" meta="ОСНОВАТЕЛЬ NVIDIA" />
      <StatPlate at={at("день")} x={96} y={560} w={560} value="≈ $5 ТРЛН" caption="СТОИМОСТЬ NVIDIA · НОЯБРЬ 2026" />
      <LogoPlate at={at("nvidia")} src={L + "nvidia.png"} x={760} y={600} w={300} />
    </BeatShell>
  );
};

export const DcScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const at = useCue("dc");
  const mine = at("шахта");
  return (
    <BeatShell series={series} bar={bar(3, episode)} bg={V + "v-dc-aisle.mp4"} drift={["GPU", "МВТ", "ГВТ", "СТОЙКА", "ОХЛАЖДЕНИЕ"]}>
      <div style={{ position: "absolute", left: 96, top: 150, width: 880, zIndex: 9 }}>
        <Label at={4} size={26}>СОТНИ ТЫСЯЧ КАРТ · ОДНО ЗДАНИЕ</Label>
        <div style={{ marginTop: 20 }}><Kinetic text="ДАТА-ЦЕНТР" size={120} delay={at("дата-центр")} per={3} mode="snap" hero={[0]} /></div>
        {frame >= mine && <div style={{ marginTop: 20 }}><Stamp tone="hero" size={64} rotate={-2} delay={mine}>ШАХТА ДЛЯ ИНТЕЛЛЕКТА</Stamp></div>}
      </div>
      <MediaCard src={I + "datacenter.jpg"} at={6} x={1100} y={140} w={720} h={420} tilt={-6} label="ДАТА-ЦЕНТР" meta="ИЗНУТРИ" />
      <MediaCard src={V + "v-rack.mp4"} at={at("здание")} x={1240} y={590} w={540} h={290} tilt={6} label="СТОЙКИ" meta="24/7" startFrom={2} />
    </BeatShell>
  );
};

export const ColossusScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("colossus");
  return (
    <BeatShell series={series} bar={bar(3, episode)} bg={V + "v-dc-aerial.mp4"}>
      <MediaCard src={I + "colossus.jpg"} at={4} x={1040} y={140} w={780} h={440} tilt={-5} label="XAI COLOSSUS" meta="МЕМФИС, ТЕННЕССИ" />
      <MediaCard src={I + "musk.jpg"} at={at("маска")} x={1380} y={610} w={300} h={270} tilt={7} label="ИЛОН МАСК" meta="XAI" />
      <GlassChip at={at("мемфисе")} x={1060} y={640} text="МЕМФИС, США" icon={L + "flag-us.png"} />
      <Fig x={96} y={200} at={at("200")} value="200 000+" size={170} kicker="ВИДЕОКАРТ ПОД ОДНОЙ КРЫШЕЙ" source="COLOSSUS 1: >220 000 GPU, >300 МВТ · ANTHROPIC, 05.2026" roll={{ from: 0, to: 220000 }} />
    </BeatShell>
  );
};

export const GwScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("gw");
  return (
    <BeatShell series={series} bar={bar(3, episode)} bg={V + "v-construction.mp4"}>
      <Fig x={96} y={160} at={at("гигаваттах")} value="1 ГВТ" size={170} kicker="ЗАВОДЫ МЕРЯЮТ В ГИГАВАТТАХ" burst={false} />
      <Fig x={96} y={480} at={at("50")} value="≈ $50 МЛРД" size={130} kicker="ЦЕНА ОДНОГО ГИГАВАТТА" source="ДЖЕНСЕН ХУАНГ, 2025: $50-60 МЛРД" />
      <MediaCard src={V + "v-construction.mp4"} at={8} x={1120} y={150} w={700} h={400} tilt={-6} label="СТРОЙКА" meta="ДАТА-ЦЕНТР" startFrom={3} />
      <GlassChip at={at("гигаватт")} x={1120} y={620} text="1 ГВТ ≈ 800 000 ДОМОВ США" size={30} />
    </BeatShell>
  );
};

export const CapexScene: React.FC<P> = ({ series, episode }) => {
  const at = useCue("capex");
  const bars = at("amazon");
  return (
    <BeatShell series={series} bar={bar(3, episode)} bg={V + "v-dc-aerial.mp4"} startFrom={3} dim={0.8}>
      <Bars at={bars} x={1000} y={150} w={820} h={520} every={8} title="КАПЗАТРАТЫ 2026, $ МЛРД" source="CNBC, 29.10.2026 · ОТЧЁТЫ КОМПАНИЙ" items={[
        { label: "AMAZON", value: 220, text: "220" },
        { label: "GOOGLE", value: 200, text: "~200" },
        { label: "MICROSOFT", value: 170, text: "~170" },
        { label: "META", value: 140, text: "~140" },
      ]} />
      <Fig x={96} y={170} at={at("700")} value="$700+ МЛРД" size={140} kicker="ЧЕТЫРЕ КОМПАНИИ · ОДИН 2026 ГОД" />
      <StatPlate at={at("швеции")} x={96} y={520} w={700} value="> ВВП ШВЕЦИИ" caption="≈ $0,6 ТРЛН · МВФ" />
      <GlassChip at={at("швеции") + 6} x={96} y={760} text="ШВЕЦИЯ" icon={L + "flag-se.png"} />
    </BeatShell>
  );
};
