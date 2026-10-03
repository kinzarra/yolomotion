// Yoloco Explorer kit. The reel shows the REAL product, so the app is drawn
// here to its own markup: yoloapp/frontend src/features/explorer
// (ExplorerBloggerCard, ExplorerRunProgress, create/Step1Brief + Step2Refine,
// ExplorerRefineDialog). Sizes are the app's CSS px (mobile layout, 430 wide)
// and the whole UI is scaled up by AppScreen, so a card here reads exactly
// like a card on a phone. The app's own colours (emerald "kept", rose
// "rejected", the score tones) are kept as the app paints them: the brief was
// "the user must see the real interface".
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { exColors, exPalette } from "./palette";
import { DemoCreator, Platform } from "./copy";

export * from "../yoloco-mcp/ui";

/* ------------------------------------------------------------- helpers */

export const ease = (frame: number, from: number, to: number, easing = theme.ease.out) =>
  interpolate(frame, [from, to], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const springAt = (frame: number, fps: number, at: number, cfg: keyof typeof theme.spring = "smooth") =>
  spring({ frame: frame - at, fps, config: theme.spring[cfg] });

/** The app's own colours, outside the reel palette on purpose (see header). */
export const APP = {
  emerald: "#10B981",
  emeraldText: "#059669",
  emeraldSoft: "rgba(16, 185, 129, 0.10)",
  rose: "#F43F5E",
  roseSoft: "rgba(244, 63, 94, 0.08)",
  lime: "#84CC16",
  yellow: "#EAB308",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate700: "#334155",
  slate900: "#0F172A",
  violet50: "#F5F3FF",
  violet200: "#DDD6FE",
  violet500: "#8B5CF6",
  violet800: "#5B21B6",
  sky500: "#0EA5E9",
  gradient: "linear-gradient(90deg, #8B5CF6 0%, #6071FF 50%, #3B82F6 100%)",
} as const;

// ExplorerScore: scoreTone() in explorerGridState.ts.
export const scoreTone = (s: number) => (s >= 85 ? APP.emerald : s >= 70 ? APP.lime : s >= 50 ? APP.yellow : APP.slate400);

const UI_FONT = theme.fonts.body;

/* --------------------------------------------------------------- icons */

export type IconKey =
  | "sparkle"
  | "check"
  | "close"
  | "group"
  | "translate"
  | "tag"
  | "mail"
  | "person"
  | "female"
  | "male"
  | "table"
  | "history"
  | "bolt"
  | "back"
  | "tune"
  | "search"
  | "globe";

const PATHS: Record<IconKey, string> = {
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  group: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 010 6.4M18 14.8c1.9.8 3.1 2.6 3.5 5.2",
  translate: "M4 5h9M8.5 3v2M6 5c.8 3.6 3 6.4 6 8M11 5c-.8 3.6-3 6.4-6 8M13 21l4-10 4 10M14.5 17.5h5",
  tag: "M3 12V4h8l10 10-8 8zM7.5 7.5h.01",
  mail: "M3.5 6h17v12h-17zM3.5 6l8.5 7 8.5-7",
  person: "M12 11a4 4 0 100-8 4 4 0 000 8zM4.5 21c.8-4 3.7-6.5 7.5-6.5s6.7 2.5 7.5 6.5",
  female: "M12 13a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 13v8M9 18h6",
  male: "M10 20a5 5 0 100-10 5 5 0 000 10zM13.5 10.5L20 4M15 4h5v5",
  table: "M4 4h16v16H4zM4 9.5h16M4 15h16M10 4v16",
  history: "M4 12a8 8 0 102.3-5.7M4 4v4.5h4.5M12 8v4.5l3 2",
  bolt: "M13 2L4.5 13.5H11L10 22l8.5-11.5H12z",
  back: "M19 12H5M11 6l-6 6 6 6",
  tune: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4.5v5M8 14.5v5",
  search: "M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM20 20l-4.8-4.8",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z",
};

export const Ico: React.FC<{ k: IconKey; size?: number; color?: string; stroke?: number; fill?: boolean }> = ({
  k,
  size = 14,
  color = APP.slate400,
  stroke = 2,
  fill = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
    <path
      d={PATHS[k]}
      fill={fill ? color : "none"}
      stroke={fill ? "none" : color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------------------------------------------------- platform badges */

const PLATFORM_BG: Record<Platform, string> = {
  instagram: "linear-gradient(135deg, #F58529, #DD2A7B 55%, #8134AF)",
  tiktok: "#111111",
  youtube: "#FF0000",
  telegram: "#229ED9",
};

export const PlatformGlyph: React.FC<{ p: Platform; size: number }> = ({ p, size }) => {
  const s = size * 0.62;
  const w = "#FFFFFF";
  const glyph =
    p === "youtube" ? (
      <path d="M9 7.5v9l7.5-4.5z" fill={w} />
    ) : p === "instagram" ? (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke={w} strokeWidth="2.2" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke={w} strokeWidth="2.2" />
        <circle cx="16.6" cy="7.4" r="1.2" fill={w} />
      </>
    ) : p === "tiktok" ? (
      <path d="M13.5 4v10.2a3.3 3.3 0 11-3.3-3.3M13.5 4c.4 2.4 2 4 4.5 4.2" fill="none" stroke={w} strokeWidth="2.3" strokeLinecap="round" />
    ) : (
      <path d="M4 11.5l15-6-2.6 13-4.4-3.6-2.4 2.3.3-3.6 6.2-5.7-7.7 4.8z" fill={w} />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: PLATFORM_BG[p],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={s} height={s} viewBox="0 0 24 24">
        {glyph}
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------- avatar */

// ExplorerAvatar: photo (or the letter fallback on a colour), ring-2 white,
// the platform badge in the bottom-right corner.
export const CreatorAvatar: React.FC<{ c: Pick<DemoCreator, "photo" | "handle" | "platform" | "letterColor">; size?: number }> = ({
  c,
  size = 48,
}) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    {c.photo ? (
      <Img
        src={staticFile(`footage/yoloco-mcp/avatars/${c.photo}.png`)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block", boxShadow: "0 0 0 2px #fff" }}
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: c.letterColor ?? exPalette.primary,
          color: "#fff",
          fontFamily: UI_FONT,
          fontWeight: 900,
          fontSize: size * 0.36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 2px #fff",
        }}
      >
        {c.handle.slice(0, 1).toUpperCase()}
      </div>
    )}
    <div style={{ position: "absolute", right: -3, bottom: -3, borderRadius: size * 0.12, boxShadow: "0 0 0 2px #fff" }}>
      <PlatformGlyph p={c.platform} size={size * 0.36} />
    </div>
  </div>
);

/* --------------------------------------------------------------- score */

/** ExplorerScore: 40px ring, 3.5 stroke, tone by score, the number in the middle. */
export const ScoreRing: React.FC<{ score: number; progress?: number; size?: number }> = ({ score, progress = 1, size = 40 }) => {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  const shown = Math.round(score * progress);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={APP.slate100} strokeWidth={3.5} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={scoreTone(score)}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={`${(shown / 100) * c} ${c}`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: UI_FONT,
          fontWeight: 900,
          fontSize: size * 0.33,
          color: scoreTone(score),
        }}
      >
        {shown}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- chips */

export const Chip: React.FC<{
  icon?: IconKey;
  flag?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  size?: number;
}> = ({ icon, flag, children, style, size = 11 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: size * 2.3,
      padding: `0 ${size * 0.8}px`,
      borderRadius: 999,
      border: `1px solid ${APP.slate200}`,
      background: "#fff",
      fontFamily: UI_FONT,
      fontSize: size,
      fontWeight: 700,
      color: APP.slate700,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {flag ? <span style={{ fontSize: size * 1.05 }}>{flag}</span> : icon ? <Ico k={icon} size={size * 1.2} /> : null}
    {children}
  </div>
);

/* -------------------------------------------------------- creator card */

export type Verdict = "none" | "keep" | "reject";

/**
 * ExplorerBloggerCard, mobile: rounded-[20px], p-3.5, avatar 48, @handle
 * font-black 14, name 12 slate-500, followers + NEW + "round N", score ring
 * top-right, reason 14/20 two lines, bio 12 one line, meta chips, then the
 * two outline buttons. `drag` is the swipe offset in px, as the app applies
 * it (translateX + rotate(dragX / 24)), with the stamp it shows past 24px.
 */
export const CreatorCard: React.FC<{
  c: DemoCreator;
  lang: { keep: string; reject: string; newBadge: string; round: (n: number) => string; language: string; country: string; more: string };
  verdict?: Verdict;
  drag?: number;
  press?: "keep" | "reject" | null;
  scoreIn?: number;
  width?: number;
  focus?: "score" | "reason" | null;
  focusAmt?: number;
}> = ({ c, lang, verdict = "none", drag = 0, press = null, scoreIn = 1, width = 398, focus = null, focusAmt = 0 }) => {
  const kept = verdict === "keep";
  const rejected = verdict === "reject";
  const keepStamp = Math.min(1, Math.max(0, (drag - 24) / 40));
  const rejectStamp = Math.min(1, Math.max(0, (-drag - 24) / 40));
  const btn = (kind: "keep" | "reject") => {
    const active = press === kind;
    const tone = kind === "keep" ? APP.emerald : APP.rose;
    return (
      <div
        style={{
          flex: 1,
          height: 34,
          borderRadius: 999,
          border: `1px solid ${active ? tone : APP.slate200}`,
          background: active ? (kind === "keep" ? APP.emeraldSoft : APP.roseSoft) : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontFamily: UI_FONT,
          fontSize: 12.5,
          fontWeight: 700,
          color: active ? tone : APP.slate700,
          transform: active ? "scale(0.96)" : undefined,
        }}
      >
        <Ico k={kind === "keep" ? "check" : "close"} size={13} color={active ? tone : APP.slate700} stroke={2.4} />
        {kind === "keep" ? lang.keep : lang.reject}
      </div>
    );
  };
  return (
    <div
      style={{
        position: "relative",
        width,
        borderRadius: 20,
        padding: 14,
        background: kept ? "#F3FCF8" : rejected ? "#FFF8F9" : "#fff",
        border: `1px solid ${kept ? "#34D399" : rejected ? "#FECDD3" : APP.slate200}`,
        boxShadow: kept
          ? "0 0 0 2px rgba(52, 211, 153, 0.25), 0 1px 2px rgba(15, 23, 42, 0.05)"
          : drag !== 0
            ? "0 18px 40px -12px rgba(15, 23, 42, 0.28)"
            : "0 1px 2px rgba(15, 23, 42, 0.05)",
        opacity: rejected ? 0.6 : 1,
        transform: `translateX(${drag}px) rotate(${drag / 24}deg)`,
        fontFamily: UI_FONT,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <CreatorAvatar c={c} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: APP.slate900,
              textDecoration: rejected ? "line-through" : undefined,
              whiteSpace: "nowrap",
            }}
          >
            @{c.handle}
          </div>
          <div style={{ fontSize: 12, color: APP.slate500, textDecoration: rejected ? "line-through" : undefined, whiteSpace: "nowrap" }}>
            {c.name}
          </div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontSize: 12, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: "#1E293B" }}>
              <Ico k="group" size={14} />
              {c.followers}
            </span>
            {c.isNew ? (
              <span
                style={{
                  borderRadius: 999,
                  background: APP.violet500,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  padding: "2px 6px",
                }}
              >
                {lang.newBadge}
              </span>
            ) : null}
            <span style={{ fontSize: 10, color: APP.slate400 }}>{lang.round(c.round)}</span>
          </div>
        </div>
        <div
          style={{
            borderRadius: "50%",
            boxShadow: focus === "score" ? `0 0 0 ${6 * focusAmt}px ${exPalette.primary}33, 0 0 0 ${2.5 * focusAmt}px ${exPalette.primary}` : undefined,
          }}
        >
          <ScoreRing score={c.score} progress={scoreIn} />
        </div>
      </div>
      <div style={{ marginTop: 10, position: "relative" }}>
        <div
          style={{
            fontSize: 14,
            lineHeight: "20px",
            height: 40,
            overflow: "hidden",
            color: APP.slate700,
            backgroundImage: focus === "reason" ? `linear-gradient(transparent 58%, ${exPalette.primary}38 58%)` : undefined,
            backgroundSize: `${focusAmt * 100}% 100%`,
            backgroundRepeat: "no-repeat",
          }}
        >
          {c.reason}
        </div>
        <div style={{ marginTop: 4, fontSize: 12, lineHeight: "16px", height: 16, overflow: "hidden", color: APP.slate400, display: "flex" }}>
          <span style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{c.bio}</span>
          <span style={{ fontWeight: 700, color: exPalette.primary, marginLeft: 6 }}>{lang.more}</span>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "flex", flexWrap: "nowrap", gap: 5, overflow: "hidden" }}>
        <Chip icon={c.gender.startsWith("M") || c.gender.startsWith("Муж") ? "male" : c.gender.startsWith("F") || c.gender.startsWith("Жен") ? "female" : "person"}>
          {c.gender}
        </Chip>
        <Chip flag="🇺🇸">{lang.country}</Chip>
        <Chip icon="translate">{lang.language}</Chip>
        {c.email ? <Chip icon="mail">Email</Chip> : null}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        {btn("keep")}
        {btn("reject")}
      </div>
      {/* the swipe stamps, as the app draws them past 24px of drag */}
      {keepStamp > 0 ? <Stamp kind="keep" amt={keepStamp} label={lang.keep} /> : null}
      {rejectStamp > 0 ? <Stamp kind="reject" amt={rejectStamp} label={lang.reject} /> : null}
    </div>
  );
};

const Stamp: React.FC<{ kind: "keep" | "reject"; amt: number; label: string }> = ({ kind, amt, label }) => {
  const tone = kind === "keep" ? APP.emerald : APP.rose;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: kind === "keep" ? "rgba(16,185,129,0.10)" : "rgba(244,63,94,0.10)",
        opacity: amt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          transform: `rotate(${kind === "keep" ? -6 : 6}deg) scale(${0.8 + amt * 0.2})`,
          borderRadius: 16,
          border: `2px solid ${tone}`,
          background: "rgba(255,255,255,0.95)",
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: kind === "keep" ? APP.emeraldText : "#E11D48",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.12)",
        }}
      >
        {kind === "keep" ? "✓" : "✕"} {label}
      </span>
    </div>
  );
};

/* ---------------------------------------------------------- app chrome */

/** The app header on a phone: the violet dot, the section title, the coins pill. */
export const AppHeader: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      height: 56,
      background: "#fff",
      borderBottom: `1px solid ${APP.slate200}`,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 10,
      fontFamily: UI_FONT,
    }}
  >
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: exPalette.primary, boxShadow: `0 4px 12px ${exPalette.primary}55` }} />
    <div style={{ fontSize: 17, fontWeight: 800, color: APP.slate900, letterSpacing: "-0.01em", flex: 1 }}>{title}</div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        height: 30,
        padding: "0 10px",
        borderRadius: 999,
        border: `1px solid ${APP.slate200}`,
        fontSize: 12,
        fontWeight: 800,
        color: APP.slate900,
      }}
    >
      <Ico k="bolt" size={13} color="#F59E0B" fill />
      11,468
    </div>
  </div>
);

/** White rounded section, as every block of the explorer page is drawn. */
export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 24,
      border: `1px solid ${APP.slate200}`,
      boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      padding: 16,
      fontFamily: UI_FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

/** The app's primary gradient button (Start search, Find more). */
export const GradButton: React.FC<{ label: string; icon?: IconKey; cost?: string; pressed?: number; style?: React.CSSProperties }> = ({
  label,
  icon = "sparkle",
  cost,
  pressed = 0,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      height: 40,
      padding: "0 18px",
      borderRadius: 999,
      background: APP.gradient,
      color: "#fff",
      fontFamily: UI_FONT,
      fontWeight: 800,
      fontSize: 14,
      boxShadow: `0 10px 24px -8px ${exPalette.primary}AA`,
      transform: `scale(${1 - pressed * 0.06})`,
      filter: `brightness(${1 - pressed * 0.12})`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <Ico k={icon} size={15} color="#fff" fill={icon === "sparkle"} />
    {label}
    {cost ? (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 2, marginLeft: 4, padding: "2px 7px", borderRadius: 999, background: "rgba(255,255,255,0.22)", fontSize: 12 }}>
        <Ico k="bolt" size={11} color="#FDE68A" fill />
        {cost}
      </span>
    ) : null}
  </div>
);

/** "Export to Excel": the green outline button next to Find more. */
export const ExcelButton: React.FC<{ label: string; pressed?: number }> = ({ label, pressed = 0 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 40,
      padding: "0 14px",
      borderRadius: 999,
      border: `1.5px solid ${pressed > 0.05 ? exColors.sheet : "#A7F3D0"}`,
      background: pressed > 0.05 ? exColors.sheetSoft : "#fff",
      color: "#15803D",
      fontFamily: UI_FONT,
      fontWeight: 800,
      fontSize: 13.5,
      transform: `scale(${1 - pressed * 0.06})`,
      whiteSpace: "nowrap",
    }}
  >
    <Ico k="table" size={15} color="#15803D" />
    {label}
  </div>
);

/** The status pill: "● ГОТОВО" in emerald, or the running state in violet. */
export const StatusPill: React.FC<{ label: string; running?: boolean }> = ({ label, running = false }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 10px",
      borderRadius: 999,
      background: running ? APP.violet50 : "#ECFDF5",
      border: `1px solid ${running ? APP.violet200 : "#A7F3D0"}`,
      color: running ? APP.violet800 : "#047857",
      fontFamily: UI_FONT,
      fontSize: 10.5,
      fontWeight: 900,
      letterSpacing: "0.12em",
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: running ? APP.violet500 : APP.emerald }} />
    {label}
  </div>
);

/* --------------------------------------------------------- the screen */

export const SCREEN = { x: 46, y: 252, w: 988, h: 1112, bar: 70 } as const;
/** CSS px of the phone layout → frame px. */
export const UI_SCALE = SCREEN.w / 430;
export const UI_VIEW_H = (SCREEN.h - SCREEN.bar) / UI_SCALE;

/**
 * The product in a browser card: the real URL in the address bar, the app's
 * light background, and the UI drawn at phone size and scaled up. `scroll`
 * moves the page (UI px); `zoom` + `focus` (UI px, relative to the viewport)
 * push the camera into a detail without leaving the page.
 */
export const AppScreen: React.FC<{
  url: string;
  enter?: number; // 0→1 entrance
  exit?: number; // 0→1 exit
  scroll?: number;
  zoom?: number;
  focus?: { x: number; y: number };
  dim?: number;
  children: React.ReactNode;
  overlay?: React.ReactNode; // drawn above the page, below the bar (modals)
}> = ({ url, enter = 1, exit = 0, scroll = 0, zoom = 1, focus = { x: 215, y: 200 }, dim = 0, children, overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const float = Math.sin(t * 1.3) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: SCREEN.x,
        top: SCREEN.y,
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: 46,
        overflow: "hidden",
        background: exColors.app,
        boxShadow: `0 60px 120px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), 0 0 90px -30px ${exPalette.glow}`,
        opacity: enter * (1 - exit),
        transform:
          `translateY(${interpolate(enter, [0, 1], [260, 0]) + exit * 80 + float}px) ` +
          `scale(${interpolate(enter, [0, 1], [0.86, 1]) * (1 - exit * 0.08)}) ` +
          `rotateX(${interpolate(enter, [0, 1], [14, 0])}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* address bar */}
      <div
        style={{
          height: SCREEN.bar,
          background: "#fff",
          borderBottom: `1px solid ${APP.slate200}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: UI_FONT,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 46,
            padding: "0 26px",
            borderRadius: 999,
            background: APP.slate100,
            fontSize: 25,
            fontWeight: 600,
            color: APP.slate700,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3" fill="none" stroke={APP.slate500} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {url}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: SCREEN.bar, right: 0, bottom: 0, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 430,
            fontFamily: UI_FONT,
            transformOrigin: "0 0",
            transform:
              `scale(${UI_SCALE}) ` +
              `translate(${focus.x}px, ${focus.y}px) scale(${zoom}) translate(${-focus.x}px, ${-focus.y}px) ` +
              `translateY(${-scroll}px)`,
          }}
        >
          {children}
        </div>
        {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(15, 23, 42, ${dim * 0.45})` }} /> : null}
        {overlay ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 430, fontFamily: UI_FONT, transformOrigin: "0 0", transform: `scale(${UI_SCALE})` }}>{overlay}</div>
        ) : null}
      </div>
    </div>
  );
};

/** A finger tap: a soft disc that presses in and a ring that rings out. UI px. */
export const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = (frame - at) / fps;
  if (k < -0.35 || k > 0.7) return null;
  const arrive = ease(frame, at - 0.35 * fps, at);
  const ring = ease(frame, at, at + 0.5 * fps);
  const gone = ease(frame, at + 0.3 * fps, at + 0.7 * fps, theme.ease.in);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, pointerEvents: "none", zIndex: 30 }}>
      <div
        style={{
          position: "absolute",
          left: -17,
          top: -17,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.28)",
          border: "2px solid rgba(255,255,255,0.9)",
          opacity: arrive * (1 - gone),
          transform: `scale(${interpolate(arrive, [0, 1], [1.6, 1]) * (k > 0 && k < 0.15 ? 0.82 : 1)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -17,
          top: -17,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: `2px solid ${exPalette.primary}`,
          opacity: k >= 0 ? (1 - ring) * 0.9 : 0,
          transform: `scale(${1 + ring * 1.8})`,
        }}
      />
    </div>
  );
};

/* ---------------------------------------------------------- the clock */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * «Засекайте!» — a stopwatch that starts on the last word of the hook, lives
 * in a chip above the app while the demo runs, and stops when the export
 * lands. `big` 1→0 morphs it from the hook's centre stage into the chip.
 */
export const Clock: React.FC<{ seconds: number; big: number; label: string; done: number; doneLabel: string; opacity: number }> = ({
  seconds,
  big,
  label,
  done,
  doneLabel,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.012 * (1 - done);
  // chip: top-right above the screen; big: centre of the frame
  const x = interpolate(big, [0, 1], [1034, 540]);
  const y = interpolate(big, [0, 1], [196, 1020]);
  const s = interpolate(big, [0, 1], [1.12, 2.6]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${interpolate(big, [0, 1], [-100, -50])}%, -50%) scale(${s * pulse})`,
        transformOrigin: big > 0.5 ? "50% 50%" : "100% 50%",
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 64,
        padding: "0 22px 0 14px",
        borderRadius: 999,
        background: exColors.surfaceStrong,
        border: `1.5px solid ${done > 0.5 ? exPalette.primary : exColors.lineStrong}`,
        boxShadow: done > 0.5 ? `0 0 40px -6px ${exPalette.glow}` : exColors.shadow,
        fontFamily: theme.fonts.mono,
        zIndex: 50,
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: exPalette.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done > 0.5 ? (
          <Ico k="check" size={22} color="#fff" stroke={3} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="13" r="8" fill="none" stroke="#fff" strokeWidth="2.2" />
            <path d={`M12 13 L${12 + Math.sin((seconds / 60) * Math.PI * 2) * 6} ${13 - Math.cos((seconds / 60) * Math.PI * 2) * 6}`} stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 3h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: 13, letterSpacing: "0.16em", color: exPalette.textDim, fontWeight: 700, whiteSpace: "nowrap" }}>{done > 0.5 ? doneLabel : label}</span>
        <span style={{ fontSize: 34, fontWeight: 800, color: exPalette.text, fontVariantNumeric: "tabular-nums", marginTop: 4 }}>{fmt(seconds)}</span>
      </div>
    </div>
  );
};

/* --------------------------------------------------------- flash cut */

/** A 4-frame white flash + zoom punch across a cut, peaking on `at`. */
export const flashAt = (frame: number, at: number) => {
  const d = Math.abs(frame - at);
  return d > 4 ? 0 : Math.pow(1 - d / 5, 2.2);
};

export const Flash: React.FC<{ amount: number }> = ({ amount }) =>
  amount > 0.001 ? <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: amount * 0.9, pointerEvents: "none", zIndex: 40 }} /> : null;

/** Fit a one-line headline into a width: Unbounded is ~0.78em per capital. */
export const fitSize = (text: string, width: number, max: number) =>
  Math.min(max, Math.floor(width / (text.length * (/[А-Яа-яЁё]/.test(text) ? 0.86 : 0.8))));
