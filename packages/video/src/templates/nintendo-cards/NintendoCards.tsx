// ИСТОРИИ КОМПАНИЙ · 01 «Nintendo: от колоды карт до Switch». A comic page
// per beat: every photo printed in ink on series paper, lime for the win, red
// for the flop. Facts and sources: scripts/scenarios/nintendo-cards.md.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, usePunch } from "../../reel";
import { ncColors as colors, ncPalette as palette } from "./palette";
import { Boom, BrandBar, Bubble, ComicBg, ComicClip, CutWipe, Flash, FlyIn, InkCut, Kinetic, Label, Panel, Progress, SceneShell, Slam, SpeedLines, Stamp, SubscribeCard, Ticker, UltraHand, WIDE, Year, clamp } from "./ui";
import { DURATION, LEAD, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import type { NintendoCardsProps } from "./schema";

const I = "images/nintendo-cards/";
const M = "media/nintendo-cards/";
const S = (s: number, fps: number) => Math.round(s * fps);
/** Scene-local second of a word: ASR time at 1.0× / VO_RATE, after the line's lead. */
const W = (t: number, lead = LEAD) => lead + t / VO_RATE;

const A = {
  kyoto: M + "kyoto.mp4",
  taxiClip: M + "taxi.mp4",
  arcade: M + "arcade.mp4",
  handheld: M + "handheld.mp4",
  cards: M + "cards.mp4",
  mario: I + "mario.jpg",
  hotel: I + "hotel.jpg",
  rice: I + "rice-cut.png",
  taxiCar: I + "taxi-cut.png",
  warehouse: I + "warehouse.jpg",
  shop: I + "shop1889.jpg",
  plate: I + "plate.jpg",
  box: I + "hanafuda-box.jpg",
  hana1870: I + "hanafuda-1870.jpg",
  koikoi: I + "koikoi.jpg",
  marufuku: I + "marufuku.jpg",
  patent: I + "patent.png",
  gameboy: I + "gameboy-cut.png",
  switch: I + "switch-cut.png",
  arcadeCut: I + "dk-arcade-cut.png",
};

/** A label pinned to a panel's top-left corner. */
const Tag: React.FC<{ at: number; tone?: "paper" | "bad" | "lime"; size?: number; x?: number; y?: number; children: React.ReactNode }> = ({ at, tone = "paper", size = 24, x = -14, y = -22, children }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 3 }}>
    <Label at={at} size={size} tone={tone} rotate={-2}>{children}</Label>
  </div>
);

/** Red «ПРОВАЛ» stamped across a panel. */
const Flop: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stamp tone="bad" size={70} rotate={-12} delay={at}>ПРОВАЛ</Stamp>
    </div>
  );
};

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = (t: number) => S(W(t, 0), fps);
  const cardsAt = H(2.96);
  const taxiAt = H(4.08);
  const hotelAt = H(5.08);
  const c = usePunch(cardsAt, 14);
  const t = usePunch(taxiAt, 14);
  const h = usePunch(hotelAt, 14);
  const burn = interpolate(frame, [0, 10], [1, 0], { easing: theme.ease.out, ...clamp });
  return (
    <SceneShell exit={false} shake={c.shake * 0.5 + t.shake * 0.4 + h.shake * 0.6}>
      <ComicBg />
      {/* cover: the title and Mario, whole on frame 0 */}
      <div style={{ position: "absolute", left: 100, right: 100, top: 230, zIndex: 9 }}>
        <div style={{ position: "relative", display: "inline-block", fontFamily: WIDE, fontWeight: 900, fontSize: 124, lineHeight: 1, letterSpacing: "-0.02em", color: palette.text, transform: `scale(${1 + Math.sin(frame / 7) * 0.01})`, transformOrigin: "left center", textShadow: "8px 10px 0 rgba(0,0,0,0.6)" }}>
          <span style={{ position: "absolute", inset: "-0.04em -0.12em", background: palette.primary, opacity: burn * 0.9 }} />
          <span style={{ position: "relative" }}>NINTENDO</span>
        </div>
        <div style={{ marginTop: 22, display: "flex" }}>
          <Label at={-30} size={28} tone="lime" rotate={-2}>137 ЛЕТ · КИОТО · С 1889</Label>
        </div>
      </div>
      <Panel x={170} y={520} w={740} h={700} at={-30} rot={-3} src={A.mario} focus={[50, 40]} out={cardsAt - 4}>
        <Tag at={-30} size={26}>ТЫ ЗНАЕШЬ ЕГО</Tag>
      </Panel>
      <Bubble text="ЭТО Я!" at={H(1.46)} x={640} y={470} w={330} size={50} tail="left" />
      {/* the turn: cards, taxi, hotel */}
      <Panel x={100} y={520} w={880} h={330} at={cardsAt} from="left" rot={-2} src={A.hana1870} focus={[50, 30]}>
        <Tag at={cardsAt + 4} tone="lime" size={26}>1889 · ИГРАЛЬНЫЕ КАРТЫ</Tag>
      </Panel>
      <Panel x={100} y={880} w={430} h={360} at={taxiAt} from="bottom" rot={2} clip={A.taxiClip}>
        <Tag at={taxiAt + 4}>ТАКСИ</Tag>
      </Panel>
      <Panel x={560} y={880} w={420} h={360} at={hotelAt} from="right" rot={-1.5} src={A.hotel} focus={[55, 35]}>
        <Tag at={hotelAt + 4} tone="bad">ОТЕЛИ НА ЧАС</Tag>
      </Panel>
      <Boom text="?!" at={H(5.5)} x={880} y={860} size={200} tone="bad" rot={10} />
      <SpeedLines at={cardsAt} x={540} y={690} />
      <Flash amount={c.energy * 0.8} />
      <Flash amount={h.energy * 0.7} color={colors.bad} />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- cards */

const Cards: React.FC = () => {
  const { fps } = useVideoConfig();
  const yearAt = S(W(0.05), fps);
  const centuryAt = S(W(1.14), fps);
  const kyotoAt = S(W(2.2), fps);
  const founderAt = S(W(2.9), fps);
  const cardsAt = S(W(4.08), fps);
  const y = usePunch(yearAt, 14);
  const c = usePunch(cardsAt, 14);
  return (
    <SceneShell shake={y.shake * 0.5 + c.shake * 0.5}>
      <ComicBg />
      <ComicClip src={A.kyoto} dim={0.6} />
      <div style={{ position: "absolute", left: 100, top: 230, zIndex: 9 }}>
        <Year from={1889} to={1889} at={yearAt} size={200} />
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <Label at={centuryAt} size={28} tone="lime" rotate={-2}>XIX ВЕК</Label>
          <Label at={kyotoAt} size={28} rotate={-2}>КИОТО · ЯПОНИЯ</Label>
        </div>
      </div>
      <Panel x={100} y={540} w={880} h={400} at={4} from="right" rot={1.5} src={A.shop} focus={[55, 45]}>
        <Tag at={10}>ПЕРВАЯ ЛАВКА NINTENDO</Tag>
      </Panel>
      <div style={{ position: "absolute", left: 100, top: 985, zIndex: 9 }}>
        <Label at={founderAt} size={24} tone="lime" rotate={-2}>ФУСАДЗИРО ЯМАУТИ</Label>
        <div style={{ marginTop: 8 }}>
          <Label at={founderAt + 4} size={20} rotate={-2}>ОСНОВАТЕЛЬ</Label>
        </div>
      </div>
      <FlyIn from="left" at={founderAt + 6} x={130} y={1080} w={150} rot={-6} sticker={false}>
        <InkCut src={A.marufuku} />
      </FlyIn>
      <Panel x={560} y={970} w={420} h={280} at={cardsAt} from="bottom" rot={3} src={A.box} focus={[55, 60]}>
        <Tag at={cardsAt + 4} size={20}>РУЧНАЯ РАБОТА</Tag>
      </Panel>
      <Boom text="ХАНАФУДА" at={cardsAt + 6} x={790} y={960} size={250} rot={8} life={40} />
      <SpeedLines at={yearAt} x={300} y={330} />
      <Flash amount={y.energy * 0.7} />
      <CutWipe />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- fails */

const Fails: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yearAt = S(W(0.42), fps);
  const noneAt = S(W(2.9), fps);
  const grandAt = S(W(3.78), fps);
  const taxiAt = S(W(5.92), fps);
  const riceAt = S(W(7.08), fps);
  const hotelAt = S(W(9.2), fps);
  const flopAt = S(W(10.38), fps);
  const y = usePunch(yearAt, 14);
  const n = usePunch(noneAt, 16);
  const f = usePunch(flopAt, 18);
  const phaseB = frame >= grandAt;
  const tear = interpolate(frame - grandAt, [0, 2, 8], [0, 1, 0], clamp);
  return (
    <SceneShell shake={y.shake * 0.4 + n.shake * 0.6 + f.shake * 0.8}>
      <ComicBg tone={phaseB ? "bad" : "hero"} />
      {!phaseB && (
        <>
          <div style={{ position: "absolute", left: 100, top: 230, zIndex: 9 }}>
            <Year from={1889} to={1959} at={yearAt} size={200} dur={26} />
            <div style={{ marginTop: 16, display: "flex" }}>
              <Label at={yearAt + 10} size={28} tone="lime" rotate={-2}>ЧЕРЕЗ 70 ЛЕТ</Label>
            </div>
          </div>
          <Panel x={100} y={560} w={880} h={560} at={2} from="bottom" rot={-1.5} src={A.koikoi} focus={[50, 50]}>
            <Tag at={6}>КАРТЫ ХАНАФУДА</Tag>
          </Panel>
          {frame >= noneAt && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 760, zIndex: 12, display: "flex", justifyContent: "center" }}>
              <Stamp tone="bad" size={60} rotate={-8} delay={noneAt}>НИКОМУ НЕ НУЖНЫ</Stamp>
            </div>
          )}
        </>
      )}
      {phaseB && (
        <>
          <div style={{ position: "absolute", left: 100, right: 100, top: 230, zIndex: 9 }}>
            <Kinetic text="ВНУК ПРОБУЕТ ВСЁ" size={82} delay={grandAt} per={3} mode="snap" bad={[2]} lineHeight={1.02} />
            <div style={{ marginTop: 14, display: "flex" }}>
              <Label at={grandAt + 8} size={22} rotate={-2}>ХИРОСИ ЯМАУТИ · ПРЕЗИДЕНТ С 1949</Label>
            </div>
          </div>
          <FlyIn from="left" at={taxiAt} x={60} y={470} w={760} rot={-3} sticker={false} z={5}>
            <div style={{ position: "relative" }}>
              <InkCut src={A.taxiCar} />
              <Flop at={flopAt} />
            </div>
          </FlyIn>
          <div style={{ position: "absolute", left: 640, top: 500, zIndex: 9 }}>
            <Label at={taxiAt + 6} size={24} rotate={3}>ТАКСИ DAIYA · 1960</Label>
          </div>
          <FlyIn from="bottom" at={riceAt} x={100} y={890} w={350} rot={4} sticker={false} z={6}>
            <div style={{ position: "relative" }}>
              <InkCut src={A.rice} />
              <Flop at={flopAt + 4} />
            </div>
          </FlyIn>
          <div style={{ position: "absolute", left: 80, top: 860, zIndex: 9 }}>
            <Label at={riceAt + 6} size={20} rotate={-2}>РИС БЫСТРОГО ПРИГОТОВЛЕНИЯ</Label>
          </div>
          <Panel x={540} y={900} w={440} h={360} at={hotelAt} from="right" rot={-2} src={A.hotel} focus={[55, 35]}>
            <Tag at={hotelAt + 4}>ОТЕЛИ НА ЧАС</Tag>
            <Flop at={flopAt + 8} />
          </Panel>
          <Boom text="ПШИК" at={flopAt + 10} x={540} y={870} size={300} tone="bad" rot={-6} />
        </>
      )}
      <SpeedLines at={yearAt} x={300} y={330} />
      <Flash amount={n.energy} color={colors.bad} />
      <Flash amount={f.energy} color={colors.bad} />
      <Flash amount={tear * 0.6} />
      <CutWipe />
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ hand */

const Hand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fixAt = S(W(0.4), fps);
  const toyAt = S(W(1.6), fps);
  const shootAt = S(W(3.42), fps);
  const sellAt = S(W(5.36), fps);
  const s = usePunch(shootAt, 14);
  const m = usePunch(sellAt, 16);
  const ext = interpolate(frame, [toyAt, shootAt, shootAt + 10], [0, 0.12, 1], { easing: theme.ease.out, ...clamp }) * (1 + Math.sin(frame / 6) * 0.015 * (frame > shootAt + 10 ? 1 : 0));
  return (
    <SceneShell shake={s.shake * 0.6 + m.shake * 0.6}>
      <ComicBg />
      <ComicClip src={A.cards} dim={0.62} />
      <div style={{ position: "absolute", left: 100, top: 230, zIndex: 9, display: "flex", flexDirection: "column", gap: 12 }}>
        <Label at={2} size={28} rotate={-2}>1966 · ФАБРИКА КАРТ</Label>
        <Label at={fixAt} size={24} tone="lime" rotate={-2}>РЕМОНТНИК ГУМПЭЙ ЁКОИ</Label>
      </div>
      <Panel x={500} y={380} w={480} h={380} at={4} from="right" rot={3} src={A.plate} focus={[50, 50]}>
        <Tag at={8} size={20}>ФАБРИКА NINTENDO</Tag>
      </Panel>
      {frame >= toyAt && <UltraHand x={150} y={870} ext={ext} rot={-4} segs={6} bar={128} />}
      <Boom text="БАМ!" at={shootAt + 6} x={820} y={780} size={230} rot={-10} life={34} />
      <div style={{ position: "absolute", left: 100, top: 1010, zIndex: 11, display: "flex", flexDirection: "column", gap: 12 }}>
        <Slam text="1 000 000+" at={sellAt} size={112} roll={{ from: 0, to: 1000000, suffix: "+" }} />
        <Label at={sellAt + 8} size={22} rotate={-1}>ULTRA HAND · ПРОДАНО ШТУК</Label>
      </div>
      <SpeedLines at={shootAt} x={760} y={860} />
      <SpeedLines at={sellAt} x={420} y={1060} />
      <Flash amount={s.energy * 0.6} />
      <Flash amount={m.energy * 0.35} />
      <CutWipe />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- gameboy */

const Gameboy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gbAt = S(W(1.66), fps);
  const g = usePunch(gbAt, 14);
  return (
    <SceneShell shake={g.shake * 0.6}>
      <ComicBg />
      <Panel x={100} y={250} w={440} h={640} at={-2} from="left" rot={-3} src={A.patent} fit="contain" focus={[50, 40]}>
        <Tag at={2} size={20}>ЧЕРТЁЖ ЁКОИ · GAME & WATCH</Tag>
      </Panel>
      <UltraHand x={60} y={1080} ext={1} rot={-14} segs={5} bar={124} />
      <FlyIn from="bottom" at={gbAt - 4} x={600} y={300} w={330} rot={6} sticker={false}>
        <InkCut src={A.gameboy} />
      </FlyIn>
      <div style={{ position: "absolute", left: 590, top: 880, zIndex: 11 }}>
        <Label at={gbAt + 6} size={26} tone="lime" rotate={-3}>GAME BOY · 1989</Label>
      </div>
      <Boom text="GAME BOY!" at={gbAt} x={770} y={1080} size={300} rot={-8} life={24} />
      <SpeedLines at={gbAt} x={760} y={600} />
      <Flash amount={g.energy * 0.8} />
      <CutWipe />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- mario */

const Mario: React.FC = () => {
  const { fps } = useVideoConfig();
  const dkAt = S(W(0.66), fps);
  const rentAt = S(W(2.2), fps);
  const nameAt = S(W(3.94), fps);
  const marioAt = S(W(4.32), fps);
  const n = usePunch(nameAt, 14);
  const m = usePunch(marioAt, 16);
  return (
    <SceneShell shake={n.shake * 0.5 + m.shake * 0.7}>
      <ComicBg />
      <ComicClip src={A.arcade} dim={0.6} />
      <div style={{ position: "absolute", left: 100, top: 230, zIndex: 9 }}>
        <Label at={2} size={28} rotate={-2}>1981 · NINTENDO В США</Label>
      </div>
      <Panel x={100} y={340} w={560} h={600} at={2} from="left" rot={-2} src={A.warehouse} focus={[50, 55]}>
        <Tag at={6} size={22}>СКЛАД В СИЭТЛЕ</Tag>
      </Panel>
      <FlyIn from="right" at={dkAt} x={720} y={420} w={230} rot={5} sticker={false}>
        <InkCut src={A.arcadeCut} />
      </FlyIn>
      <div style={{ position: "absolute", left: 700, top: 960, zIndex: 9 }}>
        <Label at={dkAt + 6} size={20} rotate={2}>DONKEY KONG</Label>
      </div>
      <Bubble text="ГДЕ АРЕНДА?!" at={rentAt} x={170} y={440} w={420} size={40} tail="right" rot={-4} />
      <div style={{ position: "absolute", left: 200, top: 400, zIndex: 13 }}>
        <Label at={rentAt + 4} size={18} tone="bad" rotate={-4}>ПО ЛЕГЕНДЕ</Label>
      </div>
      <Panel x={380} y={720} w={600} h={520} at={nameAt} from="right" rot={3} src={A.mario} focus={[50, 35]} z={12} frameColor={palette.primary}>
        <Tag at={nameAt + 4} size={20}>ХОЗЯИН СКЛАДА: МАРИО СЕГАЛЕ</Tag>
      </Panel>
      <Boom text="МАРИО!" at={marioAt} x={300} y={1040} size={380} rot={-10} />
      <SpeedLines at={marioAt} x={680} y={980} />
      <Flash amount={n.energy * 0.6} />
      <Flash amount={m.energy * 0.8} />
      <CutWipe />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- final */

const Final: React.FC<{ question: string; credits: string }> = ({ question, credits }) => {
  const { fps } = useVideoConfig();
  const numAt = S(W(2.0), fps);
  const backAt = S(W(4.14), fps);
  const cardsAt = S(W(5.22), fps);
  const cardAt = S(W(6.18), fps);
  const nn = usePunch(numAt, 16);
  const c = usePunch(cardsAt, 14);
  return (
    <SceneShell exit={false} shake={nn.shake * 0.6 + c.shake * 0.4}>
      <ComicBg />
      <ComicClip src={A.handheld} dim={0.62} />
      <div style={{ position: "absolute", left: 100, top: 230, zIndex: 9 }}>
        <Label at={2} size={28} rotate={-2}>2026 · NINTENDO SWITCH</Label>
      </div>
      <FlyIn from="top" at={2} x={170} y={320} w={740} rot={-3} sticker={false}>
        <InkCut src={A.switch} />
      </FlyIn>
      <div style={{ position: "absolute", left: 100, top: 700, zIndex: 11, display: "flex", flexDirection: "column", gap: 12 }}>
        <Slam text="156 000 000" at={numAt} size={98} roll={{ from: 0, to: 156000000 }} />
        <Label at={numAt + 8} size={20} rotate={-1}>ПРОДАНО SWITCH НА 30.06.2026 · ОТЧЁТ NINTENDO</Label>
      </div>
      <Panel x={100} y={900} w={880} h={230} at={cardsAt} from="bottom" rot={-1.5} src={A.hana1870} focus={[50, 25]}>
        <Tag at={backAt} tone="lime" size={24}>1889 → 2026 · ВСЁ НАЧАЛОСЬ С КАРТ</Tag>
      </Panel>
      <SubscribeCard at={cardAt} question={question} top={1170} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 1690, zIndex: 21, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 15, lineHeight: 1.35, color: palette.textDim }}>
        {credits}
      </div>
      <SpeedLines at={numAt} x={500} y={760} />
      <Flash amount={nn.energy * 0.8} />
      <Flash amount={c.energy * 0.5} />
      <CutWipe />
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ root */

const CREDITS =
  "Nintendo · Wikipedia · Nintendo Wire · Фото: Evan-Amos (PD), fuzzcat, Marcus Richert, Smuckola (CC BY), Joshua Driggs (CC BY-SA) / Wikimedia Commons · Pexels · Pixabay";

const Overlay: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Progress total={Math.round(DURATION * fps)} />
      <BrandBar series="ИСТОРИИ КОМПАНИЙ" episode="ВЫПУСК 01" delay={-30} />
      <Ticker items={["NINTENDO", "1889 · КИОТО", "КАРТЫ ХАНАФУДА", "ТАКСИ, РИС, ОТЕЛИ: ПРОВАЛ", "1966 · ULTRA HAND", "GAME BOY", "МАРИО", "SWITCH: 156 МЛН"]} />
    </>
  );
};

export const NintendoCards: React.FC<NintendoCardsProps> = ({ question }) => (
  <Reel
    palette={palette}
    voiceoverDir="nintendo-cards"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.05}
    captions={{ top: 1310, fontSize: 50, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}` }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <Hook />
    </Scene>
    <Scene spec={SCENES.cards} name="02 cards">
      <Cards />
    </Scene>
    <Scene spec={SCENES.fails} name="03 fails">
      <Fails />
    </Scene>
    <Scene spec={SCENES.hand} name="04 hand">
      <Hand />
    </Scene>
    <Scene spec={SCENES.gameboy} name="05 gameboy">
      <Gameboy />
    </Scene>
    <Scene spec={SCENES.mario} name="06 mario">
      <Mario />
    </Scene>
    <Scene spec={SCENES.final} name="07 final">
      <Final question={question} credits={CREDITS} />
    </Scene>
    <Overlay />
  </Reel>
);
