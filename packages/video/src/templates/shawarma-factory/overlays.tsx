// Game overlays that ride above the street: rush banner, upgrade card,
// fast-forward chip, payback stamp, «ушёл» pop, final cash and the
// subscribe / like / comment row. Every one takes reel seconds.
import React from "react";
import { Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { sfColors as colors, sfPalette as palette } from "./palette";
import { clamp, Coin, fmt, WIDE, X0, X1 } from "./ui";

const sp = (age: number, fps: number, cfg: keyof typeof theme.spring = "snappy") =>
  age < 0 ? 0 : spring({ frame: age * fps, fps, config: theme.spring[cfg] });
const out = (age: number, len: number, dur = 0.3) =>
  interpolate(age, [len - dur, len], [1, 0], { easing: theme.ease.in, ...clamp });

/** Hook title: present on frame 0 (it is the cover), snaps away after the voice line. */
export const HookTitle: React.FC<{ t: number; outAt: number }> = ({ t, outAt }) => {
  const { fps } = useVideoConfig();
  const chip = sp(t + 2, fps, "bouncy");
  const gone = interpolate(t, [outAt, outAt + 0.3], [0, 1], { easing: theme.ease.in, ...clamp });
  if (gone >= 1) return null;
  return (
    <div style={{ position: "absolute", left: X0, top: 238, opacity: 1 - gone, transform: `translateY(${-gone * 60}px) scale(${1 + gone * 0.08})`, transformOrigin: "left top", filter: gone > 0 ? `blur(${gone * 8}px)` : undefined }}>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 112, lineHeight: 0.95, color: palette.text, letterSpacing: "-0.02em", textShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>МУЛЬТИК</div>
      <div style={{ fontFamily: WIDE, fontWeight: 800, fontSize: 60, lineHeight: 1.05, color: palette.text, marginTop: 8, textShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>НА 30 СЕКУНД</div>
      <div style={{ display: "inline-flex", marginTop: 18, padding: "12px 22px", borderRadius: 12, background: palette.primary, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 30, letterSpacing: "0.08em", transform: `scale(${interpolate(chip, [0, 1], [0.5, 1])}) rotate(-2deg)`, boxShadow: `0 0 30px ${palette.glow}` }}>
        СОБРАЛ CLAUDE
      </div>
    </div>
  );
};

/** «ЧАС ПИК» slams in over the skyline, the clock time under it. */
export const RushBanner: React.FC<{ t: number; at: number; clock: string; len?: number }> = ({ t, at, clock, len = 3.2 }) => {
  const { fps } = useVideoConfig();
  const age = t - at;
  if (age < 0 || age > len) return null;
  const s = sp(age, fps, "bouncy");
  const sub = sp(age - 0.15, fps, "snappy");
  const o = out(age, len);
  const shake = age < 0.35 ? Math.sin(age * 90) * (0.35 - age) * 30 : 0;
  return (
    <div style={{ position: "absolute", left: X0, top: 250, opacity: o, transform: `translateX(${shake}px)` }}>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 140, lineHeight: 0.92, color: palette.text, letterSpacing: "-0.03em", transform: `scale(${interpolate(s, [0, 1], [1.8, 1])}) rotate(${interpolate(s, [0, 1], [-6, -2])}deg)`, transformOrigin: "left center", opacity: Math.min(1, s * 2), textShadow: `0 0 40px ${colors.badGlow}, 0 10px 30px rgba(0,0,0,0.8)` }}>
        ЧАС ПИК
      </div>
      <div style={{ display: "inline-flex", gap: 14, alignItems: "center", marginTop: 16, padding: "12px 20px", borderRadius: 12, background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em", opacity: sub, transform: `translateY(${interpolate(sub, [0, 1], [-20, 0])}px)` }}>
        {clock} · ИЗ МЕТРО ТОЛПА
      </div>
    </div>
  );
};

/** The upgrade card: slides in, the НАНЯТЬ button gets tapped at `tap`, the card flies to the kiosk. */
export const UpgradeCard: React.FC<{ t: number; at: number; tap: number; price: number }> = ({ t, at, tap, price }) => {
  const { fps } = useVideoConfig();
  const age = t - at;
  const after = t - tap;
  if (age < 0 || after > 0.6) return null;
  const s = sp(age, fps, "bouncy");
  const press = after > -0.12 && after < 0.15 ? 1 : 0;
  const fly = interpolate(after, [0.2, 0.6], [0, 1], { easing: theme.ease.in, ...clamp });
  const ripple = interpolate(after, [0, 0.45], [0, 1], { easing: theme.ease.out, ...clamp });
  // a tap pointer slides to the button just before the tap
  const point = interpolate(t, [tap - 0.6, tap - 0.1], [0, 1], { easing: theme.ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", left: 160, top: 236, width: 760, opacity: 1 - fly, transform: `translate(${fly * 220}px, ${interpolate(s, [0, 1], [-260, 0]) + fly * 330}px) scale(${interpolate(s, [0, 1], [0.6, 1]) * (1 - fly * 0.7)}) rotate(${interpolate(s, [0, 1], [8, -1.5])}deg)` }}>
      <div style={{ borderRadius: 28, background: colors.surfaceStrong, border: `3px solid ${palette.primary}`, boxShadow: `0 0 50px ${palette.glow}, ${colors.shadow}`, padding: "26px 32px", display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 120, height: 120, borderRadius: 24, background: colors.surfaceLift, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.lineStrong}` }}>
          <ChefIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.18em", color: palette.primary }}>УЛУЧШЕНИЕ</div>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: palette.text, lineHeight: 1.05, marginTop: 6 }}>ВТОРОЙ ПОВАР</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, color: palette.textDim, marginTop: 8 }}>ШАУРМА В 3 РАЗА БЫСТРЕЕ</div>
        </div>
      </div>
      <div style={{ position: "relative", marginTop: -8, marginLeft: 220, width: 470, height: 84, borderRadius: 20, background: palette.primary, color: colors.ink2, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: WIDE, fontWeight: 900, fontSize: 30, whiteSpace: "nowrap", transform: `scale(${press ? 0.9 : 1})`, boxShadow: press ? "none" : `0 10px 0 ${colors.ink2}` }}>
        НАНЯТЬ · {fmt(price)} <span style={{ fontFamily: theme.fonts.mono }}>₽</span>
        {ripple > 0 && ripple < 1 && <div style={{ position: "absolute", left: 290, top: 40, width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: "50%", border: `5px solid ${palette.text}`, opacity: 1 - ripple, transform: `scale(${1 + ripple * 4})` }} />}
        {point > 0 && <Pointer x={290 + (1 - point) * 160} y={50 + (1 - point) * 140} pressed={press === 1} />}
      </div>
    </div>
  );
};

const Pointer: React.FC<{ x: number; y: number; pressed: boolean }> = ({ x, y, pressed }) => (
  <svg viewBox="0 0 40 52" width={58} height={76} style={{ position: "absolute", left: x - 10, top: y - 4, transform: `scale(${pressed ? 0.88 : 1})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M14 4 Q14 0 18 0 Q22 0 22 4 L22 22 L30 23 Q38 25 37 33 L35 44 Q34 50 28 50 L16 50 Q12 50 9 46 L2 34 Q0 30 4 28 Q7 27 10 30 L14 34 Z" fill={palette.text} stroke={colors.ink2} strokeWidth={2.5} strokeLinejoin="round" />
  </svg>
);

const ChefIcon: React.FC = () => (
  <svg viewBox="0 0 80 80" width={88} height={88}>
    <path d="M18 34 Q10 20 24 16 Q28 4 40 8 Q52 4 56 16 Q70 20 62 34 Z" fill={colors.paper} stroke={colors.ink2} strokeWidth={3} strokeLinejoin="round" />
    <rect x={20} y={32} width={40} height={10} fill={colors.paperShade} stroke={colors.ink2} strokeWidth={3} />
    <circle cx={40} cy={56} r={14} fill={colors.paperShade} stroke={colors.ink2} strokeWidth={3} />
    <path d="M34 60 Q40 65 46 60" stroke={colors.ink2} strokeWidth={3} fill="none" strokeLinecap="round" />
  </svg>
);

/** Red money pop for the hire cost, under the cash pill. */
export const CostPop: React.FC<{ t: number; at: number; amount: number }> = ({ t, at, amount }) => {
  const { fps } = useVideoConfig();
  const age = t - at;
  if (age < 0 || age > 1.6) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: X0 + 40, top: 210 + age * 30, opacity: out(age, 1.6, 0.4), transform: `scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(-3deg)`, transformOrigin: "left top", fontFamily: WIDE, fontWeight: 900, fontSize: 64, color: colors.bad, WebkitTextStroke: `6px ${colors.ink2}`, paintOrder: "stroke fill", textShadow: `0 6px 0 ${colors.ink2}`, whiteSpace: "nowrap" }}>
      −{fmt(amount)} <span style={{ fontFamily: theme.fonts.mono }}>₽</span>
      <span style={{ fontFamily: theme.fonts.mono, fontSize: 26, marginLeft: 16, WebkitTextStroke: "0px", color: palette.text, letterSpacing: "0.08em" }}>ЗАРПЛАТА ПОВАРУ</span>
    </div>
  );
};

/** A customer who saw the line and turned back. */
export const LostPop: React.FC<{ x: number; y: number; age: number }> = ({ x, y, age }) => {
  const { fps } = useVideoConfig();
  if (age < 0 || age > 1.4) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: x, top: y - age * 50, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(4deg)`, opacity: out(age, 1.4, 0.4), textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: colors.white, background: colors.bad, padding: "6px 12px", borderRadius: 8 }}>НЕ ДОЖДАЛСЯ</div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 44, color: colors.bad, WebkitTextStroke: `5px ${colors.ink2}`, paintOrder: "stroke fill", marginTop: 4, textDecoration: "line-through" }}>500 <span style={{ fontFamily: theme.fonts.mono }}>₽</span></div>
    </div>
  );
};

/** ▶▶ ×4 fast-forward chip with speed lines while the sim runs fast. */
export const FastForward: React.FC<{ amount: number; t: number }> = ({ amount, t }) => {
  if (amount <= 0.01) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, pointerEvents: "none", opacity: amount * 0.5 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const y = 560 + ((i * 97) % 520);
          const x = ((i * 233 - t * 2600) % 1500 + 1500) % 1500 - 300;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 240, height: 3, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${colors.paper})` }} />;
        })}
      </div>
      <div style={{ position: "absolute", right: 1080 - X1, top: 214, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 14, background: palette.text, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 34, opacity: Math.min(1, amount * 2), transform: `scale(${0.8 + amount * 0.2 + Math.sin(t * 12) * 0.02})` }}>
        <svg viewBox="0 0 40 24" width={44} height={26}><path d="M0 0 L18 12 L0 24 Z M20 0 L38 12 L20 24 Z" fill={colors.ink2} /></svg>
        ×4
      </div>
    </>
  );
};

/** «ОКУПИЛСЯ» stamp when the cash is back above where it was before the hire. */
export const PaybackStamp: React.FC<{ t: number; at: number | null; len?: number }> = ({ t, at, len = 2.6 }) => {
  const { fps } = useVideoConfig();
  if (at === null) return null;
  const age = t - at;
  if (age < 0 || age > len) return null;
  const s = sp(age, fps, "bouncy");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 290, display: "flex", flexDirection: "column", alignItems: "center", opacity: out(age, len), transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) rotate(-6deg)`, transformOrigin: "540px 80px" }}>
      <div style={{ border: `8px solid ${palette.primary}`, borderRadius: 18, padding: "14px 26px", fontFamily: WIDE, fontWeight: 900, fontSize: 80, color: palette.primary, letterSpacing: "0.02em", textShadow: `0 0 30px ${palette.glow}`, boxShadow: `0 0 40px ${palette.glow}, inset 0 0 30px ${palette.glow}`, background: "rgba(6,8,10,0.6)" }}>
        ОКУПИЛСЯ
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 26, letterSpacing: "0.1em", color: palette.text, marginTop: 12 }}>ПОВАР ВЕРНУЛ 15 000 ₽</div>
    </div>
  );
};

/** The author's HeyGen face in a glowing lime ring; video while he speaks, stills before and after. */
const FaceRing: React.FC<{ t: number; from: number; len: number; rate: number; size: number }> = ({ t, from, len, rate, size }) => {
  const { fps } = useVideoConfig();
  const base = "presenter/shawarma-factory/cta";
  const st: React.CSSProperties = { position: "absolute", left: size / 2 - 540, top: size / 2 - 880, width: 1080, height: 1920, transform: "scale(1.85)", transformOrigin: "540px 880px" };
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: `5px solid ${palette.primary}`, opacity: 0.35 + pulse * 0.4, transform: `scale(${1 + pulse * 0.05})` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: `9px solid ${palette.primary}`, boxShadow: `0 0 ${40 + pulse * 30}px ${palette.glow}`, background: palette.bg }}>
        {t < from ? (
          <Img src={staticFile(`${base}-first.jpg`)} style={st} />
        ) : t >= from + len ? (
          <Img src={staticFile(`${base}-last.jpg`)} style={st} />
        ) : (
          <Sequence from={Math.round(from * fps)} durationInFrames={Math.round(len * fps)} layout="none">
            <OffthreadVideo src={staticFile(`${base}.mp4`)} muted playbackRate={rate} style={st} />
          </Sequence>
        )}
      </div>
    </div>
  );
};

/**
 * The end, made loud: the street dims, the author's face pops in a lime ring
 * and says «Хочешь так же? Я научу!», the line is printed big beside it, and
 * the creator row sits under: ПОДПИСАТЬСЯ (tapped → ВЫ ПОДПИСАНЫ, bell rings),
 * ЛАЙК lights up, a comment chip. Final cash stays on top.
 */
export const Finale: React.FC<{ t: number; at: number; cash: number; talk: number; talkLen: number; rate: number }> = ({ t, at, cash, talk, talkLen, rate }) => {
  const { fps } = useVideoConfig();
  const age = t - at;
  if (age < 0) return null;
  const dim = interpolate(age, [0, 0.4], [0, 1], { easing: theme.ease.out, ...clamp });
  const big = sp(age, fps, "bouncy");
  const face = sp(age - 0.15, fps, "bouncy");
  const w1 = sp(t - talk, fps, "bouncy");
  const w2 = sp(t - talk - 0.75, fps, "bouncy");
  const row = sp(age - 0.9, fps, "snappy");
  const tapAt = talk + talkLen + 0.25;
  const subbed = t > tapAt;
  const tap = t - tapAt;
  const ring = subbed ? Math.sin(tap * 22) * interpolate(tap, [0, 0.9], [24, 0], clamp) : 0;
  const likeAt = tapAt + 0.6;
  const liked = t > likeAt;
  const likeHit = sp(t - likeAt, fps, "bouncy");
  const point = interpolate(t, [tapAt - 0.6, tapAt - 0.05], [0, 1], { easing: theme.ease.out, ...clamp });
  const pill: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 14, height: 100, padding: "0 34px", borderRadius: 50, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 34, letterSpacing: "0.05em", whiteSpace: "nowrap" };
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, background: `radial-gradient(ellipse at 50% 40%, rgba(6,8,10,0.55), rgba(6,8,10,0.85))`, opacity: dim }} />
      {/* final cash */}
      <div style={{ position: "absolute", left: X0, top: 226, opacity: Math.min(1, big * 1.5), transform: `scale(${interpolate(big, [0, 1], [0.6, 1])})`, transformOrigin: "left top" }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 24, letterSpacing: "0.16em", color: palette.textDim }}>В КАССЕ ЗА ВЕЧЕР</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
          <Coin size={78} />
          <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 100, lineHeight: 1, color: palette.primary, textShadow: `0 0 40px ${palette.glow}`, letterSpacing: "-0.02em" }}>
            {fmt(cash)}<span style={{ fontFamily: theme.fonts.mono, fontWeight: 800 }}> ₽</span>
          </span>
        </div>
      </div>
      {/* the face in a ring */}
      <div style={{ position: "absolute", left: X1 - 390, top: 410, opacity: Math.min(1, face * 1.6), transform: `scale(${interpolate(face, [0, 1], [0.3, 1])}) rotate(${interpolate(face, [0, 1], [-14, 0])}deg)`, transformOrigin: "50% 50%" }}>
        <FaceRing t={t} from={talk} len={talkLen} rate={rate} size={390} />
      </div>
      {/* the spoken line, printed loud */}
      <div style={{ position: "absolute", left: X0, top: 450, width: 470 }}>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 66, lineHeight: 1.0, color: palette.text, opacity: Math.min(1, w1 * 1.5), transform: `translateX(${interpolate(w1, [0, 1], [-60, 0])}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.9)" }}>
          ХОЧЕШЬ<br />ТАК ЖЕ?
        </div>
        <div style={{ display: "inline-block", marginTop: 22, padding: "10px 24px", borderRadius: 18, background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 72, opacity: Math.min(1, w2 * 1.5), transform: `scale(${interpolate(w2, [0, 1], [1.8, 1])}) rotate(-4deg)`, boxShadow: `0 0 50px ${palette.glow}, 0 10px 0 ${colors.ink2}` }}>
          НАУЧУ!
        </div>
      </div>
      {/* creator row */}
      <div style={{ position: "absolute", left: X0, right: 1080 - X1, top: 860, display: "flex", gap: 16, alignItems: "center", opacity: row, transform: `translateY(${interpolate(row, [0, 1], [50, 0])}px)` }}>
        <div style={{ ...pill, position: "relative", background: subbed ? colors.surfaceLift : colors.bad, color: colors.white, boxShadow: subbed ? "none" : `0 0 50px ${colors.badGlow}, 0 10px 0 ${colors.ink2}`, transform: `scale(${tap > -0.1 && tap < 0.12 ? 0.9 : 1 + (subbed ? 0 : Math.sin(t * 8) * 0.025)})` }}>
          {subbed ? "ВЫ ПОДПИСАНЫ" : "ПОДПИСАТЬСЯ"}
          <svg viewBox="0 0 24 24" width={42} height={42} style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
            <path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm-2 17a2 2 0 0 0 4 0" fill={colors.white} />
          </svg>
          {!subbed && point > 0 && <Pointer x={170 + (1 - point) * 140} y={56 + (1 - point) * 140} pressed={tap > -0.1} />}
        </div>
        <div style={{ ...pill, padding: "0 28px", background: liked ? palette.primary : "rgba(255,255,255,0.1)", border: `3px solid ${liked ? palette.primary : colors.lineStrong}`, color: liked ? colors.ink2 : palette.text, transform: `scale(${liked ? 1 + (1 - likeHit) * 0.35 : 1})`, boxShadow: liked ? `0 0 40px ${palette.glow}` : "none" }}>
          <svg viewBox="0 0 24 24" width={44} height={44}>
            <path d="M2 10h4v11H2zM7 10l4.2-7.6c.4-.7 1.3-.9 1.9-.4.5.4.7 1 .6 1.6L13 9h6.3c1.3 0 2.3 1.2 2 2.5l-1.6 7.4A2.5 2.5 0 0 1 17.3 21H7z" fill={liked ? colors.ink2 : "none"} stroke={liked ? colors.ink2 : palette.text} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ position: "absolute", left: X0, top: 984, opacity: row, transform: `translateY(${Math.sin(t * 4) * 3}px)` }}>
        <div style={{ ...pill, height: 70, fontSize: 26, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, color: palette.text, borderRadius: "36px 36px 36px 8px" }}>
          <svg viewBox="0 0 24 24" width={30} height={30}><path d="M4 4h16v12H8l-4 4z" fill="none" stroke={palette.text} strokeWidth={2.4} strokeLinejoin="round" /></svg>
          ПИШИ В КОММЕНТЫ
        </div>
      </div>
    </>
  );
};

/** A two-line caption over the skyline between the big beats: mono kicker + wide line. */
export const Caption: React.FC<{ t: number; at: number; len: number; kicker: string; line: React.ReactNode; tone?: "hero" | "bad" }> = ({ t, at, len, kicker, line, tone = "hero" }) => {
  const { fps } = useVideoConfig();
  const age = t - at;
  if (age < 0 || age > len) return null;
  const a = sp(age, fps, "snappy");
  const b = sp(age - 0.1, fps, "snappy");
  const c = tone === "bad" ? colors.bad : palette.primary;
  return (
    <div style={{ position: "absolute", left: X0, top: 260, opacity: out(age, len, 0.25) }}>
      <div style={{ display: "inline-block", padding: "8px 14px", borderRadius: 8, background: c, color: tone === "bad" ? colors.white : colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", opacity: a, transform: `translateY(${interpolate(a, [0, 1], [-20, 0])}px)` }}>{kicker}</div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 76, lineHeight: 1.02, color: palette.text, marginTop: 14, opacity: b, transform: `translateY(${interpolate(b, [0, 1], [30, 0])}px) scale(${interpolate(b, [0, 1], [0.94, 1])})`, transformOrigin: "left top", textShadow: "0 10px 30px rgba(0,0,0,0.85)" }}>{line}</div>
    </div>
  );
};

/** A short game event pop: label chip + optional amount, floats up from (x, y). */
export const EventPop: React.FC<{ x: number; y: number; age: number; label: string; amount?: string; tone?: "hero" | "bad"; len?: number }> = ({ x, y, age, label, amount, tone = "hero", len = 1.8 }) => {
  const { fps } = useVideoConfig();
  if (age < 0 || age > len) return null;
  const s = sp(age, fps, "bouncy");
  const c = tone === "bad" ? colors.bad : palette.primary;
  return (
    <div style={{ position: "absolute", left: x, top: y - age * 40, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(-3deg)`, opacity: out(age, len, 0.35), textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: tone === "bad" ? colors.white : colors.ink2, background: c, padding: "8px 16px", borderRadius: 10, boxShadow: `0 8px 0 ${colors.ink2}` }}>{label}</div>
      {amount && <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 70, color: c, WebkitTextStroke: `6px ${colors.ink2}`, paintOrder: "stroke fill", textShadow: `0 6px 0 ${colors.ink2}`, marginTop: 6 }}>{amount}</div>}
    </div>
  );
};

/** HeyGen face, full-screen, on the first line of the hook. 16:9 studio letterboxed in 9:16 → this scale fills the frame. */
export const HookFace: React.FC<{ t: number; until: number; rate: number }> = ({ t, until, rate }) => {
  const k = interpolate(t, [until - 0.12, until + 0.18], [0, 1], { easing: theme.ease.in, ...clamp });
  if (k >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: palette.bg, opacity: 1 - k, transform: `scale(${1 + k * 0.25})`, filter: k > 0 ? `blur(${k * 14}px)` : undefined }}>
      <OffthreadVideo src={staticFile("presenter/shawarma-factory/hook.mp4")} muted playbackRate={rate} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(3.2)", transformOrigin: "540px 930px" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg}D0 0%, ${palette.bg}00 30%, ${palette.bg}00 62%, ${palette.bg}E6 100%)` }} />
    </div>
  );
};
