// Scene 3 — the deployed product, ALIVE in a browser: content reveals, a
// cursor clicks "Get started" (press + ripple), the page scrolls under a
// sticky navbar to a second section (deploy terminal + live counters).
// The page uses the landing's real dark-mode tokens.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { page, vibe } from "../palette";
import { Entrance } from "../../../components/Motion";
import { ExitWrap, StepLabel, WindowFrame } from "../ui";

// Scene-local timeline (frames from scene start, len = 210 @30fps).
const CUE = {
  cursorIn: 74,
  moveStart: 80,
  moveEnd: 100,
  click: 103,
  scrollStart: 114,
  scrollEnd: 152,
  sectionB: 148, // entrances inside section B key off this
};
const VIEWPORT = 470; // scrollable area below the sticky navbar
const BTN = { x: 1262, y: 54 }; // "Get started" center, page coords

const Counter: React.FC<{
  at: number;
  target: number;
  decimals?: number;
  suffix: string;
}> = ({ at, target, decimals = 0, suffix }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: 30, stiffness: 60 },
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {interpolate(p, [0, 1], [0, target]).toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Card: React.FC<{ delay: number; title: string; sub: string }> = ({
  delay,
  title,
  sub,
}) => (
  <Entrance delay={delay} style={{ flex: 1, display: "flex" }}>
    <div
      style={{
        flex: 1,
        padding: "22px 26px",
        background: page.surface,
        border: `1px solid ${page.border}`,
        borderRadius: 14,
        boxShadow: page.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          border: `1px solid ${page.border}`,
          background: page.surfaceAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: 15, height: 15, borderRadius: 8, background: page.accent }}
        />
      </div>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 24,
          fontWeight: 700,
          color: page.textMain,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 18,
          color: page.textMuted,
          lineHeight: 1.4,
        }}
      >
        {sub}
      </div>
    </div>
  </Entrance>
);

const StatChip: React.FC<{ delay: number; label: string; children: React.ReactNode }> = ({
  delay,
  label,
  children,
}) => (
  <Entrance delay={delay}>
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 22px",
        background: page.surface,
        border: `1px solid ${page.border}`,
        borderRadius: 10,
        boxShadow: "0 10px 24px -14px rgba(0, 0, 0, 0.7)",
        fontFamily: theme.fonts.mono,
        fontSize: 22,
        color: page.textMain,
      }}
    >
      <span style={{ color: page.textMuted }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{children}</span>
    </div>
  </Entrance>
);

// macOS-style pointer with press animation around the click cue.
const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: frame - CUE.cursorIn,
    fps,
    config: theme.spring.smooth,
  });
  const x = interpolate(frame, [CUE.moveStart, CUE.moveEnd], [880, BTN.x - 6], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [CUE.moveStart, CUE.moveEnd], [330, BTN.y - 4], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const press = interpolate(
    frame,
    [CUE.click - 2, CUE.click + 2, CUE.click + 7],
    [1, 0.82, 1],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fade = interpolate(frame, [CUE.scrollStart, CUE.scrollStart + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: appear * fade,
        transform: `scale(${press})`,
        transformOrigin: "6px 4px",
        zIndex: 30,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24">
        <path
          d="M5.5 3.2v17.6c0 .45.54.67.85.35l4.4-4.4a.5.5 0 0 1 .36-.15h6.24c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
          fill="#FFFFFF"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

// Expanding ring at the button on click.
const ClickRipple: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [CUE.click, CUE.click + 14], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < CUE.click) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: BTN.x,
        top: BTN.y,
        width: 10,
        height: 10,
        marginLeft: -5,
        marginTop: -5,
        borderRadius: "50%",
        border: `3px solid ${page.primary}`,
        opacity: 0.7 * (1 - p),
        transform: `scale(${1 + p * 14})`,
        zIndex: 25,
      }}
    />
  );
};

const TerminalCard: React.FC<{ delay: number; url: string }> = ({ delay, url }) => (
  <Entrance delay={delay} style={{ flex: 1.4, display: "flex" }}>
    <div
      style={{
        flex: 1,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${page.border}`,
        background: "#0D1016",
        boxShadow: page.shadow,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 18px",
          borderBottom: `1px solid ${page.border}`,
          background: page.surfaceAlt,
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
          ))}
        </div>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 15,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: page.textMuted,
          }}
        >
          vibecloud deploy agent
        </span>
      </div>
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontFamily: theme.fonts.mono,
          fontSize: 21,
        }}
      >
        <div style={{ color: page.textMain }}>
          <span style={{ color: page.textMuted }}>$ </span>
          claude &quot;deploy my-app to prod&quot;
        </div>
        <div style={{ color: page.textMuted }}>
          <span style={{ color: page.accent }}>✓</span> mcp · build — 42 modules · 2.1s
        </div>
        <div style={{ color: page.textMuted }}>
          <span style={{ color: page.accent }}>✓</span> mcp · deploy — target prod
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{ width: 9, height: 9, borderRadius: 5, background: page.accent }}
          />
          <span style={{ color: page.textMain }}>Live —</span>
          <span style={{ color: page.primary, fontWeight: 700 }}>https://{url}</span>
        </div>
      </div>
    </div>
  </Entrance>
);

export const LiveScene: React.FC<{
  len: number;
  url: string;
  brandName: string;
  headline: string; // second word gets the orange highlight
}> = ({ len, url, brandName, headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns on the whole browser window.
  const zoom = interpolate(frame, [0, len], [1, 1.045], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const livePulse = 0.55 + 0.45 * (0.5 + Math.sin(frame / 9) / 2);
  const scrollY = interpolate(
    frame,
    [CUE.scrollStart, CUE.scrollEnd],
    [0, -VIEWPORT],
    {
      easing: theme.ease.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // The button presses back when clicked.
  const btnPress = interpolate(
    frame,
    [CUE.click - 2, CUE.click + 2, CUE.click + 8],
    [1, 0.93, 1],
    { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const words = headline.split(" ");
  const highlightIdx = 1;

  return (
    <ExitWrap len={len}>
      <div style={{ position: "absolute", top: 54, left: 70 }}>
        <Entrance delay={2}>
          <StepLabel n="03" word="Live in prod" />
        </Entrance>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Entrance delay={0}>
          <div style={{ transform: `scale(${zoom})` }}>
            <WindowFrame
              width={1430}
              bar={
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                  <div
                    style={{
                      flex: 1,
                      maxWidth: 560,
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 20px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.07)",
                      fontFamily: theme.fonts.mono,
                      fontSize: 20,
                      color: vibe.text,
                    }}
                  >
                    <span style={{ color: "#28C840", fontSize: 16 }}>●</span>
                    {url}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 16px",
                      borderRadius: 9,
                      background: "rgba(40,200,64,0.14)",
                      border: "1px solid rgba(40,200,64,0.4)",
                      fontFamily: theme.fonts.mono,
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "#28C840",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: "#28C840",
                        opacity: livePulse,
                      }}
                    />
                    LIVE
                  </div>
                </div>
              }
            >
              <div style={{ position: "relative", background: page.background }}>
                {/* Sticky navbar — stays put while the page scrolls. */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    padding: "24px 62px",
                    borderBottom: `1px solid ${scrollY < -8 ? page.border : "transparent"}`,
                    position: "relative",
                    zIndex: 10,
                    background: page.background,
                  }}
                >
                  <Entrance delay={8}>
                    <div
                      style={{
                        fontFamily: theme.fonts.display,
                        fontSize: 29,
                        fontWeight: 700,
                        color: page.textMain,
                      }}
                    >
                      {brandName}
                    </div>
                  </Entrance>
                  {["Product", "Pricing", "Docs"].map((l, i) => (
                    <Entrance key={l} delay={12 + i * 3}>
                      <div
                        style={{
                          fontFamily: theme.fonts.body,
                          fontSize: 20,
                          color: page.textMuted,
                        }}
                      >
                        {l}
                      </div>
                    </Entrance>
                  ))}
                  <Entrance delay={22} style={{ marginLeft: "auto" }}>
                    <div
                      style={{
                        padding: "12px 28px",
                        borderRadius: 12,
                        background: page.btnGrad,
                        boxShadow: "0 14px 34px -12px rgba(255, 147, 77, 0.5)",
                        fontFamily: theme.fonts.display,
                        fontSize: 21,
                        fontWeight: 700,
                        color: page.btnText,
                        transform: `scale(${btnPress})`,
                      }}
                    >
                      Get started
                    </div>
                  </Entrance>
                </div>

                {/* Scrollport */}
                <div style={{ height: VIEWPORT, overflow: "hidden" }}>
                  <div style={{ transform: `translateY(${scrollY}px)` }}>
                    {/* Section A — hero */}
                    <div
                      style={{
                        height: VIEWPORT,
                        padding: "26px 62px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 26,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 20,
                            fontFamily: theme.fonts.display,
                            fontSize: 64,
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {words.map((w, i) => {
                            const p = spring({
                              frame: frame - 16 - i * 4,
                              fps,
                              config: theme.spring.snappy,
                            });
                            return (
                              <span
                                key={i}
                                style={{
                                  opacity: p,
                                  transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px)`,
                                  color:
                                    i === highlightIdx ? page.primary : page.textMain,
                                }}
                              >
                                {w}
                              </span>
                            );
                          })}
                        </div>
                        <Entrance delay={32}>
                          <div
                            style={{
                              fontFamily: theme.fonts.body,
                              fontSize: 25,
                              color: page.textMuted,
                            }}
                          >
                            From prompt to production in one command.
                          </div>
                        </Entrance>
                      </div>
                      <div style={{ display: "flex", gap: 32 }}>
                        <Card
                          delay={40}
                          title="Instant deploys"
                          sub="Claude ships every change straight to prod via MCP."
                        />
                        <Card
                          delay={45}
                          title="Zero config"
                          sub="No YAML, no pipelines. Describe it, it runs."
                        />
                        <Card
                          delay={50}
                          title="Always on"
                          sub="Health checks and rollbacks handled for you."
                        />
                      </div>
                    </div>

                    {/* Section B — deploy terminal + live stats */}
                    <div
                      style={{
                        height: VIEWPORT,
                        padding: "34px 62px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                      }}
                    >
                      <Entrance delay={CUE.sectionB}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            fontFamily: theme.fonts.display,
                            fontSize: 19,
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: page.textMuted,
                          }}
                        >
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: 5,
                              background: page.primary,
                            }}
                          />
                          Powered by MCP
                        </div>
                      </Entrance>
                      <div style={{ display: "flex", gap: 32, alignItems: "stretch" }}>
                        <TerminalCard delay={CUE.sectionB + 4} url={url} />
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            justifyContent: "center",
                          }}
                        >
                          <StatChip delay={CUE.sectionB + 10} label="uptime">
                            <Counter
                              at={CUE.sectionB + 12}
                              target={99.98}
                              decimals={2}
                              suffix="%"
                            />
                          </StatChip>
                          <StatChip delay={CUE.sectionB + 14} label="p95">
                            <Counter at={CUE.sectionB + 16} target={212} suffix="ms" />
                          </StatChip>
                          <StatChip delay={CUE.sectionB + 18} label="deploys today">
                            <Counter at={CUE.sectionB + 20} target={128} suffix="" />
                          </StatChip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ClickRipple />
                <Cursor />
              </div>
            </WindowFrame>
          </div>
        </Entrance>
      </AbsoluteFill>
    </ExitWrap>
  );
};
