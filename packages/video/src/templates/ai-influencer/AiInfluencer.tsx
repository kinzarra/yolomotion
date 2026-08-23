import React from "react";
import { Reel, Scene } from "../../reel";
import { aiPalette } from "./palette";
import { AiInfluencerProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { MorphScene } from "./scenes/MorphScene";
import { SplitScene } from "./scenes/SplitScene";
import { TrustScene } from "./scenes/TrustScene";
import { ScaleScene } from "./scenes/ScaleScene";
import { FinaleScene } from "./scenes/FinaleScene";

export const AiInfluencer: React.FC<AiInfluencerProps> = ({
  handle,
  followers,
  ctaLabel,
}) => (
  <Reel
    palette={aiPalette}
    voiceoverDir="ai-influencer"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    // Red is transient here, so it never fights the scene's own red element
    // for more than a beat.
    captions={{ activeColor: aiPalette.primary }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene handle={handle} followers={followers} />
    </Scene>
    <Scene spec={SCENES.morph} name="02 morph">
      <MorphScene />
    </Scene>
    <Scene spec={SCENES.split} name="03 split">
      <SplitScene />
    </Scene>
    <Scene spec={SCENES.trust} name="04 trust">
      <TrustScene />
    </Scene>
    <Scene spec={SCENES.scale} name="05 scale">
      <ScaleScene />
    </Scene>
    <Scene spec={SCENES.finale} name="06 finale">
      <FinaleScene ctaLabel={ctaLabel} />
    </Scene>
  </Reel>
);
