import React from "react";
import { Reel, Scene } from "../../reel";
import { rcColors, rcPalette } from "./palette";
import { RaceConditionProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { ReadScene } from "./scenes/ReadScene";
import { SoldScene } from "./scenes/SoldScene";
import { RaceScene } from "./scenes/RaceScene";
import { LockScene } from "./scenes/LockScene";
import { LawScene } from "./scenes/LawScene";

export const RaceCondition: React.FC<RaceConditionProps> = ({
  brandName,
  chapter,
  itemLabel,
  closingLine,
  signOff,
}) => {
  const brand = { brandName, chapter };
  return (
    <Reel
      palette={rcPalette}
      voiceoverDir="race-condition"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      gradeOpacity={0.12}
      captions={{
        // Red while the bug is on screen; the hero orange once the fix lands.
        activeColor: (now) =>
          now < SCENES.lock.from ? rcColors.danger : rcPalette.primary,
        heroColor: rcPalette.primary,
        badColor: rcColors.danger,
        fontSize: 58,
      }}
    >
      <Scene spec={SCENES.hook} name="01 hook">
        <HookScene {...brand} itemLabel={itemLabel} />
      </Scene>
      <Scene spec={SCENES.read} name="02 read">
        <ReadScene {...brand} />
      </Scene>
      <Scene spec={SCENES.sold} name="03 sold">
        <SoldScene {...brand} />
      </Scene>
      <Scene spec={SCENES.race} name="04 race">
        <RaceScene {...brand} />
      </Scene>
      <Scene spec={SCENES.lock} name="05 lock">
        <LockScene {...brand} />
      </Scene>
      <Scene spec={SCENES.law} name="06 law">
        <LawScene {...brand} closingLine={closingLine} signOff={signOff} />
      </Scene>
    </Reel>
  );
};
