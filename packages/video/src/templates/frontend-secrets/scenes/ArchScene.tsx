import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../theme";
import { secColors, secPalette } from "../palette";
import {
  BrandBar,
  Chip,
  Eyebrow,
  KeyGlyph,
  Kinetic,
  LockGlyph,
  SceneShell,
  useIn,
  usePunch,
  useRamp,
} from "../ui";

const RAIL_H = 108;

const BrowserGlyph: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <rect x="2.6" y="4" width="18.8" height="16" rx="2.6" stroke={secPalette.accent} strokeWidth="1.9" />
    <path d="M2.6 8.6h18.8" stroke={secPalette.accent} strokeWidth="1.9" />
    <circle cx="5.4" cy="6.3" r="0.95" fill={secPalette.accent} />
    <circle cx="8.2" cy="6.3" r="0.95" fill={secPalette.accent} />
  </svg>
);

const ServerGlyph: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <rect x="3.4" y="3.4" width="17.2" height="7.4" rx="2" stroke={secPalette.text} strokeWidth="1.9" />
    <rect x="3.4" y="13.2" width="17.2" height="7.4" rx="2" stroke={secPalette.text} strokeWidth="1.9" />
    <circle cx="7" cy="7.1" r="1.05" fill={secColors.good} />
    <circle cx="7" cy="16.9" r="1.05" fill={secColors.good} />
    <path d="M11 7.1h6.4M11 16.9h6.4" stroke={secColors.lineStrong} strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

const CloudGlyph: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 18.5a4.3 4.3 0 0 1-.6-8.55A5.4 5.4 0 0 1 17 8.9a4.1 4.1 0 0 1 .4 8.1z"
      stroke={secPalette.textDim}
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
  </svg>
);

const Node: React.FC<{
  delay: number;
  icon: React.ReactNode;
  label: string;
  sub: string;
  right?: React.ReactNode;
  glow?: boolean;
}> = ({ delay, icon, label, sub, right, glow }) => {
  const p = useIn(delay, "smooth");
  return (
    <div
      style={{
        borderRadius: 28,
        border: `1px solid ${glow ? secPalette.primary : secColors.lineStrong}`,
        background: secColors.surface,
        boxShadow: glow ? `0 30px 90px -40px ${secPalette.glow}` : secColors.shadow,
        padding: "26px 34px",
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px) scale(${interpolate(p, [0, 1], [0.93, 1])})`,
      }}
    >
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: secPalette.text,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 23,
            color: secPalette.textDim,
            marginTop: 4,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      </div>
      {right}
    </div>
  );
};

/** Vertical connector; `down`/`up` are 0→1 progress for a traveling pulse. */
const Rail: React.FC<{
  down?: number;
  up?: number;
  downColor?: string;
  upColor?: string;
  withKey?: boolean;
  chip?: React.ReactNode;
}> = ({ down = 0, up = 0, downColor = secPalette.accent, upColor = secColors.good, withKey, chip }) => (
  <div style={{ position: "relative", height: RAIL_H }}>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 6,
        bottom: 6,
        width: 5,
        borderRadius: 3,
        transform: "translateX(-50%)",
        background: secColors.line,
      }}
    />
    {down > 0 && down < 1 ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: interpolate(down, [0, 1], [2, RAIL_H - 22]),
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            background: downColor,
            boxShadow: `0 0 30px ${downColor}`,
          }}
        />
        {withKey ? <KeyGlyph size={38} /> : null}
      </div>
    ) : null}
    {up > 0 && up < 1 ? (
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: interpolate(up, [0, 1], [RAIL_H - 22, 2]),
          transform: "translateX(-50%)",
          width: 22,
          height: 22,
          borderRadius: 11,
          background: upColor,
          boxShadow: `0 0 30px ${upColor}`,
        }}
      />
    ) : null}
    {chip ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(60px, -50%)",
        }}
      >
        {chip}
      </div>
    ) : null}
  </div>
);

/** 18.1–24.6s — BROWSER → BACKEND → API; the secret never crosses back up. */
export const ArchScene: React.FC<{
  brandName: string;
  chapter: string;
}> = ({ brandName, chapter }) => {
  const ask = useRamp(30, 58, theme.ease.inOut);
  const use_ = useRamp(84, 110, theme.ease.inOut);
  const back2 = useRamp(134, 150, theme.ease.inOut);
  const back1 = useRamp(150, 166, theme.ease.inOut);
  const lockPunch = usePunch(150, 14);
  const vaultOn = useRamp(84, 92, theme.ease.out);

  return (
    <SceneShell>
      <BrandBar brandName={brandName} chapter={chapter} />
      <AbsoluteFill
        style={{
          padding: "292px 82px 230px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Eyebrow delay={0}>the fix</Eyebrow>
        <div style={{ marginTop: 34, marginBottom: 56 }}>
          <Kinetic text="ASK YOUR BACKEND." size={96} delay={4} per={2} />
        </div>

        <Node
          delay={8}
          icon={<BrowserGlyph />}
          label="BROWSER"
          sub="your frontend — public"
          right={
            back1 >= 1 ? (
              <Chip delay={166} tone="good" size={24}>
                data
              </Chip>
            ) : undefined
          }
        />
        <Rail
          down={ask}
          chip={
            <Chip delay={32} tone="blue" size={24} dot={false}>
              asks — no secret attached
            </Chip>
          }
          up={back1}
        />
        <Node
          delay={14}
          icon={<ServerGlyph />}
          label="YOUR BACKEND"
          sub="private — you control it"
          glow={vaultOn > 0.4}
          right={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 22px",
                borderRadius: 18,
                border: `1px solid ${vaultOn > 0.4 ? secPalette.primary : secColors.lineStrong}`,
                background: secColors.surfaceLift,
                transform: `scale(${1 + lockPunch.pop * 0.12})`,
              }}
            >
              <KeyGlyph size={40} glow={vaultOn > 0.4} />
              <LockGlyph size={40} color={back2 > 0 ? secColors.good : secPalette.textDim} />
            </div>
          }
        />
        <Rail
          down={use_}
          downColor={secPalette.primary}
          withKey
          up={back2}
          chip={
            <Chip delay={86} tone="hero" size={24} dot={false}>
              uses the secret
            </Chip>
          }
        />
        <Node delay={20} icon={<CloudGlyph />} label="THIRD-PARTY API" sub="api.openai.com" />

        <div style={{ marginTop: 54, display: "flex", justifyContent: "center" }}>
          <Chip delay={152} tone="good" size={27}>
            the key never leaves the server
          </Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
