import React from "react";
import { Reel, Scene } from "../../reel";
import { fxPalette } from "./palette";
import { FedexBlackjackProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { Story } from "./Story";

export const FedexBlackjack: React.FC<FedexBlackjackProps> = () => (
  <Reel palette={fxPalette} voiceoverDir="fedex-blackjack" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.05}>
    <Scene spec={SCENES.main} name="01 story"><Story /></Scene>
  </Reel>
);
