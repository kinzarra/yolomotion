// Beat 1 — the claim and the price.
// Hits: «Я БОЛЬШЕ НЕ СНИМАЮ РОЛИКИ» rises word by word → $0.25 slams in lime
// with a flash and a frame shake → the qualifier prints under it, so the
// number cannot be read as "a preview" or "per minute".
import React from "react";
import { AbsoluteFill } from "remotion";
import { usePunch } from "../../../reel";
import { Chip, Flash, Kinetic, Price, SceneShell, Wordmark } from "../ui";

const PRICE = 54; // the number lands — a beat after the headline finishes

export const HookScene: React.FC = () => {
  const punch = usePunch(PRICE, 20);

  return (
    <SceneShell shake={punch.shake}>
      <Flash amount={punch.energy} />

      <AbsoluteFill style={{ padding: "168px 90px 0", alignItems: "flex-start" }}>
        <Wordmark size={54} glow={false} />

        {/* Three authored lines, not two wrapped ones: at size 92 the pair
            «СНИМАЮ РОЛИКИ» overruns the 900px column, and letting it wrap put
            the stagger on the wrong words. */}
        <div style={{ width: 900, marginTop: 96 }}>
          <Kinetic text="Я БОЛЬШЕ НЕ" delay={0} per={4} size={92} />
          <Kinetic text="СНИМАЮ" delay={7} per={4} size={92} />
          <Kinetic text="РОЛИКИ" delay={13} per={4} size={92} />
        </div>

        <div
          style={{
            marginTop: 92,
            display: "flex",
            alignItems: "baseline",
            gap: 30,
            transform: `scale(${1 + punch.pop * 0.06})`,
            transformOrigin: "left center",
          }}
        >
          <Price value="$0.25" delay={PRICE} size={196} />
        </div>

        <div style={{ marginTop: 40 }}>
          <Chip delay={PRICE + 14} tone="paper" size={29}>
            ЗА ОДИН РОЛИК · ОТ ИДЕИ ДО ПУБЛИКАЦИИ
          </Chip>
        </div>
      </AbsoluteFill>

    </SceneShell>
  );
};
