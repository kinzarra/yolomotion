import React from "react";
import { Reel, Scene } from "../../reel";
import { ynColors, ynPalette } from "./palette";
import { YoutubeNetflixProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { OfferScene } from "./scenes/OfferScene";
import { NetflixScene } from "./scenes/NetflixScene";
import { TelevisionScene } from "./scenes/TelevisionScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { MoneyScene } from "./scenes/MoneyScene";
import { CrazyScene } from "./scenes/CrazyScene";
import { ShiftScene } from "./scenes/ShiftScene";
import { FollowersScene } from "./scenes/FollowersScene";
import { EconomyScene } from "./scenes/EconomyScene";
import { YolocoScene } from "./scenes/YolocoScene";

export const YoutubeNetflix: React.FC<YoutubeNetflixProps> = ({ ctaLabel, url }) => (
  <Reel
    palette={ynPalette}
    voiceoverDir="youtube-netflix"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    // The karaoke highlight is white, not the accent: the red belongs to the
    // two platforms, so a caption never spends it except on the three "+WORD"
    // keywords the scenario names.
    captions={{
      activeColor: ynColors.white,
      heroColor: ynPalette.primary,
      fontSize: 54,
      maxWidth: 900,
    }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    <Scene spec={SCENES.offer} name="02 offer">
      <OfferScene />
    </Scene>
    <Scene spec={SCENES.netflix} name="03 netflix">
      <NetflixScene />
    </Scene>
    <Scene spec={SCENES.television} name="04 television">
      <TelevisionScene />
    </Scene>
    <Scene spec={SCENES.problem} name="05 problem">
      <ProblemScene />
    </Scene>
    <Scene spec={SCENES.money} name="06 money">
      <MoneyScene />
    </Scene>
    <Scene spec={SCENES.crazy} name="07 crazy">
      <CrazyScene />
    </Scene>
    <Scene spec={SCENES.shift} name="08 shift">
      <ShiftScene />
    </Scene>
    <Scene spec={SCENES.followers} name="09 followers">
      <FollowersScene />
    </Scene>
    <Scene spec={SCENES.economy} name="10 economy">
      <EconomyScene />
    </Scene>
    <Scene spec={SCENES.yoloco} name="11 yoloco">
      <YolocoScene ctaLabel={ctaLabel} url={url} />
    </Scene>
  </Reel>
);
