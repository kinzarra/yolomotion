// 07 cta — Yoloco + the product name, the promise, and a QR that opens
// /explorer/new (app.yoloco.io for the English cut, app.yoloco.ru for the
// Russian one). The cartoon Philipp from yoloco-mcp points at the code: a
// soft presence, faded into the field, never the subject.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { exColors, exPalette } from "../palette";
import { COPY, Lang } from "../copy";
import { QR as QR_EN } from "../qr-en";
import { QR as QR_RU } from "../qr-ru";
import { Ico, SceneShell, YolocoMark, YolocoWordmark, ease, fitSize, springAt } from "../ui";

const ART = { src: "footage/yoloco-mcp/cut-philipp-cta.png", w: 1086, h: 1448, finger: { x: 0.03, y: 0.285 } } as const;

/** The QR assembling from the centre out; dark modules on a white plate. */
const Qr: React.FC<{ qr: { size: number; bits: string }; size: number; delay: number }> = ({ qr, size, delay }) => {
  const frame = useCurrentFrame();
  const n = qr.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  const mid = (n - 1) / 2;
  const build = ease(frame, delay, delay + 22);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (qr.bits[y * n + x] !== "1") continue;
      const d = Math.hypot(x - mid, y - mid) / (mid * 1.42);
      const s = Math.min(1, Math.max(0, (build - d * 0.85) / 0.15));
      if (s <= 0) continue;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={(x + quiet) * cell + (cell * (1 - s)) / 2}
          y={(y + quiet) * cell + (cell * (1 - s)) / 2}
          width={cell * s}
          height={cell * s}
          rx={cell * 0.16}
          fill={exColors.appInk}
        />,
      );
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", borderRadius: 28, background: "#fff" }}>
      {cells}
    </svg>
  );
};

export const CtaScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const copy = COPY[lang];
  const qr = lang === "en" ? QR_EN : QR_RU;
  const name = springAt(frame, fps, -4, "snappy");
  const line = springAt(frame, fps, 6, "smooth");
  const plate = springAt(frame, fps, 4, "bouncy");
  const me = springAt(frame, fps, 12, "smooth");
  const nameSize = fitSize(copy.ctaProduct, 920, 168);
  const qrSize = 390;
  const qrBox = { x: 84, y: 760 };
  const artH = 800;
  const artW = (ART.w / ART.h) * artH;
  const artLeft = qrBox.x + qrSize + 34 - ART.finger.x * artW;
  const artTop = qrBox.y + qrSize / 2 - ART.finger.y * artH;

  return (
    <SceneShell exit={false}>
      <div style={{ position: "absolute", left: 84, top: 270, display: "flex", alignItems: "center", gap: 20 }}>
        <YolocoMark size={84} delay={-6} />
        <YolocoWordmark size={74} delay={-2} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 400,
          fontFamily: theme.fonts.wide,
          fontWeight: 900,
          fontSize: nameSize,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: exPalette.text,
          opacity: name,
          transform: `translateY(${interpolate(name, [0, 1], [80, 0])}px)`,
          clipPath: `inset(0 ${(1 - name) * 100}% 0 0)`,
        }}
      >
        {copy.ctaProduct}
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 430 + nameSize,
          fontFamily: theme.fonts.wide,
          fontWeight: 600,
          fontSize: fitSize(copy.ctaLine, 900, 46),
          color: exPalette.accent,
          opacity: line,
          transform: `translateY(${interpolate(line, [0, 1], [30, 0])}px)`,
        }}
      >
        {copy.ctaLine}
      </div>

      {/* Philipp, behind the plate, pointing at it */}
      <Img
        src={staticFile(ART.src)}
        style={{
          position: "absolute",
          left: artLeft,
          top: artTop + Math.sin(t * 1.6) * 5,
          height: artH,
          width: artW,
          maxWidth: "none",
          opacity: me * 0.96,
          transform: `translateX(${interpolate(me, [0, 1], [160, 0])}px) rotate(${Math.sin(t * 1.2) * 0.8}deg)`,
          WebkitMaskImage: "linear-gradient(180deg, #000 62%, transparent 86%)",
          maskImage: "linear-gradient(180deg, #000 62%, transparent 86%)",
          filter: "saturate(0.85)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: qrBox.x,
          top: qrBox.y,
          opacity: plate,
          transform: `scale(${interpolate(plate, [0, 1], [0.7, 1])}) rotate(${interpolate(plate, [0, 1], [-6, 0])}deg)`,
          transformOrigin: "50% 50%",
          borderRadius: 28,
          boxShadow: `0 0 0 8px ${exPalette.primary}, 0 40px 100px -20px ${exPalette.glow}`,
        }}
      >
        <Qr qr={qr} size={qrSize} delay={6} />
      </div>
      <div
        style={{
          position: "absolute",
          left: qrBox.x,
          top: qrBox.y + qrSize + 36,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: ease(frame, 16, 30),
        }}
      >
        <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: exPalette.textDim, display: "flex", alignItems: "center", gap: 10 }}>
          <Ico k="search" size={28} color={exPalette.textDim} stroke={2.4} />
          {copy.ctaScan}
        </span>
        <span
          style={{
            alignSelf: "flex-start",
            padding: "10px 22px",
            borderRadius: 999,
            background: exColors.surfaceStrong,
            border: `1.5px solid ${exColors.lineStrong}`,
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            fontWeight: 700,
            color: exPalette.text,
          }}
        >
          {copy.ctaUrl}
        </span>
      </div>
    </SceneShell>
  );
};
