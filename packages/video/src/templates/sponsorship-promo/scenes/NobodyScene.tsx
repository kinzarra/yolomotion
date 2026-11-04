import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, Card, Cut, Eyebrow, Icon, IconKind, Sticker, Title, useSpringAt } from "../ui";

// The claim over the whole strategy: every widget of the report assembles
// into one tilted board around it, «вся стратегия конкурентов за 15 минут».
const W: { k: IconKind; l: string; v: string; c?: string; x: number; y: number; r: number }[] = [
  { k: "campaign", l: "интеграций", v: "3 557", x: 40, y: 150, r: -6 },
  { k: "users", l: "блогеров", v: "516", x: 560, y: 120, r: 5 },
  { k: "bolt", l: "бюджет", v: "72 млн ₽", x: 20, y: 380, r: 4 },
  { k: "crown", l: "доля VOIS", v: "81%", c: sp.vois, x: 600, y: 360, r: -5 },
  { k: "ticket", l: "промокод", v: "66 млн", x: 40, y: 1130, r: 5 },
  { k: "doc", l: "кампаний", v: "142", x: 600, y: 1110, r: -4 },
  { k: "close", l: "с ERID", v: "1,8%", c: sp.bad, x: 320, y: 1300, r: 3 },
];

export const NobodyScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Cut>
      <Backdrop intensity={1} />
      {W.map((w, i) => (
        <Widget key={w.l} {...w} i={i} frame={frame} />
      ))}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, gap: 34 }}>
        <div style={{ background: "rgba(18,17,33,0.82)", borderRadius: 48, padding: "40px 30px", boxShadow: `0 0 120px ${sp.violetGlow}` }}>
          <Title text={"Такого разбора\nрекламы конкурентов\nна рынке нет."} size={88} at={0.05} stagger={0.12} accent={["нет"]} />
        </div>
        <Sticker at={1.4} rotate={-3} bg={sp.violet} color={sp.white} size={44}>
          вся стратегия конкурентов за 15 минут
        </Sticker>
      </AbsoluteFill>
    </Cut>
  );
};

const Widget: React.FC<(typeof W)[number] & { i: number; frame: number }> = ({ k, l, v, c = sp.violet, x, y, r, i, frame }) => {
  const p = useSpringAt(0.1 + i * 0.12, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - p) * (y > 900 ? 300 : -300) + Math.sin((frame + i * 13) / 16) * 8}px) rotate(${r}deg) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: p }}>
      <Card pad={26} style={{ width: 420, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon kind={k} size={46} />
        </div>
        <div>
          <Eyebrow size={22}>{l}</Eyebrow>
          <Big size={60} color={c === sp.violet ? sp.ink : c}>{v}</Big>
        </div>
      </Card>
    </div>
  );
};
