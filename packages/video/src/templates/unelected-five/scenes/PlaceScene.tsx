// One countdown beat: «N МЕСТО» slams full frame and docks to a badge, the
// person rises (a real photo, or the mask stays when no free photo exists),
// stat chips stack top right, a licensed clip plays in a screen, the number
// slams, then the stamp. Every place 5 → 1 is this scene with its own data
// (places.ts); frames are cut to the words of its voice clip.
import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { Chip, Flash, Kinetic, SceneShell, Stamp } from "../ui";
import { Clip, FIGURES, PersonPhoto, PhotoFigure, TikTokMark, Ticker, WavingFlag, asset } from "../parts";
import { Place } from "../places";
import { PLACE_SPEED } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Big «N МЕСТО» that lands full frame, then flies into the top-left badge. */
const Rank: React.FC<{ rank: number; dock: number }> = ({ rank, dock }) => {
  const hit = useIn(0, "snappy");
  const d = useRamp(dock, dock + 10, theme.ease.inOut);
  const docked = d > 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: interpolate(d, [0, 1], [0, 72]),
        top: interpolate(d, [0, 1], [430, 236]),
        width: interpolate(d, [0, 1], [1080, 520]),
        display: "flex",
        flexDirection: "column",
        alignItems: docked ? "flex-start" : "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: docked ? "row" : "column",
          alignItems: docked ? "baseline" : "center",
          gap: docked ? 16 : 0,
          opacity: Math.min(1, hit * 1.5),
          transform: `scale(${interpolate(hit, [0, 1], [1.6, 1]) * (docked ? 1 : 1 - d * 2 * 0.3)})`,
          transformOrigin: docked ? "left top" : "center",
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            fontSize: docked ? 96 : 520,
            lineHeight: 0.9,
            color: palette.primary,
            textShadow: `0 0 ${docked ? 30 : 120}px ${palette.glow}`,
          }}
        >
          {rank}
        </span>
        <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: docked ? 56 : 150, letterSpacing: "-0.01em", color: palette.text }}>
          МЕСТО
        </span>
      </div>
    </div>
  );
};

/** A line printed on thermal paper: the role under the name. */
const PaperStrip: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        padding: "8px 16px",
        background: colors.paper,
        color: colors.ink,
        fontFamily: theme.fonts.mono,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
        boxShadow: colors.paperShadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) rotate(-1deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** A number that slams in lime with its caption printed on paper under it. */
// Unbounded Black digits run ≈ 0.95em wide, a space ≈ 0.35em; 960px is the column.
const fitSize = (value: string) => Math.max(56, Math.min(118, Math.floor(960 / (value.replace(/ /g, "").length * 0.95 + (value.split(" ").length - 1) * 0.35))));
const hasLetters = (value: string) => /[А-ЯA-Z]/i.test(value);
const stampSize = (text: string) => Math.max(40, Math.min(96, Math.floor(960 / (text.replace(/ /g, "").length * 0.92 + (text.split(" ").length - 1) * 0.3))));

const BigNumber: React.FC<{ value: string; label: string; at: number; out?: number }> = ({ value, label, at, out }) => {
  const wrap = hasLetters(value);
  const size = wrap ? 92 : fitSize(value);
  const frame = useCurrentFrame();
  const p = useIn(at, "snappy");
  const hit = usePunch(at, 16);
  const leave = out === undefined ? 0 : interpolate(frame, [out - 8, out], [0, 1], { easing: theme.ease.in, ...clamp });
  if (frame < at || (out !== undefined && frame >= out)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1230,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        zIndex: 4,
        opacity: p * (1 - leave),
        transform: `translateY(${interpolate(p, [0, 1], [50, 0]) - leave * 40}px) scale(${1 + hit.pop * 0.06})`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          color: palette.primary,
          textShadow: `0 0 ${40 + hit.energy * 60}px ${palette.glow}`,
          whiteSpace: wrap ? "normal" : "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          padding: "8px 16px",
          background: colors.paper,
          color: colors.ink,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const PlaceScene: React.FC<{ place: Place }> = ({ place }) => {
  const frame = useCurrentFrame();
  const { rank } = place;
  const sp = (v: number) => Math.round(v / PLACE_SPEED);
  const at = {
    name: sp(place.at.name),
    stats: place.at.stats.map(sp),
    clip: sp(place.at.clip),
    num: sp(place.at.num),
    num2: place.at.num2 === undefined ? undefined : sp(place.at.num2),
    stamp: sp(place.at.stamp),
  };
  const slam = usePunch(0, 18);
  const num = usePunch(at.num, 14);
  const num2 = usePunch(at.num2 ?? 1e9, 14);
  const stamp = usePunch(at.stamp, 16);
  const nameIn = useIn(at.name, "snappy");
  const creditIn = interpolate(frame, [at.name + 12, at.name + 26], [0, 0.85], clamp);
  const clipOut = at.num2 ?? at.stamp; // the screen leaves when the second number (or the stamp) needs the frame
  const fallback = FIGURES[1];
  const ex = place.extras ?? {};
  const cpuIn = useIn(ex.cpu === undefined ? 1e9 : sp(ex.cpu), "snappy");
  const cpuHit = usePunch(ex.cpu === undefined ? 1e9 : sp(ex.cpu), 14);
  const putinIn = useIn(ex.putin === undefined ? 1e9 : sp(ex.putin), "smooth");
  const logosIn = useIn(ex.tiktok === undefined ? 1e9 : sp(ex.tiktok), "snappy");
  const crowdIn = useIn(ex.crowd === undefined ? 1e9 : sp(ex.crowd), "smooth");
  const leadersAt = ex.leaders === undefined ? undefined : sp(ex.leaders);
  const leadersIn = useIn(leadersAt ?? 1e9, "snappy");
  // one spring per portrait, called unconditionally (hooks may not sit under a condition)
  const leaderIn = [0, 1, 2].map((i) => useIn((leadersAt ?? 1e9) + i * 6, "snappy"));

  return (
    <SceneShell shake={slam.shake * 1.2 + num.shake * 0.6 + num2.shake * 0.6 + stamp.shake * 0.8}>
      <Rank rank={rank} dock={at.name - 6} />

      {/* the person: a real photo, or the mask that never came off */}
      {frame >= at.name - 1 &&
        (place.photo ? (
          <PersonPhoto
            src={place.photo.src}
            width={place.photo.width}
            ratio={place.photo.ratio}
            at={at.name}
            right={place.photo.right}
            bottom={place.photo.bottom}
            flip={place.photo.flip}
          />
        ) : (
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: nameIn, transform: `translateY(${interpolate(nameIn, [0, 1], [300, 0])}px)` }}>
            <PhotoFigure fig={{ ...fallback, width: 620, x: 470, y: 560, z: 1, tilt: 0, q: { x: 0.5, y: 0.38, size: 190 } }} seed={9} />
          </div>
        ))}

      {/* name + role, under the badge */}
      {frame >= at.name && (
        <div style={{ position: "absolute", left: 72, top: 400, width: 640, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <Kinetic text={place.name} size={rank === 1 ? 78 : 84} delay={at.name} per={3} mode="snap" lineHeight={1} />
          <PaperStrip delay={at.name + 10}>{place.role}</PaperStrip>
          {place.maskFallback && (
            <Chip delay={at.name + 22} tone="bad" size={22}>
              {place.maskFallback}
            </Chip>
          )}
        </div>
      )}

      {/* why they weigh: stat chips, top right, one per word */}
      {frame >= at.stats[0] && (
        <div style={{ position: "absolute", right: 60, top: 226, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          {place.stats.map((t, i) => (
            <Chip key={t} delay={at.stats[i]} tone={i === 0 ? "hero" : "neutral"} size={21} filled={i === 0}>
              {t}
            </Chip>
          ))}
        </div>
      )}

      {/* the evidence: a licensed clip in a screen, bottom left */}
      <Clip src={place.clip.src} from={place.clip.from} at={at.clip} out={clipOut} x={60} y={740} width={420} height={560} label={place.clip.label} />

      {/* the numbers */}
      <BigNumber value={place.num.value} label={place.num.label} at={at.num} out={at.num2 ?? leadersAt} />
      {place.num2 && at.num2 !== undefined && (
        <BigNumber value={place.num2.value} label={place.num2.label} at={at.num2} />
      )}

      {/* the stamp, last, held to the cut */}
      {frame >= at.stamp && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1470, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 6 }}>
          <Stamp tone={place.stamp.tone} size={stampSize(place.stamp.text)} rotate={-6} delay={at.stamp}>
            {place.stamp.text}
          </Stamp>
          {place.stamp.label && <PaperStrip delay={at.stamp + 8}>{place.stamp.label}</PaperStrip>}
        </div>
      )}

      {/* ---- the author's extras ---- */}
      {ex.cpu !== undefined && frame >= sp(ex.cpu) && (
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 820,
            width: 230,
            opacity: cpuIn,
            transform: `translateY(${interpolate(cpuIn, [0, 1], [-300, 0]) + Math.sin(frame / 15) * 4}px) scale(${1 + cpuHit.pop * 0.2}) rotate(${-8 + Math.sin(frame / 23) * 2}deg)`,
            filter: `drop-shadow(0 0 ${14 + cpuHit.energy * 30}px ${palette.glow}) drop-shadow(0 24px 30px rgba(0,0,0,0.7))`,
          }}
        >
          <Img src={asset("prop-cpu.png")} style={{ width: 230, display: "block" }} />
        </div>
      )}
      {ex.putin !== undefined && frame >= sp(ex.putin) - 1 && (
        <div
          style={{
            position: "absolute",
            right: -70,
            bottom: -40,
            width: 560,
            zIndex: 5,
            opacity: putinIn,
            transform: `translateY(${interpolate(putinIn, [0, 1], [300, 0])}px)`,
            filter: "grayscale(0.6) contrast(1.1) brightness(0.9) drop-shadow(0 30px 40px rgba(0,0,0,0.8))",
            maskImage: "linear-gradient(180deg, #000 70%, transparent 98%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 98%)",
          }}
        >
          <Img src={asset("putin2.png")} style={{ width: 560, display: "block" }} />
        </div>
      )}
      {ex.tiktok !== undefined && frame >= sp(ex.tiktok) && (
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 640,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: logosIn,
            transform: `translateY(${interpolate(logosIn, [0, 1], [30, 0])}px)`,
          }}
        >
          <TikTokMark size={66} />
          <span style={{ fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 40, color: palette.text, letterSpacing: "-0.02em" }}>TikTok</span>
          <div style={{ padding: "10px 16px", background: colors.white, borderRadius: 8, boxShadow: colors.paperShadow }}>
            <Img src={asset("bytedance.svg")} style={{ height: 28, display: "block" }} />
          </div>
        </div>
      )}
      {ex.crowd !== undefined && frame >= sp(ex.crowd) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1120,
            height: 230,
            overflow: "hidden",
            opacity: crowdIn * 0.85,
            transform: `scaleY(${interpolate(crowdIn, [0, 1], [0.6, 1])})`,
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <Img
            src={asset("crowd-china.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 40%",
              filter: "grayscale(0.55) contrast(1.15) brightness(0.55)",
              transform: `scale(${1.05 + (frame - sp(ex.crowd)) * 0.0006})`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${palette.bg} 0%, transparent 35%, transparent 65%, ${palette.bg} 100%)` }} />
        </div>
      )}
      {ex.ticker && <Ticker at={sp(ex.ticker.at)} top={1660} items={ex.ticker.items} />}
      {leadersAt !== undefined && frame >= leadersAt && (
        <div style={{ position: "absolute", left: 60, top: 1180, width: 640, opacity: leadersIn, transform: `translateY(${interpolate(leadersIn, [0, 1], [40, 0])}px)` }}>
          <div style={{ display: "flex", gap: 22, alignItems: "flex-end" }}>
            {[
              { src: "leader-jiang.png", name: "ЦЗЯН" },
              { src: "leader-hu.png", name: "ХУ" },
              { src: "leader-xi.png", name: "СИ" },
            ].map((l, i) => {
              const q = leaderIn[i];
              return (
                <div key={l.src} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: q, transform: `scale(${interpolate(q, [0, 1], [0.6, 1])})` }}>
                  <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", border: `5px solid ${colors.bad}`, background: colors.surfaceStrong, boxShadow: `0 0 30px ${colors.badGlow}` }}>
                    <Img src={asset(l.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", filter: "grayscale(0.5) contrast(1.1)" }} />
                  </div>
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: colors.bad }}>{l.name}</span>
                </div>
              );
            })}
          </div>
          {/* arrows, TikTok-style, to the man on the right */}
          <svg width={1020} height={260} style={{ position: "absolute", left: 0, top: -40, overflow: "visible" }}>
            {[0, 1, 2].map((i) => {
              const x0 = 150 + i * 172;
              const dash = (frame - leadersAt) * 6;
              return (
                <g key={i} opacity={Math.min(1, Math.max(0, (frame - leadersAt - i * 6) / 10))}>
                  <path d={`M${x0} 60 C ${x0 + 120} -20, 700 -60, 840 -120`} stroke={colors.bad} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="18 12" strokeDashoffset={-dash} />
                  <path d="M840 -120 L800 -118 L826 -90 Z" fill={colors.bad} transform={`translate(${Math.sin(frame / 7) * 3}, 0)`} />
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: 16, fontFamily: theme.fonts.wide, fontWeight: 900, fontSize: 50, lineHeight: 1, whiteSpace: "nowrap", color: colors.bad, textShadow: `0 0 30px ${colors.badGlow}` }}>
            3 ВОЖДЯ · 1 АВТОР
          </div>
        </div>
      )}
      {ex.flag !== undefined && frame >= sp(ex.flag) && <WavingFlag src={asset("flag-cn.svg")} ratio={1.5} width={400} x={50} y={780} rotate={-6} at={sp(ex.flag)} />}

      {/* CC BY needs the credit on screen while the photo is */}
      {place.photo && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1600,
            textAlign: "center",
            fontFamily: theme.fonts.mono,
            fontSize: 17,
            letterSpacing: "0.06em",
            color: palette.textDim,
            opacity: creditIn,
          }}
        >
          {place.photo.credit}
        </div>
      )}

      <Flash amount={Math.max(num.energy, num2.energy)} />
      <Flash amount={stamp.energy} color={place.stamp.tone === "bad" ? colors.bad : palette.primary} />
    </SceneShell>
  );
};
