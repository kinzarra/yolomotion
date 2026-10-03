// 03 results — first the run in flight (ExplorerRunProgress: «Работа AI»,
// the five stages, candidates per network counting up as each network is
// named), then the report: creators arrive as cards, and the camera goes to
// the score ring on «оценка» and underlines the reason on «причина».
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { exPalette } from "../palette";
import { COPY, Lang, Platform } from "../copy";
import { cues } from "../timeline";
import { APP, AppHeader, AppScreen, Ico, Panel, PlatformGlyph, SceneShell, ease, springAt } from "../ui";
import { ReportPage, cardTop } from "./report";

// The funnel of a real run (explorer/results, 2026-09-24): 276 candidates.
const NETS: { p: Platform; name: string; n: number }[] = [
  { p: "instagram", name: "Instagram", n: 112 },
  { p: "tiktok", name: "TikTok", n: 74 },
  { p: "youtube", name: "YouTube", n: 51 },
  { p: "telegram", name: "Telegram", n: 39 },
];
export const FOUND = 33;

export const ResultsScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "results").map((s) => Math.round(s * fps));

  // phase A: progress until "and brings back creators" (page 2)
  const swap = c[2] - 4;
  const toReport = ease(frame, swap, swap + 10);
  // each network counts up from the moment its name is said (pages 0 and 1)
  const netAt = [c[0] + 6, c[0] + 16, c[1] + 2, c[1] + 12];
  const netCount = NETS.map((n, i) => Math.round(n.n * ease(frame, netAt[i], netAt[i] + 16)));
  const total = netCount.reduce((a, b) => a + b, 0);
  const stageDone = Math.floor(interpolate(frame, [4, swap], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const progress = (
    <div style={{ opacity: 1 - toReport }}>
      <AppHeader title={copy.appTitle} />
      <Panel style={{ margin: "12px 16px 0", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 16, background: "linear-gradient(120deg, rgba(139,92,246,0.10), rgba(96,113,255,0.06) 40%, rgba(14,165,233,0.08))" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #8B5CF6, #6071FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 20px -6px ${exPalette.primary}88`,
                }}
              >
                <Ico k="sparkle" size={20} color="#fff" fill />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: APP.slate900 }}>
                  {copy.progressTitle} · {lang === "ru" ? "Раунд 1" : "Round 1"}
                </div>
                <div style={{ fontSize: 11, color: APP.slate500 }}>{copy.progressRunning}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: exPalette.primary, fontVariantNumeric: "tabular-nums" }}>{total}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: APP.slate500, whiteSpace: "nowrap" }}>{copy.usually}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 999, background: APP.slate100, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${8 + 92 * ease(frame, 0, swap, (x) => 1 - Math.pow(1 - x, 2))}%`,
                borderRadius: 999,
                background: "linear-gradient(90deg, #8B5CF6, #6071FF, #0EA5E9)",
              }}
            />
          </div>
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${APP.slate200}` }}>
          {copy.stages.map((s, i) => {
            const done = i < stageDone;
            const now = i === stageDone;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 9, height: 27 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: done ? APP.emerald : now ? exPalette.primary : APP.slate100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {done ? <Ico k="check" size={11} color="#fff" stroke={3.2} /> : now ? <div style={{ width: 6, height: 6, borderRadius: 3, background: "#fff" }} /> : null}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: now ? 800 : 600, color: done || now ? APP.slate900 : APP.slate400 }}>{s}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${APP.slate200}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: APP.slate500 }}>
            <span>{copy.foundTitle}</span>
            <span style={{ color: APP.slate900, fontVariantNumeric: "tabular-nums" }}>{total}</span>
          </div>
          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {NETS.map((n, i) => {
              const p = springAt(frame, fps, netAt[i] - 4, "bouncy");
              return (
                <div
                  key={n.p}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 16,
                    border: `1px solid ${p > 0.5 ? "#C7CCFF" : APP.slate200}`,
                    background: "#fff",
                    transform: `scale(${0.92 + 0.08 * p})`,
                  }}
                >
                  <PlatformGlyph p={n.p} size={28} />
                  <div style={{ lineHeight: 1.15 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: APP.slate500 }}>{n.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: APP.slate900, fontVariantNumeric: "tabular-nums" }}>{netCount[i]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    </div>
  );

  // phase B: the report. Scroll so the «Блогеры» panel + first card fill the view.
  const scrollTo = cardTop(0, false) - 175;
  const scroll = toReport * scrollTo + ease(frame, swap + 30, c[4] - 6) * 60;
  const scoreFocus = ease(frame, c[4] - 4, c[4] + 10);
  const reasonFocus = ease(frame, c[5] - 2, c[5] + 18);
  const zoom = 1 + 0.28 * scoreFocus * (1 - reasonFocus) + 0.07 * reasonFocus;
  const y0 = cardTop(0, false) - scroll;
  const focusPt = {
    x: interpolate(reasonFocus, [0, 1], [330, 215]),
    y: interpolate(reasonFocus, [0, 1], [y0 + 36, y0 + 92]),
  };

  const cards = copy.creators.map((cr, i) => ({
    c: cr,
    enter: springAt(frame, fps, swap + 8 + i * 5, "smooth"),
    scoreIn: ease(frame, swap + 12 + i * 5, swap + 34 + i * 5),
    focus: i === 0 ? (reasonFocus > 0.01 ? ("reason" as const) : ("score" as const)) : null,
    focusAmt: i === 0 ? (reasonFocus > 0.01 ? reasonFocus : scoreFocus) : 0,
  }));

  return (
    <SceneShell>
      <AppScreen url={copy.url.replace("/new", "/7c1e…")} scroll={toReport > 0 ? scroll : 0} zoom={zoom} focus={focusPt}>
        {toReport < 1 ? <div style={{ position: "absolute", left: 0, top: 0, width: 430, zIndex: 2 }}>{progress}</div> : null}
        <div style={{ opacity: toReport }}>
          <ReportPage lang={lang} cards={cards} found={FOUND} kept={0} rejected={0} rounds={1} />
        </div>
      </AppScreen>
    </SceneShell>
  );
};
