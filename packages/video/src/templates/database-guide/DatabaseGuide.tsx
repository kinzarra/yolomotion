import React from "react";
import { Reel, Scene } from "../../reel";
import { DatabaseGuideProps } from "./schema";
import { dbPalette } from "./palette";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { WhyScene } from "./scenes/WhyScene";
import { AnalogyScene } from "./scenes/AnalogyScene";
import { ChoiceScene } from "./scenes/ChoiceScene";
import { CtaScene } from "./scenes/CtaScene";
import { LoopScene } from "./scenes/LoopScene";

export const DatabaseGuide: React.FC<DatabaseGuideProps> = ({ brandName, cta }) => (
  // No karaoke captions in this one — the scenes carry their own type. The
  // scenes sit on the drifting mesh rather than painting their own backdrop.
  <Reel
    palette={dbPalette}
    voiceoverDir="database-guide"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    captions={false}
    bgMesh
    gradeOpacity={0.18}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene brandName={brandName} />
    </Scene>
    <Scene spec={SCENES.why} name="02 why">
      <WhyScene brandName={brandName} />
    </Scene>
    <Scene spec={SCENES.table} name="03 analogy">
      <AnalogyScene brandName={brandName} />
    </Scene>
    <Scene spec={SCENES.choice} name="04 choice">
      <ChoiceScene brandName={brandName} />
    </Scene>
    <Scene spec={SCENES.cta} name="05 cta">
      <CtaScene brandName={brandName} cta={cta} />
    </Scene>
    <Scene spec={SCENES.loop} name="06 loop">
      <LoopScene brandName={brandName} />
    </Scene>
  </Reel>
);
