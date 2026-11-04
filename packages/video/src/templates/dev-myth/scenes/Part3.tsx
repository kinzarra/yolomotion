// Part 3 «ИИ разрушил монополию на код»: the old way as a seven-step track
// (idea → developer → money → task → estimate → code → months), then the new
// way in one terminal, then the JetBrains 2026 numbers on screen (the voice
// rounds them, the screen keeps them exact).
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, Calendar, Cross, Flash, FlyIn, Kinetic, Label, Receipt, ReceiptLine, ReceiptRule, S, SceneShell, Slam, Stamp, Stopwatch, Strike, Terminal, TopBar, WIDE, cl, media } from "../ui";
import { CodeBlock, FileTree, LogoCard, NoteRain } from "../fx";
import { BgVideo, GlassChip, LogoPlate, MediaCard, StatPlate } from "../fx2";
import { T } from "../timeline";
import { Sym, richText } from "../sym";

const I = "images/dev-myth/";
const L = "images/dev-myth/logos/";
export const BAR3 = "ЧАСТЬ 3 · ИИ РАЗРУШИЛ МОНОПОЛИЮ";
const USD = [I + "usd-front.png", I + "usd-stand.png", I + "usd-back.png"];

/* --------------------------------------------------------------- the old way */

const STEPS = ["ИДЕЯ", "РАЗРАБОТЧИК", "ДЕНЬГИ", "ЗАДАЧА", "СРОКИ", "КОД", "РЕЗУЛЬТАТ"];

/** The seven steps across the top; done steps lime, the current one paper, the rest dim. */
const StepTrack: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: theme.spring.snappy });
  return (
    <div style={{ position: "absolute", left: 96, right: 96, top: 120, zIndex: 9, display: "flex", alignItems: "center", gap: 10 }}>
      {STEPS.map((st, i) => {
        const now = i === active;
        const done = i < active;
        return (
          <React.Fragment key={st}>
            <div style={{ padding: "10px 16px", fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", background: now ? colors.paper : done ? palette.primary : colors.surfaceLift, color: now || done ? colors.ink : palette.textDim, border: `2px solid ${now ? colors.paper : done ? palette.primary : colors.line}`, transform: now ? `scale(${interpolate(p, [0, 1], [1.3, 1.08])})` : undefined, boxShadow: now ? colors.paperShadow : undefined }}>
              {i + 1}. {st}
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: done ? palette.primary : colors.line }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Old: React.FC<{ step: number; children: React.ReactNode; shake?: number }> = ({ step, children, shake = 0 }) => (
  <SceneShell shake={shake}>
    <BgVideo src="media/dev-myth/v-handshake.mp4" dim={0.78} tint={0.25} startFrom={step * 0.9} />
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · РАНЬШЕ`} />
    <StepTrack active={step} />
    {children}
  </SceneShell>
);

const CLIENT = { src: I + "client.png", w: 380 };
const Client: React.FC<{ at?: number; x?: number; y?: number; w?: number; from?: "left" | "right" | "bottom" }> = ({ at = 0, x = 200, y = 250, w = CLIENT.w, from = "left" }) => (
  <FlyIn from={from} at={at} x={x} y={y} w={w} rot={-2} z={6}>
    <Img src={media(CLIENT.src)} style={{ width: "100%", display: "block" }} />
  </FlyIn>
);
const DevFig: React.FC<{ at?: number; x?: number; y?: number; w?: number }> = ({ at = 0, x = 1300, y = 260, w = 400 }) => (
  <FlyIn from="right" at={at} x={x} y={y} w={w} rot={2} z={6}>
    <Img src={media(I + "fig-dev.png")} style={{ width: "100%", display: "block", filter: "brightness(1.35)" }} />
  </FlyIn>
);

export const P3ThenScene: React.FC = () => (
  <SceneShell>
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · РАНЬШЕ`} />
    <StepTrack active={-1} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, zIndex: 9, display: "flex", justifyContent: "center" }}>
      <Kinetic text="КАК БЫЛО РАНЬШЕ" size={120} delay={4} per={3} mode="snap" lineHeight={1} />
    </div>
  </SceneShell>
);

/** A light bulb drawn in the palette: glass, screw, rays when lit. */
const Bulb: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const on = frame >= at ? (Math.floor((frame - at) / 3) % 4 === 1 && frame - at < 12 ? 0.3 : 1) : 0.15;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
      {on > 0.5 && [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (-160 + i * 23) * (Math.PI / 180); return <line key={i} x1={50 + Math.cos(a) * 52} y1={48 + Math.sin(a) * 52} x2={50 + Math.cos(a) * 66} y2={48 + Math.sin(a) * 66} stroke={palette.primary} strokeWidth={5} strokeLinecap="round" />; })}
      <circle cx={50} cy={48} r={36} fill={palette.primary} opacity={on} style={{ filter: `drop-shadow(0 0 20px ${palette.glow})` }} />
      <circle cx={50} cy={48} r={36} fill="none" stroke={colors.paper} strokeWidth={4} />
      <rect x={34} y={86} width={32} height={22} rx={4} fill={colors.paperShade} />
      <rect x={38} y={110} width={24} height={8} rx={3} fill={colors.inkFaded} />
    </svg>
  );
};

export const P3IdeaScene: React.FC = () => (
  <Old step={0}>
    <Client at={0} x={620} y={300} w={360} />
    <div style={{ position: "absolute", left: 1000, top: 260, zIndex: 8 }}><Bulb at={S(T(0.6), 30)} size={170} /></div>
    <div style={{ position: "absolute", left: 96, top: 360, zIndex: 9 }}><Kinetic text="ИДЕЯ" size={130} delay={6} per={3} mode="snap" hero={[0]} lineHeight={1} /></div>
  </Old>
);

export const P3FindScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [0, 40], [0, 1], { easing: theme.ease.inOut, ...cl });
  return (
    <Old step={1}>
      <div style={{ position: "absolute", left: 120 + walk * 520, top: 300, width: 340, zIndex: 6, transform: `translateY(${Math.abs(Math.sin(frame / 4)) * -14}px)` }}>
        <Img src={media(CLIENT.src)} style={{ width: "100%", display: "block" }} />
      </div>
      <DevFig at={6} x={1300} y={280} w={420} />
      <div style={{ position: "absolute", left: 1300, top: 860, zIndex: 9 }}><Label at={10} size={26} rotate={-1}>ИЩЕМ РАЗРАБОТЧИКА · 2–4 НЕДЕЛИ</Label></div>
    </Old>
  );
};

export const P3PayScene: React.FC<{ salary: number }> = ({ salary }) => {
  const frame = useCurrentFrame();
  const hit = usePunch(8, 16);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <Old step={2} shake={hit.shake}>
      <NoteRain at={0} count={14}>{(i) => <Img key={i} src={media(USD[i % 3])} style={{ width: 300, display: "block", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.7))" }} />}</NoteRain>
      <DevFig at={0} x={1300} y={280} w={420} />
      {frame >= 8 && <div style={{ position: "absolute", left: 96, top: 380, zIndex: 9 }}><Slam text={`${fmt(salary)} ₽`} at={8} size={170} /></div>}
      <div style={{ position: "absolute", left: 100, top: 590, zIndex: 9 }}><Label at={14} size={28} rotate={-1}>КАЖДЫЙ МЕСЯЦ</Label></div>
      <Flash amount={hit.energy} />
    </Old>
  );
};

/** What the client said vs what the developer heard: a house and a tower. */
const House: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M 15 50 L 50 18 L 85 50 L 85 88 L 15 88 Z" fill="none" stroke={colors.ink} strokeWidth={5} strokeLinejoin="round" /><rect x={42} y={62} width={16} height={26} fill={colors.ink} /></svg>
);
const Tower: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><rect x={32} y={8} width={36} height={84} fill="none" stroke={colors.ink} strokeWidth={5} />{[0, 1, 2, 3, 4, 5].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={40 + c * 12} y={16 + r * 12} width={8} height={7} fill={colors.ink} />))}</svg>
);

export const P3TaskScene: React.FC = () => (
  <Old step={3}>
    <Client at={0} x={160} y={330} w={330} />
    <DevFig at={0} x={1380} y={330} w={360} />
    <FlyIn from="bottom" at={4} x={420} y={260} w={330} rot={-3} z={8} sticker={false}>
      <div style={{ padding: 24, background: colors.paper, boxShadow: colors.paperShadow, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: colors.inkFaded, marginBottom: 8 }}>ХОТЕЛ</div>
        <House s={200} />
      </div>
    </FlyIn>
    <FlyIn from="bottom" at={14} x={1080} y={260} w={330} rot={3} z={8} sticker={false}>
      <div style={{ padding: 24, background: colors.paper, boxShadow: colors.paperShadow, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, color: colors.bad, marginBottom: 8 }}>ПОНЯЛ</div>
        <Tower s={200} />
      </div>
    </FlyIn>
    <div style={{ position: "absolute", left: 870, top: 330, zIndex: 9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 150, color: colors.bad }}>≠</div>
  </Old>
);

export const P3EstimateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const marks = [4, 18, 32];
  const words = ["2 НЕДЕЛИ", "1 МЕСЯЦ", "3 МЕСЯЦА"];
  const last = usePunch(marks[2], 16);
  return (
    <Old step={4} shake={last.shake}>
      <DevFig at={-20} x={1340} y={300} w={380} />
      <div style={{ position: "absolute", left: 120, top: 260, width: 1050, height: 560, zIndex: 7, background: colors.paper, boxShadow: colors.paperShadow, padding: "36px 48px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 24, color: colors.inkFaded, letterSpacing: "0.12em" }}>ОЦЕНКА СРОКОВ</div>
        {words.map((w, i) =>
          frame >= marks[i] ? (
            <div key={w} style={{ position: "relative", alignSelf: "flex-start" }}>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 92, color: i === 2 ? colors.bad : colors.ink }}>{w}</div>
              {i < 2 && frame >= marks[i + 1] - 4 && <Strike at={marks[i + 1] - 4} width={i === 0 ? 640 : 560} thick={14} style={{ left: -10, top: 52, transform: "rotate(-4deg)" }} />}
            </div>
          ) : null,
        )}
      </div>
      <Flash amount={last.energy} color={colors.bad} />
    </Old>
  );
};

export const P3CodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const red = Math.floor(frame / 12) % 2 === 0;
  return (
    <Old step={5}>
      <div style={{ position: "absolute", left: 110, top: 260, width: 900, zIndex: 7, padding: 26, background: colors.surfaceStrong, border: `2px solid ${red ? colors.bad : palette.primary}`, boxShadow: colors.shadow }}>
        <CodeBlock at={2} width={840} size={26} speed={2.4} lines={["function checkout(cart) {", "  const total = sum(cart);", "  return pay(total);", "}"]} />
        <div style={{ marginTop: 18, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: red ? colors.bad : palette.primary }}>{richText(red ? "✗ тест упал · исправляю" : "✓ тест прошёл")}</div>
      </div>
      <FlyIn from="right" at={6} x={1200} y={300} w={330} rot={3} z={8} sticker={false}>
        <Calendar day={interpolate(frame, [6, 90], [0, 30], cl)} title="МЕСЯЦ РАБОТЫ" width={330} />
      </FlyIn>
    </Old>
  );
};

export const P3MonthsScene: React.FC<{ salary: number }> = ({ salary }) => {
  const frame = useCurrentFrame();
  const hit = usePunch(S(T(2.2), 30), 16);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <Old step={6} shake={hit.shake}>
      <div style={{ position: "absolute", left: 120, top: 250, zIndex: 7 }}>
        <Receipt width={700} printFrom={2} printFrames={22} title="ИТОГ · РАНЬШЕ" number="№ 2026-03" tilt={-2}>
          <ReceiptLine label="РАЗРАБОТЧИК × 3 МЕСЯЦА" value={`${fmt(salary * 3)} ₽`} strong size={28} delay={8} />
          <ReceiptLine label="ПОИСК ЧЕЛОВЕКА" value="2–4 НЕДЕЛИ" size={24} delay={12} />
          <ReceiptRule strong />
          <ReceiptLine label="СРОК ДО РЕЗУЛЬТАТА" value="МЕСЯЦЫ" strong size={28} delay={16} />
        </Receipt>
      </div>
      {frame >= S(T(2.2), 30) && <div style={{ position: "absolute", left: 980, top: 420, zIndex: 9 }}><Stamp tone="bad" size={110} rotate={-5} delay={S(T(2.2), 30)} style={{ fontFamily: WIDE }}>{`${fmt(salary * 3)} ₽`}</Stamp></div>}
      <Flash amount={hit.energy} color={colors.bad} />
    </Old>
  );
};

/* --------------------------------------------------------------- the new way */

export const P3NowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = usePunch(S(T(1.3), 30), 18);
  const rew = interpolate(frame, [0, 20], [1, 0], { easing: theme.ease.out, ...cl });
  return (
    <SceneShell shake={hit.shake}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · ТЕПЕРЬ`} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, zIndex: 9, display: "flex", justifyContent: "center", opacity: 1 - rew * 0.5 }}>
        <Stamp tone="hero" size={180} rotate={-3} delay={S(T(1.3), 30)}>ТЕПЕРЬ</Stamp>
      </div>
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/** A laptop drawn in CSS, its screen hosting whatever is passed. */
const Laptop: React.FC<{ w: number; children: React.ReactNode }> = ({ w, children }) => (
  <div style={{ width: w }}>
    <div style={{ padding: 16, background: colors.surfaceLift, borderRadius: "18px 18px 0 0", border: `2px solid ${colors.lineStrong}` }}>
      <div style={{ height: w * 0.56, background: palette.bg, overflow: "hidden" }}>{children}</div>
    </div>
    <div style={{ height: 26, margin: "0 -40px", background: colors.lineStrong, borderRadius: "0 0 22px 22px" }} />
  </div>
);

export const P3OpenScene: React.FC = () => (
  <SceneShell>
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · ТЕПЕРЬ`} />
    <FlyIn from="bottom" at={0} x={560} y={200} w={800} rot={0} z={6} sticker={false}>
      <Laptop w={800}>
        <div style={{ padding: 30 }}>
          <Terminal at={6} width={700} lines={[{ text: "$ claude", dim: true }, { text: "Claude Code · готов к работе", instant: true }]} />
        </div>
      </Laptop>
    </FlyIn>
    <div style={{ position: "absolute", left: 110, top: 300, zIndex: 8 }}><LogoCard at={S(T(0.9), 30)} src={L + "claude.svg"} name="CLAUDE CODE" size={110} w={240} hero /></div>
    <div style={{ position: "absolute", left: 1570, top: 300, zIndex: 8 }}><LogoCard at={S(T(1.4), 30)} src={L + "openai.svg"} name="CODEX" size={110} w={240} /></div>
  </SceneShell>
);

export const P3PromptScene: React.FC = () => (
  <SceneShell>
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · ТЕПЕРЬ`} />
    <FlyIn from="bottom" at={0} x={210} y={170} w={1500} rot={0} z={8} sticker={false}>
      <Terminal at={S(T(0.7), 30)} width={1500} speed={1.9} lines={[{ text: "$ claude", dim: true, instant: true }, { text: "> Создай мне веб-приложение. Добавь регистрацию, базу данных, личный кабинет и оплату подписки. Напиши тесты." }]} />
    </FlyIn>
    <BgVideo src="media/dev-myth/v-creator.mp4" dim={0.8} tint={0.3} />
    {/* note 66: the parts of the app float in as they are named */}
    <GlassChip at={S(T(2.5), 30)} x={160} y={520} text="РЕГИСТРАЦИЯ" icon={L + "si-google.svg"} />
    <GlassChip at={S(T(3.6), 30)} x={560} y={600} text="БАЗА ДАННЫХ" icon={L + "si-postgresql.svg"} />
    <GlassChip at={S(T(4.7), 30)} x={980} y={530} text="ЛИЧНЫЙ КАБИНЕТ" glyph="◉" />
    <GlassChip at={S(T(5.8), 30)} x={1380} y={610} text="ОПЛАТА" icon={L + "si-stripe.svg"} />
    <GlassChip at={S(T(7.0), 30)} x={760} y={720} text="ТЕСТЫ · 38 ✓" hero />
    <GlassChip at={S(T(7.4), 30)} x={1240} y={760} text="API" icon={L + "si-postman.svg"} />
    <GlassChip at={S(T(7.8), 30)} x={250} y={760} text="ЛОГИН · JWT" glyph="⚿" />
  </SceneShell>
);

const FILES = ["src/", " auth/register.ts", " db/schema.sql", " account/page.tsx", " billing/subscribe.ts", "tests/", " auth.test.ts", " billing.test.ts"];
export const P3WorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const verbs: [string, number][] = [["СОЗДАЁТ ФАЙЛЫ", 2.6], ["ПИШЕТ ФУНКЦИИ", 4.2], ["СТАВИТ ЗАВИСИМОСТИ", 5.4], ["ЗАПУСКАЕТ ПРОВЕРКИ", 8.2], ["ИСПРАВЛЯЕТ ОШИБКИ", 9.1]];
  return (
    <SceneShell>
      <BgVideo src="media/dev-myth/v-hacker.mp4" dim={0.8} tint={0.3} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={`${BAR3} · ТЕПЕРЬ`} />
      <div style={{ position: "absolute", left: 110, top: 150, zIndex: 8, width: 480, padding: 22, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.12em", color: palette.textDim, marginBottom: 12 }}>ФАЙЛЫ</div>
        <FileTree at={S(T(2.6), 30)} every={6} files={FILES} width={430} />
      </div>
      <FlyIn from="bottom" at={4} x={660} y={150} w={1150} rot={0} z={7} sticker={false}>
        <div style={{ position: "relative" }}>
          <Terminal at={10} width={1150} speed={2.6} lines={[
            { text: "$ claude", dim: true, instant: true },
            { text: "✓ npm install · 42 пакета", instant: true },
            { text: "✓ 8 файлов создано", instant: true },
            { text: "✗ billing.test.ts: 1 ошибка → исправляю…", instant: true },
            { text: "✓ 38 тестов прошли", instant: true },
          ]} />
          <div style={{ position: "absolute", right: 22, top: 8 }}><Stopwatch at={10} rate={36} size={40} /></div>
        </div>
      </FlyIn>
      <div style={{ position: "absolute", left: 660, top: 560, zIndex: 9, display: "flex", flexWrap: "wrap", gap: 12, width: 1150 }}>
        {verbs.map(([v, t]) => frame >= S(T(t), 30) ? <Label key={v} at={S(T(t), 30)} size={26} tone="lime" rotate={-1}>{richText("✓ " + v)}</Label> : null)}
      </div>
    </SceneShell>
  );
};

export const P3AutoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const at2 = S(T(2.2), 30);
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <div style={{ position: "absolute", left: 110, top: 220, width: 780, zIndex: 7, padding: 30, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, opacity: frame >= at2 ? 0.45 : 1 }}>
        <Label at={4} size={22}>РАНЬШЕ · ПОДСКАЗКА В РЕДАКТОРЕ</Label>
        <div style={{ marginTop: 26, fontFamily: theme.fonts.mono, fontSize: 34, color: palette.text }}>const total = <span style={{ color: palette.textDim }}>sum(cart)</span><span style={{ display: "inline-block", width: 16, height: 36, background: palette.text, verticalAlign: "-6px" }} /></div>
        <div style={{ marginTop: 14, fontFamily: theme.fonts.mono, fontSize: 22, color: palette.textDim }}>одно слово · Tab, чтобы принять</div>
      </div>
      {frame >= at2 && (
        <FlyIn from="right" at={at2} x={1010} y={220} w={800} rot={1.5} z={8} sticker={false}>
          <div style={{ padding: 30, background: colors.surfaceStrong, border: `2px solid ${palette.primary}`, boxShadow: `0 0 40px ${palette.glow}` }}>
            <Label at={at2 + 2} size={22} tone="lime">ТЕПЕРЬ · ВСЯ РАЗРАБОТКА</Label>
            <div style={{ marginTop: 22 }}><FileTree at={at2 + 6} every={3} files={FILES} width={700} /></div>
          </div>
        </FlyIn>
      )}
    </SceneShell>
  );
};

/* ------------------------------------------------------------------ numbers */

/** People as dots in a row: `n` of them, the first `lit` in lime. */
const People: React.FC<{ n: number; lit: number; at: number; size?: number }> = ({ n, lit, at, size = 120 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: size * 0.25 }}>
      {Array.from({ length: n }, (_, i) => {
        const on = i < lit && frame >= at + i * 3;
        return (
          <svg key={i} width={size * 0.6} height={size} viewBox="0 0 60 100">
            <circle cx={30} cy={20} r={16} fill={on ? palette.primary : colors.lineStrong} />
            <rect x={10} y={42} width={40} height={54} rx={14} fill={on ? palette.primary : colors.lineStrong} style={{ filter: on ? `drop-shadow(0 0 10px ${palette.glow})` : undefined }} />
          </svg>
        );
      })}
    </div>
  );
};

export const P3StatsScene: React.FC = () => (
  <SceneShell>
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <Kinetic text="САМОЕ ИНТЕРЕСНОЕ" size={90} delay={4} per={3} mode="snap" lineHeight={1} />
      {useCurrentFrame() >= S(T(2.6), 30) && <Stamp tone="hero" size={130} rotate={-3} delay={S(T(2.6), 30)}>СТАТИСТИКА</Stamp>}
    </div>
  </SceneShell>
);

export const P3SurveyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const n = S(T(2.4), 30);
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <LogoPlate at={2} src={L + "jetbrains.png"} x={110} y={170} w={520} caption="ОПРОС РАЗРАБОТЧИКОВ · 2026" />
      {frame >= n && (
        <div style={{ position: "absolute", left: 110, top: 400, zIndex: 9, display: "flex", flexDirection: "column", gap: 16 }}>
          <Slam text="15 000+" at={n} size={150} roll={{ from: 0, to: 15000, suffix: "+" }} />
          <Label at={n + 6} size={26}>ПРОФЕССИОНАЛЬНЫХ РАЗРАБОТЧИКОВ · ОПРОС МАЙ–ИЮЛЬ 2026</Label>
        </div>
      )}
      <MediaCard src="media/dev-myth/v-survey.mp4" at={6} x={1430} y={150} w={380} h={460} tilt={-8} label="РАЗРАБОТЧИК" meta="2026" />
      <div style={{ position: "absolute", left: 110, top: 640, right: 110, zIndex: 6, display: "grid", gridTemplateColumns: "repeat(60, 1fr)", gap: 6, opacity: 0.8 }}>
        {Array.from({ length: 300 }, (_, i) => <div key={i} style={{ height: 14, borderRadius: 7, background: frame >= n + (i % 60) / 3 ? palette.primary : colors.line }} />)}
      </div>
    </SceneShell>
  );
};

export const P3NinetyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t2 = S(T(3.8), 30);
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <div style={{ position: "absolute", left: 110, top: 200, zIndex: 9 }}><Slam text="90%" at={4} size={200} /></div>
      <div style={{ position: "absolute", left: 120, top: 420, zIndex: 9 }}><Label at={8} size={28}>ПОЛЬЗУЮТСЯ ИИ-АГЕНТАМИ КАЖДУЮ НЕДЕЛЮ</Label></div>
      <div style={{ position: "absolute", left: 820, top: 200, zIndex: 8 }}><People n={10} lit={9} at={10} size={130} /></div>
      {frame >= t2 && (
        <>
          <div style={{ position: "absolute", left: 110, top: 540, zIndex: 9 }}><Slam text="68%" at={t2} size={150} color={palette.text} /></div>
          <div style={{ position: "absolute", left: 120, top: 720, zIndex: 9 }}><Label at={t2 + 4} size={28} tone="lime">КАЖДЫЙ ДЕНЬ · ПОЧТИ ДВЕ ТРЕТИ</Label></div>
          <MediaCard src="media/dev-myth/v-team.mp4" at={t2 + 2} x={820} y={470} w={960} h={340} tilt={4} label="КАЖДЫЙ ДЕНЬ" meta="JETBRAINS 2026" />
        </>
      )}
    </SceneShell>
  );
};

export const P3FifthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 40], [0, 0.8], { easing: theme.ease.out, ...cl });
  const r = 150;
  const C = 2 * Math.PI * r;
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <div style={{ position: "absolute", left: 110, top: 200, zIndex: 9 }}><Slam text="22%" at={4} size={200} /></div>
      <div style={{ position: "absolute", left: 110, top: 440, zIndex: 9 }}><Label at={8} size={28}>КАЖДЫЙ ПЯТЫЙ РАЗРАБОТЧИК</Label></div>
      <div style={{ position: "absolute", left: 110, top: 520, zIndex: 8 }}><People n={5} lit={1} at={10} size={120} /></div>
      <div style={{ position: "absolute", left: 1150, top: 200, zIndex: 8, width: 360, height: 360 }}>
        <svg width={360} height={360}>
          <circle cx={180} cy={180} r={r} fill="none" stroke={colors.line} strokeWidth={34} />
          <circle cx={180} cy={180} r={r} fill="none" stroke={palette.primary} strokeWidth={34} strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 180 180)" style={{ filter: `drop-shadow(0 0 14px ${palette.glow})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 900, fontSize: 70, color: palette.text }}>
          {Math.round(p * 100)}%
          <span style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: palette.textDim, marginTop: 6 }}>КОДА ПИШУТ АГЕНТЫ</span>
        </div>
      </div>
      <LogoPlate at={30} src={L + "jetbrains.png"} x={1150} y={600} w={360} caption="RESEARCH · АВГУСТ 2026" />
    </SceneShell>
  );
};

export const P3ThinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const at = S(T(0.9), 30);
  const dim = interpolate(frame, [at, at + 20], [1, 0.35], cl);
  return (
    <SceneShell>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <div style={{ position: "absolute", left: 1120, top: 180, zIndex: 6, padding: 8, background: colors.white, boxShadow: colors.shadow, opacity: dim, filter: `grayscale(${1 - dim})` }}>
        <div style={{ width: 680, height: 500, overflow: "hidden" }}>
          <OffthreadVideo src={media("footage/dev-myth/typing.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 240, width: 800, zIndex: 9 }}>
        <Kinetic text="ВДУМАЙТЕСЬ" size={100} delay={2} per={3} mode="snap" lineHeight={1} />
      </div>
      {frame >= at && <div style={{ position: "absolute", left: 110, top: 420, zIndex: 10, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}><Stamp tone="bad" size={74} rotate={-4} delay={at}>РАЗРАБОТЧИКИ</Stamp><Stamp tone="bad" size={74} rotate={-2} delay={at + 5}>НЕ ПИШУТ КОД</Stamp></div>}
    </SceneShell>
  );
};

export const P3PayWhatScene: React.FC<{ salary: number }> = ({ salary }) => {
  const frame = useCurrentFrame();
  const at = S(T(3.0), 30);
  const hit = usePunch(at, 18);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <SceneShell shake={hit.shake}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right={BAR3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Slam text={`${fmt(salary)} ₽`} at={4} size={190} />
        {frame >= at && <Stamp tone="bad" size={130} rotate={-4} delay={at}>ЗА ЧТО?</Stamp>}
      </div>
      <Burst at={at} x={960} y={600} color={colors.bad} />
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};

export { Cross, Sequence };
