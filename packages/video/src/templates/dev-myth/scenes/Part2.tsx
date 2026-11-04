// Part 2 «Что на самом деле делает программист» (PLAN-FRAMES 2.01–2.11):
// the five tasks, «уже кто-то решал» with GitHub's count, three solutions
// that already exist, Archimedes, the library wall, the one question, the
// copier, search / adapt / assemble, and the labs that learned exactly that.
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, CutWipe, Drift, Flash, FlyIn, Kinetic, Label, S, SceneShell, Shockwave, Slam, Stamp, TopBar, WIDE, cl, media } from "../ui";
import { CodeBlock, CutVideo, FaceShot, LogoCard, Still, Wireframe } from "../fx";
import { PRESENTER as FACE } from "../presenter-more";
import { Sequence, OffthreadVideo } from "remotion";
import { LEAD, LIBS_T, P2CARD, SCRATCH_T, SEARCH_T, SOLVED_T, T, TASKS_T, THING_T, VO_RATE, WHO_T, WHY2_T } from "../timeline";
import { LABS } from "./Part1B";
import { Sym, richText } from "../sym";

const I = "images/dev-myth/";
const L = "images/dev-myth/logos/";
const BAR = "ЧАСТЬ 2 · ЧТО ДЕЛАЕТ ПРОГРАММИСТ";

/** A screenshot on a white card, slightly tilted, with an optional ring (fractions of the image). */
const Shot: React.FC<{ src: string; w: number; ring?: { x: number; y: number; w: number; h: number; at: number } }> = ({ src, w, ring }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", padding: 8, background: colors.white, boxShadow: colors.shadow, width: w }}>
      <Img src={media(src)} style={{ width: "100%", display: "block" }} />
      {ring && frame >= ring.at && (
        <div style={{ position: "absolute", left: `calc(8px + ${ring.x * 100}%)`, top: `calc(8px + ${ring.y * 100}%)`, width: `${ring.w * 100}%`, height: `${ring.h * 100}%`, border: `6px solid ${colors.bad}`, borderRadius: 16, boxShadow: `0 0 24px ${colors.badGlow}` }} />
      )}
    </div>
  );
};

/* ------------------------------------------------------------- part card */

export const PartCard: React.FC<{ n: string; title: string }> = ({ n, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hitAt = S(P2CARD.hit, fps);
  const breakAt = S(P2CARD.shatter, fps);
  const hit = usePunch(hitAt, 16);
  const brk = usePunch(breakAt, 14);
  const band = interpolate(frame, [0, hitAt], [-STAGE_W, 0], { easing: theme.ease.inOut, ...cl });
  const k = Math.max(0, frame - breakAt);
  const card = (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: band, top: 470, width: 1920, height: 14, background: palette.primary, boxShadow: `0 0 40px ${palette.glow}` }} />
      {frame >= hitAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Slam text={n} at={hitAt} size={260} />
          <div style={{ padding: "16px 30px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 52, transform: "rotate(-1.5deg)", boxShadow: colors.paperShadow }}>{title}</div>
        </div>
      )}
    </div>
  );
  // the shards: a 6×4 grid cut diagonally, each triangle flies off from the centre
  const cols = 6;
  const rows = 4;
  const shards: { poly: string; cx: number; cy: number; i: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x0 = (c / cols) * 100, x1 = ((c + 1) / cols) * 100, y0 = (r / rows) * 100, y1 = ((r + 1) / rows) * 100;
      const j = (v: number, i: number) => v + (((i * 37) % 7) - 3) * 0.6;
      shards.push({ poly: `polygon(${x0}% ${y0}%, ${x1}% ${j(y0, r + c)}%, ${j(x0, c * 3 + r)}% ${y1}%)`, cx: (x0 + x1) / 2 - 3, cy: (y0 + y1) / 2 - 3, i: shards.length });
      shards.push({ poly: `polygon(${x1}% ${j(y0, r + c)}%, ${x1}% ${y1}%, ${j(x0, c * 3 + r)}% ${y1}%)`, cx: (x0 + x1) / 2 + 3, cy: (y0 + y1) / 2 + 3, i: shards.length });
    }
  return (
    <SceneShell exit={false} shake={hit.shake + brk.shake}>
      {frame < breakAt ? (
        card
      ) : (
        shards.map((sh) => {
          const dx = (sh.cx - 50) / 50;
          const dy = (sh.cy - 50) / 50;
          const spd = 1 + ((sh.i * 13) % 7) / 7;
          const t = interpolate(k, [0, 18], [0, 1], { easing: theme.ease.in, ...cl });
          return (
            <div key={sh.i} style={{ position: "absolute", inset: 0, clipPath: sh.poly, transform: `translate(${dx * 900 * t * spd}px, ${dy * 600 * t * spd + 300 * t * t}px) rotate(${(dx + dy) * 70 * t}deg) scale(${1 - t * 0.3})`, transformOrigin: `${sh.cx}% ${sh.cy}%`, opacity: 1 - t * 0.6 }}>
              {card}
            </div>
          );
        })
      )}
      <Flash amount={hit.energy + brk.energy * 0.8} />
    </SceneShell>
  );
};
const STAGE_W = 1920;

/* ---------------------------------------------------------------- intro */

/** The five task slots around the developer: left column 3, right column 2. */
const SLOTS = [
  { x: 96, y: 150 }, { x: 96, y: 400 }, { x: 96, y: 650 },
  { x: 1300, y: 230 }, { x: 1300, y: 540 },
];
const SLOT_W = 520;
const SLOT_H = 220;

const Slot: React.FC<{ i: number; at: number; label: string; children?: React.ReactNode; filled?: boolean }> = ({ i, at, label, children, filled = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  const { x, y } = SLOTS[i];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: SLOT_W, height: SLOT_H, zIndex: 6, border: `2px ${filled ? "solid" : "dashed"} ${filled ? palette.primary : colors.lineStrong}`, background: filled ? colors.surfaceStrong : "transparent", boxShadow: filled ? `0 0 30px ${palette.glow}` : undefined, transform: filled ? `scale(${interpolate(p, [0, 1], [0.7, 1])})` : undefined, opacity: filled ? Math.min(1, p * 1.5) : 0.6 }}>
      <div style={{ position: "absolute", left: 16, top: -18, padding: "4px 12px", background: filled ? palette.primary : colors.surfaceLift, color: filled ? colors.ink2 : palette.textDim, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ position: "absolute", inset: "26px 20px 16px", overflow: "hidden" }}>{filled && children}</div>
    </div>
  );
};

/** Note 28: in the middle, a real programmer typing (Pexels 7504970), not a still. */
const Dev: React.FC<{ at: number; dim?: number }> = ({ at, dim = 1 }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 5, opacity: dim }}>
    <FlyIn from="bottom" at={at} x={660} y={190} w={600} rot={0} sticker={false}>
      <div style={{ padding: 8, background: colors.white, boxShadow: colors.shadow }}>
        <div style={{ position: "relative", width: 584, height: 560, overflow: "hidden" }}>
          <Sequence from={Math.max(0, at)} layout="none">
            <OffthreadVideo src={media("footage/dev-myth/typing.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Sequence>
        </div>
        <div style={{ padding: "10px 6px 2px", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: colors.ink }}>РАЗРАБОТЧИК · РАБОЧИЙ ДЕНЬ</div>
      </div>
    </FlyIn>
  </div>
);

export const P2IntroScene: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <FaceShot file={FACE.p2intro.file} duration={FACE.p2intro.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 260, width: 820 }}>
          <Kinetic text="ЧЕМ ЗАНИМАЕТСЯ РАЗРАБОТЧИК?" size={84} delay={S(LEAD + 1.1, fps)} per={3} mode="snap" hero={[2]} lineHeight={1.04} />
        </div>
      </FaceShot>
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- tasks */

const Mini: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = palette.text, size = 22 }) => (
  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: size, lineHeight: 1.5, color, whiteSpace: "pre" }}>{richText(children)}</div>
);

/** Note 22: Postman, and the request travelling FRONT ⇄ API ⇄ BACKEND. */
const ApiChain: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const k = frame - at;
  const box = (label: string, i: number, hero = false) => (
    <div style={{ padding: "10px 14px", border: `2px solid ${hero ? palette.primary : colors.lineStrong}`, background: hero ? palette.primary : colors.surfaceLift, color: hero ? colors.ink2 : palette.text, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, opacity: k >= 3 + i * 4 ? 1 : 0 }}>{richText(label)}</div>
  );
  const pulse = ((k * 4) % 120) / 120;
  return (
    <div style={{ position: "relative", height: 170 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, opacity: k >= 0 ? 1 : 0 }}>
        <Img src={media(L + "si-postman.svg")} style={{ width: 44, height: 44 }} />
        <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 20, color: palette.text }}>POSTMAN · GET /api/user → 200 OK</span>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: "50%", height: 3, background: colors.lineStrong }} />
        <div style={{ position: "absolute", left: `calc(40px + ${pulse * 100}% - ${pulse * 80}px)`, top: "50%", width: 14, height: 14, marginTop: -7, borderRadius: 7, background: palette.primary, boxShadow: `0 0 16px ${palette.glow}`, opacity: k >= 12 ? 1 : 0 }} />
        {box("FRONT", 0)}
        {box("⇄ API ⇄", 1, true)}
        {box("BACKEND", 2)}
      </div>
    </div>
  );
};

export const TasksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ats = [TASKS_T.fn, TASKS_T.ui, TASKS_T.db, TASKS_T.bugs, TASKS_T.api].map((t) => S(T(t), fps));
  const fixed = frame >= ats[3] + 14;
  return (
    <SceneShell>
      <Drift items={["fn()", "SQL", "API", "UI", "BUG", "git", "npm", "200 OK"]} opacity={0.12} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <Dev at={-40} />
      <Slot i={0} at={ats[0]} label="ФУНКЦИИ" filled={frame >= ats[0]}>
        <CodeBlock at={ats[0] + 2} width={480} size={22} speed={3} lines={["function login(user, pass) {", "  const u = db.find(user);", "  return check(u, pass);", "}"]} />
      </Slot>
      <Slot i={1} at={ats[1]} label="ИНТЕРФЕЙСЫ" filled={frame >= ats[1]}>
        <div style={{ position: "relative", width: 480, height: 170 }}><Wireframe at={ats[1] + 2} x={70} y={0} w={280} /></div>
      </Slot>
      <Slot i={2} at={ats[2]} label="БАЗЫ ДАННЫХ" filled={frame >= ats[2]}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Img src={media(L + "si-postgresql.svg")} style={{ width: 96, height: 96 }} />
          <Mini size={20}>{"id │ email          │ plan\n 1 │ ivan@mail.ru   │ pro\n 2 │ olga@ya.ru     │ free"}</Mini>
        </div>
      </Slot>
      <Slot i={3} at={ats[3]} label="ОШИБКИ" filled={frame >= ats[3]}>
        <Mini color={colors.bad}>{"✗ TypeError: undefined\n  at billing.ts:42"}</Mini>
        {fixed && <Mini color={palette.primary}>{"✓ исправлено · тесты прошли"}</Mini>}
      </Slot>
      <Slot i={4} at={ats[4]} label="API" filled={frame >= ats[4]}>
        <ApiChain at={ats[4]} />
      </Slot>
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- hard */

/** A tangled path, after the author's reference: a dot, a knot of loops, an arrow out. Seeded, so every render is the same. */
const tanglePath = () => {
  // a smooth scribble: a few sinusoids per axis make round loops that cross
  // themselves, and a slow drift carries the line from the knot's left to its right
  const cx = 960, cy = 560, R = 300;
  const fx = [[1.0, 0.0, 170], [2.3, 1.1, 90], [3.7, 2.4, 55]];
  const fy = [[1.4, 0.7, 150], [2.9, 1.9, 85], [4.3, 0.3, 45]];
  const N = 900, turns = 5.2 * Math.PI * 2;
  let d = `M 220 ${cy} L ${cx - R - 40} ${cy}`;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * turns;
    const k = i / N;
    const ease = Math.sin(Math.PI * k); // loops swell in the middle, settle at the ends
    const x = cx - R + 2 * R * k + ease * fx.reduce((a, [f, p, amp]) => a + amp * Math.sin(f * t + p), 0);
    const y = cy + ease * fy.reduce((a, [f, p, amp]) => a + amp * Math.sin(f * t + p), 0);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L 1690 ${cy}`;
  return d;
};
const TANGLE = tanglePath();

export const HardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationInFrames } = useVideoConfig();
  const draw = interpolate(frame, [2, durationInFrames - 14], [0, 1], { easing: theme.ease.inOut, ...cl });
  const arrow = draw > 0.985;
  const stampAt = S(0.5, fps);
  const hit = usePunch(stampAt, 16);
  const labels: [string, number, number][] = [["ФУНКЦИИ", 520, 330], ["ИНТЕРФЕЙСЫ", 1180, 300], ["БАЗЫ ДАННЫХ", 1340, 760], ["ОШИБКИ", 560, 790], ["API", 960, 860], ["ДЕПЛОЙ", 1450, 470], ["ТЕСТЫ", 430, 560]];
  return (
    <SceneShell shake={hit.shake * 0.5}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 4 }}>
        <circle cx={220} cy={560} r={16} fill={palette.text} />
        <path d={TANGLE} fill="none" stroke={palette.text} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${palette.bg})` }} />
        {arrow && <path d="M 1690 540 L 1730 560 L 1690 580 Z" fill={palette.primary} />}
      </svg>
      {labels.map(([t, x, y], i) => {
        const at = 6 + i * 6;
        if (frame < at) return null;
        const p = interpolate(frame - at, [0, 8], [0, 1], { easing: theme.ease.out, ...cl });
        return (
          <div key={t} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.6 + p * 0.4}) rotate(${((i % 3) - 1) * 6}deg)`, opacity: p, padding: "8px 16px", background: colors.surfaceLift, border: `2px solid ${colors.lineStrong}`, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: palette.text, zIndex: 6 }}>{t}</div>
        );
      })}
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <Stamp tone="bad" size={110} rotate={-3} delay={stampAt}>СЛОЖНО?</Stamp>
        </div>
      )}
      <Flash amount={hit.energy * 0.6} color={colors.bad} />
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- thing */

export const ThingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mostAt = S(T(THING_T.most), fps);
  const solvedAt = S(T(THING_T.solved), fps);
  const faceEnd = S(LEAD + FACE.thing.duration / VO_RATE, fps);
  const hit = usePunch(solvedAt, 16);
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={["627k", "★ 30.5k", "MIT", "fork", "auth", "oauth2", "jwt", "★ 28.4k"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <div style={{ position: "absolute", left: 96, top: 180, width: 800, zIndex: 9 }}>
        <Kinetic text="БОЛЬШИНСТВО ЗАДАЧ УЖЕ КТО-ТО РЕШАЛ" size={76} delay={mostAt} per={3} mode="snap" hero={[2, 3, 4]} lineHeight={1.04} />
      </div>
      <FaceShot file={FACE.thing.file} duration={FACE.thing.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 280, width: 820 }}>
          <Kinetic text="ИНТЕРЕСНАЯ ВЕЩЬ" size={96} delay={6} per={3} mode="snap" hero={[1]} lineHeight={1.02} />
        </div>
      </FaceShot>
      <FlyIn from="right" at={faceEnd} x={980} y={150} w={840} rot={1.5} z={7} card={false} sticker={false}>
        <Shot src={I + "github-auth.png"} w={840} ring={{ x: 0, y: 0, w: 0.2, h: 0.075, at: solvedAt }} />
      </FlyIn>
      {frame >= solvedAt && (
        <div style={{ position: "absolute", left: 96, top: 560, zIndex: 10, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <Slam text="627 000" at={solvedAt} size={150} roll={{ from: 0, to: 627000 }} />
          <Label at={solvedAt + 6} size={24}>ГОТОВЫХ РЕШЕНИЙ ДЛЯ ВХОДА · GITHUB, 31.10.2026</Label>
        </div>
      )}
      <Burst at={solvedAt} x={500} y={640} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- solved */

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ width: 520, padding: 26, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
    <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em", color: palette.textDim, marginBottom: 18 }}>{title}</div>
    {children}
  </div>
);

const Field: React.FC<{ w?: string; label?: string }> = ({ w = "100%", label }) => (
  <div style={{ width: w, height: 46, marginBottom: 12, border: `2px solid ${colors.lineStrong}`, background: colors.surfaceLift, fontFamily: theme.fonts.mono, fontSize: 20, color: palette.textDim, display: "flex", alignItems: "center", paddingLeft: 14 }}>{label}</div>
);

export const SolvedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (t: number) => S(T(t), fps);
  const oks = [at(SOLVED_T.loginOk), at(SOLVED_T.payOk), at(SOLVED_T.mailOk)];
  const p = usePunch(oks.filter((o) => frame >= o).slice(-1)[0] ?? 9999, 14);
  return (
    <SceneShell shake={p.shake * 0.6}>
      <Drift items={["OAuth", "Stripe", "SMTP", "S3", "JWT", "webhook", "CDN", "200 OK"]} opacity={0.12} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <FlyIn from="bottom" at={at(SOLVED_T.login)} x={96} y={200} w={520} rot={-2} z={6} sticker={false}>
        <Card title="ВХОД ДЛЯ ПОЛЬЗОВАТЕЛЕЙ">
          <Field label="email" />
          <Field label="пароль" />
          <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56, justifyContent: "center", background: colors.white, color: colors.ink, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24 }}>
            <Img src={media(L + "si-google.svg")} style={{ width: 30, height: 30, filter: "invert(1)" }} />
            Войти через Google
          </div>
        </Card>
      </FlyIn>
      <FlyIn from="bottom" at={at(SOLVED_T.pay)} x={700} y={200} w={520} rot={1.5} z={6} sticker={false}>
        <Card title="СИСТЕМА ПЛАТЕЖЕЙ">
          <Field label="4242 4242 4242 4242" />
          <div style={{ display: "flex", gap: 12 }}><Field w="50%" label="12 / 28" /><Field w="50%" label="CVC" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56, justifyContent: "center", background: palette.primary, color: colors.ink2, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24 }}>
            <Img src={media(L + "si-stripe.svg")} style={{ width: 34, height: 34, filter: "invert(1)" }} />
            ОПЛАТИТЬ 990 ₽
          </div>
        </Card>
      </FlyIn>
      <FlyIn from="bottom" at={at(SOLVED_T.mail)} x={1304} y={200} w={520} rot={-1.5} z={6} sticker={false}>
        <Card title="ПИСЬМА И ФОТО">
          <div style={{ position: "relative", height: 210, overflow: "hidden", marginBottom: 12 }}>
            <Sequence from={S(T(SOLVED_T.mail), fps)} layout="none">
              <OffthreadVideo src={media("media/dev-myth/envelope.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Sequence>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: theme.fonts.mono, fontSize: 20, color: palette.text }}>
            <span style={{ padding: "6px 10px", background: colors.surfaceLift }}><Sym c="✉" /></span> Подтвердите email · 3 фото
          </div>
        </Card>
      </FlyIn>
      {oks.map((o, k) =>
        frame >= o ? (
          <div key={k} style={{ position: "absolute", left: 120 + k * 600, top: 600, zIndex: 9 }}>
            <Stamp tone="hero" size={70} rotate={-6} delay={o}>УЖЕ ЕСТЬ</Stamp>
          </div>
        ) : null,
      )}
      <Flash amount={p.energy * 0.6} />
    </SceneShell>
  );
};

/* -------------------------------------------------------------- scratch */

export const ScratchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scratchAt = S(T(SCRATCH_T.scratch), fps);
  const hit = usePunch(scratchAt, 16);
  return (
    <SceneShell shake={hit.shake}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <FlyIn from="right" at={0} x={760} y={150} w={1060} rot={1.5} z={5} card={false} sticker={false}>
        <div style={{ padding: 10, background: colors.paper, boxShadow: colors.paperShadow, overflow: "hidden" }}>
          <div style={{ position: "relative", width: 1040, height: 622, overflow: "hidden" }}>
            <Still src={I + "archimedes.jpg"} from={1.0} to={1.12} pan={[-40, -10]} dim={0} tint={0} />
          </div>
        </div>
      </FlyIn>
      <div style={{ position: "absolute", left: 96, top: 200, width: 640, zIndex: 9 }}>
        <Kinetic text="ЭВРИКА?" size={110} delay={4} per={3} mode="snap" lineHeight={1.02} />
        <div style={{ marginTop: 18 }}><Label at={10} size={22}>АРХИМЕД · ГРАВЮРА 1737 ГОДА</Label></div>
      </div>
      {frame >= scratchAt && (
        <div style={{ position: "absolute", left: 96, top: 520, zIndex: 10 }}>
          <Stamp tone="bad" size={110} rotate={-5} delay={scratchAt}>НЕ С НУЛЯ</Stamp>
        </div>
      )}
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- libs */

const STACK = [
  ["si-npm.svg", "NPM"], ["si-react.svg", "REACT"], ["si-django.svg", "DJANGO"], ["si-laravel.svg", "LARAVEL"],
  ["si-spring.svg", "SPRING"], ["si-python.svg", "PYTHON"], ["si-nodedotjs.svg", "NODE.JS"], ["si-postgresql.svg", "POSTGRES"],
] as const;

export const LibsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const libsAt = S(T(LIBS_T.libs), fps);
  const docsAt = S(T(LIBS_T.docs), fps);
  const okAt = S(T(LIBS_T.ok), fps);
  const hit = usePunch(okAt, 16);
  return (
    <SceneShell shake={hit.shake}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <FlyIn from="left" at={docsAt} x={96} y={160} w={760} rot={-1.5} z={6} card={false} sticker={false}>
        <Shot src={I + "django-auth.png"} w={760} />
      </FlyIn>
      <div style={{ position: "absolute", left: 960, top: 150, width: 880, zIndex: 7, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {STACK.map(([f, n], i) => <LogoCard key={n} at={libsAt + i * 4} src={L + f} name={n} size={96} />)}
      </div>
      {frame >= okAt && (
        <div style={{ position: "absolute", left: 980, top: 650, zIndex: 10 }}>
          <Stamp tone="hero" size={92} rotate={-4} delay={okAt}>НОРМАЛЬНО</Stamp>
        </div>
      )}
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/* ------------------------------------------------------------- question */

export const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [S(LEAD + FACE.question.duration / VO_RATE, fps), S(LEAD + FACE.question.duration / VO_RATE, fps) + 20], [0, 1], { easing: theme.ease.out, ...cl });
  const line = interpolate(frame, [0, 18], [0, 1], { easing: theme.ease.inOut, ...cl });
  return (
    <SceneShell>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${palette.primary}22, transparent 55%)`, zIndex: 1 }} />
      <div style={{ position: "absolute", left: 960 - 900 * line, width: 1800 * line, top: 820, height: 3, background: palette.primary, boxShadow: `0 0 30px ${palette.glow}`, zIndex: 3 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, zIndex: 9, display: "flex", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 640, lineHeight: 1, color: palette.text, opacity: p, transform: `scale(${interpolate(p, [0, 1], [1.2, 1])})`, textShadow: `0 0 80px ${palette.glow}` }}>?</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, zIndex: 9, display: "flex", justifyContent: "center" }}>
        <Label at={8} size={28}>ОДИН ВОПРОС</Label>
      </div>
      <FaceShot file={FACE.question.file} duration={FACE.question.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 320 }}>
          <Stamp tone="hero" size={62} rotate={-3} delay={S(LEAD + 0.9, fps)}>ОДИН ВОПРОС</Stamp>
        </div>
      </FaceShot>
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- why2 */

export const Why2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const humanAt = S(T(WHY2_T.human), fps);
  const hit = usePunch(humanAt, 16);
  const copies = Math.min(9, Math.max(0, Math.floor((frame - 6) / 7)));
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={["login.ts", "copy", "paste", "×1000", "Ctrl+C", "Ctrl+V", "fork", "clone"]} opacity={0.12} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <div style={{ position: "absolute", left: 96, top: 180, width: 900, zIndex: 9 }}>
        <Kinetic text="РЕШЕНИЕ УЖЕ ЕСТЬ. ЗАЧЕМ ПОВТОРЯТЬ?" size={72} delay={4} per={3} mode="snap" hero={[1, 2]} lineHeight={1.04} />
      </div>
      {/* the copier: the same file, again and again */}
      {Array.from({ length: copies }, (_, k) => (
        <div key={k} style={{ position: "absolute", left: 110 + k * 46, top: 470 + k * 26, zIndex: 4 + k, width: 420, padding: "16px 20px", background: colors.paper, color: colors.ink, fontFamily: theme.fonts.mono, fontSize: 20, fontWeight: 700, boxShadow: colors.paperShadow, transform: `rotate(${(k % 3) - 1}deg)` }}>
          <div style={{ color: colors.inkFaded, letterSpacing: "0.1em", marginBottom: 8 }}>login.ts · КОПИЯ {k + 1}</div>
          <div>function login(user, pass) {"{"} … {"}"}</div>
        </div>
      ))}
      <FlyIn from="right" at={8} x={1300} y={60} w={480} rot={2} z={6} sticker={false}>
        <div style={{ padding: 8, background: colors.white, boxShadow: colors.shadow }}>
          <div style={{ width: 524, height: 640, overflow: "hidden" }}>
            <Sequence from={8} layout="none"><OffthreadVideo src={media("media/dev-myth/hackers.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.4) contrast(1.1)" }} /></Sequence>
          </div>
        </div>
      </FlyIn>
      {frame >= humanAt && (
        <div style={{ position: "absolute", left: 1150, top: 660, zIndex: 12 }}>
          <Stamp tone="bad" size={84} rotate={-5} delay={humanAt}>ЧЕЛОВЕК?</Stamp>
        </div>
      )}
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- search */

export const SearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const notAt = S(T(SEARCH_T.not), fps);
  const sAt = S(T(SEARCH_T.search), fps);
  const aAt = S(T(SEARCH_T.adapt), fps);
  const bAt = S(T(SEARCH_T.build), fps);
  const hits = [usePunch(notAt, 14), usePunch(sAt, 12), usePunch(aAt, 12), usePunch(bAt, 12)];
  const cols = frame >= sAt;
  return (
    <SceneShell shake={hits.reduce((a, h) => a + h.shake * 0.5, 0)}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      {!cols && (
        <>
          <div style={{ position: "absolute", left: 96, top: 220, width: 1200, zIndex: 9 }}>
            <Kinetic text="БОЛЬШАЯ ЧАСТЬ ПРОГРАММИРОВАНИЯ" size={80} delay={4} per={3} mode="snap" lineHeight={1.04} />
          </div>
          {frame >= notAt && (
            <div style={{ position: "absolute", left: 96, top: 520, zIndex: 10 }}>
              <Stamp tone="bad" size={110} rotate={-4} delay={notAt}>НЕ ИЗОБРЕТЕНИЕ</Stamp>
            </div>
          )}
        </>
      )}
      {cols && (
        <>
          {[
            { at: sAt, word: "ПОИСК", x: 96, body: <Shot src={I + "stackoverflow.png"} w={540} /> },
            { at: aAt, word: "АДАПТАЦИЯ", x: 690, body: <Shot src={I + "django-auth.png"} w={540} /> },
            {
              at: bAt, word: "СБОРКА", x: 1284,
              body: (
                <div style={{ width: 540, padding: 20, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}` }}>
                  <CodeBlock at={bAt + 2} width={500} size={22} speed={3} lines={["import { auth } from 'next-auth'", "import Stripe from 'stripe'", "import { db } from './db'", "", "export default app(auth, db, Stripe)"]} accent={/(import|from|export)/} />
                </div>
              ),
            },
          ].map((c) =>
            frame >= c.at ? (
              <React.Fragment key={c.word}>
                <FlyIn from="bottom" at={c.at + 2} x={c.x} y={290} w={540} rot={0} z={7} card={false} sticker={false}>
                  {c.body}
                </FlyIn>
                <div style={{ position: "absolute", left: c.x, top: 150, zIndex: 9 }}>
                  <Stamp tone="hero" size={60} rotate={-3} delay={c.at}>{c.word}</Stamp>
                </div>
              </React.Fragment>
            ) : null,
          )}
        </>
      )}
      {frame >= sAt && frame < sAt + 14 && <CutWipe />}
      <Flash amount={hits[0].energy} color={colors.bad} />
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ who */

export const WhoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const aiAt = S(T(WHO_T.ai), fps);
  const hit = usePunch(aiAt, 18);
  const all = [...LABS, { src: L + "gemini.svg", name: "GEMINI" }];
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={["AI", "LLM", "агент", "100 $", "Claude", "GPT", "Qwen", "DeepSeek"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, zIndex: 9, display: "flex", justifyContent: "center" }}>
        {frame < aiAt ? (
          <Kinetic text="КТО НАУЧИЛСЯ ИМЕННО ЭТОМУ?" size={84} delay={4} per={3} mode="snap" lineHeight={1.04} />
        ) : (
          <Stamp tone="hero" size={80} rotate={-3} delay={aiAt}>ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ</Stamp>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, zIndex: 9, display: "flex", justifyContent: "center", gap: 22 }}>
        {all.map((l, i) => <LogoCard key={l.name} at={aiAt + 6 + i * 4} src={l.src} name={l.name} size={110} w={220} hero={i < 2} />)}
      </div>
      <FaceShot file={FACE.who.file} duration={FACE.who.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 280, width: 820 }}>
          <Kinetic text="КТО НАУЧИЛСЯ ИМЕННО ЭТОМУ?" size={84} delay={6} per={3} mode="snap" lineHeight={1.04} />
        </div>
      </FaceShot>
      <Shockwave at={aiAt} size={2000} />
      <Burst at={aiAt} x={960} y={270} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};
