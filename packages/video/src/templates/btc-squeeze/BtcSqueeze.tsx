import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { btcColors, btcPalette } from "./palette";
import { BtcSqueezeProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { TriggerScene } from "./scenes/TriggerScene";
import { PrinterScene } from "./scenes/PrinterScene";
import { ClarityScene } from "./scenes/ClarityScene";
import { ShortsScene } from "./scenes/ShortsScene";
import { SqueezeScene } from "./scenes/SqueezeScene";
import { EtfScene } from "./scenes/EtfScene";
import { FormulaScene } from "./scenes/FormulaScene";
import { CtaScene } from "./scenes/CtaScene";

export const BtcSqueeze: React.FC<BtcSqueezeProps> = ({ series, episode, dataDate, footnote }) => {
  const brand = { series, episode };
  return (
    <Reel
      palette={btcPalette}
      voiceoverDir="btc-squeeze"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.08}
      captions={{
        activeColor: btcPalette.primary,
        heroColor: btcPalette.primary,
        badColor: btcColors.bad,
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
      <Scene spec={SCENES.trigger} name="02 trigger">
        <TriggerScene {...brand} />
      </Scene>
      <Scene spec={SCENES.printer} name="03 printer">
        <PrinterScene {...brand} />
      </Scene>
      <Scene spec={SCENES.clarity} name="04 clarity">
        <ClarityScene {...brand} />
      </Scene>
      <Scene spec={SCENES.shorts} name="05 shorts">
        <ShortsScene {...brand} />
      </Scene>
      <Scene spec={SCENES.squeeze} name="06 squeeze">
        <SqueezeScene {...brand} />
      </Scene>
      <Scene spec={SCENES.etf} name="07 etf">
        <EtfScene {...brand} />
      </Scene>
      <Scene spec={SCENES.formula} name="08 formula">
        <FormulaScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cta} name="09 cta">
        <CtaScene {...brand} dataDate={dataDate} footnote={footnote} />
      </Scene>
    </Reel>
  );
};
