import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette, syntax } from "../palette";
import { AppMock } from "../AppMock";
import {
  BrandBar,
  Slam,
  SceneShell,
  UrlPill,
  WindowCard,
  useIn,
  usePunch,
  useRamp,
} from "../ui";

const FOUND_AT = 100; // scan locks onto the key
const SLAM_AT = 130; // ANYONE CAN SEE THIS

const TABS = ["Elements", "Console", "Sources", "Network"];

// Minified bundle around the leak — the found line is index 3.
const LINES_BEFORE = [
  '!function(){var e=Object.assign({},r);',
  'const t=await fetch("https://api.openai.com/v1",',
  '{method:"POST",headers:{"Content-Type":',
];
const LINES_AFTER = [
  'body:JSON.stringify({prompt:n,model:"gpt-4o"})})',
  ".then(e=>e.json()).catch(()=>null);",
  'window.__L=Object.freeze({v:"2.4.1",r:t})}();',
];
const FOUND_INDEX = LINES_BEFORE.length;
const LINE_COUNT = LINES_BEFORE.length + 1 + LINES_AFTER.length;

/** 7.5–13.4s — the app gets ripped open into DevTools; the key is found. */
export const DevtoolsScene: React.FC<{
  brandName: string;
  chapter: string;
  appDomain: string;
  secretValue: string;
}> = ({ brandName, chapter, appDomain, secretValue }) => {
  const frame = useCurrentFrame();
  // The rip: app flies up and back, DevTools slams up from the bottom.
  const rip = useIn(2, "smooth");
  const tools = useIn(8, "smooth");
  const typed = useRamp(26, 40, theme.ease.inOut);
  const query = "sk-".slice(0, Math.round(3 * typed));
  // Scan sweeps the bundle line by line, then locks onto the found row.
  const scan = useRamp(48, FOUND_AT, theme.ease.inOut);
  const scanRow = Math.min(LINE_COUNT - 1, Math.floor(scan * LINE_COUNT));
  const found = frame >= FOUND_AT;
  const foundPop = useIn(FOUND_AT, "snappy");
  const punchFound = usePunch(FOUND_AT, 14);
  const punchSlam = usePunch(SLAM_AT, 22);
  const dimForSlam = useRamp(SLAM_AT, SLAM_AT + 8, theme.ease.out);

  const line = (code: string, i: number) => {
    const active = !found && i === scanRow;
    return (
      <div
        key={i}
        style={{
          display: "flex",
          gap: 22,
          padding: "7px 22px",
          background: active ? secColors.blueSoft : "transparent",
          borderLeft: `4px solid ${active ? secPalette.accent : "transparent"}`,
        }}
      >
        <span style={{ color: syntax.comment, minWidth: 44, textAlign: "right" }}>
          {141 + i}
        </span>
        <span
          style={{
            color: syntax.punct,
            whiteSpace: "pre",
            overflow: "hidden",
          }}
        >
          {code}
        </span>
      </div>
    );
  };

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "280px 82px 220px",
          display: "flex",
          flexDirection: "column",
          transform: `translate(${punchSlam.shake}px, ${punchSlam.shake * -0.5}px)`,
        }}
      >
        <div
          style={{
            opacity: 1 - dimForSlam * 0.66,
            filter: `blur(${dimForSlam * 3}px)`,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* The pretty app — pushed up and back as DevTools rips in. */}
          <div
            style={{
              opacity: interpolate(rip, [0, 1], [0, 0.8]),
              transform: `translateY(${interpolate(rip, [0, 1], [90, 0])}px) scale(${interpolate(rip, [0, 1], [1, 0.94])})`,
              transformOrigin: "50% 0%",
            }}
          >
            <WindowCard title={<UrlPill domain={appDomain} />} delay={2} pad="0">
              <AppMock width={914} delay={-20} showCards={false} />
            </WindowCard>
          </div>

          {/* DevTools panel. */}
          <div
            style={{
              marginTop: 34,
              borderRadius: 30,
              overflow: "hidden",
              border: `1px solid ${found ? secColors.danger : secColors.lineStrong}`,
              background: secColors.toolsBg,
              boxShadow: secColors.shadow,
              opacity: tools,
              transform: `translateY(${interpolate(tools, [0, 1], [420, 0])}px) scale(${1 + punchFound.pop * 0.012})`,
            }}
          >
            {/* Tab strip + search. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                gap: 34,
                height: 76,
                background: secColors.toolsBar,
                borderBottom: `1px solid ${secColors.line}`,
                fontFamily: theme.fonts.body,
                fontSize: 25,
              }}
            >
              {TABS.map((tab) => {
                const active = tab === "Sources";
                return (
                  <span
                    key={tab}
                    style={{
                      color: active ? secPalette.text : secPalette.textDim,
                      fontWeight: active ? 700 : 400,
                      borderBottom: `4px solid ${active ? secPalette.accent : "transparent"}`,
                      padding: "22px 2px",
                    }}
                  >
                    {tab}
                  </span>
                );
              })}
              <span style={{ flex: 1 }} />
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: `1px solid ${found ? secColors.danger : secColors.lineStrong}`,
                  background: secColors.surfaceStrong,
                  fontFamily: theme.fonts.mono,
                  fontSize: 25,
                  color: secPalette.text,
                  minWidth: 210,
                }}
              >
                <span style={{ color: secPalette.textDim }}>⌕</span>
                {query}
                <span
                  style={{
                    width: 13,
                    height: 30,
                    background: secPalette.accent,
                    opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.15,
                  }}
                />
                <span style={{ flex: 1 }} />
                {found ? (
                  <span
                    style={{
                      color: secColors.danger,
                      fontWeight: 700,
                      opacity: foundPop,
                      whiteSpace: "nowrap",
                    }}
                  >
                    3 hits
                  </span>
                ) : null}
              </span>
            </div>

            {/* Bundle source with the scan + the found key. */}
            <div
              style={{
                padding: "18px 0 22px",
                fontFamily: theme.fonts.mono,
                fontSize: 25.5,
                lineHeight: 1.5,
              }}
            >
              {LINES_BEFORE.map((c, i) => line(c, i))}
              <div
                style={{
                  display: "flex",
                  gap: 22,
                  padding: "7px 22px",
                  background: found ? secColors.dangerSoft : "transparent",
                  borderLeft: `4px solid ${found ? secColors.danger : "transparent"}`,
                  transform: `scale(${1 + punchFound.pop * 0.03})`,
                  transformOrigin: "8% 50%",
                }}
              >
                <span style={{ color: syntax.comment, minWidth: 44, textAlign: "right" }}>
                  {141 + FOUND_INDEX}
                </span>
                <span style={{ whiteSpace: "pre", color: syntax.punct }}>
                  {'Authorization:"Bearer '}
                  <span
                    style={{
                      color: found ? secColors.danger : syntax.str,
                      fontWeight: found ? 800 : 500,
                      background: found ? secColors.dangerSoft : "transparent",
                      borderRadius: 6,
                      padding: found ? "2px 6px" : 0,
                      textShadow: found ? `0 0 26px ${secColors.dangerGlow}` : undefined,
                    }}
                  >
                    {secretValue}
                  </span>
                  {'"},'}
                </span>
              </div>
              {LINES_AFTER.map((c, i) => line(c, FOUND_INDEX + 1 + i))}
            </div>
          </div>
        </div>

        {/* The verdict. */}
        <div
          style={{
            position: "absolute",
            inset: "0 82px 120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 8,
            transform: "rotate(2deg)",
          }}
        >
          <Slam text="ANYONE" at={SLAM_AT} size={168} color={secColors.danger} />
          <Slam text="CAN SEE THIS." at={SLAM_AT + 4} size={124} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 50%, ${secColors.dangerGlow}, transparent 64%)`,
          opacity: punchSlam.energy * 0.42 + punchFound.energy * 0.18,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: secPalette.text,
          opacity: frame >= SLAM_AT && frame < SLAM_AT + 2 ? 0.16 : 0,
        }}
      />
    </SceneShell>
  );
};
