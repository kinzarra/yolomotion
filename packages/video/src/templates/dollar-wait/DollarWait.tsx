import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { dwColors, dwPalette } from "./palette";
import { DollarWaitProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { AnswerScene } from "./scenes/AnswerScene";
import { FeverScene } from "./scenes/FeverScene";
import { LevelsScene } from "./scenes/LevelsScene";
import { WhyScene } from "./scenes/WhyScene";
import { CounterScene } from "./scenes/CounterScene";
import { MistakeScene } from "./scenes/MistakeScene";
import { SwapScene } from "./scenes/SwapScene";
import { WhoScene } from "./scenes/WhoScene";
import { PlanScene } from "./scenes/PlanScene";
import { ScenariosScene } from "./scenes/ScenariosScene";
import { CtaScene } from "./scenes/CtaScene";
import { Presenter } from "./scenes/Presenter";

export const DollarWait: React.FC<DollarWaitProps> = ({
  series,
  episode,
  rateHigh,
  rateNow,
  monthDelta,
  keyRate,
  nextMeeting,
  footnote,
  disclaimer,
}) => {
  const brand = { series, episode };
  return (
    <Reel
      palette={dwPalette}
      voiceoverDir="dollar-wait"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: dwPalette.primary,
        heroColor: dwPalette.primary,
        badColor: dwColors.bad,
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
      <Scene spec={SCENES.answer} name="02 answer">
        <AnswerScene {...brand} />
      </Scene>
      <Scene spec={SCENES.fever} name="03 fever">
        <FeverScene {...brand} monthDelta={monthDelta} />
      </Scene>
      <Scene spec={SCENES.levels} name="04 levels">
        <LevelsScene {...brand} rateHigh={rateHigh} rateNow={rateNow} />
      </Scene>
      <Scene spec={SCENES.why} name="05 why">
        <WhyScene {...brand} keyRate={keyRate} />
      </Scene>
      <Scene spec={SCENES.counter} name="06 counter">
        <CounterScene {...brand} nextMeeting={nextMeeting} />
      </Scene>
      <Scene spec={SCENES.mistake} name="07 mistake">
        <MistakeScene {...brand} rateHigh={rateHigh} rateNow={rateNow} />
      </Scene>
      <Scene spec={SCENES.swap} name="08 swap">
        <SwapScene {...brand} />
      </Scene>
      <Scene spec={SCENES.who} name="09 who">
        <WhoScene {...brand} />
      </Scene>
      <Scene spec={SCENES.plan} name="10 plan">
        <PlanScene {...brand} />
      </Scene>
      <Scene spec={SCENES.scenarios} name="11 scenarios">
        <ScenariosScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cta} name="12 cta">
        <CtaScene {...brand} footnote={footnote} disclaimer={disclaimer} />
      </Scene>

      {/* Above the scenes, below the captions — the last child of <Reel>. */}
      <Presenter />
    </Reel>
  );
};
