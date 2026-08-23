import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { drColors, drPalette } from "./palette";
import { DigitalRubleProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { StopScene } from "./scenes/StopScene";
import { FormsScene } from "./scenes/FormsScene";
import { ParityScene } from "./scenes/ParityScene";
import { LaunchScene } from "./scenes/LaunchScene";
import { VoluntaryScene } from "./scenes/VoluntaryScene";
import { ProsScene } from "./scenes/ProsScene";
import { ConsScene } from "./scenes/ConsScene";
import { QuestionScene } from "./scenes/QuestionScene";
import { CtaScene } from "./scenes/CtaScene";

export const DigitalRuble: React.FC<DigitalRubleProps> = ({
  series,
  episode,
  yesLabel,
  noLabel,
  commentTarget,
}) => {
  const brand = { series, episode };
  return (
    <Reel
      palette={drPalette}
      voiceoverDir="digital-ruble"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: drPalette.primary,
        heroColor: drPalette.primary,
        badColor: drColors.bad,
        // Unbounded is wide: smaller size, two or three words a page.
        fontFamily: theme.fonts.wide,
        fontWeight: 800,
        fontSize: 44,
        maxWidth: 920,
        top: 1416,
      }}
    >
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene {...brand} />
      </Scene>
      <Scene spec={SCENES.stop} name="02 stop">
        <StopScene {...brand} />
      </Scene>
      <Scene spec={SCENES.forms} name="03 forms">
        <FormsScene {...brand} />
      </Scene>
      <Scene spec={SCENES.parity} name="04 parity">
        <ParityScene {...brand} />
      </Scene>
      <Scene spec={SCENES.launch} name="05 launch">
        <LaunchScene {...brand} />
      </Scene>
      <Scene spec={SCENES.voluntary} name="06 voluntary">
        <VoluntaryScene {...brand} />
      </Scene>
      <Scene spec={SCENES.pros} name="07 pros">
        <ProsScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cons} name="08 cons">
        <ConsScene {...brand} />
      </Scene>
      <Scene spec={SCENES.question} name="09 question">
        <QuestionScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cta} name="10 cta">
        <CtaScene
          {...brand}
          yesLabel={yesLabel}
          noLabel={noLabel}
          commentTarget={commentTarget}
        />
      </Scene>
    </Reel>
  );
};
