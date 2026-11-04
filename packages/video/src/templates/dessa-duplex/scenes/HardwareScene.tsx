// Beat 5. One number holds the frame: «1». First СТОЙКА over the real GB200
// NVL72 rack (server-room footage behind), then on «А работает даже на
// Макбуке» the rack slides away, the glowing MacBook drops in, the word flips.
import React from "react";
import { interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch } from "../../../reel";
import { ddColors as colors, ddPalette as palette } from "../palette";
import { CUES } from "../timeline";
import { AppleMark, clamp, Drift, Flash, Glass, IMG, Kicker, media, Mono, PosterShell, RackCompare, Serif, WIDE, X0, X1 } from "../ui";

const C = CUES.hardware;

export const HardwareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const swap = interpolate(frame, [f(C.mac) - 4, f(C.mac) + 8], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const mac = frame >= f(C.mac);
  const hit = usePunch(f(C.mac), 16);
  const one = useIn(-4, "bouncy");
  const rack = useIn(-6, "smooth");
  const macIn = useIn(f(C.mac), "smooth");
  const word = useIn(mac ? f(C.mac) : -2, "snappy");
  const apple = useIn(f(C.mac) + 8, "bouncy");

  return (
    <PosterShell shake={hit.shake} glowY={1200}>
      {/* server room, dimmed, full-bleed behind the rack */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.38 * (1 - swap) }}>
        <OffthreadVideo src={media("media/dessa-duplex/server-rack.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) brightness(0.55) contrast(1.2)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bg}55 40%, ${palette.bg} 100%)` }} />
      </div>

      <Kicker left={mac ? "А ЗАПУСКАЕТСЯ" : "ОБУЧИЛИ НА"} right={mac ? "MACBOOK PRO M4 MAX" : "NVIDIA GB200 NVL72"} at={2} />

      {/* the rack */}
      <div style={{ position: "absolute", left: 660, top: 250, width: 310, zIndex: 3, opacity: rack * (1 - swap), transform: `translateX(${interpolate(rack, [0, 1], [200, 0]) + swap * 600}px) rotate(${swap * 10}deg)` }}>
        <Drift src={IMG.gb200.src} w={310} h={310 * IMG.gb200.ratio} style={{ borderRadius: 30, border: "1.5px solid rgba(255,255,255,0.2)", boxShadow: colors.shadow }} />
        <Mono size={15} color={colors.lineStrong} style={{ marginTop: 12 }}>фото: Geekerwan, CC BY 3.0</Mono>
      </div>

      {/* the MacBook */}
      {mac && (
        <div style={{ position: "absolute", left: 40, top: 700, width: 1000, zIndex: 3, opacity: macIn, transform: `translateY(${interpolate(macIn, [0, 1], [-260, 0])}px) scale(${interpolate(macIn, [0, 1], [1.3, 1])})` }}>
          <Drift src={IMG.macbook.src} w={1000} h={880} at={f(C.mac)} style={{ WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 50%, #000 55%, transparent 100%)", maskImage: "radial-gradient(ellipse 55% 50% at 50% 50%, #000 55%, transparent 100%)" }} imgStyle={{ objectPosition: "50% 55%" }} />
        </div>
      )}

      {/* the one number */}
      <div style={{ position: "absolute", left: X0, top: interpolate(swap, [0, 1], [300, 250]), zIndex: 6 }}>
        <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 420, lineHeight: 0.8, letterSpacing: "-0.05em", color: palette.primary, textShadow: `0 0 90px ${palette.glow}`, opacity: one, transform: `scale(${interpolate(one, [0, 1], [1.6, 1]) + hit.pop * 0.08})`, transformOrigin: "0% 100%" }}>1</div>
        <div style={{ opacity: word, transform: `translateY(${interpolate(word, [0, 1], [50, 0])}px)` }}>
          <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: mac ? 104 : 92, letterSpacing: "-0.04em", lineHeight: 1, color: palette.text, marginTop: 24 }}>{mac ? "НОУТБУК" : "СТОЙКА"}</div>
          <Serif size={mac ? 120 : 96} style={{ marginTop: 8 }}>{mac ? "без облака" : "для обучения"}</Serif>
        </div>
      </div>
      {/* hundreds of racks vs one */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${swap * 200}px)` }}>
        <Glass x={X0 - 10} y={1000} w={X1 - X0 + 20} h={560} at={4}>
          <RackCompare at={8} />
        </Glass>
      </div>

      {/* Apple, chrome on glass */}
      {mac && (
        <div style={{ position: "absolute", left: X0, top: 1380, zIndex: 7, display: "flex", alignItems: "center", gap: 28, opacity: apple, transform: `translateY(${interpolate(apple, [0, 1], [80, 0])}px) scale(${interpolate(apple, [0, 1], [0.6, 1])})`, transformOrigin: "0% 50%" }}>
          <div style={{ width: 190, height: 190, borderRadius: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,255,255,0.2)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }}>
            <AppleMark size={104} />
          </div>
          <div>
            <div style={{ fontFamily: WIDE, fontWeight: 900, fontSize: 64, letterSpacing: "-0.03em", color: palette.text, lineHeight: 1 }}>M4 MAX</div>
            <Mono size={20} style={{ marginTop: 10 }}>ЛОКАЛЬНО, БЫСТРЕЕ РЕЧИ</Mono>
          </div>
        </div>
      )}
      <Flash amount={hit.energy} />
    </PosterShell>
  );
};
