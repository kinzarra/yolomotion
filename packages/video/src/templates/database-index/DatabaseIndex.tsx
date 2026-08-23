import React from "react";
import { Reel, Scene } from "../../reel";
import { DatabaseIndexProps } from "./schema";
import { idxPalette } from "./palette";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { FastScene } from "./scenes/FastScene";
import { SlowScene } from "./scenes/SlowScene";
import { QueryScene } from "./scenes/QueryScene";
import { ScanScene } from "./scenes/ScanScene";
import { BookScene } from "./scenes/BookScene";
import { IndexScene } from "./scenes/IndexScene";
import { FoundScene } from "./scenes/FoundScene";
import { CtaScene } from "./scenes/CtaScene";

export const DatabaseIndex: React.FC<DatabaseIndexProps> = ({
  brandName,
  chapter,
  query,
  indexStatement,
  targetEmail,
  closingLine,
}) => {
  const brand = { brandName, chapter };

  return (
    // No karaoke captions in this one — the scenes carry their own type.
    <Reel
      palette={idxPalette}
      voiceoverDir="database-index"
      voiceover={VOICEOVER}
      voRate={VO_RATE}
      captions={false}
      gradeOpacity={0.13}
    >
      {/* Scenes — each one owns its own shell (grid, orbs, exit). */}
      <Scene spec={SCENES.fast} name="01 fast">
        <FastScene {...brand} />
      </Scene>
      <Scene spec={SCENES.slow} name="02 slow">
        <SlowScene {...brand} />
      </Scene>
      <Scene spec={SCENES.query} name="03 query">
        <QueryScene {...brand} query={query} targetEmail={targetEmail} />
      </Scene>
      <Scene spec={SCENES.scan} name="04 full scan">
        <ScanScene {...brand} />
      </Scene>
      <Scene spec={SCENES.book} name="05 book">
        <BookScene {...brand} targetEmail={targetEmail} />
      </Scene>
      <Scene spec={SCENES.index} name="06 create index">
        <IndexScene {...brand} indexStatement={indexStatement} targetEmail={targetEmail} />
      </Scene>
      <Scene spec={SCENES.found} name="07 found">
        <FoundScene {...brand} />
      </Scene>
      <Scene spec={SCENES.cta} name="08 cta">
        <CtaScene {...brand} closingLine={closingLine} />
      </Scene>
    </Reel>
  );
};
