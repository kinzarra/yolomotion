// «Как добывают интеллект» (ДЕНЬГИ · ПРОСТО, ВЫПУСК 09): the long-format kit on
// a 1920×1080 stage. Captions in the bottom band, type in the left half,
// evidence (clips, photos, logos, figures) on the right; music bed on top.
import React from "react";
import { Reel, Scene } from "../../reel";
import { imColors as colors, imPalette as palette } from "./palette";
import { IntellectMineProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { PartCard, V, WIDE } from "./ui";
import { SoundLayer } from "./sound";
import { HookScene, PromiseScene } from "./scenes/Open";
import { AsmlScene, EuvScene, HurricaneScene, MemoryScene, SandScene, SiliconScene, TaiwanScene, WaferScene } from "./scenes/Part1";
import { CapexScene, ColossusScene, DcScene, GpuScene, GwScene, NvidiaScene, RackScene } from "./scenes/Part2";
import { BillsScene, CheapScene, DealScene, IeaScene, LimitsScene, MeltingScene, NuclearScene, PowerScene, QueryScene, QuotaScene, RentScene, ScaleScene, TokenScene } from "./scenes/Part3";
import { CREDITS, ChainScene, FinalScene, SubScene } from "./scenes/End";

export const IntellectMine: React.FC<IntellectMineProps> = ({ series, episode }) => {
  const p = { series, episode };
  return (
    <Reel
      palette={palette}
      voiceoverDir="intellect-mine"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      captions={{ top: 950, fontSize: 42, maxWidth: 1500, sideMargin: 200, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}`, letterSpacing: "-0.01em" }}
    >
      <SoundLayer />
      <Scene spec={SCENES.hook} name="01 hook"><HookScene {...p} /></Scene>
      <Scene spec={SCENES.promise} name="02 promise"><PromiseScene {...p} /></Scene>
      <Scene spec={SCENES.card1} name="P1"><PartCard n="01" title="ПЕСОК И ЧИП" kicker="КВАРЦ · КРЕМНИЙ · СВЕТ · ТАЙВАНЬ" bg={V + "v-sand.mp4"} /></Scene>
      <Scene spec={SCENES.sand} name="03 sand"><SandScene {...p} /></Scene>
      <Scene spec={SCENES.hurricane} name="04 hurricane"><HurricaneScene {...p} /></Scene>
      <Scene spec={SCENES.silicon} name="05 silicon"><SiliconScene {...p} /></Scene>
      <Scene spec={SCENES.asml} name="06 asml"><AsmlScene {...p} /></Scene>
      <Scene spec={SCENES.euv} name="07 euv"><EuvScene {...p} /></Scene>
      <Scene spec={SCENES.taiwan} name="08 taiwan"><TaiwanScene {...p} /></Scene>
      <Scene spec={SCENES.wafer} name="09 wafer"><WaferScene {...p} /></Scene>
      <Scene spec={SCENES.memory} name="10 memory"><MemoryScene {...p} /></Scene>
      <Scene spec={SCENES.card2} name="P2"><PartCard n="02" title="ВИДЕОКАРТА" kicker="NVIDIA · ШКАФ ЗА МИЛЛИОНЫ" bg={V + "v-gpu.mp4"} /></Scene>
      <Scene spec={SCENES.gpu} name="11 gpu"><GpuScene {...p} /></Scene>
      <Scene spec={SCENES.rack} name="12 rack"><RackScene {...p} /></Scene>
      <Scene spec={SCENES.nvidia} name="13 nvidia"><NvidiaScene {...p} /></Scene>
      <Scene spec={SCENES.card3} name="P3"><PartCard n="03" title="ДАТА-ЦЕНТР" kicker="ШАХТА ДЛЯ ИНТЕЛЛЕКТА" bg={V + "v-dc-aisle.mp4"} /></Scene>
      <Scene spec={SCENES.dc} name="14 dc"><DcScene {...p} /></Scene>
      <Scene spec={SCENES.colossus} name="15 colossus"><ColossusScene {...p} /></Scene>
      <Scene spec={SCENES.gw} name="16 gw"><GwScene {...p} /></Scene>
      <Scene spec={SCENES.capex} name="17 capex"><CapexScene {...p} /></Scene>
      <Scene spec={SCENES.card4} name="P4"><PartCard n="04" title="ЭНЕРГИЯ" kicker="ЭЛЕКТРИЧЕСТВО · АТОМ · СЧЕТА" bg={V + "v-powerlines.mp4"} /></Scene>
      <Scene spec={SCENES.power} name="18 power"><PowerScene {...p} /></Scene>
      <Scene spec={SCENES.iea} name="19 iea"><IeaScene {...p} /></Scene>
      <Scene spec={SCENES.nuclear} name="20 nuclear"><NuclearScene {...p} /></Scene>
      <Scene spec={SCENES.bills} name="21 bills"><BillsScene {...p} /></Scene>
      <Scene spec={SCENES.card5} name="P5"><PartCard n="05" title="ТОКЕН" kicker="ЧТО ВЫХОДИТ С КОНВЕЙЕРА" bg={V + "v-data.mp4"} /></Scene>
      <Scene spec={SCENES.token} name="22 token"><TokenScene {...p} /></Scene>
      <Scene spec={SCENES.query} name="23 query"><QueryScene {...p} /></Scene>
      <Scene spec={SCENES.scale} name="24 scale"><ScaleScene {...p} /></Scene>
      <Scene spec={SCENES.cheap} name="25 cheap"><CheapScene {...p} /></Scene>
      <Scene spec={SCENES.card6} name="P6"><PartCard n="06" title="КВОТЫ" kicker="ПОЧЕМУ У ТЕБЯ ЛИМИТ" bg={V + "v-queue.mp4"} /></Scene>
      <Scene spec={SCENES.limits} name="26 limits"><LimitsScene {...p} /></Scene>
      <Scene spec={SCENES.melting} name="27 melting"><MeltingScene {...p} /></Scene>
      <Scene spec={SCENES.deal} name="28 deal"><DealScene {...p} /></Scene>
      <Scene spec={SCENES.quota} name="29 quota"><QuotaScene {...p} /></Scene>
      <Scene spec={SCENES.rent} name="30 rent"><RentScene {...p} /></Scene>
      <Scene spec={SCENES.chain} name="31 chain"><ChainScene {...p} /></Scene>
      <Scene spec={SCENES.final} name="32 final"><FinalScene {...p} /></Scene>
      <Scene spec={SCENES.sub} name="33 subscribe"><SubScene {...p} credits={CREDITS} /></Scene>
    </Reel>
  );
};
