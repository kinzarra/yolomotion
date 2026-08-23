import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { idxColors, idxPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Counter,
  Eyebrow,
  Kinetic,
  SceneShell,
  useIn,
  useRamp,
} from "../ui";

const PAGE_W = 450;
const PAGE_H = 540;
const OPEN = 24;
const FLIP_FROM = 26;
const FLIPS = 4;
const TOC = 60;
const JUMP = 82;

const pageFace: React.CSSProperties = {
  position: "absolute",
  top: 0,
  width: PAGE_W,
  height: PAGE_H,
  boxSizing: "border-box",
  padding: "34px 30px",
  border: `1px solid ${idxColors.lineStrong}`,
  background: `linear-gradient(160deg, ${idxColors.paper}, ${idxColors.surfaceLift})`,
  backfaceVisibility: "hidden",
  overflow: "hidden",
};

/** Line-art "text" so a page reads as a page without unreadable micro-type. */
const Lines: React.FC<{ seed: number; count?: number; opacity?: number }> = ({
  seed,
  count = 11,
  opacity = 1,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 22,
      opacity,
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 8,
          borderRadius: 4,
          background: idxColors.lineStrong,
          width: `${58 + ((seed * 37 + i * 53) % 42)}%`,
        }}
      />
    ))}
  </div>
);

/** 14.3–18.2s — "An index is basically the table of contents for your data." */
export const BookScene: React.FC<{
  brandName: string;
  chapter: string;
  targetEmail: string;
}> = ({ brandName, chapter, targetEmail }) => {
  const frame = useCurrentFrame();
  const open = useRamp(0, OPEN, theme.ease.out);
  const leftAngle = interpolate(open, [0, 1], [-78, -7]);
  const rightAngle = interpolate(open, [0, 1], [78, 7]);
  const toc = useIn(TOC, "smooth");
  const mark = useIn(TOC + 14, "bouncy");
  const jump = useIn(JUMP, "snappy");
  const arrow = useRamp(JUMP, JUMP + 12, theme.ease.out);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "300px 82px 220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Eyebrow delay={0}>the analogy</Eyebrow>
        <div style={{ marginTop: 40 }}>
          <Kinetic text="AN INDEX IS THE" size={92} delay={3} />
          <Kinetic
            text="TABLE OF CONTENTS"
            size={92}
            delay={9}
            color={idxPalette.primary}
            glow
          />
        </div>

        <div
          style={{
            marginTop: 54,
            position: "relative",
            width: 900,
            height: PAGE_H,
            alignSelf: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: 1800,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Left page — line-art first, contents after. */}
            <div
              style={{
                ...pageFace,
                left: 0,
                transformOrigin: "right center",
                transform: `rotateY(${leftAngle}deg)`,
                borderRadius: "22px 6px 6px 22px",
              }}
            >
              <div style={{ position: "absolute", inset: "34px 30px" }}>
                <Lines seed={3} opacity={1 - toc} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "34px 30px",
                  opacity: toc,
                  transform: `translateY(${interpolate(toc, [0, 1], [26, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 24,
                    letterSpacing: "0.18em",
                    color: idxPalette.primary,
                    marginBottom: 26,
                  }}
                >
                  INDEX
                </div>
                {[
                  ["a … c", "12"],
                  ["d … j", "210"],
                  [targetEmail, "734"],
                  ["s … z", "902"],
                ].map(([label, page], i) => {
                  const hit = i === 2;
                  return (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 18,
                        padding: hit ? "12px 14px" : "12px 0",
                        marginLeft: hit ? -14 : 0,
                        marginRight: hit ? -14 : 0,
                        borderRadius: 12,
                        background: hit
                          ? `rgba(255, 138, 76, ${0.14 * mark})`
                          : "transparent",
                        fontFamily: theme.fonts.mono,
                        fontSize: 25,
                        fontWeight: hit ? 700 : 500,
                        color: hit ? idxPalette.primary : idxPalette.textDim,
                        transform: hit
                          ? `scale(${interpolate(mark, [0, 1], [0.96, 1])})`
                          : undefined,
                      }}
                    >
                      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                      <span
                        style={{
                          flex: 1,
                          height: 2,
                          background: idxColors.line,
                        }}
                      />
                      <span>{page}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right page — the destination. */}
            <div
              style={{
                ...pageFace,
                left: PAGE_W,
                transformOrigin: "left center",
                transform: `rotateY(${rightAngle}deg)`,
                borderRadius: "6px 22px 22px 6px",
              }}
            >
              <div style={{ position: "absolute", inset: "34px 30px" }}>
                <Lines seed={7} opacity={1 - jump} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "34px 30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  opacity: jump,
                  transform: `scale(${interpolate(jump, [0, 1], [0.9, 1])})`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 24,
                    letterSpacing: "0.18em",
                    color: idxPalette.textDim,
                  }}
                >
                  PAGE 734
                </div>
                <div
                  style={{
                    marginTop: 18,
                    padding: "22px 24px",
                    borderRadius: 16,
                    border: `1px solid ${idxColors.good}`,
                    background: idxColors.goodSoft,
                    fontFamily: theme.fonts.mono,
                    fontSize: 26,
                    fontWeight: 700,
                    color: idxColors.good,
                    wordBreak: "break-all",
                  }}
                >
                  {targetEmail}
                </div>
                <div style={{ marginTop: 26 }}>
                  <Lines seed={11} count={5} opacity={0.7} />
                </div>
              </div>
            </div>

            {/* The pages you flip when there is no contents page. */}
            {Array.from({ length: FLIPS }).map((_, i) => {
              const s = FLIP_FROM + i * 5;
              const p = interpolate(frame, [s, s + 13], [0, 1], {
                easing: theme.ease.inOut,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    ...pageFace,
                    left: PAGE_W,
                    zIndex: FLIPS - i,
                    opacity: p >= 1 ? 0 : 1,
                    transformOrigin: "left center",
                    transform: `rotateY(${interpolate(p, [0, 1], [rightAngle, -173])}deg)`,
                    borderRadius: "6px 22px 22px 6px",
                  }}
                >
                  <Lines seed={i + 1} />
                </div>
              );
            })}
          </div>

          {/* 2D overlay: the jump from the contents entry straight to the page. */}
          <div
            style={{
              position: "absolute",
              left: 432,
              top: 267,
              height: 6,
              width: 200 * arrow,
              borderRadius: 4,
              background: idxPalette.primary,
              boxShadow: `0 0 34px ${idxPalette.glow}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 432 + 200 * arrow,
              top: 254,
              width: 0,
              height: 0,
              opacity: arrow,
              borderTop: `16px solid transparent`,
              borderBottom: `16px solid transparent`,
              borderLeft: `24px solid ${idxPalette.primary}`,
            }}
          />
        </div>

        {/* The two chips contradict each other, so they cross-fade in place. */}
        <div style={{ marginTop: 42, position: "relative", height: 66 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - toc }}>
            <Chip delay={FLIP_FROM + 2} tone="danger" dot={false}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              page&nbsp;
              <Counter
                from={1}
                to={812}
                delay={FLIP_FROM}
                duration={32}
                easing={theme.ease.inOut}
              />
            </span>
              &nbsp;· no contents
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Chip delay={TOC} tone="hero" dot={false}>
              straight to 734
            </Chip>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
