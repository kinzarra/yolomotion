// One countdown beat: «N МЕСТО» slams full frame, shrinks to a badge, the
// person rises, then the mechanism plays in three hits — what they do, when,
// and what it does to the ruble. Every place 5 → 1 is this scene with its
// own data (places.ts); the frames are cut to the words of its voice clip.
import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import { Chip, Cross, Flash, Kinetic, SceneShell } from "../ui";
import { asset } from "../parts";
import { Place } from "../places";
import { PLACE_SPEED } from "../timeline";
import { CutoffGauge, Stamps, SubscribeButton } from "../beats";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useRampValue = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { easing: theme.ease.out, ...clamp });

/** The company logo on a paper card — the logo's wordmark is dark ink. */
const LogoCard: React.FC<{ src: string; delay: number }> = ({ src, delay }) => {
  const p = useIn(delay, "snappy");
  return (
    <div
      style={{
        padding: "12px 18px",
        background: colors.paper,
        borderRadius: 10,
        boxShadow: colors.paperShadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
      }}
    >
      <Img src={asset(src)} style={{ height: 112, display: "block" }} />
    </div>
  );
};

/** Big «N МЕСТО» that lands full frame, then flies into the top-left badge. */
const Rank: React.FC<{ rank: number; dock: number }> = ({ rank, dock }) => {
  const hit = useIn(0, "snappy");
  const d = useRamp(dock, dock + 10, theme.ease.inOut);
  const scale = interpolate(d, [0, 1], [1, 0.2]);
  return (
    <div
      style={{
        position: "absolute",
        left: interpolate(d, [0, 1], [0, 72]),
        top: interpolate(d, [0, 1], [430, 236]),
        width: interpolate(d, [0, 1], [1080, 520]),
        display: "flex",
        flexDirection: "column",
        alignItems: d > 0.5 ? "flex-start" : "center",
        transformOrigin: "left top",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: d > 0.5 ? "row" : "column",
          alignItems: d > 0.5 ? "baseline" : "center",
          gap: d > 0.5 ? 16 : 0,
          opacity: Math.min(1, hit * 1.5),
          transform: `scale(${interpolate(hit, [0, 1], [1.6, 1]) * (d > 0.5 ? 1 : scale + (1 - scale) * (1 - d * 2))})`,
          transformOrigin: d > 0.5 ? "left top" : "center",
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            fontSize: d > 0.5 ? 96 : 520,
            lineHeight: 0.9,
            color: palette.primary,
            textShadow: `0 0 ${d > 0.5 ? 30 : 120}px ${palette.glow}`,
          }}
        >
          {rank}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.wide,
            fontWeight: 900,
            fontSize: d > 0.5 ? 56 : 150,
            letterSpacing: "-0.01em",
            color: palette.text,
          }}
        >
          МЕСТО
        </span>
      </div>
    </div>
  );
};

/** Arrow drawn in CSS: Unbounded has no arrow glyphs. */
const Arrow: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center", opacity: p }}>
    <div style={{ width: 70 * p, height: 8, background: palette.primary }} />
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: "18px solid transparent",
        borderBottom: "18px solid transparent",
        borderLeft: `26px solid ${palette.primary}`,
      }}
    />
  </div>
);

export const PlaceScene: React.FC<{ place: Place }> = ({ place }) => {
  const frame = useCurrentFrame();
  const { rank } = place;
  // places.ts holds frames at recorded speed; the reel plays PLACE_SPEED faster
  const at = Object.fromEntries(
    Object.entries(place.at).map(([k, v]) => [k, v === undefined ? v : Math.round(v / PLACE_SPEED)]),
  ) as Place["at"];
  const slam = usePunch(0, 18);
  const act = usePunch(at.act, 14);
  const result = usePunch(at.result, 16);
  const meme = useIn(at.meme, "bouncy");
  const memeHit = usePunch(at.meme, 14);
  const rigIn = useIn(at.role, "smooth");

  const rise = useIn(at.name - 4, "smooth");
  const nameOut = useRamp(at.act - 2, at.act + 6, theme.ease.in);
  const flowIn = useIn(at.act, "snappy");
  const arrow = useRamp(at.act + 6, at.act + 16);
  const kb = interpolate(frame, [at.name, at.name + 200], [1, 1.07], clamp);

  return (
    <SceneShell shake={slam.shake * 1.2 + act.shake * 0.5 + result.shake * 0.7 + memeHit.shake * 0.6}>
      <Rank rank={rank} dock={at.name - 6} />

      {/* why they weigh: stat chips stacking top right */}
      {frame >= at.name && (
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 226,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          {place.stats.map((t, i) => (
            <Chip key={t} delay={at.name + 8 + i * 7} tone={i === 0 ? "hero" : "neutral"} size={26} filled={i === 0}>
              {t}
            </Chip>
          ))}
        </div>
      )}

      {/* the real thing behind the money: two rigs flanking the person */}
      {place.rig &&
        frame >= at.role - 1 &&
        (["left", "right"] as const).map((side, i) => (
          <div
            key={side}
            style={{
              position: "absolute",
              [side]: -70,
              top: 720,
              width: 440,
              opacity: rigIn * 0.92,
              transform: `translateX(${interpolate(rigIn, [0, 1], [side === "left" ? -180 : 180, 0])}px) scaleX(${side === "left" ? -1 : 1}) translateY(${Math.sin(frame / 14 + i * 2) * 4}px)`,
            }}
          >
            <Img src={asset(place.rig!)} style={{ width: "100%", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7)) brightness(0.9)" }} />
          </div>
        ))}
      {place.rigLabel && frame >= at.role && (
        <div style={{ position: "absolute", right: 70, top: 690 }}>
          <Chip delay={at.role + 6} tone="paper" size={26}>
            {place.rigLabel}
          </Chip>
        </div>
      )}

      {/* the person */}
      {frame >= at.name - 6 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: rise,
            transform: `translateY(${interpolate(rise, [0, 1], [160, 0])}px) scale(${kb})`,
          }}
        >
          <Img
            src={asset(place.photo)}
            style={{
              width: place.photoWidth,
              filter: "contrast(1.06) saturate(0.95)",
              maskImage: "linear-gradient(180deg, #000 70%, transparent 97%)",
              WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 97%)",
            }}
          />
        </div>
      )}

      {/* name card, until the mechanism takes the floor */}
      {frame >= at.name && nameOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            top: 1290,
            opacity: 1 - nameOut,
            transform: `translateY(${nameOut * 40}px)`,
          }}
        >
          <Kinetic text={place.name} size={92} delay={at.name} per={4} mode="snap" />
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
            {place.logo ? (
              <LogoCard src={place.logo} delay={at.role} />
            ) : (
              <Chip delay={at.role} tone="hero" size={30}>
                {place.role}
              </Chip>
            )}
          </div>
        </div>
      )}

      {/* what they do: from → to */}
      {frame >= at.act && (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1270,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: flowIn * (1 - useRampValue(frame, at.result, at.result + 8) * 0.55),
            transform: `translateY(${interpolate(flowIn, [0, 1], [40, 0])}px)`,
          }}
        >
          <Kinetic text={place.act} size={64} delay={at.act} per={3} mode="snap" align="center" />
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Img src={asset(place.from)} style={{ height: 150, maxWidth: 300, objectFit: "contain", filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.7))" }} />
            <Arrow p={arrow} />
            <div style={{ position: "relative" }}>
            <Img
              src={asset(place.to)}
              style={{
                height: 150,
                maxWidth: 300,
                objectFit: "contain",
                opacity: arrow,
                transform: `scale(${interpolate(arrow, [0, 1], [0.7, 1])})`,
                filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.7))",
              }}
            />
            {place.toCross && (
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                <Cross delay={at.act + 18} size={150} thick={18} />
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* when */}
      {frame >= at.when && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center" }}>
          <Chip delay={at.when} tone="hero" size={30} filled>
            {place.when}
          </Chip>
        </div>
      )}

      {/* what it does to the ruble */}
      {frame >= at.result && (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 1560,
            display: "flex",
            justifyContent: place.meme ? "flex-start" : "center",
            transform: `scale(${1 + result.pop * 0.08})`,
            transformOrigin: "left center",
          }}
        >
          <Kinetic
            text={place.result}
            size={92}
            delay={at.result}
            per={4}
            mode="snap"
            align={place.meme ? "flex-start" : "center"}
            hero={place.resultHero}
            bad={place.resultBad}
            glow={!place.resultBad}
            style={place.meme ? { maxWidth: 620 } : undefined}
          />
        </div>
      )}

      {/* the author's reaction meme lands on the result word */}
      {place.meme && frame >= at.meme && (
        <Img
          src={asset(place.meme)}
          style={{
            position: "absolute",
            right: place.memeWidth ? 30 : 70,
            top: place.memeWidth ? 1520 : 1480,
            width: place.memeWidth ?? 270,
            maskImage: "linear-gradient(180deg, #000 78%, transparent 99%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 78%, transparent 99%)",
            opacity: Math.min(1, meme * 1.4),
            transform: `translateY(${interpolate(meme, [0, 1], [200, 0])}px) scale(${interpolate(meme, [0, 1], [0.5, 1]) + memeHit.pop * 0.06}) rotate(${Math.sin(frame / 10) * 3}deg)`,
            filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.75))",
          }}
        />
      )}

      {/* CC BY: the credit sits on screen with the photo */}
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 1240,
          fontFamily: theme.fonts.mono,
          fontSize: 15,
          letterSpacing: "0.06em",
          color: palette.textDim,
          opacity: interpolate(frame, [at.name + 6, at.name + 18], [0, 0.8], clamp),
        }}
      >
        {place.credit}
      </div>

      {place.gauge && frame >= at.act && <CutoffGauge cutoff={place.gauge} at={at.act} />}
      {place.subscribe && at.sub !== undefined && frame >= at.sub && <SubscribeButton at={at.sub} out={at.result - 2} />}
      {place.stamps && at.stamps !== undefined && <Stamps word={place.stamps} at={at.stamps} />}

      <Flash amount={Math.max(slam.energy, result.energy * 0.7)} />
      <Flash amount={act.energy * 0.4} color={colors.bad} />
    </SceneShell>
  );
};
