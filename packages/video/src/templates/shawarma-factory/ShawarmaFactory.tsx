import React from "react";
import { Reel, Scene } from "../../reel";
import { sfPalette } from "./palette";
import { ShawarmaFactoryProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { StreetScene } from "./scenes/StreetScene";

export const ShawarmaFactory: React.FC<ShawarmaFactoryProps> = () => (
  <Reel palette={sfPalette} voiceoverDir="shawarma-factory" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.05}>
    <Scene spec={SCENES.main} name="01 street"><StreetScene /></Scene>
  </Reel>
);
