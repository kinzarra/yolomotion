import React from "react";
import { Reel, Scene } from "../../reel";
import { palette } from "./palette";
import { TeslaRoadsterProps } from "./schema";
import { SCENES, VOICEOVER } from "./timeline";
import { HookScene } from "./scenes/HookScene";

export const TeslaRoadsterEn: React.FC<TeslaRoadsterProps> = ({ series, episode }) => (
  <Reel
    palette={palette}
    voiceoverDir="tesla-roadster-en"
    voiceover={VOICEOVER}
    voRate={1}
    captions={false}
    gradeOpacity={0.08}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene series={series} episode={episode} />
    </Scene>
  </Reel>
);
