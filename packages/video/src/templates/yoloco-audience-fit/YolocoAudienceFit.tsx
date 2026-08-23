import React from "react";
import { Reel, Scene } from "../../reel";
import { yoPalette } from "./palette";
import { YolocoAudienceFitProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { CreatorScene } from "./scenes/CreatorScene";
import { VanityScene } from "./scenes/VanityScene";
import { PillarsScene } from "./scenes/PillarsScene";
import { VersusScene } from "./scenes/VersusScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { LogoScene } from "./scenes/LogoScene";

export const YolocoAudienceFit: React.FC<YolocoAudienceFitProps> = ({
  handle,
  niche,
  tagline,
  cta,
}) => (
  // No karaoke captions in this one — the scenes carry their own type.
  <Reel
    palette={yoPalette}
    voiceoverDir="yoloco-audience-fit"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={false}
    gradeOpacity={0.14}
  >
    {/* Scenes — each one owns its five-layer shell. */}
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.creator} name="02 creator">
      <CreatorScene handle={handle} niche={niche} />
    </Scene>
    <Scene spec={SCENES.vanity} name="03 vanity">
      <VanityScene />
    </Scene>
    <Scene spec={SCENES.pillars} name="04 pillars">
      <PillarsScene />
    </Scene>
    <Scene spec={SCENES.versus} name="05 versus">
      <VersusScene />
    </Scene>
    <Scene spec={SCENES.dashboard} name="06 dashboard">
      <DashboardScene />
    </Scene>
    <Scene spec={SCENES.logo} name="07 logo">
      <LogoScene tagline={tagline} cta={cta} />
    </Scene>
  </Reel>
);
