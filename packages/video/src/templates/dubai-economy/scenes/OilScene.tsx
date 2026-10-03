// 03 oil — why the city was built at all. A receipt prints the find (1966,
// Fateh, offshore), the reserve bar drains to red, and КОНЧИТСЯ slams down
// on «она кончится». Sheikh Rashid is named in the eyebrow, never pictured.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { deColors } from "../palette";
import {
  BigNum,
  BrandBar,
  Dust,
  Eyebrow,
  Flash,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
  Shockwave,
  Stamp,
  ramp,
} from "../ui";

export const OilScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const little = Math.round(3.6 * fps); // «и её было мало»
  const ends = Math.round(7.3 * fps); // «она кончится»
  const hit = usePunch(ends, 16);
  const drain = ramp(frame, little, ends, theme.ease.inOut);
  const level = 1 - drain * 0.92;
  return (
    <SceneShell shake={hit.shake}>
      <Dust seed={3} opacity={0.35} />
      <BrandBar series={series} episode={episode} />
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Eyebrow delay={0}>ПЕРВАЯ НЕФТЬ ДУБАЯ</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 90, top: 350 }}>
        <BigNum size={210} delay={4}>
          1966
        </BigNum>
      </div>

      <div style={{ position: "absolute", left: 140, top: 600, transform: "scale(1.22)", transformOrigin: "top left" }}>
        <Receipt width={655} printFrom={10} printFrames={34} title="ДУБАЙ · НЕДРА" number="№ 1966" tilt={-2}>
          <ReceiptLine label="МЕСТОРОЖДЕНИЕ" value="ФАТЕХ" delay={22} />
          <ReceiptLine label="ГДЕ" value="В МОРЕ" delay={28} />
          <ReceiptLine label="ЗАПАС" value="МАЛО" mark="cross" delay={little} strong />
          <ReceiptRule />
          <div style={{ fontSize: 22, letterSpacing: "0.14em", color: deColors.inkFaded, marginBottom: 10 }}>
            ОСТАТОК
          </div>
          <div style={{ position: "relative", height: 46, border: `3px solid ${deColors.ink}` }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${level * 100}%`,
                background: drain > 0.5 ? deColors.bad : deColors.ink,
              }}
            />
          </div>
          <ReceiptLine label="ПРАВИТЕЛЬ" value="ШЕЙХ РАШИД" delay={Math.round(5.2 * fps)} faded />
        </Receipt>
      </div>

      <div style={{ position: "absolute", left: 330, top: 1150 }}>
        {frame >= ends - 2 && (
          <Stamp delay={ends - 2} tone="bad" size={84} rotate={-9}>
            КОНЧИТСЯ
          </Stamp>
        )}
      </div>
      <div style={{ position: "absolute", left: 560, top: 1200, width: 0, height: 0 }}>
        <Shockwave at={ends} color={deColors.bad} size={1200} />
      </div>
      <Flash amount={hit.energy} color={deColors.bad} />
    </SceneShell>
  );
};
