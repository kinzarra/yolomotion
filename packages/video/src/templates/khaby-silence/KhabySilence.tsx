import React from "react";
import { Reel, Scene } from "../../reel";
import { ksColors, ksPalette } from "./palette";
import { KhabySilenceProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { JobScene } from "./scenes/JobScene";
import { NobodyScene } from "./scenes/NobodyScene";
import { ChaosScene } from "./scenes/ChaosScene";
import { OppositeScene } from "./scenes/OppositeScene";
import { SilenceScene } from "./scenes/SilenceScene";
import { BarrierScene } from "./scenes/BarrierScene";
import { GrowthScene } from "./scenes/GrowthScene";
import { LessonScene } from "./scenes/LessonScene";
import { YolocoScene } from "./scenes/YolocoScene";

export const KhabySilence: React.FC<KhabySilenceProps> = ({
  handle,
  heroPhoto,
  gesturePhoto,
  calmPhoto,
  stagePhoto,
  photoCredit,
  ctaLabel,
  url,
}) => (
  <Reel
    palette={ksPalette}
    voiceoverDir="khaby-silence"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    // The karaoke highlight is white, not the accent: only the scenario's
    // keywords ("+WORD") take the vermilion, so a frame never carries two.
    captions={{
      activeColor: ksColors.white,
      heroColor: ksPalette.primary,
      fontSize: 56,
      maxWidth: 900,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene photo={heroPhoto} />
    </Scene>
    <Scene spec={SCENES.job} name="02 job">
      <JobScene handle={handle} />
    </Scene>
    <Scene spec={SCENES.nobody} name="03 nobody">
      <NobodyScene />
    </Scene>
    <Scene spec={SCENES.chaos} name="04 chaos">
      <ChaosScene />
    </Scene>
    <Scene spec={SCENES.opposite} name="05 opposite">
      <OppositeScene photo={gesturePhoto} />
    </Scene>
    <Scene spec={SCENES.silence} name="06 silence">
      <SilenceScene photo={gesturePhoto} />
    </Scene>
    <Scene spec={SCENES.barrier} name="07 barrier">
      <BarrierScene photo={calmPhoto} />
    </Scene>
    <Scene spec={SCENES.growth} name="08 growth">
      <GrowthScene photo={stagePhoto} />
    </Scene>
    <Scene spec={SCENES.lesson} name="09 lesson">
      <LessonScene />
    </Scene>
    <Scene spec={SCENES.yoloco} name="10 yoloco">
      <YolocoScene ctaLabel={ctaLabel} url={url} credit={photoCredit} />
    </Scene>
  </Reel>
);
