import React from "react";
import { Reel, Scene } from "../../reel";
import { CaptionsTrack } from "./CaptionsTrack";
import { gasPalette } from "./palette";
import { GasolineInflationProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { ShortageScene } from "./scenes/ShortageScene";
import { ProofScene } from "./scenes/ProofScene";
import { FirstHitScene } from "./scenes/FirstHitScene";
import { FieldScene } from "./scenes/FieldScene";
import { ChainScene } from "./scenes/ChainScene";
import { CostsScene } from "./scenes/CostsScene";
import { HiddenScene } from "./scenes/HiddenScene";
import { DefinitionScene } from "./scenes/DefinitionScene";
import { OutroScene } from "./scenes/OutroScene";

export const GasolineInflation: React.FC<GasolineInflationProps> = (props) => {
  const brand = { series: props.series, episode: props.episode };
  return (
    <Reel
      palette={gasPalette}
      voiceoverDir="gasoline-inflation"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      captions={false}
      gradeOpacity={0.07}
    >
      <Scene spec={SCENES.hook} name="01 hook"><HookScene /></Scene>
      <Scene spec={SCENES.shortage} name="02 shortage"><ShortageScene {...brand} /></Scene>
      <Scene spec={SCENES.proof} name="03 proof">
        <ProofScene {...brand} gasolineIncrease={props.gasolineIncrease} inflation={props.inflation} source={props.source} />
      </Scene>
      <Scene spec={SCENES.firstHit} name="04 first hit"><FirstHitScene {...brand} /></Scene>
      <Scene spec={SCENES.field} name="05 field"><FieldScene {...brand} /></Scene>
      <Scene spec={SCENES.chain} name="06 chain"><ChainScene {...brand} /></Scene>
      <Scene spec={SCENES.costs} name="07 costs"><CostsScene {...brand} /></Scene>
      <Scene spec={SCENES.hidden} name="08 hidden"><HiddenScene {...brand} /></Scene>
      <Scene spec={SCENES.definition} name="09 definition"><DefinitionScene {...brand} /></Scene>
      <Scene spec={SCENES.outro} name="10 outro"><OutroScene {...brand} /></Scene>
      <CaptionsTrack />
    </Reel>
  );
};
