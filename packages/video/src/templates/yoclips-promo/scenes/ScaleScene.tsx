// Beat 8 — the second turn, and the one the tail exists for.
// Pure graphics on purpose: there is no screenshot of a hundred videos, and a
// grid of thumbnails would be decoration. Two receipt lines, two counters, and
// the multiplication does itself.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useIn, usePunch } from "../../../reel";
import { ycColors } from "../palette";
import { Counter, Eyebrow, Flash, Kinetic, Price, SceneShell } from "../ui";

const HUNDRED = 44; // the second row lands
const LINE = 96; // «канал за цену ужина»

export const ScaleScene: React.FC = () => {
  const punch = usePunch(HUNDRED, 20);

  return (
    <SceneShell shake={punch.shake * 0.6}>
      <Flash amount={punch.energy * 0.7} />
      <AbsoluteFill style={{ padding: "300px 90px 0", alignItems: "flex-start" }}>
        <Eyebrow delay={2}>Экономика</Eyebrow>

        <Row label="1 РОЛИК" delay={8} price="$0.25" priceDelay={14} />
        <div style={{ height: 30 }} />
        <Row label="100 РОЛИКОВ" delay={HUNDRED} price="$25" priceDelay={HUNDRED + 6} hero counterTo={100} />

        <div style={{ width: 900, marginTop: 92 }}>
          <Kinetic text="КАНАЛ ЗА ЦЕНУ УЖИНА" delay={LINE} per={4} size={76} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Row: React.FC<{
  label: string;
  delay: number;
  price: string;
  priceDelay: number;
  hero?: boolean;
  counterTo?: number;
}> = ({ label, delay, price, priceDelay, hero = false, counterTo }) => {
  // Counter has no entrance of its own — before its delay the spring reads 0
  // and it happily renders «0» on screen. The row gates it, and the dotted
  // leader draws with it so the line does not appear finished before the
  // figure at the end of it exists.
  const p = useIn(delay, "snappy");
  return (
  <div
    style={{
      width: 900,
      marginTop: 56,
      display: "flex",
      alignItems: "baseline",
      gap: 24,
    }}
  >
    {counterTo !== undefined ? (
      <span
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
        }}
      >
        <Counter to={counterTo} delay={delay} size={72} />
        <Kinetic text="РОЛИКОВ" delay={delay + 4} per={3} size={72} />
      </span>
    ) : (
      <Kinetic text={label} delay={delay} per={3} size={72} />
    )}
    <span
      style={{
        flex: 1,
        borderBottom: `2px dotted ${ycColors.lineStrong}`,
        transform: `translateY(-0.25em) scaleX(${p})`,
        transformOrigin: "left",
        minWidth: 20,
      }}
    />
    <Price value={price} delay={priceDelay} size={hero ? 104 : 80} tone="hero" origin="right center" />
  </div>
  );
};
