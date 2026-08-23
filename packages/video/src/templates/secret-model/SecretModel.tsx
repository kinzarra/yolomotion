import React from "react";
import { Reel, Scene } from "../../reel";
import { smPalette } from "./palette";
import { SecretModelProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { InternalScene } from "./scenes/InternalScene";
import { LadderScene } from "./scenes/LadderScene";
import { TestingScene } from "./scenes/TestingScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { GapScene } from "./scenes/GapScene";
import { LawScene } from "./scenes/LawScene";

export const SecretModel: React.FC<SecretModelProps> = ({
  brandName,
  chapter,
  headline,
  closingLine,
  signOff,
}) => {
  const brand = { brandName, chapter };
  return (
    <Reel
      palette={smPalette}
      voiceoverDir="secret-model"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.11}
      captions={{
        // Blue reads the line; orange is reserved for "+" keywords, which in
        // this reel only ever mark the unreleased or the merely reported.
        activeColor: smPalette.accent,
        heroColor: smPalette.primary,
        fontSize: 56,
      }}
    >
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene {...brand} headline={headline} />
      </Scene>
      <Scene spec={SCENES.internal} name="02 internal">
        <InternalScene {...brand} />
      </Scene>
      <Scene spec={SCENES.ladder} name="03 ladder">
        <LadderScene {...brand} />
      </Scene>
      <Scene spec={SCENES.testing} name="04 testing">
        <TestingScene {...brand} />
      </Scene>
      <Scene spec={SCENES.pipeline} name="05 pipeline">
        <PipelineScene {...brand} />
      </Scene>
      <Scene spec={SCENES.gap} name="06 gap">
        <GapScene {...brand} />
      </Scene>
      <Scene spec={SCENES.law} name="07 law">
        <LawScene {...brand} closingLine={closingLine} signOff={signOff} />
      </Scene>
    </Reel>
  );
};
