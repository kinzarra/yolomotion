// Beat 6 — only with consent. A phone shows the stylised ПРОВЕРКА БЕЗОПАСНОСТИ
// dialog with РАЗРЕШИТЬ / ОТКАЗАТЬСЯ; a finger hovers over РАЗРЕШИТЬ and never
// lands. A big padlock closes behind it, the law prints on paper, and a lime
// trace runs along the phone's outline only — the photos and messages inside
// stay dim and untouched.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, useRamp } from "../../../reel";
import { BrandBar, ConsentScreen, Eyebrow, Kinetic, OutlineTrace, Padlock, Phone, Receipt, ReceiptLine, ReceiptRule, SceneShell, Touch, useExit } from "../ui";

const HEAD = 8;
const LOCK = 24; // «не даёт ... доступа»
const PAPER = 56;
const NO_AUTO = 70; // «автоматического доступа»
const HOVER = 118; // «проверка безопасности»
const TRACE = 130;
const TRACE_END = 186;
const SWAP = 186; // «с согласия»
const YES = 194;

const PH = { left: 60, top: 600, width: 380, height: 743 };
const SCALE = PH.width / 440;
// centre of РАЗРЕШИТЬ inside the dialog, in frame coordinates
const ALLOW = { x: PH.left + 220 * SCALE, y: PH.top + 560 * SCALE };

export const ConsentScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const closed = useIn(LOCK, "snappy");
  const headOut = useExit(SWAP - 10, 10);
  const hover = useIn(HOVER, "smooth");
  const trace = useRamp(TRACE, TRACE_END, theme.ease.inOut);
  const traceOn = interpolate(frame, [TRACE, TRACE + 8, TRACE_END - 8, TRACE_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inOut,
  });
  const bob = Math.sin((frame - HOVER) / 11) * 10;

  return (
    <SceneShell>
      <BrandBar series={series} episode={episode} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Eyebrow delay={2}>Что говорит закон</Eyebrow>
        <div style={{ position: "relative", width: 980, marginTop: 20, minHeight: 180 }}>
          {headOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - headOut, transform: `translateY(${-headOut * 40}px)` }}>
              <Kinetic text="НЕ ДОСТУП К ПЕРЕПИСКЕ" delay={HEAD} per={4} size={76} align="center" mode="snap" style={{ justifyContent: "center" }} />
            </div>
          )}
          {frame >= SWAP && (
            <Kinetic text="ТОЛЬКО С СОГЛАСИЯ" delay={SWAP} per={4} size={76} align="center" mode="snap" hero={[2]} style={{ justifyContent: "center" }} />
          )}
        </div>
      </AbsoluteFill>

      {/* the padlock behind, closing */}
      <div style={{ position: "absolute", left: 640, top: 600 }}>
        <Padlock size={330} closed={closed} delay={6} />
      </div>

      {/* the law, on paper */}
      <div style={{ position: "absolute", left: 520, top: 1010 }}>
        <Receipt width={500} printFrom={PAPER} printFrames={26} title="ЗАКОН" number="210-ФЗ" tilt={1.4}>
          <ReceiptLine label="АВТОМАТИЧЕСКИЙ ДОСТУП" size={21} mark="cross" delay={NO_AUTO} />
          <ReceiptRule />
          <ReceiptLine label="С СОГЛАСИЯ КЛИЕНТА" size={21} strong mark="check" delay={YES} />
        </Receipt>
      </div>

      {/* the phone and the dialog */}
      <div style={{ position: "absolute", left: PH.left, top: PH.top, width: 440, height: 860, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        <Phone width={440} height={860} delay={4}>
          <ConsentScreen delay={14} />
        </Phone>
      </div>
      <OutlineTrace width={PH.width} height={PH.height} radius={48} progress={trace * 1.5} on={traceOn} style={{ left: PH.left - 6, top: PH.top - 6 }} />

      {/* the finger that does not press */}
      <Touch x={ALLOW.x + 38 * (1 - hover) + 12} y={ALLOW.y + 70 * (1 - hover) + 4 + bob} opacity={hover} press={0} />
    </SceneShell>
  );
};
