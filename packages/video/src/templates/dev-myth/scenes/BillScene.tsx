// Beat 1, the human's price. A thermal receipt prints for one programmer,
// the figure slams in lime as it is spoken, and the real Хабр
// Карьера table flies in as the evidence under it.
import React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { usePunch } from "../../../reel";
import { devMythColors as colors } from "../palette";
import { BgVideo, GlassChip, MediaCard } from "../fx2";
import { COVER_END, Cover } from "./Cover";
import { Burst, Drift, Flash, FlyIn, Label, Receipt, ReceiptLine, ReceiptRule, S, SceneShell, Slam, TopBar, media } from "../ui";
import { BILL_T, T } from "../timeline";

/** The article crop (1558×748) and where «Медиана — 254 тысячи рублей» sits in it. */
export const HABR = { src: "images/dev-myth/habr-salary.png", ring: { x: 0.485, y: 0.505, w: 0.41, h: 0.095 } };

export const BillScene: React.FC<{ salary: number; source: string; price: number }> = ({ salary, source, price }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numberAt = S(T(BILL_T.number), fps);
  const monthAt = S(T(BILL_T.ratio), fps);
  const open = usePunch(COVER_END, 12);
  const hit = usePunch(numberAt, 16);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <SceneShell shake={open.shake * 0.4 + hit.shake}>
      <BgVideo src="media/dev-myth/v-money.mp4" dim={0.72} tint={0.35} />
      <Drift items={[`${fmt(salary)} ₽`, "20 ЛЕТ", "×12", "МЕДИАНА", "BACKEND", "₽", "ЗАРПЛАТА", "ОФФЕР"]} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЦЕНА ОДНОГО ПРОГРАММИСТА" />

      {/* the receipt: the series object, printing as the line starts */}
      <div style={{ position: "absolute", left: 110, top: 140, zIndex: 6 }}>
        <Receipt width={620} printFrom={COVER_END} printFrames={18} title="СЧЁТ · ОДИН ПРОГРАММИСТ" number="№ 2026-01" tilt={-2}>
          <ReceiptLine label="BACKEND-РАЗРАБОТЧИК" value={`${fmt(salary)} ₽`} strong size={30} delay={COVER_END + 6} />
          <ReceiptLine label="ПЕРИОД" value="1 МЕСЯЦ" size={26} delay={COVER_END + 9} />
          <ReceiptRule strong />
          <ReceiptLine label="МЕДИАНА ПО РЫНКУ" value="BACKEND · 2026" faded size={21} delay={16} />
          <ReceiptLine label="ИСТОЧНИК" value="ХАБР КАРЬЕРА · 2026" faded size={21} delay={19} />
          <ReceiptLine label="СРОК ДЕЙСТВИЯ" value="20 ЛЕТ" faded size={21} delay={22} />
        </Receipt>
      </div>

      {/* notes 33, 35: real hands counting real dollars, framed (the cut-out looked rough) */}
      <MediaCard src="media/dev-myth/hands-money.mp4" at={COVER_END + 8} x={150} y={520} w={300} h={400} tilt={-6} label="НАЛИЧНЫЕ" meta="PEXELS" />

      {/* the figure, exactly as spoken */}
      {frame >= numberAt && (
        <div style={{ position: "absolute", left: 800, top: 150, zIndex: 9 }}>
          <Slam text={`${fmt(salary)} ₽`} at={numberAt} size={176} />
        </div>
      )}
      <div style={{ position: "absolute", left: 806, top: 350, zIndex: 9, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        {frame >= numberAt + 8 && <Label at={numberAt + 8} size={20}>{source}</Label>}
        {frame >= monthAt && <Label at={monthAt} size={30} tone="lime" rotate={-1.5}>×2,3 К СРЕДНЕЙ ПО СТРАНЕ</Label>}
        {frame >= monthAt + 5 && <Label at={monthAt + 5} size={20}>СРЕДНЯЯ 109 000 ₽ · РОССТАТ, АПРЕЛЬ 2026</Label>}
      </div>

      {/* the evidence: the real table in a HUD card, the line ringed */}
      <MediaCard src={HABR.src} at={numberAt + 8} x={860} y={540} w={820} h={394} tilt={5} label="ХАБР КАРЬЕРА" meta="1-Е ПОЛУГОДИЕ 2026" grade={false} />
      {frame >= numberAt + 26 && <div style={{ position: "absolute", left: 860 + HABR.ring.x * 820, top: 540 + HABR.ring.y * 394, width: HABR.ring.w * 820, height: HABR.ring.h * 394, zIndex: 8, border: `6px solid ${colors.bad}`, borderRadius: 18, boxShadow: `0 0 24px ${colors.badGlow}` }} />}
      {frame >= numberAt + 4 && <GlassChip at={numberAt + 4} x={1380} y={430} text="МЕДИАНА BACKEND" size={22} />}

      <Burst at={numberAt} x={1300} y={240} />
      <Flash amount={open.energy * 0.7} />
      <Flash amount={hit.energy} />
      <Cover salary={salary} price={price} />
    </SceneShell>
  );
};
