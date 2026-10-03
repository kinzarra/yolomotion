// 05 more — the killer feature. «Найти ещё» opens the refine dialog
// (ExplorerRefineDialog: «AI учтёт ваш выбор: ✓ 3 оставленных, ✕ 1
// вычеркнутых. Уже показанные (33) не повторятся.»), «Да, найти», and round 2
// lands on top of the column: NEW badges, «раунд 2», higher scores.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { exPalette } from "../palette";
import { COPY, Lang } from "../copy";
import { cues } from "../timeline";
import { APP, AppScreen, GradButton, Ico, SceneShell, Tap, UI_VIEW_H, Verdict, ease, springAt } from "../ui";
import { CardState, ReportPage, actionsTop, cardTop } from "./report";
import { FOUND } from "./ResultsScene";

const PICKS: Verdict[] = ["keep", "keep", "reject", "keep"];

export const MoreScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "more").map((s) => Math.round(s * fps));
  const kept = PICKS.filter((v) => v === "keep").length;
  const rejected = PICKS.filter((v) => v === "reject").length;

  const moreTap = c[0] + 8;
  const dlgIn = springAt(frame, fps, moreTap + 4, "snappy");
  const yesTap = c[1] + 12;
  const dlgOut = ease(frame, yesTap + 4, yesTap + 10, theme.ease.in);
  const dlg = dlgIn * (1 - dlgOut);
  const landAt = yesTap + 12;
  const landed = frame >= landAt;

  // scroll: from the last picked card up to the actions row, then down to the new cards
  const fromScroll = cardTop(3, false) + 113 - UI_VIEW_H / 2;
  const topScroll = actionsTop(false) - 150;
  const newScroll = cardTop(0, false) - 150;
  const s1 = ease(frame, 0, 12, theme.ease.inOut);
  const s2 = ease(frame, landAt, landAt + 14, theme.ease.inOut);
  const scroll = fromScroll + (topScroll - fromScroll) * s1 + (newScroll - topScroll) * s2;

  const fresh: CardState[] = landed
    ? copy.round2.map((cr, i) => ({
        c: cr,
        enter: springAt(frame, fps, landAt + 4 + i * 6, "bouncy"),
        scoreIn: ease(frame, landAt + 8 + i * 6, landAt + 30 + i * 6),
      }))
    : [];
  const cards: CardState[] = [...fresh, ...copy.creators.map((cr, i) => ({ c: cr, verdict: PICKS[i] }))];

  // Find more button centre, viewport UI px
  const moreBtn = { x: 290, y: actionsTop(false) + 20 - scroll };

  const dialog =
    dlg > 0.001 ? (
      <>
        <div style={{ position: "absolute", left: 0, top: 0, width: 430, height: UI_VIEW_H, background: `rgba(15,23,42,${0.45 * dlg})` }} />
        <div
          style={{
            position: "absolute",
            left: 18,
            width: 394,
            top: 70,
            boxSizing: "border-box",
            borderRadius: 24,
            background: "#fff",
            padding: 18,
            fontFamily: theme.fonts.body,
            opacity: dlg,
            transform: `translateY(${(1 - dlg) * 40}px) scale(${0.94 + 0.06 * dlg})`,
            boxShadow: "0 30px 60px -20px rgba(15,23,42,0.5)",
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 900, color: APP.slate900 }}>{copy.refineTitle}</div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              borderRadius: 16,
              border: `1px solid ${APP.violet200}`,
              background: APP.violet50,
              padding: 12,
              fontSize: 13,
              lineHeight: "20px",
              color: "#4C1D95",
            }}
          >
            <Ico k="sparkle" size={18} color={APP.violet500} fill />
            <div>
              <b>{copy.refineSummary(kept, rejected)}</b> {copy.refineNoRepeat(FOUND)}
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: APP.slate500 }}>
            {lang === "ru" ? "ЧТО ЕЩЁ УЧЕСТЬ" : "ANYTHING ELSE"}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 56,
              borderRadius: 16,
              border: `1px solid ${APP.slate200}`,
              padding: "8px 12px",
              fontSize: 12.5,
              color: APP.slate400,
            }}
          >
            {lang === "ru" ? "Например: больше микро-блогеров, без магазинов" : "For example: more micro-bloggers, no shops"}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <div
              style={{
                height: 40,
                padding: "0 18px",
                borderRadius: 16,
                border: `1px solid ${APP.slate200}`,
                display: "flex",
                alignItems: "center",
                fontSize: 13.5,
                fontWeight: 800,
                color: APP.slate700,
              }}
            >
              {lang === "ru" ? "Отмена" : "Cancel"}
            </div>
            <GradButton label={copy.refineYes} cost="10" pressed={frame >= yesTap && frame < yesTap + 5 ? 1 : 0} style={{ borderRadius: 16 }} />
          </div>
        </div>
        <Tap x={300} y={70 + 268} at={yesTap} />
      </>
    ) : null;

  return (
    <SceneShell>
      <AppScreen
        url={copy.url.replace("/new", "/7c1e…")}
        scroll={scroll}
        overlay={
          <>
            {frame < moreTap + 6 ? <Tap x={moreBtn.x} y={moreBtn.y} at={moreTap} /> : null}
            {dialog}
          </>
        }
      >
        <ReportPage
          lang={lang}
          cards={cards}
          found={FOUND + (landed ? 2 : 0)}
          kept={kept}
          rejected={rejected}
          rounds={landed ? 2 : 1}
          morePress={frame >= moreTap - 1 && frame < moreTap + 5 ? 1 : 0}
          activeTab={0}
        />
      </AppScreen>
      {/* the beat's claim, on the field above the app */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 160,
          paddingLeft: 46,
          display: "flex",
          justifyContent: "flex-start",
          opacity: ease(frame, landAt, landAt + 8),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 999,
            background: exPalette.primary,
            boxShadow: `0 20px 50px -14px ${exPalette.glow}`,
            fontFamily: theme.fonts.wide,
            fontWeight: 800,
            fontSize: 30,
            color: "#fff",
            transformOrigin: "0 50%",
            transform: `scale(${0.8 + 0.2 * springAt(frame, fps, landAt, "bouncy")})`,
          }}
        >
          <Ico k="sparkle" size={30} color="#fff" fill />
          {lang === "ru" ? "РАУНД 2 · ТОЧНЕЕ" : "ROUND 2 · SHARPER"}
        </div>
      </div>
    </SceneShell>
  );
};
