import React from "react";
import { Reel, Scene } from "../../reel";
import { bhPalette } from "./palette";
import { BinanceHackProps } from "./schema";
import { DURATIONS } from "./durations";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { Story } from "./Story";

// Until the voiceover exists the track stays empty, so stills render silent.
const voiced = Object.keys(DURATIONS).length > 0;

export const BinanceHack: React.FC<BinanceHackProps> = () => (
  <Reel palette={bhPalette} voiceoverDir="binance-hack" voiceover={voiced ? VOICEOVER : []} voRate={VO_RATE} captions={false} gradeOpacity={0.04}>
    <Scene spec={SCENES.main} name="01 case"><Story /></Scene>
  </Reel>
);
