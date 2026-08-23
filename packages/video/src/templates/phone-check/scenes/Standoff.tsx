// The composition beats 3 and 8 share: the hooded figure left, the bank
// right, a dashed line between them, and the notes hanging in the middle.
// `noteShift` slides the money toward the hood (negative) or back (0), and
// `bankDim` is how far the bank has gone dark.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { pcColors, pcPalette } from "../palette";
import { BankBuilding, Chip, Hooded, NoteStack } from "../ui";

export const STAND_TOP = 760;
export const NOTE_W = 300;

export const Standoff: React.FC<{
  hood?: number;
  bank?: number;
  notes?: number;
  notePop?: number;
  noteShift?: number;
  noteScale?: number;
  noteOpacity?: number;
  bankDim?: number;
  labels?: boolean;
}> = ({ hood = 0, bank = 0, notes = 0, notePop = 0, noteShift = 0, noteScale = 1, noteOpacity = 1, bankDim = 0, labels = true }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 22) * 6;
  return (
    <>
      {/* the line they stand on */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <line x1={250} y1={STAND_TOP + 150} x2={830} y2={STAND_TOP + 150} stroke={pcColors.lineStrong} strokeWidth={3} strokeDasharray="6 16" />
      </svg>

      {/* left: the hood */}
      <div style={{ position: "absolute", left: 70, top: STAND_TOP - 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Hooded height={300} delay={hood} />
        {labels && (
          <Chip delay={hood + 10} tone="bad" size={22}>
            МОШЕННИК
          </Chip>
        )}
      </div>

      {/* right: the bank */}
      <div style={{ position: "absolute", right: 70, top: STAND_TOP + 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <BankBuilding width={300} delay={bank} dim={bankDim} />
        {labels && (
          <div style={{ opacity: 1 - bankDim * 0.6 }}>
            <Chip delay={bank + 10} tone="neutral" size={22}>
              БАНК
            </Chip>
          </div>
        )}
      </div>

      {/* the money, exactly in the middle */}
      <div
        style={{
          position: "absolute",
          left: 540 - NOTE_W / 2,
          top: STAND_TOP + 40,
          opacity: noteOpacity,
          transform: `translate(${noteShift}px, ${float}px) scale(${(1 + notePop * 0.1) * noteScale})`,
          filter: notePop > 0.01 ? `drop-shadow(0 0 ${40 * notePop}px ${pcPalette.glow})` : undefined,
        }}
      >
        <NoteStack width={NOTE_W} delay={notes} />
      </div>
      <span style={{ display: "none" }}>{theme.fonts.mono}</span>
    </>
  );
};
