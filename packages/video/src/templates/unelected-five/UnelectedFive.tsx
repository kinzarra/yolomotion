import React from "react";
import { Reel, Scene } from "../../reel";
import { palette } from "./palette";
import { UnelectedFiveProps } from "./schema";
import { SCENES, VOICEOVER } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { PlaceScene } from "./scenes/PlaceScene";
import { FinalScene } from "./scenes/FinalScene";
import { PLACE1, PLACE2, PLACE3, PLACE4, PLACE5 } from "./places";

export const UnelectedFive: React.FC<UnelectedFiveProps> = ({ series, episode }) => (
  <Reel palette={palette} voiceoverDir="unelected-five" voiceover={VOICEOVER} voRate={1} captions={false} gradeOpacity={0.08}>
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene series={series} episode={episode} />
    </Scene>
    <Scene spec={SCENES.place5} name="02 place 5">
      <PlaceScene place={PLACE5} />
    </Scene>
    <Scene spec={SCENES.place4} name="03 place 4">
      <PlaceScene place={PLACE4} />
    </Scene>
    <Scene spec={SCENES.place3} name="04 place 3">
      <PlaceScene place={PLACE3} />
    </Scene>
    <Scene spec={SCENES.place2} name="05 place 2">
      <PlaceScene place={PLACE2} />
    </Scene>
    <Scene spec={SCENES.place1} name="06 place 1">
      <PlaceScene place={PLACE1} />
    </Scene>
    <Scene spec={SCENES.final} name="07 final">
      <FinalScene />
    </Scene>
  </Reel>
);
