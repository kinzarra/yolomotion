// The recap conveyor (every station lights on its word), the face with the
// conclusion, and the subscribe card with the comment question + credits.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FACE_PREVIEW } from "../face";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { imColors as colors, imPalette as palette } from "../palette";
import { BeatShell, BgVideo, Burst, Conveyor, Face, Flash, I, Kinetic, L, SceneShell, Stamp, TopBar, V, WIDE, mono, richText, useSec } from "../ui";
import { cue, lineEnd } from "../timeline";
import { bar } from "./common";

type P = { series: string; episode: string };
const staticFace = staticFile(FACE_PREVIEW);

export const ChainScene: React.FC<P> = ({ series, episode }) => {
  const s = useSec();
  const at = (w: string) => s(cue("chain", w));
  const lit = [at("песок"), at("машина"), at("чип"), at("память"), at("шкаф"), at("дата-центр"), at("электростанция"), s(lineEnd("chain") + 0.1)];
  return (
    <BeatShell series={series} bar={bar(7, episode)} bg={V + "v-data.mp4"} dim={0.85} tint={0.2}>
      <Conveyor
        y={150}
        lit={lit}
        stations={[
          { name: "ПЕСОК", sub: "СПРУС-ПАЙН, США", img: I + "spruce-pine.jpg", flag: L + "flag-us.png" },
          { name: "МАШИНА", sub: "ASML, НИДЕРЛАНДЫ", img: I + "asml-euv.jpg", flag: L + "flag-nl.png" },
          { name: "ЧИП", sub: "TSMC, ТАЙВАНЬ", img: I + "tsmc-fab.jpg", flag: L + "flag-tw.png" },
          { name: "ПАМЯТЬ", sub: "SK HYNIX, КОРЕЯ", img: I + "hbm.jpg", flag: L + "flag-kr.png" },
          { name: "ШКАФ", sub: "NVIDIA · $4-6 МЛН", img: I + "nvidia-rack.jpg" },
          { name: "ДАТА-ЦЕНТР", sub: "200 000+ КАРТ", img: I + "datacenter.jpg" },
          { name: "ЭНЕРГИЯ", sub: "ГИГАВАТТЫ, АТОМ", img: I + "tmi.jpg" },
          { name: "ТОКЕН", sub: "ОТВЕТ В ТВОЁМ ЧАТЕ" },
        ]}
      />
      <Burst at={lit[7]} x={960} y={720} />
    </BeatShell>
  );
};

export const FinalScene: React.FC<P> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const s = useSec();
  const at = (w: string, n = 0) => s(cue("final", w, n));
  const good = at("товаром");
  const price = at("цена");
  const queue = at("очередь");
  const you = at("ты");
  const hit = usePunch(you, 18);
  return (
    <SceneShell shake={hit.shake}>
      <Face shot="final" from={0} />
      <div style={{ position: "absolute", left: 96, top: 220, width: 860, zIndex: 9 }}>
        <Kinetic text="ИНТЕЛЛЕКТ СТАЛ ТОВАРОМ" size={86} delay={good} per={3} mode="snap" hero={[2]} lineHeight={1.04} />
        <div style={{ display: "flex", gap: 22, marginTop: 36, minHeight: 110 }}>
          {frame >= price && <Stamp tone="hero" size={60} rotate={-4} delay={price}>ЦЕНА</Stamp>}
          {frame >= queue && <Stamp tone="bad" size={60} rotate={3} delay={queue}>ОЧЕРЕДЬ</Stamp>}
        </div>
        {frame >= you && <div style={{ marginTop: 26, fontFamily: WIDE, fontWeight: 900, fontSize: 76, color: palette.primary, textShadow: `0 0 30px ${palette.glow}` }}>ГДЕ В НЕЙ ТЫ?</div>}
      </div>
      <TopBar left={series} right={episode} />
      <Burst at={you} x={480} y={720} />
      <Flash amount={hit.energy * 0.8} />
    </SceneShell>
  );
};

/** Credits for every CC BY asset in the episode (the licence asks for it on screen). */
export const CREDITS = "Музыка: «Lightless Dawn», Kevin MacLeod (incompetech.com), CC BY 4.0 · Видео: Pexels, Pixabay · Фото: Wikimedia Commons";

export const SubScene: React.FC<P & { credits: string }> = ({ series, episode, credits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSec();
  const p = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });
  const press = s(cue("sub", "подписывайся") + 0.5);
  const bellAt = press + s(0.6);
  const askAt = s(cue("sub", "напиши"));
  const pressed = frame >= press;
  const ring = frame >= bellAt ? Math.sin((frame - bellAt) / 1.8) * 28 * Math.max(0, 1 - (frame - bellAt) / 40) : 0;
  const ask = spring({ frame: frame - askAt, fps, config: theme.spring.bouncy });
  const hit = usePunch(press, 14);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.3}>
      <BgVideo src={V + "v-data.mp4"} dim={0.86} tint={0.25} blur={4} />
      <TopBar left={series} right={episode} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, zIndex: 9, display: "flex", justifyContent: "center", transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 1.4) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "40px 52px", borderRadius: 40, background: "rgba(16,20,24,0.82)", border: `2px solid ${palette.primary}88`, boxShadow: `0 0 80px ${palette.glow}, 0 50px 120px -40px rgba(0,0,0,0.95)` }}>
          <div style={{ width: 140, height: 140, borderRadius: 70, overflow: "hidden", border: `5px solid ${palette.primary}` }}>
            <Img src={staticFace} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: "scale(1.8)" }} />
          </div>
          <div>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 54, color: palette.text }}>{series}</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: palette.textDim, marginTop: 8 }}>разборы про деньги, работу и ИИ</div>
          </div>
          <div style={{ padding: "24px 44px", borderRadius: 50, background: pressed ? colors.surfaceLift : colors.bad, color: colors.white, fontFamily: theme.fonts.body, fontWeight: 900, fontSize: 38, transform: `scale(${frame >= press - 3 && frame < press + 3 ? 0.9 : 1})`, boxShadow: pressed ? undefined : `0 0 40px ${colors.badGlow}` }}>{pressed ? richText("ВЫ ПОДПИСАНЫ ✓") : "ПОДПИСАТЬСЯ"}</div>
          <svg width={84} height={84} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}>
            <path d="M12 2a1.6 1.6 0 0 1 1.6 1.6v.6A6.4 6.4 0 0 1 18.4 10.4v4.4l1.8 2.6H3.8l1.8-2.6v-4.4a6.4 6.4 0 0 1 4.8-6.2v-.6A1.6 1.6 0 0 1 12 2z" fill={frame >= bellAt ? palette.primary : palette.text} />
            <circle cx={12} cy={20.2} r={2} fill={frame >= bellAt ? palette.primary : palette.text} />
          </svg>
        </div>
      </div>
      {frame >= askAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", padding: "30px 48px", borderRadius: 34, background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 52, boxShadow: colors.paperShadow, transform: `scale(${interpolate(ask, [0, 1], [0.5, 1])}) rotate(-1.5deg)`, opacity: Math.min(1, ask * 1.5) }}>
            СКОЛЬКО ТЫ ПЛАТИШЬ ЗА ИИ В МЕСЯЦ?
            <div style={{ position: "absolute", left: 80, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `28px solid ${colors.paper}` }} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 96, right: 96, top: 860, zIndex: 9, textAlign: "center", fontFamily: mono, fontWeight: 600, fontSize: 17, letterSpacing: "0.04em", color: palette.textDim }}>{credits}</div>
      <Flash amount={hit.energy * 0.6} />
    </SceneShell>
  );
};
