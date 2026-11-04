import React from "react";
import { useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { rcPalette } from "../palette";
import { cue } from "../cues";
import { BigNum, BrandBarWide, PrintedPhoto, Receipt, ReceiptLine, ReceiptRule, SceneShell, Source } from "../ui";

// Beat 8 — Gref, November 2025: the AI rated the teams, 20% of the central
// office goes. The portrait prints on the left, the receipt states it.
export const GrefScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const c = (p: number) => cue("gref", "11-gref", p, fps);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <PrintedPhoto
        file="gref.jpg"
        width={520}
        height={560}
        len={durationInFrames}
        printFrom={0}
        printFrames={22}
        focus={[0.5, 0.3]}
        zoom={[1.0, 1.1]}
        tilt={-2}
        caption={
          <>
            <span>ГЕРМАН ГРЕФ</span>
            <span>19.11.2025</span>
          </>
        }
        style={{ left: 110, top: 140 }}
      />
      <div style={{ position: "absolute", left: 760, top: 170 }}>
        <Receipt width={560} printFrom={c(1) - 6} printFrames={24} title="AI JOURNEY" number="№ 08" tilt={1.5}>
          <ReceiptLine label="ИИ ОЦЕНИЛ" value="КОМАНДЫ" delay={c(1)} />
          <ReceiptLine label="КРИТЕРИЙ" value="ЭФФЕКТИВНОСТЬ" delay={c(2)} />
          <ReceiptRule />
          <ReceiptLine label="ЦЕНТР. АППАРАТ" value="−20%" strong mark="cross" delay={c(3)} />
        </Receipt>
      </div>
      <div style={{ position: "absolute", left: 1380, top: 220, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        <BigNum size={190} delay={c(3)} color={rcPalette.text}>
          −20%
        </BigNum>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: rcPalette.textDim, maxWidth: 420 }}>
          ЦЕНТРАЛЬНОГО АППАРАТА — НЕ ВСЕГО СБЕРА
        </div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 848 }}>
        <Source delay={c(1)}>THE MOSCOW TIMES, 19.11.2025 · ФОТО: KREMLIN.RU, CC BY 4.0</Source>
      </div>
    </SceneShell>
  );
};
