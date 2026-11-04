import React from "react";
import { Reel, Scene } from "../../reel";
import { vibecodingLayersPalette } from "./palette";
import { VibecodingLayersProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { PunchScene } from "./scenes/PunchScene";
import { AsmScene } from "./scenes/AsmScene";
import { ClangScene } from "./scenes/ClangScene";
import { FrameworksScene } from "./scenes/FrameworksScene";
import { VibeScene } from "./scenes/VibeScene";
import { TurnScene } from "./scenes/TurnScene";
import { CtaScene } from "./scenes/CtaScene";

// Scenes carry their own type, so the shared captions stay off.
export const VibecodingLayers: React.FC<VibecodingLayersProps> = () => (
  <Reel palette={vibecodingLayersPalette} voiceoverDir="vibecoding-layers" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.08}>
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.punch} name="02 punch">
      <PunchScene />
    </Scene>
    <Scene spec={SCENES.asm} name="03 asm">
      <AsmScene />
    </Scene>
    <Scene spec={SCENES.clang} name="04 clang">
      <ClangScene />
    </Scene>
    <Scene spec={SCENES.frameworks} name="05 frameworks">
      <FrameworksScene />
    </Scene>
    <Scene spec={SCENES.vibe} name="06 vibe">
      <VibeScene />
    </Scene>
    <Scene spec={SCENES.turn} name="07 turn">
      <TurnScene />
    </Scene>
    <Scene spec={SCENES.cta} name="08 cta">
      <CtaScene />
    </Scene>
  </Reel>
);
