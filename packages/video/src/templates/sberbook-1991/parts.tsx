// Episode pieces shared by the hook and the years: the 100-ruble note of
// 1991, a banded pack of them, today's 5 000 ₽ note, and the savings book.
import React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../../theme";
import { colors } from "./palette";

export const NOTE = staticFile("images/sberbook-1991/rub100-1991.jpg");
export const NOTE_RATIO = 1475 / 3000;
export const NOTE5000 = staticFile("images/salary-2013/rub5000.jpg");
export const NOTE5000_RATIO = 543 / 1233;
export const BOOK_PAGE = staticFile("images/sberbook-1991/book-page.png");

/** One note, optionally torn down to a fraction of its width. */
export const Note: React.FC<{
  w: number;
  src?: string;
  ratio?: number;
  frac?: number;
  style?: React.CSSProperties;
}> = ({ w, src = NOTE, ratio = NOTE_RATIO, frac = 1, style }) => {
  const h = Math.round(w * ratio);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: Math.max(2, w * 0.012),
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
        clipPath:
          frac < 1
            ? `polygon(0 0, ${frac * 100}% 0, ${Math.max(0, frac * 100 - 3)}% 50%, ${frac * 100}% 100%, 0 100%)`
            : undefined,
        ...style,
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

/** A bank pack of 100s: top note, paper edges stepping down, a band. */
export const Pack: React.FC<{ w: number; thick: number; label?: string }> = ({ w, thick, label }) => {
  const h = Math.round(w * NOTE_RATIO);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {Array.from({ length: thick }, (_, k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${(thick - k) * 1.1}px, ${(thick - k) * 2.4}px)`,
            background: k % 3 === 0 ? colors.paperShade : colors.paper,
            border: `1px solid ${colors.inkRule}`,
            borderRadius: 5,
            boxShadow: k === 0 ? colors.paperShadow : undefined,
          }}
        />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: 5, overflow: "hidden" }}>
        <Img src={NOTE} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* the bank band */}
      <div
        style={{
          position: "absolute",
          left: "32%",
          top: -4,
          width: Math.round(w * 0.11),
          height: h + thick * 2.4 + 8,
          background: colors.paper,
          borderLeft: `2px solid ${colors.inkRule}`,
          borderRight: `2px solid ${colors.inkRule}`,
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label && (
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: Math.round(w * 0.04),
              fontWeight: 800,
              color: colors.inkFaded,
              letterSpacing: "0.1em",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * The savings book: the scanned ledger page (public domain) in a paper
 * frame, children printed over its table.
 */
export const Book: React.FC<{ w: number; h: number; tilt?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  w,
  h,
  tilt = 0,
  children,
  style,
}) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      transform: `rotate(${tilt}deg)`,
      background: colors.paperShade,
      border: `6px solid ${colors.paper}`,
      boxShadow: colors.paperShadow,
      overflow: "hidden",
      ...style,
    }}
  >
    <Img
      src={BOOK_PAGE}
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 100%" }}
    />
    {/* the age of the paper */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(120,90,40,0.18), rgba(120,90,40,0.05) 50%, rgba(60,40,10,0.28))" }} />
    {children}
  </div>
);
