// Illustrations for the VC article (author 2026-11-01: «нужен визуал для
// статей»). One picture per section of vc-article.md, in the video's look:
// dark ground, lime for the current number, red for the cost. Each one reads
// on its own, without the article around it, and names its source.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { theme } from "../../theme";
import { defineTemplate } from "../types";
import { devMythColors as colors, devMythPalette as palette } from "./palette";
import { Sym } from "./sym";

const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;
const MONO = theme.fonts.mono;
const I = "images/dev-myth/";

export const ART = ["salary", "solved", "before", "survey", "ten", "quote"] as const;
export const artSchema = z.object({ art: z.enum(ART) });
type Art = (typeof ART)[number];

const Frame: React.FC<{ title: React.ReactNode; source?: string; children: React.ReactNode }> = ({ title, source, children }) => (
  <AbsoluteFill style={{ background: palette.bg, color: palette.text }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${colors.line} 1.4px, transparent 1.8px)`, backgroundSize: "40px 40px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 0%, ${palette.primary}1C 0%, transparent 50%)` }} />
    <div style={{ position: "absolute", left: 100, right: 100, top: 80, fontFamily: WIDE, fontWeight: 900, fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.02em" }}>{title}</div>
    <div style={{ position: "absolute", left: 100, right: 100, top: 300, bottom: 140 }}>{children}</div>
    <div style={{ position: "absolute", left: 100, right: 100, bottom: 56, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: palette.textDim }}>
      <span>{source ?? ""}</span>
      <span style={{ color: palette.text }}>ДЕНЬГИ · ПРОСТО</span>
    </div>
  </AbsoluteFill>
);

const Hi: React.FC<{ children: React.ReactNode; bad?: boolean }> = ({ children, bad }) => (
  <span style={{ display: "inline-block", padding: "0 16px", background: bad ? colors.bad : palette.primary, color: bad ? colors.white : colors.ink2, transform: "rotate(-1.5deg)" }}>{children}</span>
);

const Salary = () => {
  const rows = [
    { label: "СРЕДНЯЯ ЗАРПЛАТА В РОССИИ", sub: "Росстат, апрель 2026", v: "109 000 ₽", w: 109 / 254, c: palette.textDim },
    { label: "BACKEND-РАЗРАБОТЧИК, МЕДИАНА", sub: "Хабр Карьера, 1-е полугодие 2026", v: "254 000 ₽", w: 1, c: colors.bad },
    { label: "ПОДПИСКА CLAUDE MAX", sub: "claude.com/pricing", v: "100 $", w: 0.035, c: palette.primary },
  ];
  return (
    <Frame title={<>СКОЛЬКО СТОИТ <Hi bad>ПРОГРАММИСТ</Hi></>} source="Росстат · Хабр Карьера · claude.com/pricing">
      <div style={{ display: "flex", flexDirection: "column", gap: 80, marginTop: 20 }}>
        {rows.map((r) => (
          <div key={r.label}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em" }}>
              <span>{r.label}</span><span style={{ color: palette.textDim, fontWeight: 600, letterSpacing: 0, fontSize: 24 }}>{r.sub}</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: Math.max(26, 1180 * r.w), height: 64, background: r.c, borderRadius: 8, boxShadow: r.c === palette.textDim ? undefined : `0 0 40px ${r.c}66` }} />
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64, color: r.c === palette.textDim ? palette.text : r.c, whiteSpace: "nowrap" }}>{r.v}</div>
              {r.w === 1 && <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, padding: "6px 14px", border: `3px solid ${colors.bad}`, color: colors.bad }}>×2,3</div>}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

const Solved = () => {
  const items: [string, string][] = [
    ["si-github.svg", "ВХОД И РЕГИСТРАЦИЯ"], ["si-stripe.svg", "ПЛАТЕЖИ"], ["si-postgresql.svg", "БАЗА ДАННЫХ"], ["si-react.svg", "ИНТЕРФЕЙС"],
    ["si-postman.svg", "API"], ["si-googlemaps.svg", "КАРТЫ"], ["si-telegram.svg", "УВЕДОМЛЕНИЯ"], ["si-stackoverflow.svg", "ОТВЕТЫ НА ОШИБКИ"],
  ];
  return (
    <Frame title={<>БОЛЬШИНСТВО ЗАДАЧ <Hi>УЖЕ КТО-ТО РЕШАЛ</Hi></>} source="Готовые библиотеки, сервисы и чужой опыт">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginTop: 10 }}>
        {items.map(([logo, label]) => (
          <div key={label} style={{ height: 270, borderRadius: 24, background: colors.surfaceStrong, border: `2px solid ${colors.line}`, padding: "30px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Img src={staticFile(I + "logos/" + logo)} style={{ width: 84, height: 84, filter: "brightness(0) invert(1)" }} />
            <div>
              <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 30, lineHeight: 1.1 }}>{label}</div>
              <div style={{ marginTop: 12, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: palette.primary, display: "flex", alignItems: "center", gap: 8 }}><Sym c="✓" />ГОТОВОЕ РЕШЕНИЕ</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

const Chip: React.FC<{ children: React.ReactNode; hot?: boolean }> = ({ children, hot }) => (
  <div style={{ padding: "18px 22px", borderRadius: 16, background: hot ? palette.primary : colors.surfaceStrong, color: hot ? colors.ink2 : palette.text, border: `2px solid ${hot ? palette.primary : colors.lineStrong}`, fontFamily: MONO, fontWeight: 800, fontSize: 29, whiteSpace: "nowrap", boxShadow: hot ? `0 0 40px ${palette.glow}` : undefined }}>{children}</div>
);
const Arrow = () => <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: palette.textDim }}>›</div>;

const Before = () => {
  const old = ["ИДЕЯ", "РАЗРАБОТЧИК", "ОПЛАТА", "ТЗ", "ОЦЕНКА", "КОД И ТЕСТЫ", "РЕЗУЛЬТАТ"];
  return (
    <Frame title={<>КАК БЫЛО <span style={{ color: palette.textDim }}>И</span> <Hi>КАК СТАЛО</Hi></>} source="Claude Code · Codex">
      <div style={{ display: "flex", flexDirection: "column", gap: 90, marginTop: 30 }}>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: palette.textDim, marginBottom: 20 }}>РАНЬШЕ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "nowrap" }}>
            {old.map((s, i) => <React.Fragment key={s}>{i > 0 && <Arrow />}<Chip>{s}</Chip></React.Fragment>)}
          </div>
          <div style={{ marginTop: 22, display: "inline-block", padding: "8px 18px", background: colors.bad, color: colors.white, fontFamily: WIDE, fontWeight: 900, fontSize: 48 }}>НЕДЕЛИ И МЕСЯЦЫ</div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: palette.textDim, marginBottom: 20 }}>СЕЙЧАС</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Chip>ИДЕЯ</Chip><Arrow /><Chip hot>«СОЗДАЙ ПРИЛОЖЕНИЕ С РЕГИСТРАЦИЕЙ, БАЗОЙ И ОПЛАТОЙ»</Chip><Arrow /><Chip>РЕЗУЛЬТАТ</Chip>
          </div>
          <div style={{ marginTop: 22, display: "inline-block", padding: "8px 18px", background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 48 }}>ЧАСЫ</div>
        </div>
      </div>
    </Frame>
  );
};

const Survey = () => {
  const stats = [
    { v: 90, label: "пользуются ИИ-агентами каждую неделю" },
    { v: 68, label: "пользуются каждый день" },
    { v: 22, label: "получают от агентов больше 80% кода" },
  ];
  return (
    <Frame title={<>ДАЖЕ РАЗРАБОТЧИКИ <Hi>НЕ ПИШУТ КОД САМИ</Hi></>} source="JetBrains, опрос 15 000+ разработчиков, 2026">
      <div style={{ display: "flex", gap: 40, marginTop: 10 }}>
        {stats.map((s, i) => (
          <div key={s.v} style={{ flex: 1, height: 520, borderRadius: 28, background: colors.surfaceStrong, border: `2px solid ${i === 0 ? palette.primary : colors.line}`, boxShadow: i === 0 ? `0 0 60px ${palette.glow}` : undefined, padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 150, lineHeight: 1, color: i === 0 ? palette.primary : palette.text }}>{s.v}%</div>
            <div>
              <div style={{ height: 18, borderRadius: 9, background: colors.line, overflow: "hidden" }}><div style={{ width: `${s.v}%`, height: "100%", background: i === 0 ? palette.primary : palette.text }} /></div>
              <div style={{ marginTop: 26, fontFamily: MONO, fontWeight: 700, fontSize: 30, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 0, top: -250, width: 300, padding: "18px 24px", borderRadius: 18, background: "rgba(242,245,238,0.96)" }}>
        <Img src={staticFile(I + "logos/jetbrains.png")} style={{ width: "100%", display: "block" }} />
      </div>
    </Frame>
  );
};

const Person: React.FC<{ on: boolean }> = ({ on }) => (
  <svg viewBox="0 0 100 140" width={130} height={182} style={{ overflow: "visible" }}>
    <circle cx={50} cy={34} r={26} fill={on ? palette.primary : "none"} stroke={on ? palette.primary : colors.lineStrong} strokeWidth={5} />
    <path d="M8 136c0-34 18-56 42-56s42 22 42 56z" fill={on ? palette.primary : "none"} stroke={on ? palette.primary : colors.lineStrong} strokeWidth={5} />
    {!on && <path d="M10 20L90 130" stroke={colors.bad} strokeWidth={7} strokeLinecap="round" />}
  </svg>
);

const Ten = () => (
  <Frame title={<>БЫЛО 10 ПРОГРАММИСТОВ. <Hi>СТАЛО 3</Hi></>} source="Условный пример · вакансии: SuperJob, 1-е полугодие 2026">
    <div style={{ display: "flex", gap: 60, alignItems: "center", marginTop: 30 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 130px)", gap: "40px 30px" }}>
        {Array.from({ length: 10 }, (_, i) => <Person key={i} on={i < 3} />)}
      </div>
      <div style={{ flex: 1, borderRadius: 28, background: colors.surfaceStrong, border: `2px solid ${colors.bad}`, padding: "44px 44px", boxShadow: `0 0 50px ${colors.badGlow}` }}>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 130, lineHeight: 1, color: colors.bad }}>−21%</div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontWeight: 700, fontSize: 30, lineHeight: 1.3 }}>IT-вакансий за год</div>
        <div style={{ marginTop: 30, fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: 1.35, color: palette.textDim }}>Чтобы сломать рынок, ИИ не нужно заменять всех</div>
      </div>
    </div>
  </Frame>
);

const Quote = () => (
  <AbsoluteFill style={{ background: palette.bg }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${colors.line} 1.4px, transparent 1.8px)`, backgroundSize: "40px 40px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 78% 70%, ${palette.primary}33 0%, transparent 55%)` }} />
    <Img src={staticFile(I + "face-smirk.png")} style={{ position: "absolute", right: -170, bottom: -40, height: 980, filter: `drop-shadow(0 0 60px ${palette.glow})` }} />
    <div style={{ position: "absolute", left: 100, top: 150, width: 1080 }}>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 200, lineHeight: 0.6, color: palette.primary }}>«</div>
      <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 80, lineHeight: 1.05, letterSpacing: "-0.02em", color: palette.text, whiteSpace: "nowrap" }}>ПИСАТЬ КОД<br />БОЛЬШЕ НЕ НУЖНО.</div>
      {["НУЖНО СОЗДАВАТЬ", "ПРОДУКТЫ"].map((t, i) => (
        <div key={t} style={{ marginTop: i ? 10 : 30, display: "table", padding: "6px 20px", background: palette.primary, color: colors.ink2, fontFamily: WIDE, fontWeight: 900, fontSize: 72, lineHeight: 1.05, whiteSpace: "nowrap", transform: "rotate(-1.5deg)" }}>{t}</div>
      ))}
      <div style={{ marginTop: 60, fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: "0.1em", color: palette.textDim }}>20 ЛЕТ В IT · ДЕНЬГИ · ПРОСТО</div>
    </div>
  </AbsoluteFill>
);

const VIEWS: Record<Art, React.FC> = { salary: Salary, solved: Solved, before: Before, survey: Survey, ten: Ten, quote: Quote };

export const ArticleArt: React.FC<{ art: Art }> = ({ art }) => {
  const V = VIEWS[art];
  return <V />;
};

export const devMythArticle = ART.map((art) =>
  defineTemplate({
    id: `dev-myth-art-${art}`,
    name: `Как разработчики обманывали нас · картинка статьи ${art}`,
    description: "An illustration for the VC article about dev-myth.",
    schema: artSchema,
    defaultProps: { art },
    durationInSeconds: 1,
    formats: ["landscape"],
    component: ArticleArt,
  }),
);
