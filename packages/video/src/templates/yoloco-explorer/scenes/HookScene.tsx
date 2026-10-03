// 01 hook — "any creators in 3 minutes", then three briefs fired at the
// product one after another (taxi drivers in Nigeria, moms in Australia,
// finance pros in New York), each pulling a swarm of creators around it, then
// «Засекайте!» — the clock starts (drawn by the composition, it outlives the beat).
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../theme";
import { exColors, exPalette } from "../palette";
import { COPY, Lang, Platform } from "../copy";
import { cues } from "../timeline";
import { Flash, Ico, PlatformGlyph, SceneShell, ease, fitSize, flashAt, springAt } from "../ui";

const LETTERS = "AKMOSTJRDLENVBZ";
const HUES = ["#6071FF", "#8B5CF6", "#3B82F6", "#A5B0FF", "#4B49C4", "#7C83FF", "#5B6CFF"];
const NETS: Platform[] = ["instagram", "tiktok", "youtube", "telegram"];

/** A ring of creator dots bursting out of the query, with platform badges. */
const Swarm: React.FC<{ at: number; seed: number }> = ({ at, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const n = 14;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + seed * 0.7;
        const ring = i % 2 === 0 ? 1 : 0.72;
        const p = springAt(frame, fps, at + i * 1.6, "bouncy");
        const rx = 420 * ring;
        const ry = 300 * ring;
        const x = 540 + Math.cos(a + t * 0.25) * rx * p;
        const y = 960 + Math.sin(a + t * 0.25) * ry * p;
        const size = i % 3 === 0 ? 96 : 76;
        const hue = HUES[(i + seed * 3) % HUES.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              opacity: p,
              transform: `scale(${p})`,
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: hue,
                border: `3px solid ${exColors.surfaceStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.body,
                fontWeight: 900,
                fontSize: size * 0.38,
                color: "#fff",
              }}
            >
              {LETTERS[(i * 7 + seed * 5) % LETTERS.length]}
            </div>
            <div style={{ position: "absolute", right: -4, bottom: -4, borderRadius: 10, boxShadow: `0 0 0 3px ${exColors.surfaceStrong}` }}>
              <PlatformGlyph p={NETS[(i + seed) % 4]} size={size * 0.36} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export const HookScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];
  const c = cues(lang, "hook").map((s) => Math.round(s * fps));
  // phases: 0 promise, 1–3 the three briefs, 4 «start the clock»
  const starts = [0, c[2], c[3], c[4], c[5]];
  const phase = starts.reduce((acc, s, i) => (frame >= s - 2 ? i : acc), 0);
  const local = frame - starts[phase];
  const cut = Math.max(...starts.slice(1).map((s) => flashAt(frame, s)));
  const punch = 1 + cut * 0.08;

  let body: React.ReactNode = null;
  if (phase === 0) {
    const [a, b] = copy.hookAny;
    const size = fitSize(a, 900, 132);
    const pa = springAt(frame, fps, -5, "snappy");
    const pb = springAt(frame, fps, c[1] - 4, "snappy");
    const ring = ease(frame, c[1], c[2]);
    body = (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
          <div
            style={{
              fontFamily: theme.fonts.wide,
              fontWeight: 900,
              fontSize: size,
              letterSpacing: "-0.03em",
              color: exPalette.text,
              opacity: pa,
              transform: `translateY(${interpolate(pa, [0, 1], [90, 0])}px) scale(${interpolate(pa, [0, 1], [1.25, 1])})`,
            }}
          >
            {a}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700 + size * 1.35, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "18px 40px",
              borderRadius: 999,
              background: exPalette.primary,
              boxShadow: `0 30px 80px -20px ${exPalette.glow}`,
              opacity: pb,
              transform: `translateY(${interpolate(pb, [0, 1], [60, 0])}px) scale(${interpolate(pb, [0, 1], [0.7, 1])})`,
            }}
          >
            <svg width="62" height="62" viewBox="0 0 62 62">
              <circle cx="31" cy="33" r="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
              <circle
                cx="31"
                cy="33"
                r="24"
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${ring * 150.8} 150.8`}
                transform="rotate(-90 31 33)"
              />
            </svg>
            <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: fitSize(b, 640, 76), color: "#fff", letterSpacing: "-0.02em" }}>{b}</span>
          </div>
        </div>
      </>
    );
  } else if (phase <= 3) {
    const q = copy.hookQueries[phase - 1];
    const typed = Math.min(q.who.length, Math.floor(Math.max(0, local) / 1.4));
    const pin = springAt(local, fps, 6, "bouncy");
    const count = Math.round(interpolate(local, [4, 30], [0, [48, 63, 37][phase - 1]], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out }));
    body = (
      <>
        <Swarm at={starts[phase] + 2} seed={phase} />
        {/* the brief, in the product's own field */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "26px 36px",
              borderRadius: 34,
              background: exColors.card,
              boxShadow: `0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 6px ${exPalette.primary}55`,
              fontFamily: theme.fonts.body,
            }}
          >
            <Ico k="sparkle" size={46} color={exPalette.primary} fill />
            <span style={{ fontSize: fitSize(q.who, 520, 74) * 1.05, fontWeight: 800, color: exColors.appInk, letterSpacing: "-0.03em" }}>
              {q.who.slice(0, typed)}
              <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: exPalette.primary }}>|</span>
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1046,
            display: "flex",
            justifyContent: "center",
            opacity: pin,
            transform: `translateY(${interpolate(pin, [0, 1], [40, 0])}px) scale(${pin})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 28px",
              borderRadius: 999,
              background: exColors.surfaceStrong,
              border: `1.5px solid ${exColors.lineStrong}`,
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 44,
              color: exPalette.text,
            }}
          >
            <span style={{ fontSize: 46 }}>{q.flag}</span>
            {q.where}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: theme.fonts.mono }}>
          <span style={{ fontSize: 96, fontWeight: 800, color: exPalette.text }}>+{count}</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: exPalette.textDim, marginLeft: 18, letterSpacing: "0.08em" }}>{copy.hookFound}</span>
        </div>
      </>
    );
  } else {
    const p = springAt(local, fps, 0, "snappy");
    body = (
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
        <div
          style={{
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            fontSize: fitSize(copy.hookStart, 940, 120),
            color: exPalette.text,
            opacity: p,
            transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`,
            letterSpacing: "-0.03em",
          }}
        >
          {copy.hookStart}
        </div>
      </div>
    );
  }

  return (
    <SceneShell>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch})` }}>{body}</div>
      <Flash amount={cut} />
    </SceneShell>
  );
};
