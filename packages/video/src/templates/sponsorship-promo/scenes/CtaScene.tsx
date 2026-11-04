import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { sp } from "../palette";
import { Big, F, Icon, IconKind, Pill, PostWall, Rise, Slam, Wordmark, useFloat, useRampSec, useSpringAt } from "../ui";

// The wall comes back (the loop to frame 0). Over it: the mark, the site, the
// tab, the punch «СКОЛЬКО · КАК · У КОГО» on the words, and a QR to yoloco.io.
const WIDGETS: { k: IconKind; l: string; v: string; c: string }[] = [
  { k: "bolt", l: "бюджет", v: "72 млн ₽", c: sp.violet },
  { k: "crown", l: "доля VOIS", v: "81%", c: sp.vois },
  { k: "users", l: "блогеров", v: "516", c: sp.violet },
  { k: "doc", l: "кампаний", v: "142", c: sp.violet },
];

const CtaWidget: React.FC<(typeof WIDGETS)[number] & { i: number }> = ({ k, l, v, c, i }) => {
  const p = useSpringAt(4.4 + i * 0.18, "bouncy");
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 30 + (i % 2) * 320, top: 1130 + Math.floor(i / 2) * 150, transform: `translateY(${(1 - p) * 300 + Math.sin((frame + i * 12) / 15) * 6}px) rotate(${(i % 2 ? 4 : -4)}deg) scale(${p})`, opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: sp.white, borderRadius: 24, padding: "14px 18px", width: 300, fontFamily: F, boxShadow: "0 18px 40px -12px rgba(0,0,0,0.6)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon kind={k} size={34} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: sp.mutedDark, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
          <div style={{ fontSize: 36, fontWeight: 900, whiteSpace: "nowrap", color: c === sp.vois ? sp.vois : sp.ink, letterSpacing: "-0.03em" }}>{v}</div>
        </div>
      </div>
    </div>
  );
};

export const CtaScene: React.FC<{ site: string; section: string }> = ({ site, section }) => {
  const frame = useCurrentFrame();
  const wall = useRampSec(0, 0.6);
  const qr = useSpringAt(1.6, "bouncy");
  const fl = useFloat(8, 50);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: wall }}>
        <PostWall dim={0.95} speed={1.4} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 140, gap: 26 }}>
        <Rise at={0.05}>
          <Wordmark size={120} />
        </Rise>
        <Rise at={0.3}>
          <Big size={110} color={sp.white} style={{ textShadow: `0 0 50px ${sp.violetGlow}` }}>{site}</Big>
        </Rise>
        <Rise at={0.95}>
          <Pill size={50} style={{ boxShadow: `0 0 70px ${sp.violetGlow}` }}>
            Раздел «{section}»
            <span style={{ background: sp.white, color: sp.violet, borderRadius: 999, fontSize: 26, padding: "6px 14px" }}>NEW</span>
          </Pill>
        </Rise>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Slam at={2.35} tilt={-2}><Big size={76} color={sp.violetTint}>УЗНАЙ</Big></Slam>
          <Slam at={2.95} tilt={2}><Big size={124} color={sp.white}>СКОЛЬКО,</Big></Slam>
          <Slam at={3.45} tilt={-2}><Big size={124} color={sp.white}>КАК</Big></Slam>
          <Slam at={3.85} tilt={2}>
            <div style={{ background: sp.violet, borderRadius: 26, padding: "4px 30px", boxShadow: `0 0 80px ${sp.violetGlow}` }}>
              <Big size={124} color={sp.white}>И У КОГО</Big>
            </div>
          </Slam>
        </div>
      </AbsoluteFill>
      {/* what you get, as report widgets stacking up next to the QR */}
      {WIDGETS.map((w, i) => (
        <CtaWidget key={w.l} {...w} i={i} />
      ))}
      {/* QR card: straight, static, high contrast, so a phone can read it off the screen */}
      <div style={{ position: "absolute", right: 36, top: 1090, transform: `scale(${qr})`, opacity: qr }}>
        <div style={{ background: sp.white, borderRadius: 30, padding: 18, boxShadow: `0 0 0 6px ${sp.violet}, 0 0 90px ${sp.violetGlow}` }}>
          <Img src={staticFile("media/sponsorship-promo/gen/qr-app.png")} style={{ width: 330, height: 330, display: "block" }} />
          <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 30, color: sp.ink, marginTop: 6 }}>app.yoloco.io</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
