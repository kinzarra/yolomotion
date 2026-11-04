// Part 1, beats 5–10: the profession, its languages, its terms, its salary,
// the fortnight for a button, and «мы им верили».
import React from "react";
import { Img, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { devMythColors as colors, devMythPalette as palette } from "../palette";
import { Burst, Calendar, CutWipe, Drift, DuoClip, Flash, FlyIn, Glitch, Kinetic, Label, S, SceneShell, Slam, Stamp, TopBar, WIDE, cl, media } from "../ui";
import { BinaryGrid, Browser, CodeBlock, NoteRain, Still, Ticket } from "../fx";
import { BELIEVE_T, BUTTON_T, LANG_T, PROF_T, SALARY_T, T } from "../timeline";

const F = "footage/dev-myth/";
/** Real 100 $ bills, Pexels 14820444 / 14820490 / 14820453 (Jonathan Borba), cut by matte (note 3). */
const USD = ["images/dev-myth/usd-front.png", "images/dev-myth/usd-stand.png", "images/dev-myth/usd-back.png"];

/* ------------------------------------------------------------ profession */

export const ProfessionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const repsAt = S(T(PROF_T.reps), fps);
  const decadesAt = S(T(PROF_T.decades), fps);
  const withoutAt = S(T(PROF_T.without), fps);
  const buildAt = S(T(PROF_T.build), fps);
  const civAt = S(T(PROF_T.civ), fps);
  const c1 = usePunch(repsAt, 12);
  const c2 = usePunch(buildAt, 12);
  const dec = usePunch(decadesAt, 16);
  const civ = usePunch(civAt, 16);
  const phase = frame < repsAt ? 0 : frame < buildAt ? 1 : 2;
  return (
    <SceneShell shake={dec.shake * 0.7 + c2.shake * 0.4 + civ.shake * 0.6}>
      <Glitch amount={interpolate(frame - repsAt, [0, 1, 7], [0, 1, 0], cl) + interpolate(frame - buildAt, [0, 1, 7], [0, 1, 0], cl)} style={{ position: "absolute", inset: 0 }}>
        {phase === 0 && <DuoClip src={F + "prof-office.mp4"} dim={0.3} startFrom={0} />}
        {phase === 1 && (
          <Sequence from={repsAt} layout="none">
            <DuoClip src={F + "prof-code.mp4"} dim={0.3} startFrom={0.5} />
          </Sequence>
        )}
        {phase === 2 && (
          <Sequence from={buildAt} layout="none">
            <DuoClip src={F + "prof-city.mp4"} dim={0.2} tint={0.35} startFrom={0} />
          </Sequence>
        )}
      </Glitch>
      <BinaryGrid at={civAt} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <div style={{ position: "absolute", left: 96, top: 230, width: 1000, zIndex: 9 }}>
        {phase < 2 && <Kinetic text="ПРОФЕССИЯ, БЕЗ КОТОРОЙ НЕЛЬЗЯ" size={96} delay={6} per={3} mode="snap" lineHeight={1.02} />}
        {phase === 2 && <Kinetic text="СОВРЕМЕННАЯ ЦИВИЛИЗАЦИЯ" size={100} delay={buildAt + 2} per={3} mode="snap" hero={[1]} lineHeight={1.02} />}
      </div>
      {frame >= decadesAt && phase < 2 && (
        <div style={{ position: "absolute", left: 110, top: 520, zIndex: 10 }}>
          <Stamp tone="bad" size={88} rotate={-4} delay={decadesAt}>ДЕСЯТИЛЕТИЯМИ</Stamp>
        </div>
      )}
      {frame >= withoutAt && phase < 2 && (
        <div style={{ position: "absolute", left: 120, top: 700, zIndex: 10, display: "flex", gap: 14 }}>
          <Label at={withoutAt} size={28} rotate={-1}>«БЕЗ НАС НИЧЕГО НЕ РАБОТАЕТ»</Label>
        </div>
      )}
      {frame >= civAt && (
        <div style={{ position: "absolute", left: 96, top: 560, zIndex: 10 }}>
          <Stamp tone="hero" size={84} rotate={2} delay={civAt}>ПОСТРОЕНА НА КОДЕ</Stamp>
        </div>
      )}
      {frame >= repsAt && frame < repsAt + 14 && <CutWipe />}
      {frame >= buildAt && frame < buildAt + 14 && <CutWipe />}
      <Flash amount={c1.energy * 0.5} />
      <Flash amount={dec.energy * 0.8} color={colors.bad} />
      <Flash amount={civ.energy * 0.8} />
    </SceneShell>
  );
};

/* ------------------------------------------------------------- languages */

const C_LINES = ["#include <stdio.h>", "", "int main(void) {", "    char *p = malloc(64);", "    if (!p) return 1;", "    printf(\"hello, world\\n\");", "    free(p);", "    return 0;", "}"];
const ASM_LINES = ["section .text", "global _start", "_start:", "    mov  eax, 4", "    mov  ebx, 1", "    mov  ecx, msg", "    mov  edx, len", "    int  0x80", "    jmp  exit"];

export const LanguagesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const morphAt = S(T(LANG_T.morph), fps);
  const codeAt = S(T(LANG_T.code), fps);
  const cut = usePunch(codeAt, 12);
  const glyphs = ["{", "}", ";", "->", "&&", "::", "=>", "<>", "()", "[]", "#", "*p"];
  return (
    <SceneShell shake={cut.shake * 0.5}>
      {frame < codeAt && <Still src="images/dev-myth/hieroglyphs.jpg" from={1.08} to={1.28} pan={[-120, -40]} dim={0.25} frames={codeAt} />}
      {frame >= codeAt && (
        <Sequence from={codeAt} layout="none">
          <DuoClip src={F + "typing.mp4"} dim={0.55} tint={0.5} startFrom={0} />
        </Sequence>
      )}
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      {/* the glyphs: hieroglyphs melting into code symbols */}
      {frame >= morphAt && frame < codeAt + 6 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
          {Array.from({ length: 22 }, (_, i) => {
            const k = frame - morphAt - i * 1.2;
            if (k < 0) return null;
            const x = 120 + ((i * 331) % 1680);
            const y = 160 + ((i * 197) % 760) + k * 3;
            return <div key={i} style={{ position: "absolute", left: x, top: y, fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 44 + (i % 3) * 16, color: palette.primary, opacity: Math.min(1, k / 6), textShadow: `0 0 18px ${palette.glow}` }}>{glyphs[i % glyphs.length]}</div>;
          })}
        </div>
      )}
      {frame < codeAt && (
        <div style={{ position: "absolute", left: 96, top: 230, zIndex: 9 }}>
          <Kinetic text="НЕПОНЯТНЫЕ ЯЗЫКИ" size={104} delay={4} per={3} mode="snap" bad={[0]} lineHeight={1.02} />
        </div>
      )}
      {frame >= codeAt && (
        <>
          <div style={{ position: "absolute", left: 110, top: 150, zIndex: 9 }}>
            <CodeBlock at={codeAt + 4} lines={C_LINES} width={800} size={30} label="C · 1972" accent={/(int|char|if|return|void)/} />
          </div>
          <div style={{ position: "absolute", left: 1010, top: 150, zIndex: 9 }}>
            <CodeBlock at={codeAt + 10} lines={ASM_LINES} width={800} size={30} label="ASSEMBLY · 1949" accent={/(mov|int|jmp|global)/} />
          </div>
        </>
      )}
      {frame >= codeAt && frame < codeAt + 14 && <CutWipe />}
      <Flash amount={cut.energy * 0.7} />
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- terms */

const TERMS = ["РЕФАКТОРИНГ", "ДЕПЛОЙ", "ТЕХДОЛГ", "KUBERNETES", "МИКРОСЕРВИСЫ", "РЕГРЕССИЯ", "ХОТФИКС", "ЛЕГАСИ", "CI/CD", "ОРКЕСТРАЦИЯ"];

export const TermsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drops = TERMS.map((_, i) => 6 + i * 5);
  const lastHit = drops.filter((d) => frame >= d).length;
  const shake = lastHit ? Math.sin((frame - drops[lastHit - 1]) * 1.5) * Math.max(0, 1 - (frame - drops[lastHit - 1]) / 10) * 5 : 0;
  const spots: [number, number, number][] = [[120, 170, -6], [760, 140, 4], [1320, 190, -3], [220, 420, 5], [900, 400, -5], [1460, 440, 3], [140, 650, -4], [700, 680, 6], [1250, 660, -2], [460, 860, 3]];
  return (
    <SceneShell shake={shake}>
      <DuoClip src={F + "prof-code.mp4"} dim={0.6} tint={0.55} startFrom={3} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      {TERMS.map((t, i) => {
        const p = interpolate(frame - drops[i], [0, 9], [0, 1], { easing: theme.ease.out, ...cl });
        if (frame < drops[i]) return null;
        const [x, y, r] = spots[i];
        const bounce = Math.sin(Math.min(1, (frame - drops[i]) / 12) * Math.PI) * 10;
        return (
          <div key={t} style={{ position: "absolute", left: x, top: y - 400 * (1 - p) - bounce, zIndex: 8, padding: "14px 26px", background: i % 3 === 1 ? colors.bad : colors.paper, color: i % 3 === 1 ? colors.white : colors.ink, fontFamily: WIDE, fontWeight: 900, fontSize: 54, letterSpacing: "-0.01em", transform: `rotate(${r}deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`, boxShadow: colors.paperShadow, opacity: Math.min(1, p * 2) }}>
            {t}
          </div>
        );
      })}
      <Flash amount={lastHit && frame - drops[lastHit - 1] < 2 ? 0.2 : 0} />
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- salary */

export const SalaryScene: React.FC<{ salary: number }> = ({ salary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numberAt = S(T(SALARY_T.number), fps);
  const hit = usePunch(numberAt, 16);
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  return (
    <SceneShell shake={hit.shake}>
      <Drift items={[`${fmt(salary)} ₽`, "×12", "ЗП", "БОНУС", "ОПЦИОН", "РЕЛОКАЦИЯ", "ОФФЕР", "+30%"]} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <NoteRain at={0} count={18}>{(i) => <Img key={i} src={media(USD[i % USD.length])} style={{ width: 380, display: "block", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.7)) saturate(1.1) contrast(1.05)" }} />}</NoteRain>
      <div style={{ position: "absolute", left: 96, top: 250, zIndex: 9 }}>
        <Kinetic text="ОГРОМНЫЕ ЗАРПЛАТЫ" size={104} delay={4} per={3} mode="snap" hero={[0]} lineHeight={1.02} />
      </div>
      {frame >= numberAt && (
        <div style={{ position: "absolute", left: 96, top: 470, zIndex: 9, display: "flex", alignItems: "flex-end", gap: 26 }}>
          <Slam text={`${fmt(salary)} ₽`} at={numberAt} size={180} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 18 }}>
            <Label at={numberAt + 6} size={26} rotate={1.5}>В МЕСЯЦ</Label>
            <Label at={numberAt + 12} size={24}>× 12 = {fmt(salary * 12)} ₽ В ГОД</Label>
          </div>
        </div>
      )}
      <Burst at={numberAt} x={700} y={560} />
      <Flash amount={hit.energy} />
    </SceneShell>
  );
};

/* ---------------------------------------------------------------- button */

export const ButtonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickAt = S(T(BUTTON_T.click), fps);
  const ticketAt = S(T(BUTTON_T.ticket), fps);
  const weeksAt = S(T(BUTTON_T.weeks), fps);
  const click = usePunch(clickAt, 10);
  const tk = usePunch(ticketAt, 12);
  const wk = usePunch(weeksAt, 16);
  const day = interpolate(frame, [ticketAt + 12, weeksAt], [0, 14], cl);
  return (
    <SceneShell shake={click.shake * 0.3 + tk.shake * 0.4 + wk.shake * 0.8}>
      <Drift items={["DEV-1042", "8 SP", "2 НЕДЕЛИ", "СПРИНТ", "QA", "BLOCKED", "СТЕНДАП", "ОЦЕНКА"]} />
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      <div style={{ position: "absolute", left: 110, top: 150, zIndex: 6 }}>
        <Browser at={2} clickAt={clickAt} width={760} label="КУПИТЬ" />
      </div>
      <div style={{ position: "absolute", left: 130, top: 640, zIndex: 9 }}>
        <Kinetic text="ОДНА КНОПКА" size={92} delay={6} per={3} mode="snap" lineHeight={1.02} />
      </div>
      <FlyIn from="right" at={ticketAt} x={960} y={130} w={620} rot={-2} z={7} sticker={false}>
        <Ticket at={ticketAt} width={620} statusAt={[ticketAt, ticketAt + 26, weeksAt]} />
      </FlyIn>
      <FlyIn from="bottom" at={ticketAt + 10} x={1600} y={560} w={300} rot={3} z={7} sticker={false}>
        <Calendar day={day} title="ОЦЕНКА" width={290} />
      </FlyIn>
      {frame >= weeksAt && (
        <div style={{ position: "absolute", left: 980, top: 700, zIndex: 10 }}>
          <Stamp tone="bad" size={110} rotate={-5} delay={weeksAt}>2 НЕДЕЛИ</Stamp>
        </div>
      )}
      <Burst at={weeksAt} x={1250} y={760} color={colors.bad} count={22} />
      <Flash amount={tk.energy * 0.5} />
      <Flash amount={wk.energy} color={colors.bad} />
    </SceneShell>
  );
};

/* --------------------------------------------------------------- believe */

export const BelieveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordAt = S(T(BELIEVE_T.word), fps);
  const crackAt = S(T(BELIEVE_T.crack), fps);
  const grow = interpolate(frame, [wordAt - 20, crackAt], [0.25, 1], { easing: theme.ease.inOut, ...cl });
  const track = interpolate(frame, [wordAt - 20, crackAt + 20], [-0.06, 0.02], { easing: theme.ease.inOut, ...cl });
  const crack = usePunch(crackAt, 18);
  const tear = interpolate(frame - crackAt, [0, 2, 12], [0, 1, 0], cl);
  return (
    <SceneShell shake={crack.shake}>
      <TopBar left="ДЕНЬГИ · ПРОСТО" right="ЧАСТЬ 1 · ВЕЛИКИЙ МИФ" />
      {frame >= wordAt - 20 && (
        <Glitch amount={tear} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 290, letterSpacing: `${track}em`, color: palette.text, transform: `scale(${grow})`, opacity: interpolate(frame - (wordAt - 20), [0, 10], [0, 1], cl), textShadow: `0 0 60px ${palette.bg}` }}>
            ВЕРИЛИ
          </div>
        </Glitch>
      )}
      {frame >= crackAt && (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 8 }}>
          {["M 980 300 L 940 470 L 1010 560 L 960 720 L 1020 800", "M 700 520 L 790 540 L 760 600 L 860 640", "M 1180 480 L 1120 560 L 1200 620 L 1150 700"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={colors.bad} strokeWidth={10} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - Math.min(1, (frame - crackAt - i * 3) / 10))} />
          ))}
        </svg>
      )}
      <Flash amount={crack.energy} color={colors.bad} />
    </SceneShell>
  );
};
