import React from "react";
import { useVideoConfig } from "remotion";
import { cue } from "../cues";
import { BrandBarWide, Eyebrow, Logo, PrintedPhoto, SceneShell, Source, Stamp, VersusReceipt } from "../ui";

// Beat 2 — escalate, don't explain: the price of a courier against the price
// of the rover, then ×3. Paper on the left, the printed rover on the right.
export const PriceScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const c = (p: number) => cue("price", "02-price", p, fps);
  return (
    <SceneShell>
      <BrandBarWide series={series} episode={episode} />
      <div style={{ position: "absolute", left: 96, top: 150 }}>
        <Eyebrow delay={2}>ЦЕННИК НА ЧЕЛОВЕКА · ДОСТАВКА</Eyebrow>
      </div>
      <div style={{ position: "absolute", left: 96, top: 230 }}>
        <VersusReceipt
          role="КУРЬЕР"
          delay={c(1) - 6}
          machineAt={c(3)}
          scale={0.95}
          human={{ label: "ОБХОДИТСЯ КОМПАНИИ", value: "878 000 ₽", unit: "В ГОД · МОСКВА" }}
          machine={{ label: "РОБОТ-ДОСТАВЩИК", value: "295 000 ₽", unit: "В ГОД · ВЛАДЕНИЕ" }}
        />
      </div>
      <div style={{ position: "absolute", left: 300, top: 640 }}>
        <Stamp delay={c(4)} tone="hero" size={84} rotate={-6}>
          ×3 ДЕШЕВЛЕ
        </Stamp>
      </div>
      <PrintedPhoto
        file="yandex-rover.jpg"
        width={720}
        height={460}
        len={durationInFrames}
        printFrom={c(2) - 10}
        focus={[0.5, 0.6]}
        tilt={2.5}
        caption={
          <>
            <span>РОВЕР · ДОСТАВКА</span>
            <span>2026</span>
          </>
        }
        style={{ left: 1080, top: 170 }}
      />
      <div style={{ position: "absolute", left: 1600, top: 140 }}>
        <Logo file="logo-yandex.svg" height={46} delay={c(2) + 6} tilt={4} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 848 }}>
        <Source delay={c(1)}>СОВКОМБАНК / ВЕДОМОСТИ, 15.01.2026</Source>
      </div>
    </SceneShell>
  );
};
