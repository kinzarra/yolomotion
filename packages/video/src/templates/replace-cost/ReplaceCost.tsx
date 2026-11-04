import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { rcColors, rcPalette } from "./palette";
import { ReplaceCostProps } from "./schema";
import { CUTS, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { CutZoom, FlashCut } from "./ui";
import { HookScene } from "./scenes/HookScene";
import { PriceScene } from "./scenes/PriceScene";
import { ListScene } from "./scenes/ListScene";
import { CashierScene } from "./scenes/CashierScene";
import { OperatorScene } from "./scenes/OperatorScene";
import { TwistScene } from "./scenes/TwistScene";
import { BackofficeScene } from "./scenes/BackofficeScene";
import { GrefScene } from "./scenes/GrefScene";
import { CourierScene } from "./scenes/CourierScene";
import { DevScene } from "./scenes/DevScene";
import { WefScene } from "./scenes/WefScene";
import { FormulaScene } from "./scenes/FormulaScene";
import { CtaScene } from "./scenes/CtaScene";

export const ReplaceCost: React.FC<ReplaceCostProps> = ({ series, episode, question, credits, sources, face }) => {
  const brand = { series, episode };
  const beats: [keyof typeof SCENES, string, React.ReactNode][] = [
    ["hook", "01 hook", <HookScene key="a" face={face} />],
    ["price", "02 price", <PriceScene key="b" {...brand} />],
    ["list", "03 list", <ListScene key="c" {...brand} />],
    ["cashier", "04 cashier", <CashierScene key="d" {...brand} />],
    ["operator", "05 operator", <OperatorScene key="e" {...brand} />],
    ["twist", "06 twist", <TwistScene key="f" {...brand} face={face} />],
    ["backoffice", "07 backoffice", <BackofficeScene key="g" {...brand} />],
    ["gref", "08 gref", <GrefScene key="h" {...brand} />],
    ["courier", "09 courier", <CourierScene key="i" {...brand} />],
    ["dev", "10 dev", <DevScene key="j" {...brand} />],
    ["wef", "11 wef", <WefScene key="k" {...brand} />],
    ["formula", "12 formula", <FormulaScene key="l" {...brand} />],
    ["cta", "13 cta", <CtaScene key="m" {...brand} face={face} question={question} credits={credits} sources={sources} />],
  ];
  return (
    <Reel
      palette={rcPalette}
      voiceoverDir="replace-cost"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: rcPalette.primary,
        heroColor: rcPalette.primary,
        badColor: rcColors.bad,
        fontFamily: theme.fonts.wide,
        fontWeight: 800,
        fontSize: 40,
        maxWidth: 1400,
        sideMargin: 160,
        top: 930,
      }}
    >
      {beats.map(([id, name, node]) => (
        <Scene key={id} spec={SCENES[id]} name={name}>
          <CutZoom>{node}</CutZoom>
        </Scene>
      ))}
      <FlashCut cuts={CUTS} />
    </Reel>
  );
};
