// The series kit, plus this episode's cash: a real $1 note and real coins
// (US Treasury / US Mint scans, public domain — Wikimedia Commons).
import React from "react";
import { Img, staticFile } from "remotion";
import { colors } from "./palette";

export * from "../digital-ruble/ui";

export const BILL = staticFile("images/min-wage-725/usd1.jpg");
export const BILL_RATIO = 784 / 1800;

export const COIN = {
  quarter: { src: staticFile("images/min-wage-725/quarter.png"), mm: 24.26, cents: 25 },
  dime: { src: staticFile("images/min-wage-725/dime.png"), mm: 17.91, cents: 10 },
  nickel: { src: staticFile("images/min-wage-725/nickel.png"), mm: 21.21, cents: 5 },
  penny: { src: staticFile("images/min-wage-725/penny.png"), mm: 19.05, cents: 1 },
} as const;

/** A $1 note: the scan, a soft paper curl across it and a cast shadow. */
export const Bill: React.FC<{ w: number; tint?: number }> = ({ w, tint = 0 }) => {
  const h = Math.round(w * BILL_RATIO);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: `${colors.paperShadow}, 0 2px 4px rgba(0,0,0,0.35)`,
      }}
    >
      <Img src={BILL} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {/* paper curl: a light ridge and a shaded fold so it reads as a note, not a sticker */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.10) 52%, rgba(255,255,255,0.06) 64%, rgba(0,0,0,0.14) 100%)",
        }}
      />
      {tint > 0 && (
        <div style={{ position: "absolute", inset: 0, background: colors.bad, mixBlendMode: "multiply", opacity: tint }} />
      )}
    </div>
  );
};

/** A coin at true relative size: `quarterPx` is the quarter's diameter on screen. */
export const Coin: React.FC<{ kind: keyof typeof COIN; quarterPx: number }> = ({ kind, quarterPx }) => {
  const d = Math.round((quarterPx * COIN[kind].mm) / COIN.quarter.mm);
  return (
    <Img
      src={COIN[kind].src}
      style={{
        width: d,
        height: d,
        display: "block",
        filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.55)) drop-shadow(0 2px 2px rgba(0,0,0,0.5))",
      }}
    />
  );
};
