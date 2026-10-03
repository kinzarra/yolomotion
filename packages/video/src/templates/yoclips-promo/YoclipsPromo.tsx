import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { ycColors, ycPalette } from "./palette";
import { YoclipsPromoProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { BriefScene } from "./scenes/BriefScene";
import { ScenarioScene } from "./scenes/ScenarioScene";
import { BudgetScene } from "./scenes/BudgetScene";
import { VoiceScene } from "./scenes/VoiceScene";
import { RenderScene } from "./scenes/RenderScene";
import { KeysScene } from "./scenes/KeysScene";
import { ScaleScene } from "./scenes/ScaleScene";
import { CtaScene } from "./scenes/CtaScene";

export const YoclipsPromo: React.FC<YoclipsPromoProps> = ({ ctaLabel }) => (
  <Reel
    palette={ycPalette}
    voiceoverDir="yoclips-promo"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    // The default grade is halved: six of the nine beats are a screen
    // recording of a bright paper interface, and a full grade over it reads
    // as a dirty monitor rather than as film.
    gradeOpacity={0.08}
    captions={{
      activeColor: ycPalette.primary,
      heroColor: ycPalette.primary,
      badColor: ycColors.bad,
      // Space Grotesk has no Cyrillic. Unbounded does, and it is wide — so a
      // smaller size and a narrower column than the engine's defaults.
      fontFamily: theme.fonts.wide,
      fontWeight: 800,
      fontSize: 44,
      maxWidth: 920,
      top: 1416,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.brief} name="02 brief">
      <BriefScene />
    </Scene>
    <Scene spec={SCENES.scenario} name="03 scenario">
      <ScenarioScene />
    </Scene>
    <Scene spec={SCENES.budget} name="04 budget">
      <BudgetScene />
    </Scene>
    <Scene spec={SCENES.voice} name="05 voice">
      <VoiceScene />
    </Scene>
    <Scene spec={SCENES.render} name="06 render">
      <RenderScene />
    </Scene>
    <Scene spec={SCENES.keys} name="07 keys">
      <KeysScene />
    </Scene>
    <Scene spec={SCENES.scale} name="08 scale">
      <ScaleScene />
    </Scene>
    <Scene spec={SCENES.cta} name="09 cta">
      <CtaScene ctaLabel={ctaLabel} />
    </Scene>
  </Reel>
);
