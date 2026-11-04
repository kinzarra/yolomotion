// Part 1, beats 11–17: «не понимали», the priests, the AI and its labs, the
// miracle (Harry, the author's picture), the machine at work, «не совсем»
// with the two neon brains, and the tower that cracks.
import React from "react";
import { Img, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, CutWipe, Drift, DuoClip, Flash, FlyIn, Glitch, Kinetic, Label, S, SceneShell, Shockwave, Stamp, Stopwatch, Strike, Terminal, TopBar, WIDE, cl, media } from "../ui";
import { FaceShot, FileTree, LogoCard, NeonBrain, Outlined, Still, Tower, Wireframe } from "../fx";
import { PRESENTER as FACE } from "../presenter-more";
import { AI_T, EXPLAIN_T, LEAD, MACHINE_T, MIRACLE_T, NOTQUITE_T, NQ_LEAD, PRIESTS_T, T, VO_RATE } from "../timeline";
import { Sym, richText } from "../sym";

const F = "footage/dev-myth/";
const L = "images/dev-myth/logos/";

/** The labs, in the order the author listed them (note 12). */
export const LABS = [
  { src: L + "anthropic.svg", name: "ANTHROPIC" },
  { src: L + "claude.svg", name: "CLAUDE CODE" },
  { src: L + "cursor.svg", name: "CURSOR" },
  { src: L + "openai.svg", name: "OPENAI" },
  { src: L + "qwen.svg", name: "QWEN" },
  { src: L + "deepseek.svg", name: "DEEPSEEK" },
];

/* ------------------------------------------------------------------- why */

export const WhyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marks = [S(0.9, fps), S(1.5, fps), S(2.1, fps)];
  const z1 = usePunch(marks[0], 12);
  const z2 = usePunch(marks[2], 12);
  const zoom = 1 + z1.pop * 0.05 + z2.pop * 0.06;
  return (
    <SceneShell shake={z1.shake * 0.4 + z2.shake * 0.5}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <DuoClip src={F + "confused.mp4"} dim={0.25} tint={0.4} startFrom={0.4} />
      </div>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <div style={{ position: "absolute", left: 96, top: 230, zIndex: 9 }}>
        <Kinetic text="НЕ ПОНИМАЛИ, КАК ЭТО РАБОТАЕТ" size={88} delay={4} per={3} mode="snap" bad={[0, 1]} lineHeight={1.02} style={{ maxWidth: 1100 }} />
      </div>
      {marks.map((m, i) =>
        frame >= m ? (
          <div key={i} style={{ position: "absolute", left: 1180 + i * 170, top: 520 - i * 90, zIndex: 9 }}>
            <Stamp tone={i === 1 ? "bad" : "hero"} size={120 + i * 20} rotate={(i - 1) * 9} delay={m}>?</Stamp>
          </div>
        ) : null,
      )}
      <Flash amount={z2.energy * 0.5} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- priests */

export const PriestsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const priestsAt = S(T(PRIESTS_T.priests), fps);
  const montageAt = S(T(PRIESTS_T.montage), fps);
  const cut2 = montageAt + S(0.6, fps);
  const p1 = usePunch(priestsAt, 12);
  const p2 = usePunch(montageAt, 12);
  const p3 = usePunch(cut2, 12);
  const phase = frame < priestsAt ? 0 : frame < montageAt ? 1 : frame < cut2 ? 2 : 3;
  const tear = [priestsAt, montageAt, cut2].reduce((a, c) => a + interpolate(frame - c, [0, 1, 7], [0, 1, 0], cl), 0);
  return (
    <SceneShell shake={p1.shake * 0.5 + p2.shake * 0.4 + p3.shake * 0.4}>
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        {phase === 0 && <Still src="images/dev-myth/priests.jpg" from={1.1} to={1.3} pan={[-80, -120]} dim={0.2} tint={0.35} frames={priestsAt} />}
        {phase === 1 && (
          <Sequence from={priestsAt} layout="none">
            <DuoClip src={F + "servers.mp4"} dim={0.25} tint={0.45} startFrom={0} />
          </Sequence>
        )}
        {phase === 2 && (
          <Sequence from={montageAt} layout="none">
            <DuoClip src={F + "hooded.mp4"} dim={0.25} tint={0.45} startFrom={0.5} />
          </Sequence>
        )}
        {phase === 3 && (
          <Sequence from={cut2} layout="none">
            <DuoClip src={F + "headphones.mp4"} dim={0.3} tint={0.45} startFrom={0} />
          </Sequence>
        )}
      </Glitch>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      {/* note 11: one line of title, the labels under it, never on top */}
      <div style={{ position: "absolute", left: 96, top: 210, width: 1720, zIndex: 9 }}>
        {phase === 0 && <Kinetic text="ЖРЕЦЫ" size={150} delay={4} per={3} mode="snap" hero={[0]} lineHeight={1.0} />}
        {phase >= 1 && <Kinetic text="ЖРЕЦЫ ЦИФРОВОЙ ЭПОХИ" size={92} delay={priestsAt + 2} per={3} mode="snap" hero={[0]} lineHeight={1.02} />}
      </div>
      <div style={{ position: "absolute", left: 110, top: 380, zIndex: 9, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        {phase === 0 && <Label at={10} size={26} rotate={-1}>ХРАМ · ТАЙНОЕ ЗНАНИЕ · ПОДНОШЕНИЯ</Label>}
        {phase === 1 && <Label at={priestsAt + 4} size={26} rotate={-1}>СЕРВЕРНАЯ · ТАЙНОЕ ЗНАНИЕ · ЗАРПЛАТА</Label>}
        {phase >= 2 && <Label at={montageAt + 3} size={28} tone="bad" rotate={-2}>НЕ МЕШАТЬ · Я В ПОТОКЕ</Label>}
        {phase === 3 && <Label at={cut2 + 3} size={26} rotate={1}>«ЭТО НЕ ТАК ПРОСТО, КАК КАЖЕТСЯ»</Label>}
      </div>
      {/* note 11: the servers beat gets its object at once — the priest himself, and the stamp */}
      {phase === 1 && (
        <>
          <FlyIn from="right" at={priestsAt + 2} x={1460} y={420} w={330} rot={3} z={8}>
            <Img src={media("images/dev-myth/fig-dev.png")} style={{ width: "100%", display: "block", filter: "brightness(1.35)" }} />
          </FlyIn>
          <div style={{ position: "absolute", left: 120, top: 560, zIndex: 10 }}>
            <Stamp tone="hero" size={80} rotate={-4} delay={priestsAt + 8}>ТАЙНОЕ ЗНАНИЕ</Stamp>
          </div>
        </>
      )}
      {[priestsAt, montageAt, cut2].map((c) => (frame >= c && frame < c + 14 ? <CutWipe key={c} /> : null))}
      <Flash amount={p1.energy * 0.7} />
      <Flash amount={p2.energy * 0.5} />
    </SceneShell>
  );
};

/* -------------------------------------------------------------------- ai */

export const AiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const aiAt = S(T(AI_T.ai), fps);
  const hit = usePunch(aiAt, 14);
  const text = "напиши мне сайт";
  const typed = text.slice(0, Math.max(0, Math.floor(frame * 0.9)));
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <SceneShell shake={hit.shake * 0.6}>
      <div style={{ position: "absolute", inset: 0, background: palette.bg, opacity: 0.85 }} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, zIndex: 9, display: "flex", justifyContent: "center", fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 64, color: palette.text }}>
        <span style={{ color: palette.primary, marginRight: 24 }}>&gt;</span>
        <span>{typed}</span>
        {blink && <span style={{ display: "inline-block", width: 34, height: 70, background: palette.text, marginLeft: 6, verticalAlign: "-8px" }} />}
      </div>
      {frame >= aiAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <Label at={aiAt} size={28} tone="lime" rotate={-1}>ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ · 2022 → 2026</Label>
        </div>
      )}
      {/* note 12: the labs, landing one by one on «интеллект» */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, zIndex: 9, display: "flex", justifyContent: "center", gap: 26 }}>
        {LABS.map((l, i) => <LogoCard key={l.name} at={aiAt + 12 + i * 4} src={l.src} name={l.name} size={120} w={240} hero={i === 1} />)}
      </div>
      <Shockwave at={aiAt} size={1600} />
      <Flash amount={hit.energy * 0.6} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- miracle */

/** Harry (note 13, the author's picture): 554×738 after the watermark crop; his wand tip in that box. */
const HARRY = { src: "images/dev-myth/harry.png", w: 554, h: 738, tip: { x: 0.9, y: 0.05 } };

export const MiracleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const miracleAt = S(T(MIRACLE_T.miracle), fps);
  const hit = usePunch(miracleAt, 16);
  const hw = 560;
  const hx = 150;
  const hy = 120;
  const tipX = hx + hw * HARRY.tip.x;
  const tipY = hy + (hw * HARRY.h) / HARRY.w * HARRY.tip.y;
  const burst = interpolate(frame - 8, [0, 34], [0, 1], { easing: theme.ease.out, ...cl });
  const glyphs = ["{", "}", ";", "</>", "=>", "()", "[]", "&&", "fn", "const", "if", "<div>", "npm", "git"];
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={["✦", "{ }", "=>", "✦", "<div>", "✦", "fn()", "✦"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <FlyIn from="left" at={0} x={hx} y={hy} w={hw} rot={-3} z={6} sticker={false}>
        <Outlined src={HARRY.src} w={hw} px={11} />
      </FlyIn>
      {/* sparks from the wand tip, turning into code */}
      {frame >= 8 && (
        <div style={{ position: "absolute", left: tipX, top: tipY, zIndex: 7, pointerEvents: "none" }}>
          {Array.from({ length: 30 }, (_, i) => {
            const a = -Math.PI * 0.9 + (i / 30) * Math.PI * 1.3 + Math.sin(i * 7) * 0.2;
            const d = (90 + ((i * 53) % 100) * 6) * burst;
            const isGlyph = burst > 0.35 + ((i * 17) % 10) * 0.04;
            return (
              <div key={i} style={{ position: "absolute", left: Math.cos(a) * d * 1.6, top: Math.sin(a) * d * 0.9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: isGlyph ? 30 + (i % 4) * 8 : 12, color: palette.primary, opacity: 1 - burst * 0.35, textShadow: `0 0 18px ${palette.glow}` }}>
                {isGlyph ? glyphs[i % glyphs.length] : <Sym c="●" />}
              </div>
            );
          })}
        </div>
      )}
      <Wireframe at={miracleAt + 2} x={1060} y={330} w={720} />
      {frame >= miracleAt && (
        <div style={{ position: "absolute", left: 1090, top: 130, zIndex: 10 }}>
          <Stamp tone="hero" size={140} rotate={-5} delay={miracleAt}>ЧУДО</Stamp>
        </div>
      )}
      <Shockwave at={10} size={1800} />
      <Burst at={miracleAt} x={1300} y={220} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- machine */

const FILES = ["src/", " auth/", "  login.ts", "  register.ts", " db/", "  schema.sql", "  client.ts", " billing/", "  stripe.ts", "  webhooks.ts", " account/", "  profile.tsx", "tests/", " auth.test.ts", " billing.test.ts"];

export const MachineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const filesAt = S(T(MACHINE_T.files), fps);
  const machineAt = S(T(MACHINE_T.machine), fps);
  const hit = usePunch(machineAt, 16);
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={["✓", "npm test", "git commit", "✓ 38", "build ok", "lint", "deploy", "✓"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <div style={{ position: "absolute", left: 110, top: 150, zIndex: 8, width: 520, padding: 22, background: colors.surfaceStrong, border: `2px solid ${colors.lineStrong}`, boxShadow: colors.shadow }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.12em", color: palette.textDim, marginBottom: 12 }}>ФАЙЛЫ · СОЗДАЁТ САМА</div>
        <FileTree at={filesAt} every={5} files={FILES} width={470} />
      </div>
      <FlyIn from="bottom" at={6} x={700} y={150} w={1100} rot={0} z={7} sticker={false}>
        <div style={{ position: "relative" }}>
          <Terminal
            at={10}
            width={1100}
            speed={2.8}
            lines={[
              { text: "$ claude", dim: true, instant: true },
              { text: "> Создай веб-приложение: регистрация, база данных, личный кабинет, оплата подписки. Напиши тесты." },
              { text: "✓ зависимости: 42 пакета установлены", instant: true },
              { text: "✓ src/auth · src/db · src/billing · src/account: 14 файлов", instant: true },
              { text: "✗ tests/billing.test.ts: 1 ошибка → исправляю…", instant: true },
              { text: "✓ 38 тестов прошли · сборка готова", instant: true },
            ]}
          />
          <div style={{ position: "absolute", right: 22, top: 8 }}>
            <Stopwatch at={10} rate={40} size={40} />
          </div>
        </div>
      </FlyIn>
      {/* notes 7, 14: inside the frame, under the terminal */}
      {frame >= machineAt && (
        <div style={{ position: "absolute", left: 640, top: 650, zIndex: 10 }}>
          <Stamp tone="hero" size={62} rotate={-3} delay={machineAt}>МАШИНА ДЕЛАЕТ САМА</Stamp>
        </div>
      )}
      <Burst at={machineAt} x={1250} y={700} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/* -------------------------------------------------------------- notquite */

export const NotQuiteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lieAt = S(T(NOTQUITE_T.lie), fps);
  const nq = (clip: number) => S(NQ_LEAD + clip / VO_RATE, fps);
  const nqAt = nq(NOTQUITE_T.notquite);
  const toolAt = nq(NOTQUITE_T.tool);
  const humanAt = nq(NOTQUITE_T.human);
  const lie = usePunch(lieAt, 16);
  const nqp = usePunch(nqAt, 16);
  const hu = usePunch(humanAt, 14);
  const plates = frame >= toolAt;
  return (
    <SceneShell shake={lie.shake * 0.8 + nqp.shake * 0.6 + hu.shake * 0.5}>
      <Drift items={["?", "≠", "20 ЛЕТ", "ИНСТРУМЕНТ", "ЧЕЛОВЕК", "?", "254 000 ₽", "100 $"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      {frame >= lieAt && !plates && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, zIndex: 9, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <Stamp tone="bad" size={210} rotate={-5} delay={lieAt}>ОБМАН?</Stamp>
            {/* note 17: along the stamp's own axis, through the letters */}
            {frame >= nqAt && <Strike at={nqAt} width={1060} thick={26} style={{ left: 40, top: 178, transform: "rotate(-5deg)", transformOrigin: "left center", background: palette.primary, boxShadow: `0 0 28px ${palette.glow}` }} />}
          </div>
        </div>
      )}
      {frame >= nqAt && !plates && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, zIndex: 10, display: "flex", justifyContent: "center" }}>
          <Stamp tone="hero" size={120} rotate={3} delay={nqAt}>НЕ СОВСЕМ</Stamp>
        </div>
      )}
      {plates && (
        <>
          <FlyIn from="left" at={toolAt} x={110} y={170} w={720} rot={-2} z={7} sticker={false}>
            <div style={{ padding: 30, background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em", color: colors.inkFaded, marginBottom: 12 }}>ЧТО МЫ ВИДЕЛИ</div>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 60, lineHeight: 1.02 }}>СЛОЖНЫЙ ИНСТРУМЕНТ</div>
              <div style={{ marginTop: 18, padding: "10px 16px", background: colors.ink, color: palette.primary, fontFamily: theme.fonts.mono, fontSize: 24, fontWeight: 700 }}>$ gcc main.c && ./a.out</div>
            </div>
          </FlyIn>
          {/* note 8: the brain under the tool, lime */}
          <div style={{ position: "absolute", left: 330, top: 500, zIndex: 6 }}>
            <NeonBrain at={toolAt + 8} w={290} color={palette.primary} seed={1} />
          </div>
          {frame >= humanAt && (
            <>
              <div style={{ position: "absolute", left: 868, top: 300, zIndex: 9, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 200, color: palette.primary, textShadow: `0 0 40px ${palette.glow}`, transform: `scale(${1 + hu.pop * 0.3})` }}>≠</div>
              <FlyIn from="right" at={humanAt} x={1090} y={170} w={720} rot={2} z={7} sticker={false}>
                <div style={{ padding: 30, background: colors.paper, color: colors.ink, boxShadow: colors.paperShadow, position: "relative" }}>
                  <div style={{ fontFamily: theme.fonts.mono, fontSize: 20, letterSpacing: "0.14em", color: colors.inkFaded, marginBottom: 12 }}>ЧТО МЫ ДУМАЛИ</div>
                  <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 60, lineHeight: 1.02 }}>УНИКАЛЬНЫЙ ЧЕЛОВЕК</div>
                  <Img src={media("images/dev-myth/fig-dev.png")} style={{ position: "absolute", right: 24, bottom: -10, width: 140, filter: "brightness(1.35) drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)" }} />
                  <div style={{ marginTop: 18, padding: "10px 16px", background: colors.bad, color: colors.white, fontFamily: theme.fonts.mono, fontSize: 22, fontWeight: 800, display: "inline-block" }}>254 000 ₽ В МЕСЯЦ</div>
                </div>
              </FlyIn>
              {/* notes 18, 19: a second brain under the human, flickering, in the mint neon */}
              <div style={{ position: "absolute", left: 1310, top: 500, zIndex: 6 }}>
                <NeonBrain at={humanAt + 8} w={290} color={palette.accent} seed={5} />
              </div>
            </>
          )}
        </>
      )}
      {/* note 26: the author says «Не совсем…» himself */}
      <FaceShot file={FACE.notquite.file} duration={FACE.notquite.duration} rate={VO_RATE} from={S(NQ_LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 320 }}>
          <Stamp tone="hero" size={70} rotate={-4} delay={nqAt}>НЕ СОВСЕМ</Stamp>
        </div>
      </FaceShot>
      <Burst at={humanAt} x={960} y={400} />
      <Flash amount={lie.energy} color={colors.bad} />
      <Flash amount={nqp.energy * 0.8} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- explain */

export const ExplainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const diffAt = S(T(EXPLAIN_T.difference), fps);
  const destroyAt = S(T(EXPLAIN_T.destroy), fps);
  const industryAt = S(T(EXPLAIN_T.industry), fps);
  const hit = usePunch(destroyAt, 20);
  const tear = interpolate(frame - destroyAt, [0, 2, 10], [0, 1, 0], cl);
  return (
    <SceneShell shake={hit.shake * 1.2}>
      <Drift items={["IT", "254 000 ₽", "100 $", "20 ЛЕТ", "≠", "ОФФЕР", "СПРИНТ", "ВАКАНСИЯ"]} opacity={0.14} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <Glitch amount={tear} style={{ position: "absolute", inset: 0 }}>
        <Tower x={1290} y={90} w={480} h={760} label="IT-ИНДУСТРИЯ" crackAt={S(LEAD + FACE.explain.duration / VO_RATE, fps) + 2} />
      </Glitch>
      <div style={{ position: "absolute", left: 96, top: 190, width: 1100, zIndex: 9 }}>
        <Kinetic text="ЭТО РАЗЛИЧИЕ" size={88} delay={diffAt} per={3} mode="snap" lineHeight={1.02} />
        {frame >= destroyAt && (
          <div style={{ marginTop: 16 }}>
            <Stamp tone="bad" size={100} rotate={-4} delay={destroyAt}>УНИЧТОЖИТ</Stamp>
          </div>
        )}
        {frame >= industryAt && (
          <div style={{ marginTop: 26 }}>
            <Kinetic text="ПРИВЫЧНУЮ IT-ИНДУСТРИЮ" size={64} delay={industryAt} per={3} mode="snap" bad={[1]} lineHeight={1.02} />
          </div>
        )}
      </div>
      {/* note 27: no chart — one plain fact */}
      {frame >= industryAt && (
        <div style={{ position: "absolute", left: 96, top: 700, zIndex: 9 }}>
          <Label at={industryAt + 4} size={30} tone="bad" rotate={-1}>ВАКАНСИЙ В IT ЗА ГОД: −21% · SUPERJOB, 2026</Label>
        </div>
      )}
      {/* the author explains himself; the tower cracks when his line is over */}
      <FaceShot file={FACE.explain.file} duration={FACE.explain.duration} rate={VO_RATE} from={S(LEAD, fps)}>
        <div style={{ position: "absolute", left: 96, top: 230, width: 820 }}>
          <Kinetic text="ЭТО РАЗЛИЧИЕ" size={84} delay={diffAt} per={3} mode="snap" lineHeight={1.02} />
          {frame >= destroyAt && <div style={{ marginTop: 16 }}><Stamp tone="bad" size={96} rotate={-4} delay={destroyAt}>УНИЧТОЖИТ</Stamp></div>}
          {frame >= industryAt && <div style={{ marginTop: 26 }}><Kinetic text="ПРИВЫЧНУЮ IT-ИНДУСТРИЮ" size={60} delay={industryAt} per={3} mode="snap" bad={[1]} lineHeight={1.02} /></div>}
        </div>
      </FaceShot>
      <Burst at={destroyAt} x={1530} y={470} color={colors.bad} count={26} />
      <Flash amount={hit.energy} color={colors.bad} />
    </SceneShell>
  );
};
