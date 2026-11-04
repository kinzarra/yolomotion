// Parts 4 «А как же творчество» and 5 «Программисты исчезнут?», the ending.
// v2 (author 2026-11-01, notes 44–81): every beat stands on a duotone video,
// the evidence sits in HUD media cards, icons drift in glass chips; no text on
// the author's face; the ending asks to subscribe in words and with a plaque.
import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, Flash, Kinetic, Label, S, SceneShell, Slam, Stamp, Strike, TopBar, WIDE, cl, media } from "../ui";
import { FaceShot, LogoCard, Outlined, Tower } from "../fx";
import { BgVideo, FaceCircle, GlassChip, MediaCard, NodeNet, StatPlate } from "../fx2";
import { PRESENTER as END } from "../presenter-end";
import { PRESENTER as CIRCLE } from "../presenter-circle";
import { LEAD, T, VO_RATE } from "../timeline";
import { Sym, richText } from "../sym";

const I = "images/dev-myth/";
const L = "images/dev-myth/logos/";
const V = "media/dev-myth/";
export const BAR4 = "ЧАСТЬ 4 · А КАК ЖЕ ТВОРЧЕСТВО?";
export const BAR5 = "ЧАСТЬ 5 · ПРОГРАММИСТЫ ИСЧЕЗНУТ?";
const at = (clip: number) => S(T(clip), 30);

const Shell: React.FC<{ bar: string; bg?: string; dim?: number; shake?: number; children: React.ReactNode; exit?: boolean }> = ({ bar, bg, dim = 0.72, shake = 0, children, exit }) => (
  <SceneShell shake={shake} exit={exit}>
    {bg && <BgVideo src={bg} dim={dim} tint={0.3} />}
    <TopBar left="ДЕНЬГИ · ПРОСТО" right={bar} />
    {children}
  </SceneShell>
);
const Arrow: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 9, fontFamily: WIDE, fontWeight: 900, fontSize: 90, color: palette.primary, textShadow: `0 0 30px ${palette.glow}` }}>→</div>
);

/* ------------------------------------------------------------------- part 4 */

export const ObjectionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const quotes: [string, number][] = [["«ИИ никогда не заменит настоящего разработчика!»", 1.6], ["«А как же архитектура?»", 6.1], ["«А креативность?»", 7.5], ["«А нестандартные решения?»", 8.7]];
  return (
    <Shell bar={BAR4} bg={V + "v-people.mp4"}>
      <div style={{ position: "absolute", left: 96, top: 170, zIndex: 9 }}><Kinetic text="Я УЖЕ СЛЫШУ ВОЗРАЖЕНИЯ" size={78} delay={2} per={3} mode="snap" lineHeight={1} /></div>
      {quotes.map(([q, t], i) => frame >= at(t) ? <GlassChip key={q} at={at(t)} x={i % 2 ? 520 : 140} y={330 + i * 130} text={q} glyph="❝" size={30} /> : null)}
    </Shell>
  );
};

export const SortScene: React.FC = () => (
  <Shell bar={BAR4} bg={V + "v-question.mp4"} dim={0.55}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, zIndex: 9, display: "flex", justifyContent: "center" }}>
      <Stamp tone="hero" size={140} rotate={-3} delay={3}>РАЗБЕРЁМСЯ</Stamp>
    </div>
  </Shell>
);

/** Notes 69, 70: both people as a framed collage from the first frame. */
export const TwoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = at(1.6);
  const b = at(4.0);
  return (
    <Shell bar={BAR4} bg={V + "v-crowd.mp4"} dim={0.8}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, zIndex: 9, display: "flex", justifyContent: "center" }}><Kinetic text="ДВА ЧЕЛОВЕКА" size={84} delay={2} per={3} mode="snap" lineHeight={1} /></div>
      <MediaCard src={I + "luthier.png"} at={4} x={150} y={300} w={700} h={520} tilt={-6} label="ИЗОБРЁЛ ИНСТРУМЕНТ" meta="МАСТЕРСКАЯ" fit="contain" />
      <MediaCard src={I + "guitarist.jpg"} at={10} x={1070} y={300} w={700} h={520} tilt={6} label="ИГРАЕТ НА НЁМ" meta="СЦЕНА" />
      {frame >= a && <GlassChip at={a} x={210} y={250} text="ИЗОБРЁЛ" hero size={30} />}
      {frame >= b && <GlassChip at={b} x={1130} y={250} text="ИГРАЕТ" hero size={30} />}
    </Shell>
  );
};

export const BothScene: React.FC = () => (
  <Shell bar={BAR4} bg={V + "v-crowd.mp4"} dim={0.82}>
    <MediaCard src={I + "luthier.png"} at={0} x={150} y={240} w={620} h={480} tilt={-8} label="ИЗОБРЁЛ" fit="contain" />
    <MediaCard src={I + "guitarist.jpg"} at={0} x={1150} y={240} w={620} h={480} tilt={8} label="ИГРАЕТ" />
    <div style={{ position: "absolute", left: 860, top: 300, zIndex: 9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 260, color: palette.primary, textShadow: `0 0 50px ${palette.glow}` }}>≠</div>
    <GlassChip at={at(0.9)} x={560} y={820} text="ОБА ЦЕННЫ · НО ЭТО РАЗНЫЕ ЗАНЯТИЯ" size={30} />
  </Shell>
);

/** A weighted graph whose shortest path lights up: the invented algorithm (note 71). */
const Graph: React.FC<{ at: number; w: number }> = ({ at: a, w }) => {
  const frame = useCurrentFrame();
  const n: [number, number][] = [[0.08, 0.5], [0.28, 0.15], [0.3, 0.82], [0.52, 0.48], [0.72, 0.14], [0.76, 0.84], [0.93, 0.5], [0.5, 0.05], [0.52, 0.95]];
  const e: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [3, 4], [3, 5], [2, 5], [4, 6], [5, 6], [1, 7], [7, 4], [2, 8], [8, 5]];
  const path = [[0, 1], [1, 3], [3, 4], [4, 6]];
  const h = w * 0.6;
  const idx = (x: [number, number]) => path.findIndex((p) => p[0] === x[0] && p[1] === x[1]);
  return (
    <svg width={w} height={h}>
      {e.map((x, i) => {
        const k = idx(x);
        const on = k >= 0 && frame >= a + k * 8;
        const x1 = n[x[0]][0] * w, y1 = n[x[0]][1] * h, x2 = n[x[1]][0] * w, y2 = n[x[1]][1] * h;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? palette.primary : colors.lineStrong} strokeWidth={on ? 7 : 2.5} style={{ filter: on ? `drop-shadow(0 0 10px ${palette.glow})` : undefined }} />
            <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} fill={on ? palette.primary : palette.textDim} fontFamily={theme.fonts.mono} fontSize={18} fontWeight={700} textAnchor="middle">{2 + ((i * 7) % 9)}</text>
          </g>
        );
      })}
      {n.map(([x, y], i) => <circle key={i} cx={x * w} cy={y * h} r={18} fill={colors.surfaceLift} stroke={i === 0 || i === 6 ? palette.primary : palette.text} strokeWidth={4} />)}
    </svg>
  );
};

/** Notes 71, 72: the algorithm on glass, then distributed computing as a living net over a data centre. */
export const AlgoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a1 = at(2.3);
  const a2 = at(5.9);
  return (
    <Shell bar={BAR4} bg={frame >= a2 ? V + "v-network.mp4" : V + "v-hacker.mp4"} dim={0.7}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}><Kinetic text="ТВОРЧЕСТВО В КОДЕ" size={74} delay={2} per={3} mode="snap" hero={[0]} lineHeight={1} /></div>
      <div style={{ position: "absolute", left: 110, top: 280, zIndex: 8, padding: 26, borderRadius: 22, background: "rgba(16,20,24,0.6)", backdropFilter: "blur(14px)", border: `1.5px solid ${palette.primary}55`, opacity: frame >= a2 ? 0.55 : 1 }}>
        <Graph at={a1} w={720} />
      </div>
      {frame >= a1 && <GlassChip at={a1} x={140} y={760} text="АЛГОРИТМ ДЕЙКСТРЫ · 1959" hero size={24} />}
      {frame >= a2 && (
        <>
          <MediaCard src={V + "v-datacenter.mp4"} at={a2} x={1000} y={150} w={820} h={360} tilt={6} label="ДАТА-ЦЕНТР" meta="РАСПРЕДЕЛЁННЫЕ ВЫЧИСЛЕНИЯ" />
          <div style={{ position: "absolute", left: 1000, top: 540, zIndex: 8 }}><NodeNet at={a2 + 4} w={820} h={320} /></div>
          <GlassChip at={a2 + 10} x={1040} y={880} text="MAPREDUCE · GOOGLE, 2004" hero size={24} />
          <GlassChip at={a2 + 16} x={1480} y={880} text="ТЫСЯЧИ СЕРВЕРОВ · ОДНА ЗАДАЧА" size={20} />
        </>
      )}
    </Shell>
  );
};

/** Note 45: the typical tasks in front of a real shop and a real belt. */
export const TypicalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number, string][] = [["ИНТЕРНЕТ-МАГАЗИН", 0.2, L + "si-stripe.svg"], ["ФОРМА ВХОДА", 2.4, L + "si-google.svg"], ["СТАНДАРТНЫЙ API", 3.8, L + "si-postman.svg"]];
  return (
    <Shell bar={BAR4} bg={V + "v-conveyor.mp4"} dim={0.7}>
      <div style={{ position: "absolute", left: 96, top: 170, zIndex: 9 }}><Kinetic text="ТИПОВЫЕ ЗАДАЧИ" size={80} delay={2} per={3} mode="snap" bad={[0]} lineHeight={1} /></div>
      <div style={{ position: "absolute", left: 110, top: 300, zIndex: 9 }}><Label at={8} size={24}>ТЫСЯЧИ ОДИНАКОВЫХ САЙТОВ В ГОД</Label></div>
      <MediaCard src={V + "v-shop.mp4"} at={2} x={1180} y={150} w={640} h={380} tilt={6} label="ОЧЕРЕДНОЙ МАГАЗИН" meta="ШАБЛОН" />
      {items.map(([t, s, icon], i) => frame >= at(s) ? (
        <React.Fragment key={t}>
          <GlassChip at={at(s)} x={110 + i * 560} y={600} text={t} icon={icon} size={28} />
          <div style={{ position: "absolute", left: 130 + i * 560, top: 700, zIndex: 10 }}><Stamp tone="bad" size={30} rotate={-4} delay={at(s) + 8}>ТИПОВАЯ ЗАДАЧА</Stamp></div>
        </React.Fragment>
      ) : null)}
    </Shell>
  );
};

/** Note 46: creativity framed on the left; the typical tasks are pulled into the AI over a robot line. */
export const DontMixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const suck = at(4.0);
  const p = interpolate(frame, [suck, suck + 30], [0, 1], { easing: theme.ease.in, ...cl });
  const tasks = ["ВХОД", "КОРЗИНА", "ОПЛАТА", "ПОЧТА", "АДМИНКА", "ФОРМА", "ПОИСК", "API"];
  return (
    <Shell bar={BAR4} bg={V + "v-robot.mp4"} dim={0.65}>
      <MediaCard src={I + "luthier.png"} at={0} x={120} y={170} w={460} h={380} tilt={-6} label="ТВОРЧЕСТВО" meta="ЧЕЛОВЕК" fit="contain" />
      <div style={{ position: "absolute", left: 120, top: 610, zIndex: 9, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Label at={6} size={26} tone="lime">НОВЫЕ АЛГОРИТМЫ · НОВАЯ АРХИТЕКТУРА</Label>
        <Label at={10} size={22}>МАЛО · ДОРОГО · ДЕЛАЕТ ЧЕЛОВЕК</Label>
      </div>
      {tasks.map((t, i) => {
        const x0 = 720 + (i % 4) * 270, y0 = 190 + Math.floor(i / 4) * 120;
        return (
          <div key={t} style={{ position: "absolute", left: x0 + (1560 - x0) * p, top: y0 + (690 - y0) * p, zIndex: 8, transform: `scale(${1 - p * 0.8})`, opacity: 1 - p * 0.8 }}>
            <GlassChip at={4 + i * 3} x={0} y={0} text={`ТИПОВАЯ · ${t}`} size={22} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1460, top: 620, zIndex: 9 }}><LogoCard at={suck - 6} src={L + "claude.svg"} name="ИИ ДЕЛАЕТ" size={110} w={260} hero /></div>
      <Burst at={suck + 20} x={1590} y={720} />
    </Shell>
  );
};

/** Note 49: the AI's failures with evidence: a hacker screen, a broken build, stamps, chips. */
export const ErrorsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s: [string, number][] = [["ОШИБАЕТСЯ", 0.3], ["ДЫРЫ В БЕЗОПАСНОСТИ", 1.9], ["НЕ ПОНИМАЕТ КОНТЕКСТ", 4.8]];
  return (
    <Shell bar={BAR4} bg={V + "v-hacker.mp4"} dim={0.7}>
      <div style={{ position: "absolute", left: 96, top: 160, zIndex: 9 }}><Kinetic text="ДА, ИИ" size={90} delay={2} per={3} mode="snap" lineHeight={1} /></div>
      <MediaCard src={V + "v-bug.mp4"} at={4} x={1180} y={160} w={640} h={380} tilt={6} label="СБОРКА УПАЛА" meta="ERROR" />
      {s.map(([t, x], i) => frame >= at(x) ? <div key={t} style={{ position: "absolute", left: 110 + i * 30, top: 320 + i * 140, zIndex: 9 }}><Stamp tone="bad" size={52} rotate={(i - 1) * 2} delay={at(x)}>{t}</Stamp></div> : null)}
      {frame >= at(1.9) && <GlassChip at={at(1.9) + 6} x={1200} y={630} text="SQL-ИНЪЕКЦИЯ" glyph="⚠" size={24} />}
      {frame >= at(1.9) && <GlassChip at={at(1.9) + 12} x={1300} y={720} text="УТЕЧКА ПАРОЛЕЙ" glyph="⚿" size={24} />}
      {frame >= at(4.8) && <GlassChip at={at(4.8) + 4} x={1200} y={810} text="«СДЕЛАЙ КАК В ПРОШЛЫЙ РАЗ» ?" size={22} />}
    </Shell>
  );
};

/** A Windows-style crash screen, drawn: the CrowdStrike morning of 19.07.2024. */
export const PeopleScene: React.FC = () => (
  <Shell bar={BAR4} bg={V + "v-datacenter.mp4"} dim={0.75}>
    <div style={{ position: "absolute", left: 110, top: 170, width: 900, height: 560, zIndex: 7, background: "#0A5AB8", padding: 60, color: colors.white, fontFamily: theme.fonts.body, boxShadow: colors.shadow, borderRadius: 14 }}>
      <div style={{ fontSize: 160, lineHeight: 1 }}>:(</div>
      <div style={{ fontSize: 34, marginTop: 30, maxWidth: 700 }}>Your device ran into a problem and needs to restart.</div>
      <div style={{ fontSize: 22, marginTop: 30, opacity: 0.8 }}>Stop code: PAGE FAULT IN NONPAGED AREA · csagent.sys</div>
    </div>
    <div style={{ position: "absolute", left: 1080, top: 200, zIndex: 9, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
      <Stamp tone="bad" size={90} rotate={-4} delay={4}>ЛЮДИ ТОЖЕ</Stamp>
      <Label at={12} size={26}>CROWDSTRIKE · 19.07.2024</Label>
      <Label at={16} size={26}>8,5 МЛН КОМПЬЮТЕРОВ УПАЛИ</Label>
      <Label at={20} size={22}>ОДНО ОБНОВЛЕНИЕ, НАПИСАННОЕ ЛЮДЬМИ</Label>
    </div>
  </Shell>
);

/** Notes 50, 75: cheaper and faster, as glass plates over a time-lapse and a cash counter. */
export const Q4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = at(3.0);
  const b = at(5.0);
  return (
    <Shell bar={BAR4} bg={V + "v-speed.mp4"} dim={0.6}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}><Kinetic text="ДЕШЕВЛЕ И БЫСТРЕЕ" size={80} delay={a} per={3} mode="snap" hero={[0, 2]} lineHeight={1} /></div>
      <MediaCard src={V + "v-money.mp4"} at={4} x={1300} y={160} w={520} h={320} tilt={6} label="ДЕНЬГИ" meta="РАНЬШЕ" />
      {frame >= a && (
        <>
          <StatPlate at={a} x={110} y={300} value="762 000 ₽" caption="РАНЬШЕ · ЗА ПРИЛОЖЕНИЕ" bad w={560} />
          <Arrow x={700} y={360} />
          <StatPlate at={a + 10} x={820} y={300} value="100 $" caption="ТЕПЕРЬ · ПОДПИСКА В МЕСЯЦ" w={380} />
        </>
      )}
      {frame >= b && (
        <>
          <StatPlate at={b} x={110} y={580} value="3 МЕС" caption="РАНЬШЕ · ДО РЕЗУЛЬТАТА" bad w={560} />
          <Arrow x={700} y={640} />
          <StatPlate at={b + 10} x={820} y={580} value="1 ДЕНЬ" caption="ТЕПЕРЬ · ПЕРВАЯ ВЕРСИЯ" w={380} />
        </>
      )}
    </Shell>
  );
};

/** Notes 73, 48: the author in a circle for two seconds; the strike runs through the plate itself. */
export const ModelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crack = at(2.9);
  return (
    <Shell bar={BAR4} bg={V + "v-robot.mp4"} dim={0.72}>
      <div style={{ position: "absolute", left: 110, top: 220, zIndex: 8 }}><LogoCard at={2} src={L + "claude.svg"} name="ИИ ДЕЛАЕТ" size={110} w={260} hero /></div>
      <Arrow x={420} y={280} />
      <MediaCard src={V + "v-people.mp4"} at={8} x={560} y={200} w={600} h={340} tilt={4} label="ЧЕЛОВЕК ПРОВЕРЯЕТ" meta="РЕВЬЮ" />
      <div style={{ position: "absolute", left: 110, top: 660, zIndex: 9 }}>
        <div style={{ position: "relative", display: "inline-block", padding: "18px 30px", background: colors.paper, color: colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 48, opacity: frame >= crack ? 0.8 : 1 }}>
          СТАРАЯ ЭКОНОМИКА РАЗРАБОТКИ
          {frame >= crack && <Strike at={crack} width={1000} thick={16} style={{ left: 16, top: 42, transform: "rotate(-1deg)" }} />}
        </div>
      </div>
      <FaceCircle file={CIRCLE.circle.file} duration={CIRCLE.circle.duration} rate={VO_RATE} from={S(LEAD, fps)} x={1460} y={170} d={340} />
    </Shell>
  );
};

/* ------------------------------------------------------------------- part 5 */

/** Note 74. */
export const UnpleasantScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = at(1.9);
  return (
    <Shell bar={BAR5} bg={V + "v-question.mp4"} dim={0.5}>
      <div style={{ position: "absolute", left: 96, top: 200, zIndex: 9, display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start" }}>
        <Kinetic text="САМЫЙ НЕПРИЯТНЫЙ ВОПРОС" size={72} delay={2} per={3} mode="snap" lineHeight={1} style={{ maxWidth: 1000 }} />
        {frame >= a && <Stamp tone="bad" size={130} rotate={-3} delay={a}>ЗАМЕНИТЬ?</Stamp>}
      </div>
      <MediaCard src={V + "v-office.mp4"} at={a + 4} x={1260} y={520} w={560} h={330} tilt={6} label="ОФИС" meta="2026" />
    </Shell>
  );
};

/** Note 76: the author's clip as the spec being handed over. */
export const SpecScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = at(4.4);
  return (
    <Shell bar={BAR5} bg={V + "v-creator.mp4"} dim={0.78}>
      <MediaCard src={V + "v-spec.mp4"} at={0} x={110} y={170} w={760} h={430} tilt={-5} label="ТЕХЗАДАНИЕ" meta="ПОДРОБНОЕ" />
      <Arrow x={920} y={300} />
      <div style={{ position: "absolute", left: 1030, top: 230, zIndex: 8 }}><LogoCard at={10} src={L + "claude.svg"} name="ИИ" size={110} w={230} hero /></div>
      <Arrow x={1290} y={300} />
      <GlassChip at={20} x={1420} y={200} text="register.ts" glyph="✓" size={22} />
      <GlassChip at={24} x={1450} y={280} text="account.tsx" glyph="✓" size={22} />
      <GlassChip at={28} x={1420} y={360} text="billing.ts" glyph="✓" size={22} />
      <GlassChip at={32} x={1450} y={440} text="38 тестов" glyph="✓" hero size={22} />
      {frame >= a && <div style={{ position: "absolute", left: 600, top: 680, zIndex: 10 }}><Stamp tone="hero" size={100} rotate={-3} delay={a}>УЖЕ МОЖНО</Stamp></div>}
    </Shell>
  );
};

/** Notes 51, 77, 78: the author's clip, the three duties as glass chips with icons, a live net. */
export const ArchitectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chips: [string, number, string | undefined, string | undefined][] = [["ТРЕБОВАНИЯ", 1.6, undefined, "☰"], ["АРХИТЕКТУРА", 3.5, L + "si-postgresql.svg", undefined], ["БЕЗОПАСНОСТЬ", 6.6, undefined, "⚿"]];
  const no = at(9.6);
  return (
    <Shell bar={BAR5} bg={V + "v-network.mp4"} dim={0.75}>
      <MediaCard src={V + "v-architect.mp4"} at={0} x={1340} y={140} w={470} h={700} tilt={-6} label="АРХИТЕКТОР" meta="РЕШАЕТ, ЧТО СТРОИТЬ" />
      <div style={{ position: "absolute", left: 96, top: 170, zIndex: 9 }}><Kinetic text="КТО РЕШАЕТ, ЧТО СТРОИТЬ" size={70} delay={2} per={3} mode="snap" lineHeight={1.04} style={{ maxWidth: 1100 }} /></div>
      <div style={{ position: "absolute", left: 600, top: 330, zIndex: 6, opacity: 0.8 }}><NodeNet at={6} w={680} h={400} n={16} /></div>
      {chips.map(([c, t, icon, glyph], i) => frame >= at(t) ? <GlassChip key={c} at={at(t)} x={110 + i * 40} y={330 + i * 120} text={c} icon={icon} glyph={glyph} hero={i === 2} size={30} /> : null)}
      {frame >= no && <div style={{ position: "absolute", left: 110, top: 720, zIndex: 10 }}><Stamp tone="bad" size={86} rotate={-4} delay={no}>ПОКА НЕ ЗАМЕНИТЬ</Stamp></div>}
    </Shell>
  );
};

/** Note 79. */
export const MarketScene: React.FC = () => (
  <Shell bar={BAR5} bg={V + "v-office.mp4"} dim={0.7}>
    <div style={{ position: "absolute", left: 96, top: 170, zIndex: 9, display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start" }}>
      <Kinetic text="ЧТОБЫ ИЗМЕНИТЬ РЫНОК" size={74} delay={2} per={3} mode="snap" lineHeight={1} />
      <Stamp tone="hero" size={74} rotate={-3} delay={at(2.9)}>НЕ НУЖНО ЗАМЕНЯТЬ ВСЕХ</Stamp>
    </div>
    <MediaCard src={V + "v-interview.mp4"} at={8} x={1100} y={460} w={720} h={380} tilt={6} label="СОБЕСЕДОВАНИЕ" meta="ВАКАНСИЙ МЕНЬШЕ" />
    <StatPlate at={at(3.2)} x={110} y={540} value="−21%" caption="ВАКАНСИЙ В IT ЗА ГОД · SUPERJOB, 2026" bad w={700} />
  </Shell>
);

export const TenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const three = at(1.6);
  const seven = at(7.2);
  return (
    <Shell bar={BAR5} bg={V + "v-office.mp4"} dim={0.8}>
      <div style={{ position: "absolute", left: 96, top: 160, zIndex: 9, display: "flex", alignItems: "center", gap: 24 }}>
        <Slam text={frame >= three ? "10 → 3" : "10"} at={4} size={130} />
        <Label at={8} size={24}>ПРИМЕР</Label>
      </div>
      <div style={{ position: "absolute", left: 96, top: 380, right: 96, zIndex: 7, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 10 }, (_, i) => {
          const gone = i >= 3 && frame >= three + (i - 3) * 5;
          const g = gone ? interpolate(frame, [three + (i - 3) * 5, three + (i - 3) * 5 + 14], [0, 1], cl) : 0;
          return (
            <div key={i} style={{ width: 165, opacity: 1 - g * 0.85, transform: `translateY(${g * 80}px) scale(${1 - g * 0.2})`, filter: `grayscale(${g})` }}>
              <Outlined src={I + "fig-dev.png"} w={165} px={4} style={{ filter: "brightness(1.7) drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff)" }} />
            </div>
          );
        })}
      </div>
      {frame >= seven && <div style={{ position: "absolute", left: 900, top: 170, zIndex: 10 }}><Stamp tone="bad" size={96} rotate={-4} delay={seven}>−7 ЧЕЛОВЕК</Stamp></div>}
    </Shell>
  );
};

export const ExampleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 50], [0, 0.3], { easing: theme.ease.out, ...cl });
  return (
    <Shell bar={BAR5} bg={V + "v-datacenter.mp4"} dim={0.8}>
      <div style={{ position: "absolute", left: 96, top: 190, width: 1000, zIndex: 9 }}><Kinetic text="ЗАМЕНИТЬ 30% УЖЕ ДОСТАТОЧНО" size={74} delay={2} per={3} mode="snap" hero={[1]} lineHeight={1.04} /></div>
      <div style={{ position: "absolute", left: 110, top: 520, width: 1000, height: 60, zIndex: 8, background: colors.surfaceLift, border: `2px solid ${colors.line}`, borderRadius: 30, overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: palette.primary, boxShadow: `0 0 30px ${palette.glow}` }} />
      </div>
      <div style={{ position: "absolute", left: 110 + p * 1000 - 40, top: 600, zIndex: 9, fontFamily: WIDE, fontWeight: 900, fontSize: 40, color: palette.text }}>{Math.round(p * 100)}%</div>
      <Tower x={1300} y={110} w={460} h={720} label="СТАРАЯ МОДЕЛЬ IT" crackAt={at(4.2)} />
    </Shell>
  );
};

/** Note 80: a whole department vs three people with AI, both real. */
export const CheaperScene: React.FC = () => {
  const frame = useCurrentFrame();
  const team = at(2.3);
  return (
    <Shell bar={BAR5} bg={V + "v-speed.mp4"} dim={0.8}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}><Kinetic text="ПРОГРАММЫ ДЕШЕВЕЮТ" size={78} delay={2} per={3} mode="snap" lineHeight={1} /></div>
      <MediaCard src={V + "v-office.mp4"} at={4} x={110} y={300} w={760} h={440} tilt={-5} label="РАНЬШЕ · ЦЕЛЫЙ ОТДЕЛ" meta="200 ЧЕЛОВЕК" />
      {frame >= team && <MediaCard src={V + "v-team.mp4"} at={team} x={1050} y={300} w={760} h={440} tilt={5} label="ТЕПЕРЬ · 3 ЧЕЛОВЕКА + ИИ" meta="СТАРТАП" />}
      {frame >= team && <GlassChip at={team + 10} x={1120} y={800} text="ТОТ ЖЕ ПРОДУКТ" hero size={28} />}
      {frame >= team && <Arrow x={900} y={470} />}
    </Shell>
  );
};

/** Note 52: the two questions on glass, the old one struck through its own text. */
export const SkillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const now = at(3.4);
  return (
    <Shell bar={BAR5} bg={V + "v-interview.mp4"} dim={0.7}>
      <div style={{ position: "absolute", left: 110, top: 190, zIndex: 9 }}><Label at={2} size={24}>РАНЬШЕ НА СОБЕСЕДОВАНИИ</Label></div>
      <div style={{ position: "absolute", left: 110, top: 250, zIndex: 9 }}>
        <div style={{ position: "relative", display: "inline-block", padding: "24px 34px", borderRadius: 26, background: "rgba(20,26,30,0.7)", backdropFilter: "blur(14px)", border: "1.5px solid rgba(230,240,225,0.25)", fontFamily: WIDE, fontWeight: 900, fontSize: 50, color: palette.text, opacity: frame >= now ? 0.6 : 1 }}>
          «ТЫ УМЕЕШЬ ПРОГРАММИРОВАТЬ?»
          {frame >= now && <Strike at={now} width={1180} thick={14} style={{ left: 24, top: 52, transform: "rotate(-1deg)" }} />}
        </div>
      </div>
      {frame >= now && (
        <>
          <div style={{ position: "absolute", left: 110, top: 470, zIndex: 9 }}><Label at={now} size={24} tone="lime">ТЕПЕРЬ</Label></div>
          <div style={{ position: "absolute", left: 110, top: 530, zIndex: 9, padding: "24px 34px", borderRadius: 26, background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 50, boxShadow: `0 0 40px ${palette.glow}` }}>«ТЫ ПОНИМАЕШЬ, КАКОЙ ПРОДУКТ НУЖЕН?»</div>
        </>
      )}
    </Shell>
  );
};

/** Notes 53, 81, 54: the author's clip for «понять людей», bars on glass, chips. */
export const HarderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 40], [0, 1], { easing: theme.ease.inOut, ...cl });
  const people = at(2.3);
  const bar = (label: string, h: number, color: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: 230, zIndex: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 260 }}>
      <div style={{ height: 460, width: 150, display: "flex", alignItems: "flex-end", background: "rgba(20,26,30,0.6)", border: `1.5px solid ${colors.lineStrong}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ width: "100%", height: `${h}%`, background: color, boxShadow: `0 0 30px ${color}88` }} />
      </div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 28, color: palette.text, textAlign: "center" }}>{label}</div>
    </div>
  );
  return (
    <Shell bar={BAR5} bg={V + "v-creator.mp4"} dim={0.8}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 26, color: palette.textDim, letterSpacing: "0.12em" }}>СЛОЖНОСТЬ</div>
      {bar("НАПИСАТЬ КОД", 90 - p * 72, palette.primary, 110)}
      {frame >= people && bar("ПОНЯТЬ ЛЮДЕЙ", 90, colors.bad, 420)}
      <MediaCard src={V + "v-harder.mp4"} at={people} x={800} y={170} w={1000} h={560} tilt={5} label="ЧТО НУЖНО ЛЮДЯМ?" meta="ИССЛЕДОВАНИЕ" />
      {frame >= people && <GlassChip at={people + 10} x={840} y={790} text="ИНТЕРВЬЮ" glyph="◉" size={24} />}
      {frame >= people && <GlassChip at={people + 16} x={1110} y={790} text="БОЛИ КЛИЕНТА" glyph="✚" size={24} />}
      {frame >= people && <GlassChip at={people + 22} x={1440} y={790} text="ПРОДУКТ" hero size={24} />}
    </Shell>
  );
};

/** Notes 55, 56: real hardware on every card: ENIAC, an Apple II, an iPhone, the two labs. */
export const IronyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const steps: [string, string, string, boolean][] = [["1946", "ENIAC", I + "eniac.jpg", false], ["1977", "ПЕРСОНАЛЬНЫЙ КОМПЬЮТЕР", I + "apple2.jpg", false], ["2007", "СМАРТФОН", I + "iphone.png", true], ["2022", "CHATGPT", L + "openai.svg", true], ["2025", "CLAUDE CODE", L + "claude.svg", true]];
  const step = Math.min(4, Math.floor(frame / 45));
  return (
    <Shell bar={BAR5} bg={V + "v-crowd.mp4"} dim={0.82}>
      <div style={{ position: "absolute", left: 96, top: 150, zIndex: 9 }}><Kinetic text="ГЛАВНАЯ ИРОНИЯ" size={80} delay={2} per={3} mode="snap" lineHeight={1} /></div>
      <div style={{ position: "absolute", left: 96, right: 96, top: 300, zIndex: 8, display: "flex", gap: 22 }}>
        {steps.map(([y, t, img, contain], i) => (
          <div key={y} style={{ flex: 1, height: 440, borderRadius: 18, overflow: "hidden", position: "relative", background: colors.surfaceStrong, border: `2px solid ${i <= step ? palette.primary : colors.line}`, opacity: i <= step ? 1 : 0.25, transform: i === step ? "translateY(-18px) scale(1.04)" : undefined, boxShadow: i === step ? `0 0 40px ${palette.glow}` : colors.shadow }}>
            <Img src={media(img)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 300, objectFit: contain ? "contain" : "cover", padding: contain ? 30 : 0, boxSizing: "border-box", background: contain ? colors.surfaceLift : undefined }} />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 46, color: palette.text }}>{y}</div>
              <div style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 18, marginTop: 6, color: palette.textDim }}>{t}</div>
            </div>
          </div>
        ))}
      </div>
      {frame >= at(7.9) && <div style={{ position: "absolute", left: 420, top: 790, zIndex: 10 }}><Stamp tone="bad" size={62} rotate={-3} delay={at(7.9)}>АВТОМАТИЗИРОВАЛИ СЕБЯ</Stamp></div>}
    </Shell>
  );
};

export const ConclusionScene: React.FC<{ salary: number }> = ({ salary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceEnd = S(LEAD + END.conclusion.duration / VO_RATE, fps);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <Shell bar="ВЫВОД">
      {frame >= faceEnd && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <Label at={faceEnd} size={30}>ЧЕЛОВЕК, КОТОРЫЙ ТОЛЬКО ПИШЕТ КОД</Label>
          <div style={{ position: "relative" }}>
            <Slam text={`${fmt(salary)} ₽`} at={faceEnd + 2} size={160} color={colors.bad} />
            <Strike at={faceEnd + 10} width={900} thick={18} style={{ left: -20, top: 70, transform: "rotate(-2deg)" }} />
          </div>
          <Stamp tone="bad" size={80} rotate={-3} delay={faceEnd + 14}>ПОДЕШЕВЕЕТ</Stamp>
        </div>
      )}
      <FaceShot file={END.conclusion.file} duration={END.conclusion.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 300, width: 700 }}>
          <Kinetic text="МОЙ ВЫВОД" size={84} delay={4} per={3} mode="snap" hero={[1]} lineHeight={1} />
        </div>
      </FaceShot>
    </Shell>
  );
};

/** Notes 57, 58: the stamp on a dark plate so it reads over the grid; two real clips of people building. */
export const RevolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 300], [1.6, 1], { easing: theme.ease.out, ...cl });
  const mil = at(5.3);
  return (
    <Shell bar="ВЫВОД" bg={V + "v-crowd.mp4"} dim={0.65}>
      <div style={{ position: "absolute", inset: -100, zIndex: 2, display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: 10, transform: `scale(${zoom})`, opacity: 0.35 }}>
        {Array.from({ length: 26 * 16 }, (_, i) => {
          const on = frame >= 10 + ((i * 37) % 220);
          return <div key={i} style={{ height: 44, background: on ? palette.primary : "transparent", opacity: on ? 0.2 + ((i * 13) % 10) / 25 : 0 }} />;
        })}
      </div>
      <MediaCard src={V + "v-creator.mp4"} at={8} x={110} y={440} w={760} h={400} tilt={-5} label="СВОЁ ПРИЛОЖЕНИЕ" meta="ВЕЧЕР, НОУТБУК" />
      <MediaCard src={V + "v-phone.mp4"} at={20} x={1050} y={440} w={760} h={400} tilt={5} label="ЗА ОДИН ВЕЧЕР" meta="БЕЗ ПРОГРАММИСТА" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ padding: "10px 26px", borderRadius: 18, background: "rgba(6,8,10,0.75)", backdropFilter: "blur(10px)" }}>
          <Kinetic text="НАСТОЯЩАЯ РЕВОЛЮЦИЯ" size={78} delay={2} per={3} mode="snap" lineHeight={1} />
        </div>
        {frame >= mil && (
          <div style={{ padding: "8px 18px", borderRadius: 16, background: "rgba(6,8,10,0.85)" }}>
            <Stamp tone="hero" size={60} rotate={-2} delay={mil}>ПРОГРАММЫ СОЗДАЁТ КАЖДЫЙ</Stamp>
          </div>
        )}
      </div>
    </Shell>
  );
};

/** Note 59: the finale face carries no type at all. */
export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const faceEnd = S(LEAD + END.finale.duration / VO_RATE, fps);
  return (
    <Shell bar="ДЕНЬГИ · ПРОСТО">
      {frame >= faceEnd - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <Stamp tone="hero" size={110} rotate={-3} delay={faceEnd - 2}>СОЗДАВАЙТЕ ПРОДУКТЫ</Stamp>
        </div>
      )}
      <FaceShot file={END.finale.file} duration={END.finale.duration} rate={VO_RATE} from={S(LEAD, fps)} />
    </Shell>
  );
};

/** Notes 60, 61: a big, bright subscribe card: avatar, name, the button pressed, the bell ringing, the like. */
export const SubscribeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });
  const press = S(T(1.0), fps);
  const bellAt = S(T(1.6), fps);
  const likeAt = S(T(2.0), fps);
  const pressed = frame >= press;
  const ring = frame >= bellAt ? Math.sin((frame - bellAt) / 1.8) * 28 * Math.max(0, 1 - (frame - bellAt) / 40) : 0;
  const likeP = spring({ frame: frame - likeAt, fps, config: theme.spring.bouncy });
  const hit = usePunch(press, 14);
  return (
    <SceneShell exit={false} shake={hit.shake * 0.3}>
      <BgVideo src={V + "v-crowd.mp4"} dim={0.85} tint={0.3} blur={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, zIndex: 9, display: "flex", justifyContent: "center", transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 1.4) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "44px 56px", borderRadius: 40, background: "rgba(16,20,24,0.82)", backdropFilter: "blur(20px)", border: `2px solid ${palette.primary}88`, boxShadow: `0 0 80px ${palette.glow}, 0 50px 120px -40px rgba(0,0,0,0.95)` }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, overflow: "hidden", border: `5px solid ${palette.primary}` }}>
            <Img src={media(I + "face-avatar.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 56, color: palette.text }}>ДЕНЬГИ · ПРОСТО</div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 26, color: palette.textDim, marginTop: 8 }}>разборы про деньги, работу и ИИ</div>
          </div>
          <div style={{ padding: "26px 46px", borderRadius: 50, background: pressed ? colors.surfaceLift : colors.bad, color: colors.white, fontFamily: theme.fonts.body, fontWeight: 900, fontSize: 40, transform: `scale(${frame >= press - 3 && frame < press + 3 ? 0.9 : 1})`, boxShadow: pressed ? undefined : `0 0 40px ${colors.badGlow}` }}>{pressed ? richText("ВЫ ПОДПИСАНЫ ✓") : "ПОДПИСАТЬСЯ"}</div>
          <svg width={90} height={90} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%", filter: frame >= bellAt ? `drop-shadow(0 0 16px ${palette.glow})` : undefined }}>
            <path d="M12 2a1.6 1.6 0 0 1 1.6 1.6v.6A6.4 6.4 0 0 1 18.4 10.4v4.4l1.8 2.6H3.8l1.8-2.6v-4.4a6.4 6.4 0 0 1 4.8-6.2v-.6A1.6 1.6 0 0 1 12 2z" fill={frame >= bellAt ? palette.primary : palette.text} />
            <circle cx={12} cy={20.2} r={2} fill={frame >= bellAt ? palette.primary : palette.text} />
          </svg>
        </div>
      </div>
      {frame >= likeAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, zIndex: 9, display: "flex", justifyContent: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 36px", borderRadius: 40, background: "rgba(16,20,24,0.82)", border: `2px solid ${palette.primary}`, transform: `scale(${interpolate(likeP, [0, 1], [0.5, 1])})` }}>
            <svg width={64} height={64} viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21V10l5.2-7.4a1.8 1.8 0 0 1 3.2 1.4L15.4 9H21a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 19.6 21z" fill={palette.primary} /></svg>
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 44, color: palette.text }}>ЛАЙК</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 36px", borderRadius: 40, background: "rgba(16,20,24,0.82)", border: `2px solid ${colors.lineStrong}`, transform: `scale(${interpolate(likeP, [0, 1], [0.5, 1])})` }}>
            <span style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 44, color: palette.text }}>ВПЕРЕДИ БОЛЬШЕ РАЗБОРОВ</span>
          </div>
        </div>
      )}
      <Flash amount={hit.energy * 0.5} />
    </SceneShell>
  );
};
