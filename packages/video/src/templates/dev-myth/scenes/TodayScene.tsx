// Beat 2, the machine's price. The first receipt is struck through in red,
// a second one prints for the same work, the real pricing card flies in, and
// 100 $ slams in lime on the word.
import React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, Drift, Flash, FlyIn, Glitch, Label, Receipt, ReceiptLine, ReceiptRule, S, SceneShell, Slam, Strike, TopBar, cl, media } from "../ui";
import { TODAY_T, T } from "../timeline";
import { BgVideo, GlassChip, MediaCard, StatPlate } from "../fx2";
import { interpolate } from "remotion";

const PRICING = { src: "images/dev-myth/claude-max.png", ratio: 380 / 378 };

export const TodayScene: React.FC<{ salary: number; price: number }> = ({ salary, price }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const priceAt = S(T(TODAY_T.price), fps);
  const open = usePunch(0, 14);
  const hit = usePunch(priceAt, 16);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  const tear = interpolate(frame, [0, 2, 10], [1, 1, 0], cl);
  return (
    <SceneShell shake={open.shake * 0.8 + hit.shake}>
      <BgVideo src="media/dev-myth/v-creator.mp4" dim={0.74} tint={0.35} />
      <Drift items={[`${price} $`, "€90", "CLAUDE MAX", "2026", "×1", "ПОДПИСКА", "ИИ", "24/7"]} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ТА ЖЕ РАБОТА · СЕГОДНЯ" />

      {/* yesterday's receipt, pushed aside and struck */}
      <Glitch amount={tear * 0.8} style={{ position: "absolute", left: 90, top: 150, zIndex: 5, transform: "scale(0.78)", transformOrigin: "left top", opacity: 0.85 }}>
        <div style={{ position: "relative" }}>
          <Receipt width={620} printFrom={-100} title="СЧЁТ · ОДИН ПРОГРАММИСТ" number="№ 2026-01" tilt={-4}>
            <ReceiptLine label="BACKEND-РАЗРАБОТЧИК" value={`${fmt(salary)} ₽`} strong size={30} delay={-100} />
            <ReceiptLine label="ПЕРИОД" value="1 МЕСЯЦ" size={26} delay={-100} />
            <ReceiptRule strong />
            <ReceiptLine label="МЕДИАНА ПО РЫНКУ" value="BACKEND · 2026" faded size={21} delay={-100} />
            <ReceiptLine label="ИСТОЧНИК" value="ХАБР КАРЬЕРА · 2026" faded size={21} delay={-100} />
          </Receipt>
          <Strike at={6} width={700} thick={18} style={{ left: -30, top: 150, transform: "rotate(-14deg)" }} />
          <Strike at={10} width={700} thick={18} style={{ left: -30, top: 230, transform: "rotate(-14deg)" }} />
        </div>
      </Glitch>

      {/* today's receipt */}
      <div style={{ position: "absolute", left: 640, top: 130, zIndex: 6 }}>
        <Receipt width={600} printFrom={4} printFrames={20} title="СЧЁТ · ТА ЖЕ РАБОТА" number="№ 2026-02" tilt={1.5}>
          <ReceiptLine label="CLAUDE MAX · ПОДПИСКА" value={`${price} $`} strong size={30} delay={10} />
          <ReceiptLine label="ПЕРИОД" value="1 МЕСЯЦ" size={26} delay={14} />
          <ReceiptRule strong />
          <ReceiptLine label="ЦЕНА В ЕВРОПЕ" value="€90" faded size={21} delay={18} />
          <ReceiptLine label="ИСТОЧНИК" value="CLAUDE.COM/PRICING" faded size={21} delay={21} />
          <ReceiptLine label="СРОК ВЫПОЛНЕНИЯ" value="МИНУТЫ" faded size={21} delay={24} />
        </Receipt>
      </div>

      {/* the evidence: the real pricing card in a HUD card */}
      <MediaCard src={PRICING.src} at={14} x={1320} y={150} w={460} h={458} tilt={-6} label="CLAUDE.COM" meta="ТАРИФЫ · 2026" grade={false} />
      {frame >= priceAt && <div style={{ position: "absolute", left: 1320 + 0.04 * 460, top: 150 + 0.6 * 458, width: 0.34 * 460, height: 0.17 * 458, zIndex: 8, border: `6px solid ${palette.primary}`, borderRadius: 16, boxShadow: `0 0 24px ${palette.glow}` }} />}
      {frame >= priceAt + 6 && <GlassChip at={priceAt + 6} x={1330} y={660} text="РАБОТАЕТ 24/7 · БЕЗ ОТПУСКА" hero size={22} />}

      {/* the price, spoken: the one lime figure */}
      {frame >= priceAt && (
        <div style={{ position: "absolute", left: 650, top: 600, zIndex: 9, display: "flex", alignItems: "flex-end", gap: 26 }}>
          <Slam text={`${price} $`} at={priceAt} size={210} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 20 }}>
            <Label at={priceAt + 4} size={26} rotate={1.5}>В МЕСЯЦ</Label>
            <Label at={priceAt + 8} size={22}>≈ €90 · CLAUDE MAX</Label>
          </div>
        </div>
      )}

      <Burst at={priceAt} x={900} y={700} />
      <Flash amount={open.energy * 0.8} color={colors.bad} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};
