// Beat 1 — the hook. Frame 0 is the cover: the Roadster mid-kickflip over
// Tesla's lineup under МАСК СДЕЛАЛ ЛЕТАЮЩУЮ ТЕСЛУ.
// «отдай за неё пятьдесят тысяч долларов» — cut to the ramp hover, a deposit
// slip prints and $50 000 punches.
// «а цену тебе даже не скажут» — cut to the author's face (placeholder), the
// slip stays, its ЦЕНА line reads ??? and НЕ СКАЖУТ slams, Fry below.
// Beat 2 «и это только бронь…» — ТОЛЬКО БРОНЬ on the face, cut to the takeoff
// in slow motion, С РАКЕТНЫМИ ДВИГАТЕЛЯМИ, the slip reprints $250 000 ×5.
import React from "react";
import { Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../../../theme";
import { useIn, usePunch, useRamp } from "../../../reel";
import { colors, palette } from "../palette";
import {
  ArchivePhoto,
  BrandBar,
  Chip,
  FaceShot,
  Flash,
  Glitch,
  Kinetic,
  NoEntry,
  Receipt,
  ReceiptLine,
  ReceiptRule,
  SceneShell,
  Shockwave,
  Stamp,
  TrackedClip,
} from "../ui";
import { CTA, FACE_IN, HOOK, HOOK_SPEED, NOW, PROMISE, ROCKET, THRUST, TRUTH } from "../timeline";
import { LikeSubscribe } from "./LikeSubscribe";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Subject x in the source frame, by clip second — measured on 4 fps contact
// sheets of the cuts in public/media/tesla-roadster/.
const KICKFLIP: [number, number][] = [
  [0, 0.49],
  [0.25, 0.57],
  [0.75, 0.58],
  [1.0, 0.4],
  [1.3, 0.25],
  [1.5, 0.34],
  [1.75, 0.48],
  [2.0, 0.54],
  [2.25, 0.64],
];
// the car flips in the top third of Tesla's frame — bring it under the headline
const KICKFLIP_DROP: [number, number][] = [
  [0, 520],
  [1.5, 480],
  [2.25, 330],
];
// the takeoff over the lineup — enters at the right edge, crosses left
const TAKEOFF: [number, number][] = [
  [0.2, 0.84],
  [0.45, 0.78],
  [0.7, 0.68],
  [0.95, 0.5],
  [1.2, 0.44],
  [1.45, 0.33],
  [1.6, 0.27],
  [2.1, 0.1],
];
// it rises into the headline — follow it down the frame as it climbs
const TAKEOFF_DROP: [number, number][] = [
  [0.15, -170],
  [0.8, -100],
  [1.15, 160],
  [1.6, 220],
  [2.1, -250],
];
// beat 3: Tesla's wide ramp shot — the car is small, so crop tighter and
// ride the drop down with it as it falls on its thrusters
const RAMP_FLY_DROP: [number, number][] = [
  [0.1, 250],
  [0.43, 136],
  [0.77, -228],
  [1.1, -473],
  [1.45, -900],
];
// presenter.ts «price» is 1.88 s of video, played at the voice's rate
const FACE_END = FACE_IN + Math.floor((1.88 / HOOK_SPEED) * 30) - 1;

const RAMP: [number, number][] = [
  [0, 0.5],
  [2.5, 0.53],
];

/* ------------------------------------------------------------ footage */

const Footage: React.FC = () => (
  <>
    <Sequence durationInFrames={HOOK.price} name="kickflip">
      <TrackedClip src="media/tesla-roadster/kickflip.mp4" track={KICKFLIP} drop={KICKFLIP_DROP} />
    </Sequence>
    <Sequence from={HOOK.price} durationInFrames={HOOK.noPrice - HOOK.price} name="ramp">
      <TrackedClip src="media/tesla-roadster/ramp.mp4" track={RAMP} push={0.08} />
    </Sequence>
    {/* the face starts with its voice (FACE_IN), two frames under the ramp */}
    <Sequence from={FACE_IN} durationInFrames={FACE_END - FACE_IN} name="face · price">
      <FaceShot src="presenter/tesla-roadster-en/price.mp4" rate={HOOK_SPEED} />
    </Sequence>
    {/* the face clip ends with its line — cut straight to the lineup (note 6: a held
        frame read as a freeze); «и это только бронь» has no face budget anyway */}
    <Sequence from={FACE_END} durationInFrames={THRUST.version - FACE_END} name="lineup">
      <TrackedClip src="media/tesla-roadster/ramp.mp4" track={[[0, 0.5]]} from={1.6} rate={0.35} push={0.06} />
    </Sequence>
    <Sequence from={THRUST.version} durationInFrames={ROCKET.start - THRUST.version} name="takeoff">
      <TrackedClip src="media/tesla-roadster/takeoff.mp4" track={TAKEOFF} drop={TAKEOFF_DROP} from={0.3} rate={0.5} push={0.1} />
    </Sequence>
    <Sequence from={ROCKET.start} durationInFrames={ROCKET.invite - ROCKET.start} name="ramp-fly">
      <TrackedClip src="media/tesla-roadster/ramp-fly.mp4" track={[[0, 0.5]]} drop={RAMP_FLY_DROP} zoom={1.3} rate={0.75} />
    </Sequence>
    <Sequence from={ROCKET.invite} durationInFrames={ROCKET.road - ROCKET.invite} name="ramp-hover">
      <TrackedClip src="media/tesla-roadster/ramp-hover.mp4" track={[[0, 0.49], [1.2, 0.47]]} rate={0.6} push={0.1} />
    </Sequence>
    {/* note 7: the smoke alone read as nothing — the car on the road at the ramp's foot */}
    <Sequence from={ROCKET.road} durationInFrames={PROMISE.start - ROCKET.road} name="ramp-base">
      <TrackedClip src="media/tesla-roadster/ramp-base.mp4" track={[[0, 0.43]]} drop={[[0, -820]]} zoom={1.5} rate={0.7} push={0.1} />
    </Sequence>
    <Sequence from={PROMISE.start} durationInFrames={PROMISE.promised - PROMISE.start} name="proto-2017">
      <ArchivePhoto src="images/tesla-roadster/proto-2017.jpg" focus="30% 60%" />
    </Sequence>
    <Sequence from={PROMISE.promised} durationInFrames={NOW.start - PROMISE.promised} name="roadster-2019">
      <ArchivePhoto src="images/tesla-roadster/roadster-2019.jpg" focus="55% 50%" pan={-40} />
    </Sequence>
    <Sequence from={NOW.start} durationInFrames={TRUTH.start - NOW.start} name="now-2026">
      <TrackedClip
        src="media/tesla-roadster/now-2026.mp4"
        track={[[1.5, 0.62], [2.0, 0.68], [2.5, 0.72], [3.25, 0.72]]}
        drop={[[1.5, -160], [2.5, -60], [3.3, -260]]}
        zoom={1.6}
        from={1.3}
        rate={0.32}
        push={0.08}
      />
    </Sequence>
    <Sequence from={TRUTH.start} durationInFrames={TRUTH.musk - TRUTH.start} name="show">
      <TrackedClip
        src="media/tesla-roadster/show.mp4"
        track={[[1, 0.42], [1.6, 0.42], [3.3, 0.6]]}
        drop={[[0, -120]]}
        zoom={1.15}
        from={0.95}
        rate={0.6}
        push={0.08}
      />
    </Sequence>
    <Sequence from={CTA.start} durationInFrames={CTA.loop - CTA.start} name="face · cta">
      <FaceShot src="presenter/tesla-roadster-en/cta.mp4" rate={HOOK_SPEED} top={170} />
    </Sequence>
    {/* the loop: the last frames replay the cover, so frame 0 follows seamlessly */}
    <Sequence from={CTA.loop} name="loop · kickflip">
      <TrackedClip src="media/tesla-roadster/kickflip.mp4" track={KICKFLIP} drop={KICKFLIP_DROP} />
    </Sequence>
    {/* legibility: dark top for the headline, dark bottom for the slip */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${colors.ink2}D9 0%, ${colors.ink2}00 32%, ${colors.ink2}00 58%, ${colors.ink2}CC 100%)`,
      }}
    />
  </>
);

/* ----------------------------------------------------------- the words */

// The cover line, louder (author note 2): ЛЕТАЮЩУЮ is printed on a lime
// marker from frame 0, ТЕСЛУ fills the width, and on «летающую» the block
// punches.
const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(HOOK.price - 6, HOOK.price, theme.ease.in);
  const hit = usePunch(HOOK.flying, 14);
  const sweep = useRamp(HOOK.flying - 2, HOOK.flying + 8);
  if (frame >= HOOK.price) return null;
  const breathe = 1 + Math.sin(frame / 14) * 0.008;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 230,
        opacity: 1 - out,
        transform: `translateY(${out * -40}px) scale(${breathe})`,
        transformOrigin: "left top",
      }}
    >
      {/* already set on frame 0 — this is the cover */}
      <Kinetic text="MUSK MADE A" delay={-20} size={84} />
      <div style={{ height: 34 }} />
      <div
        style={{
          display: "inline-block",
          position: "relative",
          padding: "8px 26px 14px",
          background: palette.primary,
          boxShadow: `0 0 ${60 + hit.energy * 80}px ${palette.glow}`,
          transform: `rotate(-1.5deg) scale(${1 + hit.pop * 0.1})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: colors.ink2,
          }}
        >
          FLYING
        </div>
        {/* a white sweep across the marker on the spoken word */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(100deg, transparent 0%, ${colors.white}AA 50%, transparent 100%)`,
            transform: `translateX(${interpolate(sweep, [0, 1], [-110, 110])}%)`,
            opacity: sweep > 0 && sweep < 1 ? 1 : 0,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ height: 10 }} />
      <Kinetic
        text="TESLA"
        delay={-20}
        size={196}
        weight={900}
        style={{ filter: `drop-shadow(0 8px 30px ${colors.ink2})` }}
      />
    </div>
  );
};

const Dateline: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= HOOK.price) return null;
  return (
    <div style={{ position: "absolute", left: 72, top: 1560 }}>
      <Chip delay={-20} size={26}>
        TESLA ROADSTER · 15.10.2026
      </Chip>
    </div>
  );
};

/* ------------------------------------------------------------ the slip */

const Slip: React.FC = () => {
  const frame = useCurrentFrame();
  const fifty = usePunch(HOOK.fifty, 14);
  const twoFifty = usePunch(THRUST.twoFifty, 16);
  const invite = usePunch(ROCKET.only, 16);
  if (frame < HOOK.price) return null;
  const thrust = frame >= THRUST.twoFifty;
  const count = thrust
    ? interpolate(frame, [THRUST.twoFifty, THRUST.twoFifty + 14], [50000, 250000], { easing: theme.ease.out, ...clamp })
    : interpolate(frame, [HOOK.fifty - 2, HOOK.fifty + 10], [0, 50000], { easing: theme.ease.out, ...clamp });
  const usd = `$${Math.round(count).toLocaleString("en-US")}`;
  const bob = Math.sin(frame / 26) * 6;
  const away = interpolate(frame, [ROCKET.road - 4, ROCKET.road + 6], [0, 900], { easing: theme.ease.in, ...clamp });
  if (away >= 900) return null;
  const rocket = frame >= ROCKET.invite;
  return (
    <div style={{ position: "absolute", left: 150, top: 1150, transform: `translateY(${bob + away}px)` }}>
      <Receipt width={780} printFrom={HOOK.price + 2} printFrames={14} title={thrust ? "ROADSTER · THRUST" : "TESLA · ROADSTER"} number="№ 2026" tilt={-2}>
        <ReceiptLine label="DEPOSIT" value={thrust ? "THRUST" : "NOW"} size={28} delay={HOOK.price + 4} />
        <div
          style={{
            fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
            fontSize: 124,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: colors.ink,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            transform: `scale(${1 + fifty.pop * 0.12 + twoFifty.pop * 0.14})`,
            transformOrigin: "left center",
          }}
        >
          {usd}
        </div>
        <ReceiptRule />
        {frame >= HOOK.noPrice && (
          <ReceiptLine label="CAR PRICE" value="$ ???" strong size={34} delay={HOOK.noPrice} />
        )}
      </Receipt>
      {/* beat 3 — the slip reprints for the version that actually flies */}
      {rocket && (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Receipt width={780} printFrom={ROCKET.invite} printFrames={12} title="ROADSTER · ROCKET" number="№ 3" tilt={-2}>
            <ReceiptLine label="DEPOSIT" value="ROCKET" size={28} delay={ROCKET.invite} />
            <div
              style={{
                fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
                fontSize: 124,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: colors.ink,
                whiteSpace: "nowrap",
                transform: `scale(${1 + invite.pop * 0.14})`,
                transformOrigin: "left center",
              }}
            >
              {frame >= ROCKET.only ? "INVITE" : "$ ???"}
            </div>
            <ReceiptRule />
            <ReceiptLine label="CAR PRICE" value="$ ???" strong size={34} delay={ROCKET.invite} />
          </Receipt>
        </div>
      )}
    </div>
  );
};

// The author's meme (note 1): Fry, cut out with scripts/matte.swift, slams in
// over the face on «не скажут» — sticker outline, his cut edge under the stamp.
const FRY = staticFile("images/tesla-roadster/fry-cut.png");

const Fry: React.FC = () => {
  const frame = useCurrentFrame();
  const at = HOOK.never - 6;
  const p = useIn(at, "bouncy");
  const out = useRamp(THRUST.start, THRUST.start + 8, theme.ease.in);
  if (frame < at || out >= 1) return null;
  const bob = Math.sin((frame - at) / 12) * 5;
  // bottom of the frame, under the slip line — the face above stays clear (note 3)
  return (
    <div
      style={{
        position: "absolute",
        left: 380,
        top: 1490,
        width: 700,
        opacity: Math.min(1, p * 1.8),
        transform: `translateY(${interpolate(p, [0, 1], [300, 0]) + out * 460 + bob}px) rotate(${interpolate(p, [0, 1], [10, -4])}deg) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        transformOrigin: "50% 100%",
        filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 5px 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) drop-shadow(0 24px 40px ${colors.ink2})`,
      }}
    >
      <Img src={FRY} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

const Never: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(THRUST.bron - 6, THRUST.bron, theme.ease.in);
  if (frame < HOOK.never || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 960,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - out,
        transform: `scale(${1 - out * 0.2})`,
      }}
    >
      <Stamp delay={HOOK.never + 4} size={104} rotate={-8}>
        NOT TELLING
      </Stamp>
    </div>
  );
};

/* ------------------------------------------------------------- beat 2 */

const OnlyDeposit: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(THRUST.version - 4, THRUST.version + 2, theme.ease.in);
  if (frame < THRUST.bron || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 960,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - out,
      }}
    >
      <Stamp delay={THRUST.bron} size={96} rotate={6}>
        JUST A DEPOSIT
      </Stamp>
    </div>
  );
};

const Rockets: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(ROCKET.start - 6, ROCKET.start, theme.ease.in);
  if (frame < THRUST.version || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 240, opacity: 1 - out, transform: `translateY(${out * -40}px)` }}>
      <Chip delay={THRUST.version + 2} size={26} tone="hero">
        THRUST EDITION
      </Chip>
      <div style={{ height: 26 }} />
      <Kinetic text="WITH ROCKET THRUSTERS" delay={THRUST.rockets - 4} size={86} mode="snap" per={4} />
    </div>
  );
};

const Times: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < THRUST.twoFifty || frame >= ROCKET.start) return null;
  return (
    <div style={{ position: "absolute", left: 48, top: 985 }}>
      <Stamp delay={THRUST.twoFifty + 6} size={84} rotate={-10} tone="hero">
        ×5
      </Stamp>
    </div>
  );
};

// The author's second meme (note 4): the Mask, cut out with matte.swift,
// rolls in from the right into the empty sky over the slip on $250 000.
const MASK = staticFile("images/tesla-roadster/mask-cut.png");

const MaskGuy: React.FC = () => {
  const frame = useCurrentFrame();
  const at = THRUST.twoFifty + 12;
  const p = useIn(at, "smooth");
  const out = useRamp(ROCKET.start - 5, ROCKET.start + 3, theme.ease.in);
  if (frame < at || out >= 1) return null;
  const bob = Math.sin((frame - at) / 11) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: 230,
        top: 700,
        width: 620,
        transform: `translateX(${interpolate(p, [0, 1], [900, 0])}px) translateY(${bob + out * 500}px) rotate(${interpolate(p, [0, 1], [12, 2])}deg)`,
        filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) drop-shadow(0 24px 40px ${colors.ink2})`,
      }}
    >
      <Img src={MASK} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/* ------------------------------------------------------------- beat 3 */

const Flies: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(ROCKET.invite - 5, ROCKET.invite + 1, theme.ease.in);
  if (frame < ROCKET.start || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 240, opacity: 1 - out, transform: `translateY(${out * -40}px)` }}>
      <Kinetic text="IT FLIES" delay={ROCKET.start + 2} size={150} mode="snap" />
      <div style={{ height: 22 }} />
      <Chip delay={ROCKET.third} size={34} tone="hero" filled>
        VERSION #3 · ROCKET
      </Chip>
    </div>
  );
};

const Invite: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useRamp(ROCKET.road - 5, ROCKET.road + 1, theme.ease.in);
  if (frame < ROCKET.invite || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 240, opacity: 1 - out, transform: `translateY(${out * -40}px)` }}>
      <Kinetic text="INVITE ONLY" delay={ROCKET.only - 8} size={110} mode="snap" per={4} hero={[1]} />
    </div>
  );
};

const NoRoad: React.FC = () => {
  const frame = useCurrentFrame();
  const sign = useIn(ROCKET.never - 4, "bouncy");
  if (frame < ROCKET.road || frame >= PROMISE.start) return null;
  const spin = Math.sin(frame / 20) * 2;
  return (
    <>
      <div style={{ position: "absolute", left: 72, right: 72, top: 240 }}>
        <Kinetic text="ON PUBLIC ROADS" delay={ROCKET.road + 4} size={84} per={4} />
      </div>
      {frame >= ROCKET.never - 4 && (
        <div
          style={{
            position: "absolute",
            left: 410,
            top: 1180,
            opacity: Math.min(1, sign * 1.6),
            transform: `scale(${interpolate(sign, [0, 1], [0.3, 1])}) rotate(${interpolate(sign, [0, 1], [-90, 0]) + spin}deg)`,
            filter: `drop-shadow(0 0 40px ${colors.badGlow})`,
          }}
        >
          <NoEntry size={260} />
        </div>
      )}
      {frame >= ROCKET.never && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
          <Stamp delay={ROCKET.never + 2} size={92} rotate={-6}>
            NOT LEGAL
          </Stamp>
        </div>
      )}
    </>
  );
};

/* ------------------------------------------------------------- beat 4 */

// The 2017 slip: the same deposit, and what it was buying then. Beat 5 will
// melt these lines.
const Slip2017: React.FC = () => {
  const frame = useCurrentFrame();
  const fifty = usePunch(PROMISE.fifty, 14);
  const away = useRamp(TRUTH.start - 4, TRUTH.start + 6, theme.ease.in);
  if (frame < PROMISE.start || away >= 1) return null;
  const bob = Math.sin(frame / 26) * 6;
  return (
    <div style={{ position: "absolute", left: 150, top: 1030, transform: `translateY(${bob + away * 900}px)`, zIndex: 2 }}>
      <Receipt width={780} printFrom={PROMISE.start + 2} printFrames={14} title="TESLA · ROADSTER" number="№ 2017" tilt={2}>
        <ReceiptLine label="DEPOSIT" value="2017" size={28} delay={PROMISE.start + 4} />
        <div
          style={{
            fontFamily: `${theme.fonts.wide}, ${theme.fonts.mono}`,
            fontSize: 124,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: colors.ink,
            whiteSpace: "nowrap",
            transform: `scale(${1 + fifty.pop * 0.12})`,
            transformOrigin: "left center",
          }}
        >
          $50,000
        </div>
        <ReceiptRule />
        {frame >= PROMISE.km && <PromiseLine label="RANGE" was="620 MI" now="300+ MI" at={PROMISE.km} melt={NOW.km} />}
        {frame >= PROMISE.seats && <PromiseLine label="SEATS" was="4" now="2" at={PROMISE.seats} melt={NOW.seats} />}
        {frame >= PROMISE.seats + 10 && <PromiseLine label="RELEASE" was="2020" now="2028" at={PROMISE.seats + 10} melt={NOW.year} />}
      </Receipt>
    </div>
  );
};

// One promise on the 2017 slip: ticked when made, struck through in red when
// beat 5 says what is left of it.
const PromiseLine: React.FC<{ label: string; was: string; now: string; at: number; melt: number }> = ({
  label,
  was,
  now,
  at,
  melt,
}) => {
  const frame = useCurrentFrame();
  if (frame < melt) {
    return <ReceiptLine label={label} value={was} mark="check" strong size={34} delay={at} />;
  }
  return (
    <ReceiptLine
      key="melted"
      label={label}
      value={
        <span>
          <span style={{ color: colors.inkFaded, textDecoration: "line-through", textDecorationThickness: 4 }}>{was}</span>{" "}
          <span style={{ color: colors.bad }}>{now}</span>
        </span>
      }
      mark="cross"
      strong
      size={34}
      delay={melt}
    />
  );
};

const MUSK = staticFile("images/tesla-roadster/musk-cut.png");

const Musk2017: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(PROMISE.musk - 4, "smooth");
  const out = useRamp(PROMISE.promised - 5, PROMISE.promised + 1, theme.ease.in);
  if (frame < PROMISE.musk - 4 || out >= 1) return null;
  const bob = Math.sin(frame / 22) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: -30,
        top: 560,
        width: 480,
        opacity: 1 - out,
        transform: `translateX(${interpolate(p, [0, 1], [-640, 0]) - out * 200}px) translateY(${bob}px)`,
        filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) drop-shadow(0 24px 40px ${colors.ink2})`,
      }}
    >
      <Img src={MUSK} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

const Then: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < PROMISE.start || frame >= NOW.start) return null;
  const promised = frame >= PROMISE.promised;
  return (
    <>
      <div style={{ position: "absolute", left: 72, right: 72, top: 240 }}>
        {promised ? (
          <>
            <Kinetic key="promised" text="PROMISED" delay={PROMISE.promised + 1} size={150} mode="snap" />
            <div style={{ height: 24 }} />
            {frame >= PROMISE.seats ? (
              <Kinetic key="seats" text="4 SEATS" delay={PROMISE.seats} size={120} mode="snap" hero={[0]} glow />
            ) : frame >= PROMISE.km ? (
              <Kinetic key="km" text="620 MI" delay={PROMISE.km} size={120} mode="snap" hero={[0, 1]} glow />
            ) : null}
          </>
        ) : (
          <Kinetic key="same" text="SAME MONEY" delay={PROMISE.start + 2} size={96} per={4} />
        )}
      </div>
      {frame >= PROMISE.year && !promised && (
        <div style={{ position: "absolute", right: 70, top: 640 }}>
          <Stamp delay={PROMISE.year} size={120} rotate={-8} tone="hero">
            2017
          </Stamp>
        </div>
      )}
    </>
  );
};

/* ------------------------------------------------------------- beat 5 */

// СЕЙЧАС over 2026, and the figure the voice is on, in red: the range counts
// down from the promised 1 000 as it melts.
const Now: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < NOW.start || frame >= TRUTH.start) return null;
  const km = Math.round(
    interpolate(frame, [NOW.km, NOW.km + 16], [620, 300], { easing: theme.ease.out, ...clamp }),
  );
  const figure =
    frame >= NOW.year ? "2028" : frame >= NOW.seats ? "2 SEATS" : frame >= NOW.km ? `${km} MI` : null;
  const key = frame >= NOW.year ? "y" : frame >= NOW.seats ? "s" : "k";
  const at = frame >= NOW.year ? NOW.year : frame >= NOW.seats ? NOW.seats : NOW.km;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 240 }}>
      <Kinetic text="NOW" delay={NOW.start + 1} size={150} mode="snap" />
      <div style={{ height: 24 }} />
      {figure && <Kinetic key={key} text={figure} delay={at} size={120} mode="snap" bad={[0, 1]} />}
    </div>
  );
};

/* ------------------------------------------------------------- beat 6 */

// Note 8: the two companies as things, not words — the Roadster cut out of
// Tesla's own footage over the Tesla wordmark, Starship on a photo card over
// the SpaceX wordmark. They slide toward Musk and lock on «слияние».
const ROADSTER = staticFile("images/tesla-roadster/roadster-cut.png");
const STARSHIP = staticFile("images/tesla-roadster/starship-card.jpg");
const TESLA_LOGO = staticFile("images/tesla-roadster/tesla-logo.png");
const SPACEX_LOGO = staticFile("images/tesla-roadster/spacex-logo.png");

const Company: React.FC<{ side: -1 | 1; from: number; at: number }> = ({ side, from, at }) => {
  const frame = useCurrentFrame();
  const p = useIn(from, "smooth");
  const lock = useIn(at, "snappy");
  const bob = Math.sin((frame + side * 20) / 18) * 6;
  const x = interpolate(p, [0, 1], [side * 700, 0]) - side * 30 * lock;
  const tesla = side === -1;
  return (
    <div
      style={{
        position: "absolute",
        left: tesla ? -10 : 610,
        top: tesla ? 1000 : 880,
        width: tesla ? 660 : 460,
        transform: `translateX(${x}px) translateY(${bob}px) rotate(${side * (6 - lock * 4)}deg)`,
        opacity: Math.min(1, p * 1.6),
      }}
    >
      {tesla ? (
        <Img
          src={ROADSTER}
          style={{ width: "100%", display: "block", filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(4px 0 0 ${colors.white}) drop-shadow(-4px 0 0 ${colors.white}) drop-shadow(0 -4px 0 ${colors.white}) drop-shadow(0 24px 40px ${colors.ink2})` }}
        />
      ) : (
        <div style={{ width: 340, marginLeft: 60, padding: 12, background: colors.paper, boxShadow: colors.paperShadow }}>
          <Img src={STARSHIP} style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
        </div>
      )}
      <Img
        src={tesla ? TESLA_LOGO : SPACEX_LOGO}
        style={{
          display: "block",
          width: tesla ? 420 : 430,
          margin: tesla ? "-30px 0 0 110px" : "26px 0 0 20px",
          // both marks as flat white type on the dark frame
          filter: `brightness(0) invert(1) drop-shadow(0 6px 20px ${colors.ink2})`,
        }}
      />
    </div>
  );
};

const Truth: React.FC = () => {
  const frame = useCurrentFrame();
  const sign = useIn(TRUTH.merge + 2, "bouncy");
  if (frame < TRUTH.start || frame >= TRUTH.end) return null;
  const graphic = frame >= TRUTH.musk;
  return (
    <>
      <div style={{ position: "absolute", left: 72, right: 72, top: 240 }}>
        <Kinetic text="SELLING" delay={TRUTH.start + 4} size={110} />
        <div style={{ height: 10 }} />
        {frame >= TRUTH.notCar && <Kinetic text="NOT A CAR" delay={TRUTH.notCar} size={110} mode="snap" bad={[0]} />}
        <div style={{ height: 10 }} />
        {frame >= TRUTH.show && <Kinetic text="A SHOW" delay={TRUTH.show} size={130} mode="snap" hero={[1]} glow />}
      </div>
      {frame >= TRUTH.spacex && !graphic && (
        <div style={{ position: "absolute", left: 72, top: 1500 }}>
          <Chip delay={TRUTH.spacex} size={28}>
            SPACEX SITE · TEXAS · OCT 15, 2026
          </Chip>
        </div>
      )}
      {graphic && (
        <>
          <Company side={-1} from={TRUTH.musk + 6} at={TRUTH.merge} />
          <Company side={1} from={TRUTH.musk + 10} at={TRUTH.merge} />
          {frame >= TRUTH.merge + 2 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1520,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, sign * 1.6),
                transform: `scale(${interpolate(sign, [0, 1], [0.6, 1])})`,
              }}
            >
              <Chip size={30} tone="hero" filled>
                MERGER? KALSHI ODDS · 66%
              </Chip>
            </div>
          )}
        </>
      )}
    </>
  );
};

const MuskHint: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useIn(TRUTH.musk - 2, "smooth");
  if (frame < TRUTH.musk - 2 || frame >= TRUTH.end) return null;
  const bob = Math.sin(frame / 22) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: 380,
        top: 560,
        width: 330,
        transform: `translateY(${interpolate(p, [0, 1], [500, 0]) + bob}px)`,
        filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(5px 0 0 ${colors.white}) drop-shadow(-5px 0 0 ${colors.white}) drop-shadow(0 -5px 0 ${colors.white}) drop-shadow(0 24px 40px ${colors.ink2})`,
        clipPath: "inset(-20px -20px 46% -20px)",
      }}
    >
      <Img src={MUSK} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/* ------------------------------------------------------------- beat 7 */

const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CTA.start || frame >= CTA.loop) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 1130 }}>
      <Kinetic text="WOULD YOU PAY" delay={CTA.start + 2} size={92} mode="snap" per={3} />
      <div style={{ height: 8 }} />
      {frame >= CTA.fifty && <Kinetic text="$50,000?" delay={CTA.fifty} size={124} mode="snap" hero={[0]} glow />}
    </div>
  );
};

// Note 9 → 10: the Roadster beside the author's face. A luma key of Tesla's
// night shot left the car see-through and cut by the source edge (note 10),
// so this is the clean Vision cut-out (roadster-cut.png) flown by hand: in
// from the top right on its thrusters, hover beside the face, a kickflip on
// the like, and out before the loop.
const FLY_IN = CTA.start + 4;
const FLY_LEN = CTA.loop - FLY_IN;
const CAR_W = 560; // the PNG keeps the frame's margins: the car fills ~0.05–0.67 of its width

const Jet: React.FC<{ x: number; seed: number }> = ({ x, seed }) => {
  const frame = useCurrentFrame();
  const flicker = 1 + Math.sin(frame * 1.7 + seed) * 0.12 + Math.sin(frame * 3.1 + seed * 2) * 0.06;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 15,
        top: CAR_W * 0.43,
        width: 30,
        height: 150 * flicker,
        borderRadius: "50% 50% 40% 40%",
        background: `linear-gradient(180deg, ${colors.white} 0%, ${palette.accent}CC 30%, ${palette.accent}00 100%)`,
        filter: "blur(5px)",
        boxShadow: `0 0 40px ${palette.accent}66`,
      }}
    />
  );
};

const FlyBy: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - FLY_IN;
  const inP = useIn(FLY_IN, "smooth");
  const outP = useRamp(FLY_IN + FLY_LEN - 14, FLY_IN + FLY_LEN, theme.ease.in);
  const flipAt = CTA.like + 6;
  const flip = useRamp(flipAt, flipAt + 22, theme.ease.inOut);
  if (frame < FLY_IN || frame >= FLY_IN + FLY_LEN) return null;
  const bob = Math.sin(t / 9) * 10;
  const tilt = Math.sin(t / 13) * 3;
  const x = interpolate(inP, [0, 1], [520, 0]) + outP * 600;
  const y = interpolate(inP, [0, 1], [-420, 0]) - outP * 700 + bob - Math.sin(flip * Math.PI) * 90;
  const rot = interpolate(inP, [0, 1], [-18, 0]) + tilt + flip * 360 - outP * 20;
  return (
    <div
      style={{
        position: "absolute",
        left: 690,
        top: 330,
        width: CAR_W,
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${1 + Math.sin(flip * Math.PI) * 0.12})`,
        transformOrigin: "50% 55%",
      }}
    >
      {/* thrusters under the wheels, drawn — flicker, never a still */}
      <Jet x={CAR_W * 0.16} seed={0} />
      <Jet x={CAR_W * 0.53} seed={2} />
      <Img
        src={ROADSTER}
        style={{
          position: "relative",
          width: "100%",
          display: "block",
          filter: `drop-shadow(0 0 0 ${colors.white}) drop-shadow(3px 0 0 ${colors.white}) drop-shadow(-3px 0 0 ${colors.white}) drop-shadow(0 -3px 0 ${colors.white}) drop-shadow(0 24px 30px ${colors.ink2})`,
        }}
      />
    </div>
  );
};

// The loop's last frames: the cover's words and chips exactly as on frame 0.
const CoverEcho: React.FC = () => (
  <Sequence from={CTA.loop} name="loop · cover">
    <Headline />
    <Dateline />
  </Sequence>
);

/* --------------------------------------------------------------- scene */

export const HookScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const frame = useCurrentFrame();
  const cut1 = usePunch(HOOK.price, 10);
  const cut2 = usePunch(HOOK.noPrice, 10);
  const fifty = usePunch(HOOK.fifty, 14);
  const never = usePunch(HOOK.never + 4, 18);
  const cut3 = usePunch(THRUST.version, 10);
  const deposit = usePunch(THRUST.bron, 16);
  const twoFifty = usePunch(THRUST.twoFifty, 16);
  const cut4 = usePunch(ROCKET.start, 10);
  const cut5 = usePunch(ROCKET.invite, 10);
  const cut6 = usePunch(ROCKET.road, 10);
  const only = usePunch(ROCKET.only, 16);
  const nope = usePunch(ROCKET.never + 2, 18);
  const cut7 = usePunch(PROMISE.start, 10);
  const cut8 = usePunch(PROMISE.promised, 10);
  const year = usePunch(PROMISE.year, 16);
  const cut10 = usePunch(TRUTH.start, 10);
  const cut11 = usePunch(TRUTH.musk, 10);
  const merge = usePunch(TRUTH.merge + 4, 16);
  const cut12 = usePunch(CTA.start, 10);
  const cut13 = usePunch(CTA.loop, 8);
  const cut9 = usePunch(NOW.start, 10);
  const meltKm = usePunch(NOW.km, 14);
  const meltSeats = usePunch(NOW.seats, 14);
  const meltYear = usePunch(NOW.year, 14);
  const cutGlitch = (at: number) => interpolate(frame, [at - 2, at, at + 6], [0, 0.9, 0], clamp);
  const glitch =
    interpolate(frame, [HOOK.price - 2, HOOK.price, HOOK.price + 6], [0, 0.9, 0], clamp) +
    interpolate(frame, [HOOK.noPrice - 2, HOOK.noPrice, HOOK.noPrice + 6], [0, 0.9, 0], clamp) +
    interpolate(frame, [THRUST.version - 2, THRUST.version, THRUST.version + 6], [0, 0.9, 0], clamp) +
    cutGlitch(ROCKET.start) +
    cutGlitch(ROCKET.invite) +
    cutGlitch(ROCKET.road) +
    cutGlitch(PROMISE.start) +
    cutGlitch(PROMISE.promised) +
    cutGlitch(NOW.start) +
    cutGlitch(NOW.km) * 0.5 +
    cutGlitch(NOW.seats) * 0.5 +
    cutGlitch(NOW.year) * 0.5 +
    cutGlitch(TRUTH.start) +
    cutGlitch(TRUTH.musk) +
    cutGlitch(CTA.start) +
    cutGlitch(CTA.loop);
  return (
    <SceneShell exit={false} shake={fifty.shake * 0.5 + never.shake + deposit.shake * 0.6 + twoFifty.shake * 0.7 + only.shake * 0.6 + nope.shake + year.shake * 0.6 + (meltKm.shake + meltSeats.shake + meltYear.shake) * 0.5 + merge.shake}>
      <Glitch amount={glitch} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Footage />
        </div>
      </Glitch>
      <BrandBar series={series} episode={episode} delay={-20} />
      <Headline />
      <Dateline />
      <Rockets />
      <Flies />
      <Invite />
      <MaskGuy />
      <Slip />
      <NoRoad />
      <Then />
      <Now />
      <MuskHint />
      <Truth />
      <FlyBy />
      <Ask />
      <LikeSubscribe at={CTA.like} out={CTA.loop} y={1450} />
      <CoverEcho />
      <Musk2017 />
      <Slip2017 />
      <Fry />
      <Never />
      <OnlyDeposit />
      <Times />
      <Shockwave at={HOOK.fifty} />
      <Shockwave at={THRUST.twoFifty} />
      <Flash amount={cut3.energy * 0.6} />
      <Flash amount={Math.max(cut4.energy, cut5.energy, cut6.energy) * 0.6} />
      <Flash amount={nope.energy} color={colors.bad} />
      <Flash amount={Math.max(cut7.energy, cut8.energy, cut9.energy) * 0.6} />
      <Flash amount={Math.max(meltKm.energy, meltSeats.energy, meltYear.energy) * 0.5} color={colors.bad} />
      <Flash amount={Math.max(cut10.energy, cut11.energy, cut12.energy, cut13.energy) * 0.6} />
      <Shockwave at={TRUTH.merge + 4} />
      <Flash amount={cut1.energy * 0.6} />
      <Flash amount={cut2.energy * 0.6} />
      <Flash amount={never.energy} color={colors.bad} />
    </SceneShell>
  );
};
