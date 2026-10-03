// The report page (/explorer/:id) as one component, because four beats live
// on it: results arrive, picks are made, round 2 lands, the export is pulled.
// Layout follows the app top to bottom: header card (status, rounds, title,
// parameter chips) → round history → «Блогеры» panel (summary, Excel + Find
// more, tabs) → the card column. All sizes are the app's CSS px.
import React from "react";
import { exPalette } from "../palette";
import { COPY, DemoCreator, Lang } from "../copy";
import { APP, AppHeader, Chip, CreatorCard, ExcelButton, GradButton, Ico, Panel, PlatformGlyph, StatusPill, Verdict } from "../ui";

export type CardState = {
  c: DemoCreator;
  verdict?: Verdict;
  drag?: number;
  press?: "keep" | "reject" | null;
  enter?: number; // 0→1
  scoreIn?: number;
  focus?: "score" | "reason" | null;
  focusAmt?: number;
};

// Fixed layout numbers (UI px) the scenes use to scroll and to aim taps.
export const LAYOUT = {
  header: 56,
  headCard: 186, // status + title + chips
  history: 98,
  gridPanel: 150,
  card: 226,
  gap: 12,
} as const;

/** y (UI px, page coordinates) where card i starts. */
export const cardTop = (i: number, withHistory: boolean) =>
  LAYOUT.header + 12 + LAYOUT.headCard + 12 + (withHistory ? LAYOUT.history + 12 : 0) + LAYOUT.gridPanel + 12 + i * (LAYOUT.card + LAYOUT.gap);

/** y of the Find more / Excel row. */
export const actionsTop = (withHistory: boolean) =>
  LAYOUT.header + 12 + LAYOUT.headCard + 12 + (withHistory ? LAYOUT.history + 12 : 0) + 16 + 44;

export const ReportPage: React.FC<{
  lang: Lang;
  cards: CardState[];
  found: number;
  kept: number;
  rejected: number;
  rounds: number;
  history?: { n: number; plus: number; at?: number }[];
  excelPress?: number;
  morePress?: number;
  activeTab?: number;
}> = ({ lang, cards, found, kept, rejected, rounds, history, excelPress = 0, morePress = 0, activeTab = 0 }) => {
  const copy = COPY[lang];
  const tabCounts = [found, cards.filter((s) => s.c.isNew).length, kept, rejected];
  return (
    <div>
      <AppHeader title={copy.appTitle} />
      {/* header card */}
      <div
        style={{
          margin: "12px 16px 0",
          height: LAYOUT.headCard,
          boxSizing: "border-box",
          padding: 16,
          borderRadius: 24,
          border: `1px solid ${APP.slate200}`,
          background: "linear-gradient(120deg, #F5F3FF 0%, #FFFFFF 60%, #F0F7FF 100%)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <StatusPill label={copy.ready} />
          <Chip icon="history">{copy.rounds(rounds)}</Chip>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 22, fontWeight: 900, color: APP.slate900, letterSpacing: "-0.02em" }}>
          {copy.reportTitle}
          <Ico k="sparkle" size={16} color={APP.violet500} fill />
        </div>
        <div style={{ marginTop: 6, fontSize: 12, lineHeight: "16px", color: APP.slate500, height: 32, overflow: "hidden" }}>{copy.brief}</div>
        <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
          <Chip flag="🇺🇸">{copy.tags[1].label.split(" · ")[1] ?? copy.tags[1].label}</Chip>
          <Chip icon="translate">{copy.language}</Chip>
          <Chip>
            <span style={{ display: "inline-flex", gap: 3 }}>
              {(["instagram", "tiktok", "youtube", "telegram"] as const).map((n) => (
                <PlatformGlyph key={n} p={n} size={14} />
              ))}
            </span>
          </Chip>
        </div>
      </div>

      {history ? (
        <Panel style={{ margin: "12px 16px 0", height: LAYOUT.history, boxSizing: "border-box", padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.16em", color: APP.slate400 }}>
            <Ico k="history" size={11} />
            {copy.roundHistory}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {history.map((h) => (
              <div
                key={h.n}
                style={{
                  flex: 1,
                  border: `1px solid ${APP.slate200}`,
                  borderRadius: 14,
                  padding: "8px 10px",
                  opacity: h.at ?? 1,
                  transform: `translateY(${(1 - (h.at ?? 1)) * 12}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 900, color: APP.slate900 }}>{lang === "ru" ? `Раунд ${h.n}` : `Round ${h.n}`}</span>
                  <StatusPill label={copy.ready} />
                </div>
                <div style={{ marginTop: 2, fontSize: 10.5, color: APP.slate500 }}>{copy.plusBloggers(h.plus)}</div>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {/* «Блогеры» panel */}
      <Panel style={{ margin: "12px 16px 0", height: LAYOUT.gridPanel, boxSizing: "border-box", padding: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: APP.slate900 }}>{copy.bloggers}</span>
          <span style={{ fontSize: 11, color: APP.slate500, whiteSpace: "nowrap" }}>{copy.summary(found, kept, rejected)}</span>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <ExcelButton label={copy.exportBtn} pressed={excelPress} />
          <GradButton label={copy.findMore} pressed={morePress} />
        </div>
        <div style={{ marginTop: 10, display: "inline-flex", gap: 2, padding: 3, borderRadius: 14, background: APP.slate100 }}>
          {copy.tabs.map((tab, i) => (
            <div
              key={tab}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 9px",
                borderRadius: 11,
                background: i === activeTab ? "#fff" : "transparent",
                boxShadow: i === activeTab ? "0 1px 2px rgba(15,23,42,0.08)" : undefined,
                fontSize: 11,
                fontWeight: 700,
                color: i === activeTab ? exPalette.primary : APP.slate700,
                whiteSpace: "nowrap",
              }}
            >
              {tab}
              <span style={{ fontSize: 9.5, padding: "0 5px", borderRadius: 999, background: i === activeTab ? "#EEF0FF" : "#E2E8F0", color: APP.slate500 }}>
                {tabCounts[i]}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* the card column */}
      <div style={{ margin: "12px 16px 0", display: "flex", flexDirection: "column", gap: LAYOUT.gap }}>
        {cards.map((s, i) => {
          const e = s.enter ?? 1;
          return (
            <div
              key={s.c.handle + i}
              style={{
                height: LAYOUT.card,
                opacity: e,
                transform: `translateY(${(1 - e) * 60}px) scale(${0.94 + 0.06 * e})`,
                position: "relative",
                zIndex: s.drag ? 5 : 1,
              }}
            >
              <CreatorCard
                c={s.c}
                lang={copy}
                verdict={s.verdict}
                drag={s.drag}
                press={s.press}
                scoreIn={s.scoreIn}
                focus={s.focus}
                focusAmt={s.focusAmt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
