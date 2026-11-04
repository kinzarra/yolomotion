// «Мы специально замедляем твой телефон»: the hook block and five parts on the
// dev-myth wide stage. Captions in the bottom band, type in the left half,
// evidence (real logos, photos, screenshots, 4K clips) on the right.
import React from "react";
import { Reel, Scene } from "../../reel";
import { psColors as colors, psPalette as palette } from "./palette";
import { PhoneSlowdownProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { WIDE } from "../dev-myth/ui";
import { PartCard } from "../dev-myth/scenes/Part2";
import { AteScene, Apps2012Scene, Bank537Scene, BankScene, BillScene, FaceScene, FacebookScene, FastScene, ProveScene, SameScene, WhereScene, Win11Scene, Win95Scene } from "./scenes/Part1";
import { AppleScene, EditorScene, FinesScene, GoogleScene, LawScene, OnceScene, TodayScene, TurnScene, WirthScene } from "./scenes/Part2";
import { ChoiceScene, FlagshipScene, FreeScene, InsideScene, LayersScene, QueueScene, SalaryScene, SuperappScene, TrackersScene } from "./scenes/Part3";
import { BatteryScene, CtaScene, CycleScene, DeleteScene, DiffScene, EuScene, FinalScene, MathScene, OnlyScene, PriceScene, QuestionScene, WebScene } from "./scenes/Part45";

export const PhoneSlowdown: React.FC<PhoneSlowdownProps> = ({ phonePrice, lifetimeLoss }) => (
  <Reel
    palette={palette}
    voiceoverDir="phone-slowdown"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{ top: 950, fontSize: 42, maxWidth: 1500, sideMargin: 200, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}`, letterSpacing: "-0.01em" }}
  >
    <Scene spec={SCENES["01-face"]} name="01 face"><FaceScene /></Scene>
    <Scene spec={SCENES["02-fast"]} name="02 fast"><FastScene /></Scene>
    <Scene spec={SCENES["03-bank"]} name="03 bank"><BankScene /></Scene>
    <Scene spec={SCENES["04-bill"]} name="04 bill"><BillScene loss={lifetimeLoss} /></Scene>
    <Scene spec={SCENES["05-prove"]} name="05 prove"><ProveScene /></Scene>
    <Scene spec={SCENES.p1} name="part 1"><PartCard n="01" title="КУДА ДЕЛАСЬ СКОРОСТЬ" /></Scene>
    <Scene spec={SCENES["06-win95"]} name="06 win95"><Win95Scene /></Scene>
    <Scene spec={SCENES["07-win11"]} name="07 win11"><Win11Scene /></Scene>
    <Scene spec={SCENES["08-same"]} name="08 same"><SameScene /></Scene>
    <Scene spec={SCENES["09-apps2012"]} name="09 apps 2012"><Apps2012Scene /></Scene>
    <Scene spec={SCENES["10-bank537"]} name="10 bank 537"><Bank537Scene /></Scene>
    <Scene spec={SCENES["11-facebook"]} name="11 facebook"><FacebookScene /></Scene>
    <Scene spec={SCENES["12-where"]} name="12 where"><WhereScene /></Scene>
    <Scene spec={SCENES["13-ate"]} name="13 ate"><AteScene /></Scene>
    <Scene spec={SCENES.p2} name="part 2"><PartCard n="02" title="ЗАКОН ВИРТА" /></Scene>
    <Scene spec={SCENES["14-wirth"]} name="14 wirth"><WirthScene /></Scene>
    <Scene spec={SCENES["15-law"]} name="15 law"><LawScene /></Scene>
    <Scene spec={SCENES["16-editor"]} name="16 editor"><EditorScene /></Scene>
    <Scene spec={SCENES["17-today"]} name="17 today"><TodayScene /></Scene>
    <Scene spec={SCENES["18-google"]} name="18 google"><GoogleScene /></Scene>
    <Scene spec={SCENES["19-once"]} name="19 once"><OnceScene /></Scene>
    <Scene spec={SCENES["20-apple"]} name="20 apple"><AppleScene /></Scene>
    <Scene spec={SCENES["21-fines"]} name="21 fines"><FinesScene /></Scene>
    <Scene spec={SCENES["22-turn"]} name="22 turn"><TurnScene /></Scene>
    <Scene spec={SCENES.p3} name="part 3"><PartCard n="03" title="ПОЧЕМУ ЭТО ВЫГОДНО" /></Scene>
    <Scene spec={SCENES["23-inside"]} name="23 inside"><InsideScene /></Scene>
    <Scene spec={SCENES["24-salary"]} name="24 salary"><SalaryScene /></Scene>
    <Scene spec={SCENES["25-choice"]} name="25 choice"><ChoiceScene /></Scene>
    <Scene spec={SCENES["26-free"]} name="26 free"><FreeScene /></Scene>
    <Scene spec={SCENES["27-superapp"]} name="27 superapp"><SuperappScene /></Scene>
    <Scene spec={SCENES["28-trackers"]} name="28 trackers"><TrackersScene /></Scene>
    <Scene spec={SCENES["29-layers"]} name="29 layers"><LayersScene /></Scene>
    <Scene spec={SCENES["30-queue"]} name="30 queue"><QueueScene /></Scene>
    <Scene spec={SCENES["31-flagship"]} name="31 flagship"><FlagshipScene /></Scene>
    <Scene spec={SCENES.p4} name="part 4"><PartCard n="04" title="СЧЁТ ЗА ЖЕЛЕЗО" /></Scene>
    <Scene spec={SCENES["32-price"]} name="32 price"><PriceScene price={phonePrice} /></Scene>
    <Scene spec={SCENES["33-cycle"]} name="33 cycle"><CycleScene /></Scene>
    <Scene spec={SCENES["34-eu"]} name="34 eu"><EuScene /></Scene>
    <Scene spec={SCENES["35-math"]} name="35 math"><MathScene price={phonePrice} /></Scene>
    <Scene spec={SCENES["36-diff"]} name="36 diff"><DiffScene loss={lifetimeLoss} /></Scene>
    <Scene spec={SCENES["37-only"]} name="37 only"><OnlyScene /></Scene>
    <Scene spec={SCENES["38-question"]} name="38 question"><QuestionScene /></Scene>
    <Scene spec={SCENES.p5} name="part 5"><PartCard n="05" title="КАК НЕ ПЛАТИТЬ" /></Scene>
    <Scene spec={SCENES["39-battery"]} name="39 battery"><BatteryScene /></Scene>
    <Scene spec={SCENES["40-delete"]} name="40 delete"><DeleteScene /></Scene>
    <Scene spec={SCENES["41-web"]} name="41 web"><WebScene /></Scene>
    <Scene spec={SCENES["42-final"]} name="42 final"><FinalScene /></Scene>
    <Scene spec={SCENES["43-cta"]} name="43 cta"><CtaScene /></Scene>
  </Reel>
);
