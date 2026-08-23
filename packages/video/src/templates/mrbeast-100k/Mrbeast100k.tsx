import React from "react";
import { Reel, Scene } from "../../reel";
import { mbPalette } from "./palette";
import { Mrbeast100kProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { CountScene } from "./scenes/CountScene";
import { StampScene } from "./scenes/StampScene";
import { ThumbnailScene } from "./scenes/ThumbnailScene";
import { FormulaScene } from "./scenes/FormulaScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { LessonScene } from "./scenes/LessonScene";
import { YolocoScene } from "./scenes/YolocoScene";

export const Mrbeast100k: React.FC<Mrbeast100kProps> = ({
  tapePhoto,
  studioPhoto,
  photoCredit,
  sourceLabel,
  tagline,
  ctaLabel,
}) => (
  <Reel
    palette={mbPalette}
    voiceoverDir="mrbeast-100k"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={{ activeColor: mbPalette.primary }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene sourceLabel={sourceLabel} photo={tapePhoto} />
    </Scene>
    <Scene spec={SCENES.count} name="02 count">
      <CountScene photo={tapePhoto} />
    </Scene>
    <Scene spec={SCENES.stamp} name="03 stamp">
      <StampScene sourceLabel={sourceLabel} photo={tapePhoto} />
    </Scene>
    <Scene spec={SCENES.thumbnail} name="04 thumbnail">
      <ThumbnailScene photo={studioPhoto} />
    </Scene>
    <Scene spec={SCENES.formula} name="05 formula">
      <FormulaScene />
    </Scene>
    <Scene spec={SCENES.timeline} name="06 timeline">
      <TimelineScene photo={tapePhoto} cutout={studioPhoto} />
    </Scene>
    <Scene spec={SCENES.lesson} name="07 lesson">
      <LessonScene />
    </Scene>
    <Scene spec={SCENES.yoloco} name="08 yoloco">
      <YolocoScene
        tagline={tagline}
        ctaLabel={ctaLabel}
        photo={studioPhoto}
        credit={photoCredit}
      />
    </Scene>
  </Reel>
);
