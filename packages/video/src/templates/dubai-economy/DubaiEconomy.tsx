import React from "react";
import { Reel, Scene } from "../../reel";
import { dubaiEconomyPalette } from "./palette";
import { DubaiEconomyProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { TurnScene } from "./scenes/TurnScene";
import { OilScene } from "./scenes/OilScene";
import { PortScene } from "./scenes/PortScene";
import { MapScene } from "./scenes/MapScene";
import { AirportScene } from "./scenes/AirportScene";
import { TaxScene } from "./scenes/TaxScene";
import { ModelScene } from "./scenes/ModelScene";
import { CrisisScene } from "./scenes/CrisisScene";
import { RescueScene } from "./scenes/RescueScene";
import { AnswerScene } from "./scenes/AnswerScene";
import { CtaScene } from "./scenes/CtaScene";

export const DubaiEconomy: React.FC<DubaiEconomyProps> = ({ ctaLabel }) => (
  <Reel
    palette={dubaiEconomyPalette}
    voiceoverDir="dubai-economy"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{ activeColor: dubaiEconomyPalette.primary }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.turn} name="02 turn">
      <TurnScene />
    </Scene>
    <Scene spec={SCENES.oil} name="03 oil">
      <OilScene />
    </Scene>
    <Scene spec={SCENES.port} name="04 port">
      <PortScene />
    </Scene>
    <Scene spec={SCENES.map} name="05 map">
      <MapScene />
    </Scene>
    <Scene spec={SCENES.airport} name="06 airport">
      <AirportScene />
    </Scene>
    <Scene spec={SCENES.tax} name="07 tax">
      <TaxScene />
    </Scene>
    <Scene spec={SCENES.model} name="08 model">
      <ModelScene />
    </Scene>
    <Scene spec={SCENES.crisis} name="09 crisis">
      <CrisisScene />
    </Scene>
    <Scene spec={SCENES.rescue} name="10 rescue">
      <RescueScene />
    </Scene>
    <Scene spec={SCENES.answer} name="11 answer">
      <AnswerScene />
    </Scene>
    <Scene spec={SCENES.cta} name="12 cta">
      <CtaScene ctaLabel={ctaLabel} />
    </Scene>
  </Reel>
);
