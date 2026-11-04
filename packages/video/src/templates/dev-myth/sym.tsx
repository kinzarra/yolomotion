// Symbols drawn as SVG (author's note 82: «иконки не подтянулись»). The render
// container has only Liberation fonts, so ✓ ✗ ⚠ ★ ● ▸ ⇄ ✉ ✦ … come out as
// boxes there while the Mac fills them from system fonts. Never put such a
// character into type: `richText` swaps them for these paths, at text size.
import React from "react";

const P: Record<string, React.ReactNode> = {
  "✓": <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />,
  "✗": <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />,
  "⚠": <><path d="M12 3L22 20H2z" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" /><path d="M12 9v5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" /><circle cx={12} cy={17} r={1.4} fill="currentColor" /></>,
  "⚿": <><circle cx={8} cy={12} r={4.5} fill="none" stroke="currentColor" strokeWidth={2.4} /><path d="M12.5 12H22M18 12v4M21 12v3" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" /></>,
  "☰": <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" />,
  "◉": <><circle cx={12} cy={12} r={8.5} fill="none" stroke="currentColor" strokeWidth={2.4} /><circle cx={12} cy={12} r={4} fill="currentColor" /></>,
  "✚": <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" />,
  "❝": <path d="M5 17c0-5 2-8 5-9M13 17c0-5 2-8 5-9" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />,
  "✦": <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="currentColor" />,
  "●": <circle cx={12} cy={12} r={6} fill="currentColor" />,
  "▸": <path d="M8 5l10 7-10 7z" fill="currentColor" />,
  "⇄": <path d="M4 8h14l-4-4M20 16H6l4 4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />,
  "✉": <><rect x={3} y={6} width={18} height={12} rx={2} fill="none" stroke="currentColor" strokeWidth={2.2} /><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth={2.2} /></>,
  "★": <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z" fill="currentColor" />,
};
const RE = new RegExp(`([${Object.keys(P).join("")}])`, "u");

/** One symbol at the current font size. */
export const Sym: React.FC<{ c: string; size?: string | number; style?: React.CSSProperties }> = ({ c, size = "0.95em", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "inline-block", verticalAlign: "-0.12em", ...style }}>{P[c]}</svg>
);

/** Text with every listed symbol drawn as SVG. */
export const richText = (text: React.ReactNode): React.ReactNode => {
  if (typeof text !== "string" || !RE.test(text)) return text;
  return text.split(RE).map((part, i) => (P[part] ? <Sym key={i} c={part} /> : part));
};
