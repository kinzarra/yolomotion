import React from "react";
import { Reel, Scene } from "../../reel";
import { fourWalletsPalette } from "./palette";
import { FourWalletsProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { MainScene } from "./scenes/MainScene";

// No voice, no captions: the chart carries everything.
export const FourWallets: React.FC<FourWalletsProps> = () => (
  <Reel palette={fourWalletsPalette} voiceoverDir="four-wallets" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.06}>
    <Scene spec={SCENES.main} name="01 main">
      <MainScene />
    </Scene>
  </Reel>
);
