import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { sp } from "../palette";
import { Backdrop, Big, Cut, F, Glitch, Icon, POSTS, PostTile, Rise, Slam, Sparkle, clamp, useFloat, useHit, useRampSec, useSpringAt } from "../ui";

// The ultra beat (author 2026-10-20): the AI tells an ad from an ordinary
// post. A: posts run through the AI gate and split: ads go up with a violet
// check, ordinary posts drop grey. B: 99% of ads found, by our tests, with
// the three test metrics in small print.
const B = 2.7;
const HIT = 3.85;
// which tiles are ads (true) in the stream; real ad thumbnails from the report either way
const STREAM = [true, false, true, true, false, true, false, true, true, false, true, true];

export const UltraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const toB = useRampSec(B - 0.15, B + 0.25);
  const hit = useHit(HIT, 0.55);
  const ring = useRampSec(B + 0.2, HIT, (x) => 1 - Math.pow(1 - x, 3));
  const big = useSpringAt(B + 0.1, "snappy");
  const fl = useFloat(8, 46);
  const R = 300;
  const C = 2 * Math.PI * R;
  return (
    <Cut shake={hit.shake}>
      <Backdrop intensity={1.4} />
      {/* A: the gate */}
      {t < B + 0.3 && (
        <AbsoluteFill style={{ opacity: 1 - toB }}>
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
            <Slam at={0.02} tilt={-2}><Big size={96} color={sp.white}>РЕКЛАМА ИЛИ НЕТ?</Big></Slam>
          </AbsoluteFill>
          {/* the gate: a violet beam with the AI mark */}
          <div style={{ position: "absolute", left: 525, top: 420, width: 30, height: 900, borderRadius: 30, background: `linear-gradient(180deg, transparent, ${sp.violet}, transparent)`, boxShadow: `0 0 80px 20px ${sp.violetGlow}` }} />
          <div style={{ position: "absolute", left: 470, top: 810, width: 140, height: 140, borderRadius: 140, background: sp.violet, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${sp.violetGlow}` }}>
            <Sparkle size={80} />
          </div>
          {STREAM.map((ad, i) => {
            const start = i * 0.2;
            const k = (t - start) / 1.5; // 0..1 across the screen
            if (k < 0 || k > 1.1) return null;
            const x = interpolate(k, [0, 1], [-200, 1150]);
            const after = Math.max(0, (x - 540) / 600);
            const y = 820 + (ad ? -1 : 1) * after * 330;
            const passed = x > 560;
            return (
              <div key={i} style={{ position: "absolute", left: x - 70, top: y - 120, transform: `rotate(${passed ? (ad ? -8 : 8) : 0}deg)`, opacity: passed && !ad ? 0.45 : 1 }}>
                <div style={{ borderRadius: 18, outline: passed && ad ? `5px solid ${sp.violet}` : undefined, filter: passed && !ad ? "grayscale(1)" : undefined }}>
                  <PostTile file={POSTS[(i * 3 + 2) % POSTS.length]} w={140} radius={18} drift={i} />
                </div>
                {passed && (
                  <div style={{ position: "absolute", top: -22, right: -22, width: 54, height: 54, borderRadius: 54, background: ad ? sp.violet : sp.muted, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${sp.white}` }}>
                    <Icon kind={ad ? "check" : "close"} size={34} />
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 640, top: 360, fontFamily: F, fontWeight: 900, fontSize: 40, color: sp.violetTint }}>реклама</div>
          <div style={{ position: "absolute", left: 640, top: 1260, fontFamily: F, fontWeight: 800, fontSize: 36, color: sp.muted }}>обычный пост</div>
        </AbsoluteFill>
      )}
      {/* B: 99% */}
      {t >= B - 0.15 && (
        <AbsoluteFill style={{ opacity: toB, alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
          <Rise at={B}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 44, color: sp.violetTint, letterSpacing: "0.04em", textTransform: "uppercase" }}>по нашим тестам</div>
          </Rise>
          <div style={{ position: "relative", width: 700, height: 700, marginTop: 20, transform: `translateY(${fl}px) scale(${interpolate(big, [0, 1], [0.6, 1]) + hit.pop * 0.08})`, opacity: big }}>
            <svg width={700} height={700} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
              <circle cx={350} cy={350} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={34} />
              <circle cx={350} cy={350} r={R} fill="none" stroke={sp.violet} strokeWidth={34} strokeLinecap="round" strokeDasharray={`${C * 0.99 * ring} ${C}`} style={{ filter: `drop-shadow(0 0 24px ${sp.violetGlow})` }} />
            </svg>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <Glitch amt={hit.pop}>
                <Big size={270} color={sp.white} style={{ textShadow: `0 0 90px ${sp.violetGlow}` }}>
                  {Math.round(ring * 99)}%
                </Big>
              </Glitch>
              <div style={{ fontFamily: F, fontWeight: 900, fontSize: 56, color: sp.white, marginTop: 6 }}>рекламы находим</div>
            </AbsoluteFill>
          </div>
          {/* the small print (author's figures) */}
          <div style={{ position: "absolute", top: 1330, width: 1000, textAlign: "center", fontFamily: F, fontSize: 28, fontWeight: 600, color: sp.muted, opacity: interpolate(t, [B + 0.6, B + 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            Точность 93% · Полнота 99% · Доля верных решений 95%
          </div>
        </AbsoluteFill>
      )}
    </Cut>
  );
};
