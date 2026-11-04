// ВЫПУСК 21 «Что студенты пообещали России?» — Serbia after the 25.10.2026 vote,
// through the Russia link. Hook on the HeyGen face (≤ 3 s), five facts, the
// answer, the subscribe card. Every beat: lime-toned clip, wipe, fly-ins,
// a slammed number with its label, a stamp. Sources: studio/briefs/serbia-economy/WORK.md.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { Reel, Scene, useIn, usePunch } from "../../reel";
import { seColors as colors, sePalette as palette } from "./palette";
import { Arrow, Ash, BrandBar, CutWipe, DuoClip, FactTag, Flash, FlyIn, Glitch, Kinetic, Label, Numbers, Progress, SceneShell, Shockwave, Slam, SpeedLines, Stamp, SubscribeCard, Ticker, clamp, media } from "./ui";
import { DURATION, SCENES, VOICEOVER, VO_RATE } from "./timeline";
import { PRESENTER } from "./presenter";
import type { SerbiaEconomyProps } from "./schema";

const I = "images/serbia-economy/";
const M = "media/serbia-economy/";
const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
const S = (s: number, fps: number) => Math.round(s * fps);

export const ASSETS = {
  shells: M + "shells.mp4",
  belgrade: M + "belgrade.mp4",
  un: M + "un.mp4",
  police: M + "police.mp4",
  airport: M + "airport.mp4",
  refinery: M + "refinery.mp4",
  students: M + "students.mp4",
  shell: I + "shell.png",
  flagRs: I + "flag-rs.png",
  flagUa: I + "flag-ua.png",
  flagRu: "images/kit/flag-ru.png",
  vucic: { src: I + "vucic.png", ratio: 500 / 731 },
  cctv: M + "protest-cctv.mp4",
  flagVideo: M + "flag-rs-wave.mp4",
  vucicAuthor: I + "vucic-author.png", // author's photo (note 5), his rights call
  studentsPhoto: I + "students.jpg",
  unLogo: I + "un-logo.png",
  tired: I + "tired.png",
  fsb: I + "fsb.png",
  lrad: I + "lrad.jpg",
  passport: I + "passport-ru.png",
  plane: I + "airserbia.png",
  nis: I + "nis-logo.png",
  gpn: I + "gazpromneft-logo.png",
  pancevo: I + "pancevo.jpg",
};

/* --------------------------------------------------------------- hook */

const Presenter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round((PRESENTER.punch.duration / VO_RATE) * fps);
  if (frame >= len) return null;
  const out = interpolate(frame, [len - 5, len], [0, 1], { easing: theme.ease.in, ...clamp });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", opacity: 1 - out }}>
      <Sequence from={0} layout="none">
        {/* HeyGen letterboxes the 16:9 look in 9:16: the band is y 656–1264, so scale it to fill and drop the face to mid-frame */}
        <OffthreadVideo src={media("presenter/serbia-economy/" + PRESENTER.punch.file)} muted playbackRate={VO_RATE} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateY(400px) scale(${3.2 + frame * 0.0012})`, transformOrigin: "50% 50%" }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}E6 0%, ${palette.bg}10 26%, transparent 55%, ${palette.bg}EE 80%)` }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 10px ${palette.primary}`, opacity: 0.5 + Math.sin(frame / 4) * 0.2 }} />
    </div>
  );
};

/** Hook headline: on frame 0 already down (the cover), words pulse in lime blocks. */
const HookWords: React.FC<{ words: string[]; bad?: number; size: number; pre?: boolean }> = ({ words, bad, size, pre }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 6, fontFamily: WIDE, fontSize: size, fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
      {words.map((w, i) => {
        const at = pre ? -40 + i * 4 : i * 4;
        const p = interpolate(frame - at, [0, 8], [0, 1], { easing: theme.ease.out, ...clamp });
        const burn = interpolate(frame - at, [2, 14], [1, 0], { easing: theme.ease.out, ...clamp });
        const color = i === bad ? colors.bad : palette.text;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: frame >= at ? 1 : 0, transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px) scale(${interpolate(p, [0, 1], [1.4, 1])})`, transformOrigin: "left bottom" }}>
            <span style={{ position: "absolute", inset: "-0.04em -0.1em -0.02em", background: palette.primary, opacity: burn }} />
            <span style={{ position: "relative", color: burn > 0.5 ? colors.ink2 : color, textShadow: `0 6px 30px ${palette.bg}` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceEnd = Math.round((PRESENTER.punch.duration / VO_RATE) * fps);
  const two = frame >= faceEnd;
  const hit = usePunch(faceEnd, 16);
  const stampAt = faceEnd + S(0.9, fps);
  const stamp = usePunch(stampAt, 14);
  const tear = interpolate(frame - faceEnd, [0, 2, 9], [0, 1, 0], clamp);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.6 + stamp.shake * 0.6}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <DuoClip src={ASSETS.shells} dim={0.35} />
      </Glitch>
      <Numbers items={["€800 000 000", "155 ММ", "FT", "×1 000 000", "БОЛГАРИЯ", "ЧЕХИЯ", "ПОЛЬША", "СВР"]} />
      {/* second half: the route, flag to flag */}
      {two && (
        <>
          <FlyIn src={ASSETS.flagRs} from="left" at={faceEnd + 2} x={60} y={700} w={330} rot={-6} />
          <FlyIn src={ASSETS.flagUa} from="right" at={faceEnd + 6} x={690} y={700} w={330} rot={6} />
          <Arrow at={faceEnd + 10} x={330} y={600} w={420} />
          <FlyIn src={ASSETS.shell} from="bottom" at={faceEnd + 12} x={500} y={640} w={90} rot={62} sticker />
          <div style={{ position: "absolute", left: 64, right: 64, top: 990, zIndex: 5, display: "flex", justifyContent: "center" }}>
            <Label at={faceEnd + 14} size={28} tone="paper">ЧЕРЕЗ ТРЕТЬИ СТРАНЫ · ОЦЕНКА FT, 2024</Label>
          </div>
        </>
      )}
      <Presenter />
      {/* headline: cover on frame 0, swaps after the face */}
      <div style={{ position: "absolute", left: 64, width: two ? 952 : 700, top: 230, zIndex: 9 }}>
        <div style={{ display: "inline-block", marginBottom: 16, padding: "8px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", transform: "rotate(-2deg)", boxShadow: `0 0 30px ${colors.badGlow}` }}>
          {two ? "СВР РФ, 29.05.2025" : "СЕРБИЯ · ОЦЕНКА FT"}
        </div>
        {two ? <Kinetic text="ДОЕХАЛИ ДО УКРАИНЫ" size={96} delay={faceEnd} per={3} mode="snap" bad={[2]} lineHeight={1.02} /> : <HookWords pre words={["ДРУГ", "РОССИИ", "ПРОДАЛ", "СНАРЯДЫ"]} size={78} />}
      </div>
      {/* the number holds the bottom of the cover */}
      {!two && (
        <div style={{ position: "absolute", left: 64, right: 64, top: 1390, zIndex: 9, display: "flex", alignItems: "center", gap: 18, transform: `scale(${1 + Math.sin(frame / 6) * 0.015})`, transformOrigin: "left center" }}>
          <Slam text="€800 МЛН" at={-20} size={150} />
        </div>
      )}
      {two && frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1390, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={78} rotate={-5} delay={stampAt}>«УДАР В СПИНУ»</Stamp>
        </div>
      )}
      {/* note 5: the author's Vučić flies in top right, TikTok style, leaves with the face */}
      <FlyIn src={ASSETS.vucicAuthor} from="right" at={S(1.2, fps)} out={faceEnd - 8} x={740} y={210} w={310} rot={6} z={10} />
      {frame >= S(1.2, fps) + 6 && frame < faceEnd - 4 && (
        <div style={{ position: "absolute", left: 770, top: 520, zIndex: 11 }}>
          <Label at={S(1.2, fps) + 6} size={22} tone="bad" rotate={3}>АЛЕКСАНДР ВУЧИЧ</Label>
        </div>
      )}
      {/* note 2: the Serbian flag as real footage, full quality, under the ticker */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1650, height: 270, zIndex: 8, overflow: "hidden" }}>
        <OffthreadVideo src={media(ASSETS.flagVideo)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + frame * 0.0008})` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg} 0%, transparent 28%)` }} />
      </div>
      <SpeedLines at={faceEnd} y={860} />
      <Flash amount={hit.energy * 0.9} />
      <Flash amount={stamp.energy} color={colors.bad} />
    </SceneShell>
  );
};

/* -------------------------------------------------------------- facts */

const Fact: React.FC<{ clip: string; n: number; kicker: string; title: string; titleHero?: number[]; titleBad?: number[]; titleSize?: number; numbers: string[]; children: (f: { numAt: number; stampAt: number; fps: number; len: number }) => React.ReactNode; numAtS?: number; stampAtS?: number; stamp?: { text: string; tone: "bad" | "hero"; size?: number } }> = ({ clip, n, kicker, title, titleHero, titleBad, titleSize = 92, numbers, children, numAtS = 0.9, stampAtS, stamp }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const numAt = S(numAtS, fps);
  const stampAt = stampAtS === undefined ? Math.round(durationInFrames * 0.66) : S(stampAtS, fps);
  const num = usePunch(numAt, 14);
  const st = usePunch(stampAt, 16);
  const tear = interpolate(frame, [0, 1, 8], [0, 1, 0], clamp);
  const zoom = 1 + num.pop * 0.03 + st.pop * 0.04;
  return (
    <SceneShell shake={num.shake * 0.5 + st.shake * 0.7}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
          <DuoClip src={clip} />
        </Glitch>
        <Numbers items={numbers} />
        <FactTag n={n} of={5} kicker={kicker} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 330, zIndex: 7 }}>
          <Kinetic text={title} size={titleSize} delay={4} per={3} mode="snap" hero={titleHero} bad={titleBad} lineHeight={1.02} />
        </div>
        {children({ numAt, stampAt, fps, len: durationInFrames })}
        {stamp && frame >= stampAt && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1400, zIndex: 12, display: "flex", justifyContent: "center" }}>
            <Stamp tone={stamp.tone} size={stamp.size ?? 84} rotate={-6} delay={stampAt}>{stamp.text}</Stamp>
          </div>
        )}
      </div>
      <SpeedLines at={numAt} x={300} y={760} />
      <Flash amount={num.energy * 0.6} />
      <Flash amount={st.energy} color={stamp?.tone === "hero" ? palette.primary : colors.bad} />
      <CutWipe />
    </SceneShell>
  );
};

/** Two result bars racing: the vote. */
const Bars: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const rows = [
    { name: "СТУДЕНТЫ", v: 52.6, color: palette.primary, ink: colors.ink2 },
    { name: "ПАРТИЯ ВУЧИЧА", v: 39.3, color: colors.bad, ink: colors.white },
  ];
  return (
    <div style={{ position: "absolute", left: 64, top: 1030, width: 640, zIndex: 6, display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => {
        const p = interpolate(frame - at - i * 4, [0, 18], [0, 1], { easing: theme.ease.out, ...clamp });
        return (
          <div key={r.name} style={{ position: "relative", height: 64, width: `${(r.v / 55) * 100 * p}%`, minWidth: p > 0 ? 40 : 0, background: r.color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: r.ink, whiteSpace: "nowrap", overflow: "hidden", boxShadow: i === 0 ? `0 0 30px ${palette.glow}` : "none" }}>
            <span>{r.name}</span>
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 30 }}>{(r.v * p).toFixed(1).replace(".", ",")}%</span>
          </div>
        );
      })}
      <Label at={at + 16} size={20}>ВЫБОРЫ 25.10.2026 · ПРЕДВАРИТЕЛЬНО, ЦИК СЕРБИИ</Label>
    </div>
  );
};

const Vucic: React.FC = () => {
  const { fps } = useVideoConfig();
  const burnAt = S(3.3, fps);
  return (
    <Fact clip={ASSETS.belgrade} n={1} kicker="25.10.2026" title="ЭТО СЕРБИЯ" titleHero={[1]} titleSize={110} numbers={["2012", "14 ЛЕТ", "SNS", "52,6%", "39,3%", "140", "250"]} numAtS={1.2} stampAtS={3.3} stamp={{ text: "ПРОИГРАЛИ", tone: "bad" }}>
      {({ numAt }) => (
        <>
          <Ash src={ASSETS.vucic.src} x={650} y={560} w={420} ratio={ASSETS.vucic.ratio} at={burnAt} />
          <FlyIn src={ASSETS.studentsPhoto} from="right" at={burnAt + 6} x={600} y={620} w={420} rot={5} card />
          <div style={{ position: "absolute", left: 64, top: 600, zIndex: 6, display: "flex", flexDirection: "column", gap: 14 }}>
            <Slam text="14 ЛЕТ" at={numAt} size={118} />
            <Label at={numAt + 6} size={24}>ПАРТИЯ ВУЧИЧА У ВЛАСТИ С 2012</Label>
          </div>
          <Bars at={numAt + 22} />
        </>
      )}
    </Fact>
  );
};

/** UN board: three tallies, Serbia lands on «ЗА». */
const VoteBoard: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiles = [
    { k: "ЗА", v: "93", lit: true },
    { k: "ПРОТИВ", v: "18" },
    { k: "ВОЗДЕРЖ.", v: "65" },
  ];
  const land = spring({ frame: frame - at - 14, fps, config: theme.spring.bouncy });
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 640, zIndex: 6 }}>
      <div style={{ display: "flex", gap: 14 }}>
        {tiles.map((t, i) => {
          const p = spring({ frame: frame - at - i * 4, fps, config: theme.spring.snappy });
          const lit = t.lit && land > 0.5;
          return (
            <div key={t.k} style={{ flex: 1, padding: "18px 0", textAlign: "center", background: lit ? palette.primary : colors.surface, border: `3px solid ${lit ? palette.primary : colors.lineStrong}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-120, 0])}px) rotateX(${interpolate(p, [0, 1], [80, 0])}deg)`, boxShadow: lit ? `0 0 40px ${palette.glow}` : "none" }}>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.1em", color: lit ? colors.ink2 : palette.textDim }}>{t.k}</div>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 80, color: lit ? colors.ink2 : palette.text }}>{t.v}</div>
            </div>
          );
        })}
      </div>
      {/* the Serbia chip drops onto «ЗА» */}
      <div style={{ position: "absolute", left: 20, top: -64, padding: "8px 16px", background: colors.white, color: colors.ink, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10, opacity: land, transform: `translateY(${interpolate(land, [0, 1], [-260, 0])}px) rotate(-4deg)`, boxShadow: colors.paperShadow }}>
        <Img src={media(ASSETS.flagRs)} style={{ height: 30 }} />
        СЕРБИЯ
      </div>
    </div>
  );
};

const Un: React.FC = () => {
  const { fps } = useVideoConfig();
  const tiredAt = S(2.2, fps);
  return (
    <Fact clip={ASSETS.un} n={2} kicker="ООН · 24.02.2025" title="РЕЗОЛЮЦИЯ ПРОТИВ РОССИИ" titleBad={[1, 2]} titleSize={78} numbers={["93", "18", "65", "ООН", "A/ES-11", "ЗА"]} numAtS={0.5} stampAtS={2.9} stamp={{ text: "ИЗВИНИЛСЯ", tone: "bad" }}>
      {({ numAt }) => (
        <>
          <VoteBoard at={numAt} />
          <FlyIn src={ASSETS.unLogo} from="top" at={numAt + 4} x={820} y={180} w={170} rot={8} sticker={false} card />
          <FlyIn src={ASSETS.vucic.src} from="left" at={tiredAt} x={20} y={930} w={360} rot={-4} />
          <FlyIn from="left" at={tiredAt + 5} x={330} y={960} w={330} rot={-3}>
            <div style={{ padding: "16px 20px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 36, lineHeight: 1.1, borderRadius: 20, boxShadow: colors.paperShadow }}>«Я БЫЛ УСТАВШИМ»</div>
          </FlyIn>
          <FlyIn src={ASSETS.tired} from="right" at={tiredAt + 8} x={700} y={900} w={340} rot={7} />
        </>
      )}
    </Fact>
  );
};

const Fsb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slamAt = S(0.9, fps);
  const p = spring({ frame: frame - slamAt, fps, config: theme.spring.snappy });
  return (
    <Fact clip={ASSETS.police} n={3} kicker="МАРТ 2025" title="ПОЛИЦИЮ СЕРБИИ ПРОВЕРЯЕТ ФСБ" titleBad={[3]} titleSize={80} numbers={["ФСБ", "LRAD", "15.03.2025", "ДБ", "МВД", "FBI"]} numAtS={0.9} stampAtS={2.2} stamp={{ text: "ФСБ: НЕ БЫЛО", tone: "bad", size: 76 }}>
      {({ numAt }) => (
        <>
          {frame >= slamAt && (
            <div style={{ position: "absolute", left: 540 - 135, top: 650, width: 270, zIndex: 6, opacity: Math.min(1, p * 1.5), transform: `scale(${interpolate(p, [0, 1], [2.6, 1]) + Math.sin(frame / 9) * 0.015}) rotate(${interpolate(p, [0, 1], [-20, 0])}deg)`, filter: `drop-shadow(0 0 40px ${colors.badGlow})` }}>
              <Img src={media(ASSETS.fsb)} style={{ width: "100%", display: "block" }} />
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
            <Shockwave at={slamAt} color={colors.bad} />
          </div>
          <FlyIn src={ASSETS.lrad} from="left" at={numAt + 14} x={30} y={720} w={330} rot={-6} card />
          <div style={{ position: "absolute", left: 40, top: 1000, zIndex: 7 }}>
            <Label at={numAt + 18} size={26} tone="bad">ЗВУКОВАЯ ПУШКА?</Label>
          </div>
          <FlyIn from="right" at={numAt + 8} x={700} y={740} w={340} rot={5} sticker={false}>
            <div style={{ padding: 6, background: colors.white, boxShadow: colors.shadow }}>
              <OffthreadVideo src={media(ASSETS.cctv)} muted style={{ width: "100%", display: "block", filter: "contrast(1.15)" }} />
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, color: colors.ink, padding: "6px 4px 2px", letterSpacing: "0.06em" }}>БЕЛГРАД · 15.03.2025 · КАМЕРА</div>
            </div>
          </FlyIn>
        </>
      )}
    </Fact>
  );
};

const Plane: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  if (k < 0 || k > 70) return null;
  const x = interpolate(k, [0, 70], [-700, 1300], { easing: theme.ease.inOut, ...clamp });
  const y = interpolate(k, [0, 70], [1060, 820], { easing: theme.ease.inOut, ...clamp });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 620, zIndex: 4, transform: "rotate(-8deg)", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.6))" }}>
      <Img src={media(ASSETS.plane)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

const Russians: React.FC = () => (
  <Fact clip={ASSETS.airport} n={4} kicker="ВНЖ · 2022–2025" title="РОССИЯН В СЕРБИИ" titleSize={92} numbers={["5 000", "61 900", "×12", "ВНЖ", "MUP", "BEG", "SVO"]} numAtS={0.4} stampAtS={2.4} stamp={{ text: "×12", tone: "hero", size: 120 }}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 64, top: 600, zIndex: 6, display: "flex", flexDirection: "column", gap: 14 }}>
          <Slam text="61 900" at={numAt} size={170} roll={{ from: 5000, to: 61900 }} />
          <Label at={numAt + 8} size={24}>С ВНЖ В КОНЦЕ 2025 · ДО ВОЙНЫ МЕНЬШЕ 5 000</Label>
        </div>
        <Plane at={numAt + 4} />
        <FlyIn src={ASSETS.passport} from="left" at={numAt + 16} x={60} y={1000} w={260} rot={-10} />
        <FlyIn src={ASSETS.flagRu} from="right" at={numAt + 22} x={780} y={1040} w={220} rot={8} />
      </>
    )}
  </Fact>
);

/** 11% ring filling around its number. */
const Ring: React.FC<{ at: number; pct: number; size: number }> = ({ at, pct, size }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 22], [0, 1], { easing: theme.ease.out, ...clamp });
  const r = size / 2 - 22;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: interpolate(frame - at, [0, 5], [0, 1], clamp), transform: `scale(${interpolate(frame - at, [0, 10], [0.6, 1], { easing: theme.ease.out, ...clamp })}) rotate(${Math.sin(frame / 30) * 3}deg)` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={colors.surface} stroke={colors.lineStrong} strokeWidth={34} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={palette.primary} strokeWidth={34} strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * p)} style={{ filter: `drop-shadow(0 0 16px ${palette.glow})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: size * 0.3, color: palette.primary }}>{Math.round(pct * p)}%</div>
    </div>
  );
};

const Nis: React.FC = () => (
  <Fact clip={ASSETS.refinery} n={5} kicker="NIS · 2024" title="ДОЧКА ГАЗПРОМ НЕФТИ" titleSize={86} numbers={["244,7 МЛРД", "11%", "€2 МЛРД", "56%", "ПАНЧЕВО", "OFAC"]} numAtS={0.8} stampAtS={2.9} stamp={{ text: "САНКЦИИ США", tone: "bad", size: 80 }}>
    {({ numAt }) => (
      <>
        <div style={{ position: "absolute", left: 50, top: 590, zIndex: 6 }}>
          <Ring at={numAt} pct={11} size={400} />
        </div>
        <div style={{ position: "absolute", left: 64, top: 1010, zIndex: 7 }}>
          <Label at={numAt + 10} size={24}>ДОХОДОВ БЮДЖЕТА СЕРБИИ · ≈ €2 МЛРД</Label>
        </div>
        <FlyIn src={ASSETS.nis} from="right" at={numAt + 4} x={600} y={600} w={380} rot={5} card />
        <FlyIn src={ASSETS.gpn} from="right" at={numAt + 10} x={620} y={800} w={360} rot={-4} card />
        <FlyIn src={ASSETS.pancevo} from="bottom" at={numAt + 16} x={560} y={1040} w={440} rot={4} card />
        <Arrow at={numAt + 22} x={430} y={540} w={190} flip rot={10} />
      </>
    )}
  </Fact>
);

/* -------------------------------------------------------------- final */

const Final: React.FC<{ question: string }> = ({ question }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ASR of 07-final (raw s / 1.1 + 0.1 lead): «Санкции» 1.97, «нет» 3.59, «Пока» 4.43
  const qAt = S(1.9, fps);
  const noAt = S(3.55, fps);
  const pokaAt = S(4.4, fps);
  const swap = frame >= pokaAt;
  const no = usePunch(noAt, 18);
  const doc = useIn(qAt + 4, "smooth");
  const card = S(2.0, fps);
  return (
    <SceneShell exit={false} shake={no.shake}>
      <Glitch amount={interpolate(frame, [0, 1, 8], [0, 1, 0], clamp)} style={{ position: "absolute", inset: 0 }}>
        <DuoClip src={ASSETS.students} dim={0.5} />
      </Glitch>
      <Numbers items={["140", "250", "52,6%", "30.09.2026", "НЕТ", "126"]} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 230, zIndex: 7 }}>
        {swap ? (
          <Kinetic text="ПОКА САНКЦИЙ НИКТО НЕ ПЛАНИРУЕТ" size={76} delay={pokaAt} per={3} mode="snap" hero={[0]} lineHeight={1.04} />
        ) : (
          <>
            <Kinetic text="В ИТОГЕ ПОБЕДИЛИ СТУДЕНТЫ" size={84} delay={2} per={3} mode="snap" hero={[3]} lineHeight={1.02} />
            <div style={{ marginTop: 14, display: "flex" }}>
              <Label at={12} size={26} tone="lime">140 ИЗ 250 МЕСТ · ПРАВЯТ БЕЗ КОАЛИЦИИ</Label>
            </div>
          </>
        )}
      </div>
      {frame >= qAt && (
        <div style={{ position: "absolute", left: 64, top: 600, width: 620, zIndex: 6, padding: "24px 26px", background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, opacity: doc, transform: `translateX(${interpolate(doc, [0, 1], [-200, 0])}px) rotate(${interpolate(doc, [0, 1], [-12, -3])}deg)` }}>
          <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: colors.inkFaded, marginBottom: 10 }}>ПРОГРАММА СТУДЕНТОВ · 30.09.2026</div>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 38, lineHeight: 1.12 }}>САНКЦИИ ПРОТИВ РОССИИ?</div>
          <div style={{ marginTop: 10, fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 23, lineHeight: 1.3, color: colors.ink }}>«Сербия сохранит позицию: не вводить ограничительные меры против РФ»</div>
        </div>
      )}
      {frame >= noAt && (
        <div style={{ position: "absolute", left: 470, top: 720, zIndex: 9, transform: `scale(${1 + Math.sin((frame - noAt) / 7) * 0.03})` }}>
          <Stamp tone="hero" size={150} rotate={-10} delay={noAt}>НЕТ</Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 950, zIndex: 7 }}>
        <Label at={noAt + 10} size={22} tone="bad">ВУЧИЧ: «ВВЕДУТ К ВЕСНЕ»</Label>
      </div>
      <SubscribeCard at={card} question={question} top={1060} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 1680, zIndex: 21, textAlign: "center", fontFamily: theme.fonts.mono, fontSize: 15, lineHeight: 1.35, color: palette.textDim }}>
        FT 22.06.2024 · ООН A/ES-11 · BCSP · Danas · RIK 25.10.2026 · Фото: Mohit S, Dejan Krsmanovic, TJDarmstadt, Tupungato / Wikimedia Commons, CC BY
      </div>
      <SpeedLines at={noAt} x={800} y={800} />
      <Flash amount={no.energy} />
      <CutWipe />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- root */

const Overlay: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Progress total={Math.round(DURATION * fps)} />
      <BrandBar series="ДЕНЬГИ · ПРОСТО" episode="ВЫПУСК 21" delay={-30} />
      <Ticker items={["ВЫБОРЫ В СЕРБИИ 25.10.2026", "СТУДЕНТЫ 52,6%", "ПАРТИЯ ВУЧИЧА 39,3%", "140 ИЗ 250 МЕСТ", "ЯВКА РЕКОРД С 1992", "ГАЗ ИЗ РОССИИ 75%", "ВЫПУСК 21"]} />
    </>
  );
};

export const SerbiaEconomy: React.FC<SerbiaEconomyProps> = ({ question }) => (
  <Reel
    palette={palette}
    voiceoverDir="serbia-economy"
    voiceover={VOICEOVER}
    voRate={VO_RATE}
    gradeOpacity={0.06}
    captions={{ top: 1240, fontSize: 52, mode: "box", uppercase: true, boxTilt: 2, fontFamily: WIDE, fontWeight: 900, activeColor: palette.primary, activeInk: colors.ink2, heroColor: palette.primary, badColor: colors.bad, textShadow: `0 4px 22px ${palette.bg}`, stroke: `8px ${palette.bg}` }}
  >
    <Scene spec={SCENES.hook} name="01 hook">
      <Hook />
    </Scene>
    <Scene spec={SCENES.vucic} name="02 vucic">
      <Vucic />
    </Scene>
    <Scene spec={SCENES.un} name="03 un">
      <Un />
    </Scene>
    <Scene spec={SCENES.fsb} name="04 fsb">
      <Fsb />
    </Scene>
    <Scene spec={SCENES.russians} name="05 russians">
      <Russians />
    </Scene>
    <Scene spec={SCENES.nis} name="06 nis">
      <Nis />
    </Scene>
    <Scene spec={SCENES.final} name="07 final">
      <Final question={question} />
    </Scene>
    <Overlay />
  </Reel>
);
