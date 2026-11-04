import React from "react";
import { Reel, Scene } from "../../reel";
import { palette } from "./palette";
import { Salary2013Props } from "./schema";
import { SCENES, VOICEOVER } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { YearsScene } from "./scenes/YearsScene";

export const Salary2013: React.FC<Salary2013Props> = ({ series, episode }) => (
  <Reel
    palette={palette}
    voiceoverDir="salary-2013"
    voiceover={VOICEOVER}
    voRate={1}
    captions={false}
    gradeOpacity={0.08}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.years} name="02 years">
      <YearsScene series={series} episode={episode} />
    </Scene>
  </Reel>
);
