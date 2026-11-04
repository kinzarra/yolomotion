import React from "react";
import { Reel, Scene } from "../../reel";
import { palette } from "./palette";
import { AiMoneyCircleProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { CoverScene } from "./scenes/CoverScene";
import { CircleScene } from "./scenes/CircleScene";
import { MapScene } from "./scenes/MapScene";
import { FinalScene } from "./scenes/FinalScene";
import { BEATS } from "./map";

export const AiMoneyCircle: React.FC<AiMoneyCircleProps> = ({ series, episode }) => (
  <Reel palette={palette} voiceoverDir="ai-money-circle" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.08}>
    <Scene spec={SCENES.cover} name="01 cover">
      <CoverScene series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.circle} name="02 the circle">
      <CircleScene series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.openaiIn} name="03 who funded OpenAI">
      <MapScene beat={BEATS.openaiIn} series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.openaiOut} name="04 whom OpenAI pays">
      <MapScene beat={BEATS.openaiOut} series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.anthropic} name="05 Anthropic">
      <MapScene beat={BEATS.anthropic} series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.nvidia} name="06 Nvidia">
      <MapScene beat={BEATS.nvidia} series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.weak} name="07 where it is thin">
      <MapScene beat={BEATS.weak} series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.final} name="08 final">
      <FinalScene series={series} episode={episode} />
    </Scene>
  </Reel>
);
