import React from "react";
import { Reel, Scene } from "../../reel";
import { bpmColors, bpmPalette } from "./palette";
import { BrandsPayingMoreProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { MoneyScene } from "./scenes/MoneyScene";
import { TrustScene } from "./scenes/TrustScene";
import { BacklashScene } from "./scenes/BacklashScene";
import { EconomicsScene } from "./scenes/EconomicsScene";
import { FitScene } from "./scenes/FitScene";
import { ShiftScene } from "./scenes/ShiftScene";
import { MeasureScene } from "./scenes/MeasureScene";
import { YolocoScene } from "./scenes/YolocoScene";

export const BrandsPayingMore: React.FC<BrandsPayingMoreProps> = ({
  kicker,
  postHandle,
  ctaLabel,
  url,
}) => (
  <Reel
    palette={bpmPalette}
    voiceoverDir="brands-paying-more"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    // The karaoke highlight is white, not the accent: only the scenario's
    // keywords ("+WORD") take the vermilion, so a frame never carries two.
    captions={{
      activeColor: bpmColors.white,
      heroColor: bpmPalette.primary,
      fontSize: 56,
      maxWidth: 900,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene kicker={kicker} />
    </Scene>
    <Scene spec={SCENES.money} name="02 money">
      <MoneyScene />
    </Scene>
    <Scene spec={SCENES.trust} name="03 trust">
      <TrustScene />
    </Scene>
    <Scene spec={SCENES.backlash} name="04 backlash">
      <BacklashScene handle={postHandle} />
    </Scene>
    <Scene spec={SCENES.economics} name="05 economics">
      <EconomicsScene />
    </Scene>
    <Scene spec={SCENES.fit} name="06 fit">
      <FitScene />
    </Scene>
    <Scene spec={SCENES.shift} name="07 shift">
      <ShiftScene />
    </Scene>
    <Scene spec={SCENES.measure} name="08 measure">
      <MeasureScene />
    </Scene>
    <Scene spec={SCENES.yoloco} name="09 yoloco">
      <YolocoScene ctaLabel={ctaLabel} url={url} />
    </Scene>
  </Reel>
);
