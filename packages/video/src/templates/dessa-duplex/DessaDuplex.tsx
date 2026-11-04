import React from "react";
import { Reel, Scene } from "../../reel";
import { ddPalette } from "./palette";
import { DessaDuplexProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { NoTextScene } from "./scenes/NoTextScene";
import { NoPauseScene } from "./scenes/NoPauseScene";
import { FeelsScene } from "./scenes/FeelsScene";
import { HardwareScene } from "./scenes/HardwareScene";
import { CtaScene } from "./scenes/CtaScene";

// Scenes carry their own type, so the shared captions stay off.
export const DessaDuplex: React.FC<DessaDuplexProps> = () => (
  <Reel palette={ddPalette} voiceoverDir="dessa-duplex" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.06}>
    <Scene spec={SCENES.hook} name="01 hook"><HookScene /></Scene>
    <Scene spec={SCENES.noText} name="02 no-text"><NoTextScene /></Scene>
    <Scene spec={SCENES.noPause} name="03 no-pause"><NoPauseScene /></Scene>
    <Scene spec={SCENES.feels} name="04 feels"><FeelsScene /></Scene>
    <Scene spec={SCENES.hardware} name="05 hardware"><HardwareScene /></Scene>
    <Scene spec={SCENES.cta} name="06 cta"><CtaScene /></Scene>
  </Reel>
);
