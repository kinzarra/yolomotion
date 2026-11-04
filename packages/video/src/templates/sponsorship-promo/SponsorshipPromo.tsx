import React from "react";
import { Reel, Scene } from "../../reel";
import { theme } from "../../theme";
import { sp, spPalette } from "./palette";
import { SponsorshipPromoProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { PainScene } from "./scenes/PainScene";
import { RevealScene } from "./scenes/RevealScene";
import { ScanScene } from "./scenes/ScanScene";
import { SpeedScene } from "./scenes/SpeedScene";
import { UltraScene } from "./scenes/UltraScene";
import { VolumeScene } from "./scenes/VolumeScene";
import { BudgetScene } from "./scenes/BudgetScene";
import { SovScene } from "./scenes/SovScene";
import { MechScene } from "./scenes/MechScene";
import { CampScene } from "./scenes/CampScene";
import { EridScene } from "./scenes/EridScene";
import { NobodyScene } from "./scenes/NobodyScene";
import { SilenceScene } from "./scenes/SilenceScene";
import { ExceptScene } from "./scenes/ExceptScene";
import { CtaScene } from "./scenes/CtaScene";

export const SponsorshipPromo: React.FC<SponsorshipPromoProps> = ({ site, section, voiceoverDir = "sponsorship-promo" }) => (
  <Reel
    palette={spPalette}
    voiceoverDir={voiceoverDir}
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    captions={{
      mode: "pill",
      activeColor: sp.violet,
      boxColor: sp.violet,
      activeInk: sp.white,
      heroColor: sp.violetTint,
      badColor: sp.bad,
      fontFamily: theme.fonts.body,
      fontWeight: 800,
      fontSize: 54,
      maxWidth: 920,
      top: 1450,
      textShadow: "0 4px 18px rgba(0,0,0,0.65)",
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook"><HookScene /></Scene>
    <Scene spec={SCENES.pain} name="02 pain"><PainScene /></Scene>
    <Scene spec={SCENES.reveal} name="03 reveal"><RevealScene section={section} /></Scene>
    <Scene spec={SCENES.scan} name="04 scan"><ScanScene /></Scene>
    <Scene spec={SCENES.ultra} name="04b ultra"><UltraScene /></Scene>
    <Scene spec={SCENES.speed} name="05 speed"><SpeedScene /></Scene>
    <Scene spec={SCENES.volume} name="06 volume"><VolumeScene /></Scene>
    <Scene spec={SCENES.budget} name="07 budget"><BudgetScene /></Scene>
    <Scene spec={SCENES.sov} name="08 sov"><SovScene /></Scene>
    <Scene spec={SCENES.mech} name="09 mech"><MechScene /></Scene>
    <Scene spec={SCENES.camp} name="10 camp"><CampScene /></Scene>
    <Scene spec={SCENES.erid} name="11 erid"><EridScene /></Scene>
    <Scene spec={SCENES.nobody} name="12 nobody"><NobodyScene /></Scene>
    <Scene spec={SCENES.silence} name="13 silence"><SilenceScene /></Scene>
    <Scene spec={SCENES.except} name="14 except"><ExceptScene /></Scene>
    <Scene spec={SCENES.cta} name="15 cta"><CtaScene site={site} section={section} /></Scene>
  </Reel>
);
