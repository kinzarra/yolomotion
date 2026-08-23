// Scene 1 — the user writes code in an IDE. Typewriter with syntax colors;
// the blinking terracotta cursor is the single hero-colored element.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { syntax, vibe } from "../palette";
import { Entrance } from "../../../components/Motion";
import { ExitWrap, StepLabel, WindowFrame } from "../ui";

type Tok = { t: string; c: keyof typeof syntax };

const LINES: Tok[][] = [
  [{ t: "// app/page.tsx", c: "comment" }],
  [
    { t: "export default function ", c: "kw" },
    { t: "Home", c: "fn" },
    { t: "() {", c: "punct" },
  ],
  [
    { t: "  return", c: "kw" },
    { t: " (", c: "punct" },
  ],
  [
    { t: "    <", c: "punct" },
    { t: "main", c: "tag" },
    { t: " className=", c: "plain" },
    { t: '"hero"', c: "str" },
    { t: ">", c: "punct" },
  ],
  [
    { t: "      <", c: "punct" },
    { t: "h1", c: "tag" },
    { t: ">", c: "punct" },
    { t: "Ship vibes, not configs", c: "plain" },
    { t: "</", c: "punct" },
    { t: "h1", c: "tag" },
    { t: ">", c: "punct" },
  ],
  [
    { t: "      <", c: "punct" },
    { t: "Deploy", c: "fn" },
    { t: " target=", c: "plain" },
    { t: '"prod"', c: "str" },
    { t: " />", c: "punct" },
  ],
  [
    { t: "    </", c: "punct" },
    { t: "main", c: "tag" },
    { t: ">", c: "punct" },
  ],
  [{ t: "  );", c: "punct" }],
  [{ t: "}", c: "punct" }],
];

const lineLen = (l: Tok[]) => l.reduce((n, tok) => n + tok.t.length, 0);
const TOTAL = LINES.reduce((n, l) => n + lineLen(l), 0);

const FILES = [
  { name: "app/", active: false },
  { name: "  page.tsx", active: true },
  { name: "  layout.tsx", active: false },
  { name: "components/", active: false },
  { name: "  Deploy.tsx", active: false },
  { name: "public/", active: false },
];

export const IdeScene: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  // Eased typing: accelerates, then settles — reads human, not metronomic.
  const typed = Math.floor(
    interpolate(frame, [14, len - 30], [0, TOTAL], {
      easing: theme.ease.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  let remaining = typed;
  const takes = LINES.map((l) => {
    const take = Math.max(0, Math.min(remaining, lineLen(l)));
    remaining -= take;
    return take;
  });
  const activeLine = Math.max(
    0,
    takes.reduce((acc, take, i) => (take > 0 ? i : acc), 0),
  );
  const cursorOn = frame % 16 < 9;

  return (
    <ExitWrap len={len}>
      <div style={{ position: "absolute", top: 54, left: 70 }}>
        <Entrance delay={4}>
          <StepLabel n="01" word="Write" />
        </Entrance>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Entrance delay={2}>
          <div
            style={{
              transform: `scale(${interpolate(frame, [0, len], [1, 1.035], {
                easing: theme.ease.inOut,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
            }}
          >
            <WindowFrame width={1360} title="vibecloud — page.tsx">
            <div style={{ display: "flex", minHeight: 560 }}>
              <div
                style={{
                  width: 250,
                  padding: "26px 0",
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                  fontFamily: theme.fonts.mono,
                  fontSize: 21,
                }}
              >
                {FILES.map((f, i) => (
                  <Entrance key={f.name} delay={6 + i * 3}>
                    <div
                      style={{
                        padding: "7px 28px",
                        whiteSpace: "pre",
                        color: f.active ? vibe.text : vibe.textDim,
                        background: f.active
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                      }}
                    >
                      {f.name}
                    </div>
                  </Entrance>
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "26px 34px",
                  fontFamily: theme.fonts.mono,
                  fontSize: 27,
                  lineHeight: 1.65,
                }}
              >
                {LINES.map((line, i) => {
                  let left = takes[i];
                  return (
                    <div key={i} style={{ display: "flex" }}>
                      <span
                        style={{
                          width: 56,
                          color: "rgba(255,255,255,0.22)",
                          userSelect: "none",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ whiteSpace: "pre" }}>
                        {line.map((tok, j) => {
                          const shown = tok.t.slice(0, Math.max(0, left));
                          left -= tok.t.length;
                          return (
                            <span key={j} style={{ color: syntax[tok.c] }}>
                              {shown}
                            </span>
                          );
                        })}
                        {i === activeLine ? (
                          <span
                            style={{
                              display: "inline-block",
                              width: 15,
                              height: 30,
                              marginLeft: 2,
                              verticalAlign: "text-bottom",
                              background: vibe.primary,
                              opacity: cursorOn ? 1 : 0.12,
                              boxShadow: `0 0 18px ${vibe.glow}`,
                            }}
                          />
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            </WindowFrame>
          </div>
        </Entrance>
      </AbsoluteFill>
    </ExitWrap>
  );
};
