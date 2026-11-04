// Episode pieces shared by the hook and the years: the 5 000 ₽ note and a
// banded pack of them.
import React from "react";
import { Img, staticFile } from "remotion";
import { colors } from "./palette";

export const NOTE = staticFile("images/salary-2013/rub5000.jpg");
export const NOTE_RATIO = 543 / 1233;

/** A bank pack of 5 000s: top note, paper edges stepping down, a band. */
export const Pack: React.FC<{ w: number; thick: number }> = ({ w, thick }) => {
  const h = Math.round(w * NOTE_RATIO);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* the notes underneath — paper edges stepping down-right */}
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
          left: "30%",
          top: -4,
          width: Math.round(w * 0.1),
          height: h + thick * 2.4 + 8,
          background: colors.paper,
          borderLeft: `2px solid ${colors.inkRule}`,
          borderRight: `2px solid ${colors.inkRule}`,
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
};


/** Third-party brand colours — evidence only (logo cards in 2022), never UI. */
export const BRAND = {
  swift: "#1C2B39",
  visa: "#1A1F71",
  mcRed: "#EB001B",
  mcYellow: "#F79E1B",
} as const;
