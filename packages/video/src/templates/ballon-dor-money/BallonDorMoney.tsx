// ВЫПУСК 22 «Экономика Золотого мяча». One object, the trophy, and a price
// tag that climbs beat by beat: 3 000 € of brass and gilt, 0 € to the winner,
// £3 000 a ticket, 600 000 € at auction, +10 M € on a market value, up to
// 16 M € to the organisers. Sources: studio/briefs/ballon-dor-money/WORK.md.
import React from "react";
import { OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, usePunch } from "../../reel";
import { bdColors as colors, bdPalette as palette } from "./palette";
import { BrandBar, CutWipe, DuoClip, FactTag, Flash, FlyIn, Glitch, GoldBall, Kinetic, Label, Numbers, Pill, PriceTag, Progress, Rise, Ring, SceneShell, Slam, SpeedLines, Stamp, SubscribeCard, TicketStub, Ticker, WIDE, clamp, media } from "./ui";
import { DURATION, HOOK, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { PRESENTER } from "./presenter";
import type { BallonDorMoneyProps } from "./schema";

const I = "images/ballon-dor-money/";
const M = "media/ballon-dor-money/";
const S = (s: number, fps: number) => Math.round(s * fps);
/** Scene-local second of a word: line lead 0.1 + Whisper time / VO_RATE. */
const W = (t: number) => 0.1 + t / VO_RATE;

const A = {
  gold: M + "gold.mp4",
  bigben: M + "bigben.mp4",
  gavelClip: M + "gavel.mp4",
  stadium: M + "stadium.mp4",
  paparazzi: M + "paparazzi.mp4",
  cash: M + "cash.mp4",
  arena: M + "arena.mp4",
  goldliquid: M + "goldliquid.mp4",
  ronaldo: I + "ronaldo.png",
  dembele: I + "dembele.png",
  palladium: I + "palladium.jpg",
  ff: I + "ff-logo.jpg",
  gavel: I + "gavel.png",
  cash500: I + "cash500.png",
  camera: I + "camera.png",
  rolexDj: I + "rolex-dj.png",
  rolexSub: I + "rolex-sub.png",
  ticketbox: I + "ticketbox.jpg",
};

/* --------------------------------------------------------------- hook */

const Presenter: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((PRESENTER.punch.duration / VO_RATE) * fps);
  const k = frame - from;
  if (k < 0 || k >= len) return null;
  const inP = interpolate(k, [0, 4], [0, 1], { easing: theme.ease.out, ...clamp });
  const out = interpolate(k, [len - 5, len], [0, 1], { easing: theme.ease.in, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 6, overflow: "hidden", opacity: inP * (1 - out) }}>
      <Sequence from={from} layout="none">
        {/* HeyGen letterboxes the look in 9:16 (band y 656-1264): scale to fill, face to mid-frame */}
        <OffthreadVideo src={media("presenter/ballon-dor-money/" + PRESENTER.punch.file)} muted playbackRate={VO_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateY(400px) scale(${3.2 + k * 0.0015})`, transformOrigin: "50% 50%" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}E6 0%, ${palette.bg}10 26%, transparent 55%, ${palette.bg}EE 82%)` }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 10px ${colors.bad}`, opacity: 0.5 + Math.sin(frame / 4) * 0.2 }} />
    </div>
  );
};

/** Cover headline: already down on frame 0, words pulse in lime blocks. */
const HookWords: React.FC<{ words: string[]; size: number; at?: number }> = ({ words, size, at = -40 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, rowGap: 6, fontFamily: WIDE, fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
      {words.map((w, i) => {
        const t = at + i * 4;
        const p = interpolate(frame - t, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
        const burn = interpolate(frame - t, [2, 14], [1, 0], { easing: theme.ease.out, ...clamp });
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: frame >= t ? 1 : 0, transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [1.4, 1])})`, transformOrigin: "left bottom" }}>
            <span style={{ position: "absolute", inset: "-0.04em -0.1em -0.02em", background: palette.primary, opacity: burn }} />
            <span style={{ position: "relative", color: burn > 0.5 ? colors.ink2 : palette.text, textShadow: `0 6px 30px ${palette.bg}` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceAt = S(HOOK.face, fps);
  const faceEnd = faceAt + Math.round((PRESENTER.punch.duration / VO_RATE) * fps);
  const zeroAt = S(4.24 / VO_RATE, fps);
  const goAt = S(6.32 / VO_RATE, fps);
  const phase = frame < faceAt ? 0 : frame < faceEnd ? 1 : 2;
  const face = usePunch(faceAt, 14);
  const zero = usePunch(zeroAt, 14);
  const after = usePunch(faceEnd, 16);
  const go = usePunch(goAt, 14);
  const tear = interpolate(frame - faceEnd, [0, 2, 9], [0, 1, 0], clamp);
  return (
    <SceneShell exit={false} shake={zero.shake * 0.7 + after.shake * 0.5 + go.shake * 0.5}>
      <Glitch amount={tear + interpolate(frame - faceAt, [0, 2, 8], [0, 1, 0], clamp)} style={{ position: "absolute", inset: 0 }}>
        <DuoClip src={A.gold} dim={0.3} startFrom={0} />
      </Glitch>
      <Numbers items={["3 000 €", "0 €", "7 КГ", "18 КАРАТ", "1956", "£3 000", "16 МЛН €", "BALLON D'OR"]} />
      {/* phase 0: the cover. The ball whole, the price under it */}
      {phase === 0 && (
        <>
          <GoldBall x={300} y={620} w={480} at={-30} />
          <div style={{ position: "absolute", left: 100, right: 100, top: 1210, zIndex: 9, transform: `scale(${1 + Math.sin(frame / 6) * 0.012})`, transformOrigin: "left center" }}>
            <PriceTag at={-20} text="3 000 €" size={150} label="ЛАТУНЬ И ПОЗОЛОТА · 7 КГ · ЦЕНА МАТЕРИАЛОВ" eyebrow="ЦЕНА ЗОЛОТОГО МЯЧА" />
          </div>
        </>
      )}
      <Presenter from={faceAt} />
      {/* phase 1: the face, and the zero */}
      {phase === 1 && frame >= zeroAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={150} rotate={-7} delay={zeroAt}>0 €</Stamp>
        </div>
      )}
      {/* phase 2: the money around it */}
      {phase === 2 && (
        <>
          <GoldBall x={390} y={640} w={300} at={faceEnd} />
          <FlyIn src={A.cash500} from="left" at={faceEnd + 3} x={40} y={620} w={340} rot={-8} />
          {/* author note 3: real Rolexes, cleanly cut */}
          <FlyIn src={A.rolexDj} from="right" at={faceEnd + 7} x={720} y={560} w={300} rot={8} />
          <FlyIn src={A.rolexSub} from="right" at={faceEnd + 10} x={800} y={860} w={170} rot={-6} />
          <FlyIn src={A.camera} from="bottom" at={faceEnd + 12} x={120} y={950} w={170} rot={4} />
          <FlyIn src={A.gavel} from="bottom" at={faceEnd + 15} x={470} y={1010} w={260} rot={-4} />
        </>
      )}
      {phase === 2 && frame >= goAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1400, zIndex: 12, display: "flex", justifyContent: "center" }}>
          <Stamp tone="hero" size={110} rotate={-6} delay={goAt}>ПОГНАЛИ!</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 100, right: 100, top: 250, zIndex: 9 }}>
        {phase === 0 && <HookWords words={["ЗОЛОТОЙ", "МЯЧ", "2026"]} size={104} />}
        {phase === 1 && (
          <>
            <div style={{ display: "inline-block", marginBottom: 16, padding: "8px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", transform: "rotate(-2deg)", boxShadow: `0 0 30px ${colors.badGlow}` }}>
              ПРИЗОВЫЕ · FRANCE FOOTBALL И UEFA
            </div>
            <Kinetic text="ПОБЕДИТЕЛЮ НЕ ПЛАТЯТ" size={92} delay={faceAt} per={3} mode="snap" bad={[1, 2]} lineHeight={1.02} />
          </>
        )}
        {phase === 2 && <Kinetic text="НО ВОКРУГ КРУТЯТСЯ МИЛЛИОНЫ" size={84} delay={faceEnd} per={3} mode="snap" hero={[3]} lineHeight={1.02} />}
      </div>
      <SpeedLines at={faceEnd} y={880} />
      <SpeedLines at={goAt} y={1450} />
      <Flash amount={face.energy * 0.7} color={colors.bad} />
      <Flash amount={zero.energy} color={colors.bad} />
      <Flash amount={after.energy * 0.8} />
    </SceneShell>
  );
};

/* -------------------------------------------------------------- facts */

const Fact: React.FC<{
  clip: string;
  n: number;
  kicker: string;
  title: string;
  titleHero?: number[];
  titleBad?: number[];
  titleSize?: number;
  numbers: string[];
  numAtS: number;
  stampAtS: number;
  stamp: { text: string; tone: "bad" | "hero"; size?: number };
  ball?: boolean;
  children: (f: { numAt: number; stampAt: number; fps: number }) => React.ReactNode;
}> = ({ clip, n, kicker, title, titleHero, titleBad, titleSize = 84, numbers, numAtS, stampAtS, stamp, ball = true, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numAt = S(numAtS, fps);
  const stampAt = S(stampAtS, fps);
  const num = usePunch(numAt, 14);
  const st = usePunch(stampAt, 16);
  const tear = interpolate(frame, [0, 1, 8], [0, 1, 0], clamp);
  const zoom = 1 + num.pop * 0.03 + st.pop * 0.04;
  return (
    <SceneShell shake={num.shake * 0.5 + st.shake * 0.7}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
          <DuoClip src={clip} startFrom={0} />
        </Glitch>
        <Numbers items={numbers} />
        <FactTag n={n} of={6} kicker={kicker} />
        {ball && <GoldBall x={850} y={196} w={120} at={2} z={9} halo={false} />}
        <div style={{ position: "absolute", left: 100, right: 100, top: 330, zIndex: 7 }}>
          <Kinetic text={title} size={titleSize} delay={4} per={3} mode="snap" hero={titleHero} bad={titleBad} lineHeight={1.02} />
        </div>
        {children({ numAt, stampAt, fps })}
        {frame >= stampAt && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1400, zIndex: 12, display: "flex", justifyContent: "center" }}>
            <Stamp tone={stamp.tone} size={stamp.size ?? 84} rotate={-6} delay={stampAt}>{stamp.text}</Stamp>
          </div>
        )}
      </div>
      <SpeedLines at={numAt} x={360} y={820} />
      <Flash amount={num.energy * 0.6} />
      <Flash amount={st.energy} color={stamp.tone === "hero" ? palette.primary : colors.bad} />
      <CutWipe />
    </SceneShell>
  );
};

const Ticket: React.FC = () => (
  <Fact clip={A.bigben} n={1} kicker="ЛОНДОН · 26.10.2026" title="БИЛЕТ НА ЦЕРЕМОНИЮ" titleSize={84} numbers={["£2 500", "+20%", "£3 000", "PALLADIUM", "70", "SOLD OUT"]} numAtS={W(2.16)} stampAtS={W(3.34)} stamp={{ text: "= ЦЕНА МЯЧА", tone: "hero", size: 88 }}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 100, top: 590, zIndex: 6 }}>
          <TicketStub at={6} />
        </div>
        <div style={{ position: "absolute", left: 100, top: 880, zIndex: 7 }}>
          <PriceTag at={numAt} text="£3 000" size={130} label="UEFA: £2 500 + НДС 20%" />
        </div>
        <FlyIn src={A.palladium} from="right" at={14} x={730} y={850} w={260} rot={5} card />
      </>
    )}
  </Fact>
);

const Ronaldo: React.FC = () => (
  <Fact clip={A.gavelClip} n={2} kicker="АУКЦИОН · ЛОНДОН · 2017" title="РОНАЛДУ ПРОДАЛ СВОЙ МЯЧ" titleSize={80} numbers={["600 000 €", "×200", "2013", "MAKE-A-WISH", "LOT 1", "SOLD"]} numAtS={W(2.3)} stampAtS={W(3.1) + 0.2} stamp={{ text: "×200 К ЦЕНЕ МЯЧА", tone: "hero", size: 76 }}>
    {({ numAt }) => (
      <>
        <FlyIn src={A.ronaldo} from="right" at={4} x={690} y={540} w={290} rot={3} z={3} />
        <div style={{ position: "absolute", left: 100, top: 640, zIndex: 7 }}>
          <PriceTag at={numAt} text="600 000 €" size={104} roll={{ from: 3000, to: 600000, suffix: " €" }} label="МЯЧ 2013 · БЛАГОТВОРИТЕЛЬНЫЙ АУКЦИОН" />
        </div>
        <FlyIn src={A.gavel} from="left" at={numAt - 8} x={80} y={960} w={340} rot={-6} />
      </>
    )}
  </Fact>
);

const Dembele: React.FC = () => (
  <Fact clip={A.stadium} n={3} kicker="TRANSFERMARKT · 10.2025" title="ДЕМБЕЛЕ ПОДОРОЖАЛ" titleSize={88} numbers={["90", "100", "+10", "PSG", "2025", "+11%"]} numAtS={W(1.98)} stampAtS={W(2.22) + 0.7} stamp={{ text: "+11%", tone: "hero", size: 120 }}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 100, top: 600, zIndex: 7 }}>
          <PriceTag at={numAt} text="+10 МЛН €" size={116} label="РЫНОЧНАЯ ЦЕНА ПОСЛЕ МЯЧА 2025" />
        </div>
        <div style={{ position: "absolute", left: 100, top: 960, zIndex: 6 }}>
          <Rise at={numAt + 6} from={90} to={100} max={100} labels={["ДО", "ПОСЛЕ"]} />
        </div>
        <FlyIn src={A.dembele} from="right" at={6} x={650} y={880} w={340} rot={4} z={5} />
      </>
    )}
  </Fact>
);

const Gala: React.FC = () => (
  <Fact clip={A.paparazzi} n={4} kicker="UEFA + GROUPE AMAURY" title="ОРГАНИЗАТОРЫ ПОЛУЧАЮТ" titleSize={70} numbers={["16 МЛН €", "10 МЛН €", "ТВ", "СПОНСОРЫ", "£3 000", "LIVE"]} numAtS={W(2.6)} stampAtS={W(3.92) + 0.3} stamp={{ text: "ИГРОКУ: 0 €", tone: "bad", size: 84 }} ball={false}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 100, top: 590, zIndex: 7 }}>
          <PriceTag at={numAt} text="ДО 16 МЛН €" size={96} roll={{ from: 3, to: 16, prefix: "ДО ", suffix: " МЛН €" }} label="ЗА 1 ЦЕРЕМОНИЮ · ОЦЕНКА FUTBOLNOMICS" />
        </div>
        <div style={{ position: "absolute", left: 100, top: 950, width: 620, zIndex: 6, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {["СПОНСОРЫ", "ТВ-ПРАВА", "БИЛЕТЫ", "ЧАСЫ", "СТАВКИ", "АВИАКОМПАНИЯ"].map((t, i) => (
            <Pill key={t} at={8 + i * 4} rot={i % 2 ? 3 : -3}>{t}</Pill>
          ))}
        </div>
        <FlyIn src={A.camera} from="right" at={10} x={780} y={880} w={200} rot={6} />
      </>
    )}
  </Fact>
);

const Magazine: React.FC = () => (
  <Fact clip={A.cash} n={5} kicker="FRANCE FOOTBALL · С 1956" title="ПРЕМИЯ КОРМИТ ЖУРНАЛ" titleSize={82} numbers={["85%", "75%", "70 000", "1956", "€3 МЛН", "FF"]} numAtS={W(0.34)} stampAtS={W(2.84) + 0.2} stamp={{ text: "ТИРАЖ < 70 000", tone: "bad", size: 80 }}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 80, top: 650, zIndex: 6 }}>
          <Ring at={numAt} pct={85} size={400} prefix="ДО" />
        </div>
        <FlyIn src={A.ff} from="right" at={numAt + 6} x={560} y={720} w={420} rot={5} card />
        <div style={{ position: "absolute", left: 100, top: 1080, zIndex: 7, display: "flex", flexDirection: "column", gap: 10 }}>
          <Label at={numAt + 8} size={26} tone="lime">ЛЬВИНАЯ ДОЛЯ</Label>
          <Label at={numAt + 12} size={24}>ДО 85% ДОХОДОВ БРЕНДА · ОЦЕНКА FUTBOLNOMICS</Label>
        </div>
      </>
    )}
  </Fact>
);

const Winner: React.FC<{ w: BallonDorMoneyProps["winner"] }> = ({ w }) => (
  <Fact clip={A.arena} n={6} kicker="ЛОНДОН · 26.10.2026" title={`МЯЧ 2026: ${w.name}`} titleHero={[2]} titleSize={86} numbers={[`${w.value} МЛН €`, "2026", "0 €", "70", "LONDON", "№1"]} numAtS={W(1.98)} stampAtS={W(2.94) + 0.3} stamp={{ text: "ПРИЗОВЫХ: 0 €", tone: "bad", size: 80 }} ball={false}>
    {({ numAt }) => (
      <>
        <FlyIn src={w.photo} from="right" at={2} x={620} y={800} w={380} rot={3} z={3} />
        <GoldBall x={130} y={1000} w={170} at={numAt + 10} z={6} />
        <div style={{ position: "absolute", left: 100, top: 620, zIndex: 7 }}>
          <PriceTag at={numAt} text={`${w.value} МЛН €`} size={110} roll={{ from: 0, to: w.value, suffix: " МЛН €" }} label={`ЦЕНА НА TRANSFERMARKT · ${w.club}`} eyebrow="ЦЕНА ПОБЕДИТЕЛЯ" />
        </div>
      </>
    )}
  </Fact>
);

/* -------------------------------------------------------------- final */

const Final: React.FC<{ question: string; credits: string }> = ({ question, credits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zeroAt = S(W(0.8), fps);
  const millAt = S(W(3.22), fps);
  const cardAt = S(W(4.06), fps);
  const z = usePunch(zeroAt, 14);
  const m = usePunch(millAt, 16);
  return (
    <SceneShell exit={false} shake={z.shake * 0.6 + m.shake * 0.6}>
      <Glitch amount={interpolate(frame, [0, 1, 8], [0, 1, 0], clamp)} style={{ position: "absolute", inset: 0 }}>
        <DuoClip src={A.goldliquid} dim={0.45} startFrom={0} />
      </Glitch>
      <Numbers items={["3 000 €", "0 €", "£3 000", "600 000 €", "+10 МЛН €", "16 МЛН €", "85%"]} />
      <GoldBall x={370} y={620} w={340} at={-30} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 230, zIndex: 8, display: "flex", flexDirection: "column", gap: 18 }}>
        <Label at={2} size={28} tone="bad">ИГРОКУ</Label>
        <Slam text="0 €" at={zeroAt} size={130} color={colors.bad} />
      </div>
      <div style={{ position: "absolute", right: 100, top: 420, zIndex: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
        <Label at={millAt - 6} size={28} tone="lime">ОРГАНИЗАТОРУ</Label>
        <Slam text="ДО 16 МЛН €" at={millAt} size={88} />
      </div>
      <SubscribeCard at={cardAt} question={question} top={1110} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 1680, zIndex: 21, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 15, lineHeight: 1.35, color: palette.textDim }}>
        {credits}
      </div>
      <SpeedLines at={zeroAt} x={250} y={330} color={colors.bad} />
      <SpeedLines at={millAt} x={700} y={520} />
      <Flash amount={z.energy * 0.8} color={colors.bad} />
      <Flash amount={m.energy * 0.8} />
      <CutWipe />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- root */

const CREDITS =
  "Goal.com · UEFA · Futbolnomics · ESPN · Transfermarkt · Фото: Ank Kumar, Anish Morarji, FrankWilliams, anna2005, Антон Зайцев, Number 10, Bryan Berlin, Кирилл Венедиктов, MrsEllacott / Wikimedia Commons, CC BY / CC BY-SA · Pexels";

const Overlay: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Progress total={Math.round(DURATION * fps)} />
      <BrandBar series="ДЕНЬГИ · ПРОСТО" episode="ВЫПУСК 22" delay={-30} />
      <Ticker items={["BALLON D'OR 2026", "LONDON PALLADIUM 26.10", "МЯЧ: 3 000 €", "ПРИЗОВЫЕ: 0 €", "БИЛЕТ: £3 000", "ОРГАНИЗАТОРЫ: ДО 16 МЛН €", "ВЫПУСК 22"]} />
    </>
  );
};

export const BallonDorMoney: React.FC<BallonDorMoneyProps> = ({ question, winner }) => (
  <Reel
    palette={palette}
    voiceoverDir="ballon-dor-money"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    captions={{ top: 1240, fontSize: 52, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}` }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <Hook />
    </Scene>
    <Scene spec={SCENES.ticket} name="02 ticket">
      <Ticket />
    </Scene>
    <Scene spec={SCENES.ronaldo} name="03 ronaldo">
      <Ronaldo />
    </Scene>
    <Scene spec={SCENES.dembele} name="04 dembele">
      <Dembele />
    </Scene>
    <Scene spec={SCENES.gala} name="05 gala">
      <Gala />
    </Scene>
    <Scene spec={SCENES.magazine} name="06 magazine">
      <Magazine />
    </Scene>
    <Scene spec={SCENES.winner} name="07 winner">
      <Winner w={winner} />
    </Scene>
    <Scene spec={SCENES.final} name="08 final">
      <Final question={question} credits={CREDITS} />
    </Scene>
    <Overlay />
  </Reel>
);
