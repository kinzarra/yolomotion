import React from "react";
import { Reel, Scene } from "../../reel";
import { ovColors, ovPalette } from "./palette";
import { AudienceOverlapProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { OverlapScene } from "./scenes/OverlapScene";
import { CounterScene } from "./scenes/CounterScene";
import { InvoiceScene } from "./scenes/InvoiceScene";
import { YolocoScene } from "./scenes/YolocoScene";
import { FinaleScene } from "./scenes/FinaleScene";

export const AudienceOverlap: React.FC<AudienceOverlapProps> = ({
  tagline,
  ctaLabel,
}) => (
  <Reel
    palette={ovPalette}
    voiceoverDir="audience-overlap"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{
      // The problem act highlights red; from the Yoloco scene on, green.
      activeColor: (now) => (now < SCENES.yoloco.from ? ovColors.bad : ovPalette.primary),
      heroColor: ovPalette.primary,
      badColor: ovColors.bad,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.overlap} name="02 overlap">
      <OverlapScene />
    </Scene>
    <Scene spec={SCENES.counter} name="03 counter">
      <CounterScene />
    </Scene>
    <Scene spec={SCENES.invoices} name="04 invoices">
      <InvoiceScene />
    </Scene>
    <Scene spec={SCENES.yoloco} name="05 yoloco">
      <YolocoScene />
    </Scene>
    <Scene spec={SCENES.finale} name="06 finale">
      <FinaleScene tagline={tagline} ctaLabel={ctaLabel} />
    </Scene>
  </Reel>
);
