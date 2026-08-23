import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { itColors, itPalette } from "./palette";
import { NoItInRussiaProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { NumbersScene } from "./scenes/NumbersScene";
import { BreakScene } from "./scenes/BreakScene";
import { EconomyScene } from "./scenes/EconomyScene";
import { TasksScene } from "./scenes/TasksScene";
import { InsightScene } from "./scenes/InsightScene";
import { JuniorScene } from "./scenes/JuniorScene";
import { FactcheckScene } from "./scenes/FactcheckScene";
import { AnswerScene } from "./scenes/AnswerScene";
import { CtaScene } from "./scenes/CtaScene";

export const NoItInRussia: React.FC<NoItInRussiaProps> = ({
  series,
  episode,
  applicants,
  vacancyDelta,
  scanned,
  footnote,
}) => {
  const brand = { series, episode };
  return (
    <Reel
      palette={itPalette}
      voiceoverDir="no-it-in-russia"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: itPalette.primary,
        heroColor: itPalette.primary,
        badColor: itColors.bad,
        // Unbounded is wide: smaller size, two or three words a page.
        fontFamily: theme.fonts.wide,
        fontWeight: 800,
        fontSize: 44,
        maxWidth: 920,
        top: 1416,
      }}
    >
      {/* The presenter is not a layer over this beat — it IS this beat, so it
          is composited inside the scene rather than in a <Presenter> above
          them all: the headline has to sit on top of the studio footage. */}
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene applicants={applicants} />
      </Scene>
      <Scene spec={SCENES.numbers} name="02 numbers">
        <NumbersScene {...brand} vacancyDelta={vacancyDelta} />
      </Scene>
      <Scene spec={SCENES.break} name="03 break">
        <BreakScene {...brand} />
      </Scene>
      <Scene spec={SCENES.economy} name="04 economy">
        <EconomyScene {...brand} />
      </Scene>
      <Scene spec={SCENES.tasks} name="05 tasks">
        <TasksScene {...brand} />
      </Scene>
      <Scene spec={SCENES.insight} name="06 insight">
        <InsightScene {...brand} />
      </Scene>
      <Scene spec={SCENES.junior} name="07 junior">
        <JuniorScene {...brand} />
      </Scene>
      <Scene spec={SCENES.factcheck} name="08 factcheck">
        <FactcheckScene {...brand} scanned={scanned} />
      </Scene>
      <Scene spec={SCENES.answer} name="09 answer">
        <AnswerScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cta} name="10 cta">
        <CtaScene {...brand} footnote={footnote} />
      </Scene>
    </Reel>
  );
};
