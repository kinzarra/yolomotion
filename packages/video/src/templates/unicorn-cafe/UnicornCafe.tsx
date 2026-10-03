import React from "react";
import { Reel, Scene } from "../../reel";
import { CaptionsTrack } from "./CaptionsTrack";
import { ucPalette } from "./palette";
import { UnicornCafeProps } from "./schema";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { Timecode } from "./ui";
import { HookScene } from "./scenes/HookScene";
import { CafeScene } from "./scenes/CafeScene";
import { StareScene } from "./scenes/StareScene";
import { SourceScene } from "./scenes/SourceScene";
import { UseScene } from "./scenes/UseScene";
import { OutroScene } from "./scenes/OutroScene";

export const UnicornCafe: React.FC<UnicornCafeProps> = ({
  claim,
  slamWord,
  payoff,
  cta,
  brand,
  brandNote,
}) => (
  <Reel
    palette={ucPalette}
    voiceoverDir="unicorn-cafe"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    // The engine's weighted captions would fight the recording; this reel has
    // real word timestamps and renders them itself.
    captions={false}
    // Light: the footage is a real room and a magenta cast on skin is the
    // fastest way to make live video look filtered.
    gradeOpacity={0.06}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene claim={claim} />
    </Scene>
    <Scene spec={SCENES.cafe} name="02 cafe">
      <CafeScene slamWord={slamWord} />
    </Scene>
    <Scene spec={SCENES.stare} name="03 stare">
      <StareScene slamWord={slamWord} />
    </Scene>
    <Scene spec={SCENES.source} name="04 source">
      <SourceScene />
    </Scene>
    <Scene spec={SCENES.use} name="05 use">
      <UseScene />
    </Scene>
    <Scene spec={SCENES.outro} name="06 outro">
      <OutroScene payoff={payoff} cta={cta} brand={brand} brandNote={brandNote} />
    </Scene>

    {/* Above the cuts, like the captions: both are the edit talking, not the
        scenes. */}
    <Timecode />
    <CaptionsTrack />
  </Reel>
);
