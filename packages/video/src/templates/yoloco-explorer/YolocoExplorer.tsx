import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { exPalette } from "./palette";
import { YolocoExplorerProps } from "./schema";
import { COPY } from "./copy";
import { CLOCK, SCENES_BY, VOICEOVER, VO_DIR, VO_RATE_BY, clockSpan } from "./timeline";
import { Clock } from "./ui";
import { HookScene } from "./scenes/HookScene";
import { PromptScene } from "./scenes/PromptScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { PickScene } from "./scenes/PickScene";
import { MoreScene } from "./scenes/MoreScene";
import { ExportScene } from "./scenes/ExportScene";
import { CtaScene } from "./scenes/CtaScene";

/** «Засекайте!» — the stopwatch outlives every cut, so it lives above the scenes. */
const ClockLayer: React.FC<{ lang: YolocoExplorerProps["lang"] }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const { from, to } = clockSpan(lang);
  if (now < from - 0.2) return null;
  const run = interpolate(now, [from, to], [0, CLOCK.shownSeconds], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dock = interpolate(now, [SCENES_BY[lang].prompt.from - 0.1, SCENES_BY[lang].prompt.from + 0.35], [1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const appear = interpolate(now, [from - 0.2, from + 0.1], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Clock
      seconds={run}
      big={dock}
      opacity={appear}
      label={COPY[lang].timerLabel}
      done={now >= to ? 1 : 0}
      doneLabel={COPY[lang].timerDone}
    />
  );
};

export const YolocoExplorer: React.FC<YolocoExplorerProps> = ({ lang }) => {
  const SCENES = SCENES_BY[lang];
  return (
  <Reel
    palette={exPalette}
    voiceoverDir={VO_DIR[lang]}
    voiceover={VOICEOVER[lang]}
    voRate={VO_RATE_BY[lang]}
    captions={{
      activeColor: exPalette.primary,
      heroColor: exPalette.primary,
      fontFamily: theme.fonts.wide,
      fontSize: 44,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.prompt} name="02 prompt">
      <PromptScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.results} name="03 results">
      <ResultsScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.pick} name="04 pick">
      <PickScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.more} name="05 more">
      <MoreScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.export} name="06 export">
      <ExportScene lang={lang} />
    </Scene>
    <Scene spec={SCENES.cta} name="07 cta">
      <CtaScene lang={lang} />
    </Scene>
    <ClockLayer lang={lang} />
  </Reel>
  );
};
