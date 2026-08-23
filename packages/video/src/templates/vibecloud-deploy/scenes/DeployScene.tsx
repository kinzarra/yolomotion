// Scene 2 — the user asks Claude; Claude builds and deploys through MCP.
// Green checkmarks are semantic UI; the only hero-colored element is the
// final live URL.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../../theme";
import { vibe } from "../palette";
import { Entrance } from "../../../components/Motion";
import { ExitWrap, StepLabel, WindowFrame } from "../ui";

const Check: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  return (
    <span
      style={{
        display: "inline-flex",
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(40,200,64,0.16)",
        color: "#28C840",
        fontSize: 19,
        fontWeight: 700,
        transform: `scale(${p})`,
      }}
    >
      ✓
    </span>
  );
};

// Pulsing "working" dots (sin-wave, no linear easing anywhere).
const WorkingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: 7 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            background: vibe.textDim,
            opacity: 0.35 + 0.55 * (0.5 + Math.sin(frame / 4 - i * 1.1) / 2),
          }}
        />
      ))}
    </span>
  );
};

const ToolRow: React.FC<{
  enter: number;
  doneAt?: number; // scene frame when the row completes; working dots before
  name: string;
  args?: string;
  result?: string;
  children?: React.ReactNode;
}> = ({ enter, doneAt, name, args, result, children }) => {
  const frame = useCurrentFrame();
  const done = doneAt !== undefined && frame >= doneAt;
  return (
    <Entrance delay={enter}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "18px 26px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.06)",
          fontFamily: theme.fonts.mono,
          fontSize: 25,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: vibe.accent,
            flexShrink: 0,
          }}
        />
        <span style={{ color: vibe.text }}>{name}</span>
        {args ? <span style={{ color: vibe.textDim }}>{args}</span> : null}
        <span
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            color: vibe.textDim,
          }}
        >
          {children}
          {done ? (
            <>
              {result ? <span style={{ fontSize: 22 }}>{result}</span> : null}
              <Check at={doneAt!} />
            </>
          ) : (
            <WorkingDots />
          )}
        </span>
      </div>
    </Entrance>
  );
};

export const DeployScene: React.FC<{
  len: number;
  prompt: string;
  url: string;
}> = ({ len, prompt, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [66, 124], [0, 100], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlIn = spring({ frame: frame - 134, fps, config: theme.spring.smooth });

  return (
    <ExitWrap len={len}>
      <div style={{ position: "absolute", top: 54, left: 70 }}>
        <Entrance delay={2}>
          <StepLabel n="02" word="Ask Claude" />
        </Entrance>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Entrance delay={0}>
          <div
            style={{
              transform: `scale(${interpolate(frame, [0, len], [1, 1.03], {
                easing: theme.ease.inOut,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
            }}
          >
            <WindowFrame width={1260} title="Claude Code · MCP: vibecloud">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                padding: "36px 40px 44px",
                minHeight: 560,
              }}
            >
              <Entrance delay={8} style={{ alignSelf: "flex-end" }}>
                <div
                  style={{
                    padding: "16px 28px",
                    borderRadius: 18,
                    borderTopRightRadius: 6,
                    background: "rgba(42,109,160,0.28)",
                    border: "1px solid rgba(42,109,160,0.55)",
                    fontFamily: theme.fonts.body,
                    fontSize: 28,
                    color: vibe.text,
                  }}
                >
                  {prompt}
                </div>
              </Entrance>

              <Entrance delay={20}>
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 26,
                    color: vibe.textDim,
                  }}
                >
                  On it — building and deploying via MCP.
                </div>
              </Entrance>

              <ToolRow
                enter={26}
                doneAt={58}
                name="build"
                args="--production"
                result="42 modules · 2.1s"
              />
              <ToolRow enter={66} doneAt={126} name="deploy" args="--target prod">
                {frame < 126 ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 300,
                        height: 10,
                        borderRadius: 5,
                        background: "rgba(255,255,255,0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          width: `${progress}%`,
                          height: "100%",
                          borderRadius: 5,
                          background: vibe.accent,
                        }}
                      />
                    </span>
                    <span
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 22,
                        width: 64,
                      }}
                    >
                      {Math.round(progress)}%
                    </span>
                  </span>
                ) : null}
              </ToolRow>

              <div
                style={{
                  marginTop: 10,
                  opacity: urlIn,
                  transform: `translateY(${interpolate(urlIn, [0, 1], [30, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  fontFamily: theme.fonts.mono,
                  fontSize: 30,
                }}
              >
                <Check at={134} />
                <span style={{ color: vibe.text }}>Live at</span>
                <span
                  style={{
                    color: vibe.primary,
                    fontWeight: 700,
                    textShadow: `0 0 34px ${vibe.glow}`,
                  }}
                >
                  https://{url}
                </span>
              </div>
            </div>
            </WindowFrame>
          </div>
        </Entrance>
      </AbsoluteFill>
    </ExitWrap>
  );
};
