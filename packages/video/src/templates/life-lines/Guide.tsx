// One-pager sent in DMs to whoever comments «СЕМЬЯ»: how to make your own sky.
// A single still in the reel's look; the prompt itself goes as the next message.
import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { Grain, Vignette } from "../../components/Layers";
import { defineTemplate } from "../types";
import { Sky } from "./LifeLines";
import { fonts, palette } from "./palette";

const W = 1080;

const STARS: { x: number; y: number; c: string; s: number; label: string; side?: "l" }[] = [
  { x: 180, y: 250, c: palette.grandma, s: 1, label: "Бабушка" },
  { x: 880, y: 200, c: palette.grandpa, s: 1, label: "Дедушка", side: "l" },
  { x: 650, y: 300, c: palette.dog, s: 0.7, label: "Собака" },
  { x: 830, y: 420, c: palette.dad, s: 1, label: "Папа", side: "l" },
  { x: 230, y: 430, c: palette.mom, s: 1, label: "Мама" },
  { x: 540, y: 500, c: palette.me, s: 1.5, label: "Я" },
];
const EDGES: [number, number][] = [[5, 4], [4, 0], [0, 1], [1, 3], [3, 5], [5, 2]];

const Star: React.FC<(typeof STARS)[number]> = ({ x, y, c, s, label, side }) => {
  const r = 40 * s;
  const L = 30 * s;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${c}77, transparent 62%)` }} />
      {[0, 90].map((rot) => (
        <div key={rot} style={{ position: "absolute", left: -L, top: -1.2, width: L * 2, height: 2.4, transform: `rotate(${rot}deg)`, background: `linear-gradient(90deg, transparent, ${c}, #fff, ${c}, transparent)` }} />
      ))}
      <div style={{ position: "absolute", left: -7 * s, top: -7 * s, width: 14 * s, height: 14 * s, borderRadius: "50%", background: `radial-gradient(circle, #fff 0 30%, ${c} 55%)`, boxShadow: `0 0 14px ${c}` }} />
      <div style={{ position: "absolute", top: 0, left: side ? -22 - 12 * s : 22 + 12 * s, transform: `translate(${side ? -100 : 0}%, -50%)`, whiteSpace: "nowrap", fontFamily: fonts.label, fontWeight: 600, fontSize: 28, color: c, textShadow: `0 0 12px ${c}88` }}>
        {label}
      </div>
    </div>
  );
};

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Выпиши своих людей",
    body: "Кто рядом и с какого твоего возраста. Кто ушёл из жизни, станет звездой. Питомцев тоже пиши.",
  },
  {
    title: "Открой claude.ai",
    body: "Вставь промпт из следующего сообщения, а под ним свой список.",
  },
  {
    title: "Смотри своё небо",
    body: "Claude нарисует анимацию прямо в чате. Открой её на весь экран и запиши экран телефона.",
  },
  {
    title: "Выложи рилс",
    body: "Добавь музыку в Instagram и напиши в описании, кто светит в твоём небе.",
  },
];

const EXAMPLE: [string, string, string][] = [
  [palette.me, "Я", "с 0"],
  [palette.mom, "Мама", "с начала"],
  [palette.grandma, "Бабушка", "с начала, звезда в 12"],
  [palette.friend, "Друг детства", "с 7 до 18"],
  [palette.dog, "Собака", "с 9, звезда в 21"],
  [palette.wife, "Жена", "с 24"],
];

export const LifeLinesGuide: React.FC = () => (
  <AbsoluteFill style={{ background: palette.skyBottom }}>
    <Sky />
    <svg width={W} height={1920} style={{ position: "absolute" }}>
      {EDGES.map(([a, b], i) => (
        <line key={i} x1={STARS[a].x} y1={STARS[a].y} x2={STARS[b].x} y2={STARS[b].y} stroke={palette.constellation} strokeWidth={2} />
      ))}
    </svg>
    {STARS.map((s) => (
      <Star key={s.label} {...s} />
    ))}

    <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center" }}>
      <div style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 96, lineHeight: 1.05, color: palette.text, textShadow: "0 0 30px rgba(255,220,150,0.25)" }}>
        Своё небо
      </div>
      <div style={{ marginTop: 14, fontFamily: fonts.label, fontWeight: 500, fontSize: 34, color: palette.textDim }}>
        как сделать такое про свою семью
      </div>
    </div>

    <div style={{ position: "absolute", left: 70, right: 70, top: 800, display: "flex", flexDirection: "column", gap: 30 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 64px", height: 64, borderRadius: 32, border: `2px solid ${palette.now}`, boxShadow: `0 0 18px ${palette.now}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.label, fontWeight: 600, fontSize: 32, color: palette.now }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 38, color: palette.text }}>{s.title}</div>
            <div style={{ marginTop: 6, fontFamily: fonts.label, fontWeight: 500, fontSize: 29, lineHeight: 1.35, color: palette.textDim }}>{s.body}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 70, right: 70, top: 1470, padding: "26px 34px", borderRadius: 28, background: palette.pillBg, border: "1.5px solid rgba(200,212,255,0.18)" }}>
      <div style={{ fontFamily: fonts.label, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: palette.axisText, marginBottom: 14 }}>ПРИМЕР СПИСКА</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", rowGap: 14, columnGap: 20 }}>
        {EXAMPLE.map(([c, who, when]) => (
          <div key={who} style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", fontFamily: fonts.label, fontSize: 27 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: c, boxShadow: `0 0 10px ${c}` }} />
            <span style={{ color: c, fontWeight: 600 }}>{who}</span>
            <span style={{ color: palette.textDim, fontWeight: 500 }}>{when}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 1770, textAlign: "center", fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 500, fontSize: 40, color: palette.textDim }}>
      Сохрани, чтобы не потерять ✦
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);

export const lifeLinesGuide = defineTemplate({
  id: "life-lines-guide",
  name: "Своё небо: памятка",
  description: "One-pager for DMs: how to make your own «sky» reel with Claude, in the life-lines look.",
  schema: z.object({}),
  defaultProps: {},
  durationInSeconds: 1,
  formats: ["reel"],
  component: LifeLinesGuide,
});
