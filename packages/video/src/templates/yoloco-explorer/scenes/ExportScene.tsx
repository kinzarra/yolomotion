// 06 export — «Выгрузить в Excel», the app steps back and the sheet the
// export produces (explorer_report) rises over it; the Email column fills
// row by row on «почты уже внутри». The clock stops here.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { exColors, exPalette } from "../palette";
import { COPY, Lang } from "../copy";
import { cues } from "../timeline";
import { APP, AppScreen, Ico, SceneShell, Tap, Verdict, ease, scoreTone, springAt } from "../ui";
import { ReportPage, actionsTop } from "./report";
import { FOUND } from "./ResultsScene";

const PICKS: Verdict[] = ["keep", "keep", "reject", "keep"];
const SHEET = { x: 58, y: 420, w: 964, row: 104, head: 74, bar: 76 } as const;
const COLS = [0.32, 0.15, 0.2, 0.33]; // blogger · followers · relevance · email

export const ExportScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "export").map((s) => Math.round(s * fps));
  const tapAt = c[0] + 4;
  const recede = ease(frame, tapAt + 6, tapAt + 18);
  const sheetIn = springAt(frame, fps, tapAt + 8, "smooth");
  const scroll = actionsTop(false) - 150;

  const rows = [...copy.round2, ...copy.creators.filter((_, i) => PICKS[i] === "keep")];
  const cards = [...copy.round2.map((cr) => ({ c: cr })), ...copy.creators.map((cr, i) => ({ c: cr, verdict: PICKS[i] }))];
  const cellX = (i: number) => SHEET.x + COLS.slice(0, i).reduce((a, b) => a + b, 0) * SHEET.w;

  return (
    <SceneShell>
      <AppScreen
        url={copy.url.replace("/new", "/7c1e…")}
        scroll={scroll}
        exit={recede * 0.5}
        dim={recede}
        overlay={<Tap x={90} y={actionsTop(false) + 20 - scroll} at={tapAt} />}
      >
        <ReportPage
          lang={lang}
          cards={cards}
          found={FOUND + 2}
          kept={5}
          rejected={1}
          rounds={2}
          activeTab={2}
          excelPress={frame >= tapAt - 1 && frame < tapAt + 8 ? 1 : 0}
        />
      </AppScreen>

      {/* the exported sheet */}
      <div
        style={{
          position: "absolute",
          left: SHEET.x,
          top: SHEET.y,
          width: SHEET.w,
          borderRadius: 26,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9)",
          opacity: sheetIn,
          transform: `translateY(${interpolate(sheetIn, [0, 1], [300, 0])}px) rotate(${interpolate(sheetIn, [0, 1], [4, -1.2])}deg) scale(${interpolate(sheetIn, [0, 1], [0.85, 1])})`,
          fontFamily: theme.fonts.body,
        }}
      >
        <div style={{ height: SHEET.bar, background: exColors.sheet, display: "flex", alignItems: "center", gap: 16, padding: "0 28px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico k="table" size={28} color={exColors.sheet} stroke={2.4} />
          </div>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{copy.sheetName}</span>
        </div>
        <div style={{ position: "relative", height: SHEET.head, display: "flex", alignItems: "center", background: "#F3F4F6", borderBottom: "1px solid #D1D5DB" }}>
          {copy.cols.map((col, i) => (
            <div
              key={col}
              style={{
                position: "absolute",
                left: cellX(i) - SHEET.x + 24,
                fontSize: 19,
                fontWeight: 800,
                color: i === 3 ? exColors.sheet : "#374151",
                letterSpacing: "0.02em",
              }}
            >
              {col}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          const rowIn = springAt(frame, fps, tapAt + 14 + i * 3, "snappy");
          const mailFrom = c[1] - 2 + i * 5;
          const typed = r.email ? Math.floor(r.email.length * ease(frame, mailFrom, mailFrom + 10, (x) => x)) : 0;
          return (
            <div
              key={r.handle}
              style={{
                position: "relative",
                height: SHEET.row,
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * 40}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 24, display: "flex", alignItems: "center", gap: 14 }}>
                {r.photo ? (
                  <Img src={staticFile(`footage/yoloco-mcp/avatars/${r.photo}.png`)} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                ) : null}
                <span style={{ fontSize: 23, fontWeight: 800, color: APP.slate900 }}>@{r.handle}</span>
              </div>
              <div style={{ position: "absolute", left: cellX(1) - SHEET.x + 24, fontSize: 25, fontWeight: 600, color: "#374151" }}>{r.followers}</div>
              <div style={{ position: "absolute", left: cellX(2) - SHEET.x + 24, fontSize: 25, fontWeight: 900, color: scoreTone(r.score) }}>{r.score}</div>
              <div
                style={{
                  position: "absolute",
                  left: cellX(3) - SHEET.x + 14,
                  right: 12,
                  height: 64,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  background: typed > 0 && typed < (r.email?.length ?? 0) ? exColors.sheetSoft : "transparent",
                  border: typed > 0 && typed < (r.email?.length ?? 0) ? `2px solid ${exColors.sheet}` : "2px solid transparent",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1D4ED8",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {r.email?.slice(0, typed)}
              </div>
            </div>
          );
        })}
      </div>

      {/* the claim on the field: emails are already in */}
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 160,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          borderRadius: 999,
          background: exColors.surfaceStrong,
          border: `1.5px solid ${exColors.lineStrong}`,
          fontFamily: theme.fonts.wide,
          fontWeight: 800,
          fontSize: 30,
          color: exPalette.text,
          opacity: ease(frame, c[1] - 4, c[1] + 6),
          transform: `translateY(${(1 - ease(frame, c[1] - 4, c[1] + 6)) * -20}px)`,
        }}
      >
        <Ico k="mail" size={30} color={exPalette.primary} stroke={2.4} />
        {lang === "ru" ? "EMAIL УЖЕ ВНУТРИ" : "EMAILS INCLUDED"}
      </div>
    </SceneShell>
  );
};
