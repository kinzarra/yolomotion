import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { pcColors, pcPalette } from "./palette";
import { PhoneCheckProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { DateScene } from "./scenes/DateScene";
import { LoopScene } from "./scenes/LoopScene";
import { ScopeScene } from "./scenes/ScopeScene";
import { FearScene } from "./scenes/FearScene";
import { ConsentScene } from "./scenes/ConsentScene";
import { InsideScene } from "./scenes/InsideScene";
import { TwistScene } from "./scenes/TwistScene";
import { ConditionScene } from "./scenes/ConditionScene";
import { CtaScene } from "./scenes/CtaScene";

export const PhoneCheck: React.FC<PhoneCheckProps> = ({ series, episode, amount, footnote }) => {
  const brand = { series, episode };
  return (
    <Reel
      palette={pcPalette}
      voiceoverDir="phone-check"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: pcPalette.primary,
        heroColor: pcPalette.primary,
        badColor: pcColors.bad,
        // Unbounded is wide: smaller size, two or three words a page.
        fontFamily: theme.fonts.wide,
        fontWeight: 800,
        fontSize: 44,
        maxWidth: 920,
        top: 1416,
      }}
    >
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene {...brand} amount={amount} />
      </Scene>
      <Scene spec={SCENES.date} name="02 date">
        <DateScene {...brand} amount={amount} />
      </Scene>
      <Scene spec={SCENES.loop} name="03 loop">
        <LoopScene {...brand} />
      </Scene>
      <Scene spec={SCENES.scope} name="04 scope">
        <ScopeScene {...brand} amount={amount} />
      </Scene>
      <Scene spec={SCENES.fear} name="05 fear">
        <FearScene {...brand} />
      </Scene>
      <Scene spec={SCENES.consent} name="06 consent">
        <ConsentScene {...brand} />
      </Scene>
      <Scene spec={SCENES.inside} name="07 inside">
        <InsideScene {...brand} amount={amount} />
      </Scene>
      <Scene spec={SCENES.twist} name="08 twist">
        <TwistScene {...brand} />
      </Scene>
      <Scene spec={SCENES.condition} name="09 condition">
        <ConditionScene {...brand} amount={amount} />
      </Scene>
      <Scene spec={SCENES.cta} name="10 cta">
        <CtaScene {...brand} amount={amount} footnote={footnote} />
      </Scene>
    </Reel>
  );
};
