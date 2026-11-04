import React from "react";
import { Reel, Scene } from "../../reel";
import { zhkhReceiptPalette } from "./palette";
import { ZhkhReceiptProps } from "./schema";
import { SERVICES } from "./data";
import { SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { ServiceScene } from "./scenes/ServiceScene";
import { TotalScene } from "./scenes/TotalScene";

// Scenes carry their own type, so the shared captions stay off.
export const ZhkhReceipt: React.FC<ZhkhReceiptProps> = () => (
  <Reel palette={zhkhReceiptPalette} voiceoverDir="zhkh-receipt" voiceover={VOICEOVER} voRate={VO_RATE} captions={false} gradeOpacity={0.08}>
    <Scene spec={SCENES.hook} name="01 hook">
      <HookScene />
    </Scene>
    {SERVICES.map((s, i) => (
      <Scene key={s.key} spec={SCENES[s.key]} name={`0${i + 2} ${s.key}`}>
        <ServiceScene service={s} index={i} />
      </Scene>
    ))}
    <Scene spec={SCENES.total} name="06 total">
      <TotalScene />
    </Scene>
  </Reel>
);
