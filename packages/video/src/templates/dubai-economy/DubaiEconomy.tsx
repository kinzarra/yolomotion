import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { deColors, dePalette } from "./palette";
import { DubaiEconomyProps } from "./schema";
import { CUTS, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { CutZoom, FlashCut } from "./ui";
import { HookScene } from "./scenes/HookScene";
import { TurnScene } from "./scenes/TurnScene";
import { OilScene } from "./scenes/OilScene";
import { PortScene } from "./scenes/PortScene";
import { MapScene } from "./scenes/MapScene";
import { AirportScene } from "./scenes/AirportScene";
import { TaxScene } from "./scenes/TaxScene";
import { ModelScene } from "./scenes/ModelScene";
import { CrisisScene } from "./scenes/CrisisScene";
import { RescueScene } from "./scenes/RescueScene";
import { AnswerScene } from "./scenes/AnswerScene";
import { CtaScene } from "./scenes/CtaScene";

export const DubaiEconomy: React.FC<DubaiEconomyProps> = ({ series, episode, question, credits }) => {
  const brand = { series, episode };
  const beats: [keyof typeof SCENES, string, React.ReactNode][] = [
    ["hook", "01 hook", <HookScene key="h" />],
    ["turn", "02 turn", <TurnScene key="t" {...brand} />],
    ["oil", "03 oil", <OilScene key="o" {...brand} />],
    ["port", "04 port", <PortScene key="p" {...brand} />],
    ["map", "05 map", <MapScene key="m" {...brand} />],
    ["airport", "06 airport", <AirportScene key="a" {...brand} />],
    ["tax", "07 tax", <TaxScene key="x" {...brand} />],
    ["model", "08 model", <ModelScene key="d" {...brand} question={question} />],
    ["crisis", "09 crisis", <CrisisScene key="c" {...brand} />],
    ["rescue", "10 rescue", <RescueScene key="r" {...brand} />],
    ["answer", "11 answer", <AnswerScene key="w" {...brand} />],
    ["cta", "12 cta", <CtaScene key="z" {...brand} question={question} credits={credits} />],
  ];
  return (
    <Reel
      palette={dePalette}
      voiceoverDir="dubai-economy"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: dePalette.primary,
        heroColor: dePalette.primary,
        badColor: deColors.bad,
        // Unbounded is wide: smaller size, two or three words a page.
        fontFamily: theme.fonts.wide,
        fontWeight: 800,
        fontSize: 44,
        maxWidth: 920,
        top: 1416,
      }}
    >
      {beats.map(([id, name, node]) => (
        <Scene key={id} spec={SCENES[id]} name={name}>
          <CutZoom>{node}</CutZoom>
        </Scene>
      ))}
      {/* Above every scene, below the captions: the flash on each boundary. */}
      <FlashCut cuts={CUTS} />
    </Reel>
  );
};
