import React from "react";
import { Reel, Scene } from "../../reel";
import { FrontendSecretsProps } from "./schema";
import { secPalette } from "./palette";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { AppScene } from "./scenes/AppScene";
import { DevtoolsScene } from "./scenes/DevtoolsScene";
import { ExposedScene } from "./scenes/ExposedScene";
import { ArchScene } from "./scenes/ArchScene";
import { EndScene } from "./scenes/EndScene";

export const FrontendSecrets: React.FC<FrontendSecretsProps> = ({
  brandName,
  chapter,
  secretName,
  secretValue,
  appDomain,
  closingLine,
  tagline,
}) => {
  const brand = { brandName, chapter };

  return (
    // No karaoke captions in this one — the scenes carry their own type.
    <Reel
      palette={secPalette}
      voiceoverDir="frontend-secrets"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      captions={false}
      gradeOpacity={0.13}
    >
      {/* Scenes — each one owns its own shell (grid, orbs, exit). */}
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene {...brand} secretName={secretName} secretValue={secretValue} />
      </Scene>
      <Scene spec={SCENES.app} name="02 app">
        <AppScene {...brand} appDomain={appDomain} />
      </Scene>
      <Scene spec={SCENES.devtools} name="03 devtools">
        <DevtoolsScene {...brand} appDomain={appDomain} secretValue={secretValue} />
      </Scene>
      <Scene spec={SCENES.exposed} name="04 exposed">
        <ExposedScene {...brand} />
      </Scene>
      <Scene spec={SCENES.arch} name="05 architecture">
        <ArchScene {...brand} />
      </Scene>
      <Scene spec={SCENES.end} name="06 end card">
        <EndScene brandName={brandName} closingLine={closingLine} tagline={tagline} />
      </Scene>
    </Reel>
  );
};
