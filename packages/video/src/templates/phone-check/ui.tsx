// Episode kit for «Банк будет проверять ваш телефон?». The series look — paper
// that prints, digital that snaps — lives in ../digital-ruble/ui and is
// re-exported untouched; this file adds only what a cyber-thriller needs: a
// stylised transfer screen, a finger, a red scan grid, code rain, a hooded
// figure, a bank building, a padlock, a shield, a barrier, data tiles, a
// transparent safe, a moving trace. Same rules: every entrance moves 2–3
// properties on a spring, every ramp is eased and clamped, every color comes
// from the series palette. The phone UI is deliberately generic — no bank
// could mistake it for its own.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useIn, useRamp } from "../../reel";
import { pcColors, pcPalette } from "./palette";
import { Banknote, rnd } from "../digital-ruble/ui";

export * from "../digital-ruble/ui";

/* ------------------------------------------------------------ helpers */

/** Eased, clamped 0→1 exit ramp (ease-in: exits are faster than entrances). */
export const useExit = (at: number, life = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Hero font stack with the mono face behind it — Unbounded has no ₽. */
export const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

/* ----------------------------------------------------------- the phone */

/**
 * The stylised transfer screen, designed for the default 440×860 phone.
 * `pressed` sinks the button, `lift` floats ₽ tokens off it, `rejected`
 * slams the red wall up from the bottom. Nothing here is a real bank's UI.
 */
export const TransferScreen: React.FC<{
  amount: string;
  pressed?: number;
  lift?: number;
  rejected?: number;
  /** 0..1 — the red wall cools down to a dark screen with red marks, so a red stamp can sit over it. */
  settled?: number;
  /** The button goes dark — for phones that are props, not the subject. */
  muted?: boolean;
}> = ({ amount, pressed = 0, lift = 0, rejected = 0, settled = 0, muted = false }) => {
  const frame = useCurrentFrame();
  const wallBg = settled < 0.5 ? pcColors.bad : pcColors.ink2;
  const wallFg = settled < 0.5 ? pcColors.ink2 : pcColors.bad;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: theme.fonts.mono,
        color: pcPalette.text,
        background: `linear-gradient(180deg, ${pcColors.surfaceStrong} 0%, #0B0E12 100%)`,
      }}
    >
      {/* title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 72,
          textAlign: "center",
          fontSize: 20,
          letterSpacing: "0.22em",
          color: pcPalette.textDim,
        }}
      >
        ПЕРЕВОД
      </div>
      {/* recipient */}
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: 130,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 18px",
          borderRadius: 18,
          background: pcColors.surfaceLift,
          border: `1px solid ${pcColors.line}`,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: pcColors.surfaceStrong,
            border: `2px solid ${pcColors.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          А
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>АЛЕКСЕЙ К.</span>
          <span style={{ fontSize: 17, color: pcPalette.textDim, letterSpacing: "0.1em" }}>+7 ··· ··· 17 13</span>
        </div>
      </div>
      {/* amount */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 252,
          textAlign: "center",
          fontFamily: WIDE,
          fontSize: 70,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {amount}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 338,
          textAlign: "center",
          fontSize: 18,
          letterSpacing: "0.18em",
          color: pcPalette.textDim,
        }}
      >
        СО СЧЁТА · •••• 4821
      </div>
      {/* keypad */}
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: 400,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {keys.map((k, i) => (
          <div
            key={i}
            style={{
              height: 62,
              borderRadius: 14,
              background: k ? pcColors.surfaceLift : "transparent",
              border: k ? `1px solid ${pcColors.line}` : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: pcPalette.textDim,
            }}
          >
            {k}
          </div>
        ))}
      </div>
      {/* the button */}
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: 716,
          height: 92,
          borderRadius: 22,
          background: muted ? pcColors.surfaceLift : pcPalette.primary,
          color: muted ? pcPalette.textDim : pcColors.ink2,
          border: muted ? `1px solid ${pcColors.line}` : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: WIDE,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "0.02em",
          transform: `scale(${1 - pressed * 0.05})`,
          filter: `brightness(${1 - pressed * 0.18})`,
          boxShadow: muted ? undefined : `0 0 ${40 * (1 - pressed)}px ${pcPalette.glow}`,
        }}
      >
        ПЕРЕВЕСТИ
      </div>
      {/* ₽ lifting off the button */}
      {lift > 0 &&
        [0, 1, 2].map((i) => {
          const p = interpolate(lift, [i * 0.18, 0.6 + i * 0.18], [0, 1], {
            easing: theme.ease.out,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (p <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 220 - 26 + (i - 1) * 70,
                top: 740 - p * 420,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: pcColors.surfaceLift,
                border: `2px solid ${pcColors.lineStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.mono,
                fontSize: 26,
                fontWeight: 800,
                opacity: 1 - p * 0.6,
                transform: `scale(${0.6 + p * 0.5}) rotate(${(i - 1) * p * 24}deg)`,
              }}
            >
              ₽
            </div>
          );
        })}
      {/* the red wall */}
      {rejected > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: wallBg,
            clipPath: `inset(${(1 - rejected) * 100}% 0 0 0)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            color: wallFg,
          }}
        >
          {/* the red flashes through for a few frames, then cools to the dark screen */}
          <div style={{ position: "absolute", inset: 0, background: pcColors.bad, opacity: settled < 0.5 ? 0 : Math.max(0, 1 - (settled - 0.5) * 2) * 0.9 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${wallFg}33 1.2px, transparent 1.8px)`,
              backgroundSize: "22px 22px",
              opacity: 0.8,
              transform: `translateY(${(frame * 3) % 22}px)`,
            }}
          />
          <svg width={150} height={140} viewBox="0 0 100 92" style={{ position: "relative" }}>
            <path d="M50 6 L96 86 L4 86 Z" fill="none" stroke={wallFg} strokeWidth={9} strokeLinejoin="round" />
            <rect x={45} y={32} width={10} height={30} fill={wallFg} />
            <rect x={45} y={68} width={10} height={10} fill={wallFg} />
          </svg>
          <div style={{ position: "relative", fontFamily: WIDE, fontSize: 30, fontWeight: 900, textAlign: "center", lineHeight: 1.1 }}>
            ОПЕРАЦИЯ
            <br />
            ЗАБЛОКИРОВАНА
          </div>
          <div style={{ position: "relative", fontSize: 17, letterSpacing: "0.2em", opacity: 0.75 }}>КОД 0x7A1 · УСТРОЙСТВО</div>
        </div>
      )}
    </div>
  );
};

/**
 * The consent dialog: a stylised system prompt with two buttons. `allow`
 * is the lime one; nothing in this reel ever presses it.
 */
export const ConsentScreen: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const p = useIn(delay, "smooth");
  const kinds: TileKind[] = ["photo", "message", "contact", "doc", "message", "photo"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B0E12", fontFamily: theme.fonts.mono }}>
      {/* the private stuff, dim, untouched */}
      <div style={{ position: "absolute", inset: 0, padding: "80px 26px 0", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, opacity: 0.28 }}>
        {kinds.map((k, i) => (
          <DataTile key={i} kind={k} size={150} delay={-40} />
        ))}
      </div>
      {/* the dialog */}
      <div
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          top: 250,
          padding: "30px 26px 26px",
          borderRadius: 26,
          background: pcColors.surfaceStrong,
          border: `2px solid ${pcColors.lineStrong}`,
          boxShadow: pcColors.shadow,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Shield size={84} color={pcPalette.text} delay={delay + 6} />
        <div style={{ fontFamily: WIDE, fontSize: 24, fontWeight: 800, textAlign: "center", lineHeight: 1.15, color: pcPalette.text }}>
          ПРОВЕРКА
          <br />
          БЕЗОПАСНОСТИ
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5, textAlign: "center", color: pcPalette.textDim, letterSpacing: "0.02em" }}>
          Банк запрашивает проверку
          <br />
          устройства на вредоносное ПО
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 6 }}>
          <div
            style={{
              height: 64,
              borderRadius: 16,
              border: `3px solid ${pcPalette.primary}`,
              color: pcPalette.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: WIDE,
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            РАЗРЕШИТЬ
          </div>
          <div
            style={{
              height: 64,
              borderRadius: 16,
              border: `2px solid ${pcColors.lineStrong}`,
              color: pcPalette.textDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: WIDE,
              fontSize: 21,
              fontWeight: 700,
            }}
          >
            ОТКАЗАТЬСЯ
          </div>
        </div>
      </div>
    </div>
  );
};

/** An incoming-call card for the «перевёл сам» half. */
export const CallCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const p = useIn(delay, "snappy");
  const frame = useCurrentFrame();
  const ring = 1 + Math.sin((frame - delay) / 3) * 0.06;
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        top: 60,
        padding: "18px 20px",
        borderRadius: 20,
        background: pcColors.surfaceLift,
        border: `2px solid ${pcColors.bad}`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: theme.fonts.mono,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-40, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: `3px solid ${pcColors.bad}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${ring})`,
        }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24">
          <path d="M6 3h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" fill={pcColors.bad} />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: pcColors.bad, letterSpacing: "0.06em" }}>НЕИЗВЕСТНЫЙ</span>
        <span style={{ fontSize: 13, color: pcPalette.textDim, letterSpacing: "0.08em" }}>«СЛУЖБА БЕЗОПАСНОСТИ»</span>
      </div>
    </div>
  );
};

/**
 * A finger on the glass: a soft ring with a dot. `press` 0..1 sinks the ring
 * and fires a ripple. Positioned by its centre.
 */
export const Touch: React.FC<{
  x: number;
  y: number;
  press?: number;
  opacity?: number;
  size?: number;
}> = ({ x, y, press = 0, opacity = 1, size = 96 }) => {
  const ringScale = 1 - press * 0.35;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity, pointerEvents: "none" }}>
      {/* ripple */}
      {press > 0.2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `3px solid ${pcColors.white}`,
            opacity: (1 - press) * 0.9,
            transform: `scale(${1 + press * 1.6})`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${pcColors.white}33 0%, ${pcColors.white}14 60%, transparent 70%)`,
          border: `3px solid ${pcColors.white}`,
          opacity: 0.85,
          transform: `scale(${ringScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: size * 0.26,
          height: size * 0.26,
          marginLeft: -size * 0.13,
          marginTop: -size * 0.13,
          borderRadius: "50%",
          background: pcColors.white,
          transform: `scale(${1 + press * 0.5})`,
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------- threat */

/** A red scanning grid with a sweep line. `amount` 0..1 fades it. */
export const ScanGrid: React.FC<{
  amount: number;
  width: number;
  height: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ amount, width, height, color = pcColors.bad, style }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.001) return null;
  const sweep = (Math.sin(frame / 14) * 0.5 + 0.5) * height;
  return (
    <div style={{ position: "absolute", width, height, opacity: amount, pointerEvents: "none", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${color}3A 1px, transparent 1px), linear-gradient(90deg, ${color}3A 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 78%)",
        }}
      />
      {/* corner brackets */}
      {[
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].map(([cx, cy]) => (
        <div
          key={`${cx}${cy}`}
          style={{
            position: "absolute",
            width: 46,
            height: 46,
            left: cx ? undefined : 0,
            right: cx ? 0 : undefined,
            top: cy ? undefined : 0,
            bottom: cy ? 0 : undefined,
            borderTop: cy ? undefined : `4px solid ${color}`,
            borderBottom: cy ? `4px solid ${color}` : undefined,
            borderLeft: cx ? undefined : `4px solid ${color}`,
            borderRight: cx ? `4px solid ${color}` : undefined,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: sweep,
          height: 3,
          background: color,
          boxShadow: `0 0 26px ${pcColors.badGlow}`,
          opacity: 0.9,
        }}
      />
    </div>
  );
};

const CODE = [
  "0x7A1F  mov  r9, [sp+0x40]",
  "inject(\"com.bank\")  ; hook",
  "ACCESSIBILITY_SERVICE = 1",
  "overlay.draw(screen)  0x00",
  "sms.read()  →  otp  ░░░░",
  "keylog[] push(0x2E)  ...",
  "C2 connect 185.··.··.17",
  "sys.call  ptrace(PTRACE_ATTACH)",
  "payload.b64  Q0hFQ0s=  ▒",
  "root.sh  chmod 777 /data",
  "getInstalledApps()  bank*",
  "screen.cap  frame 0x1C",
];

/** Dim red fragments of malicious code drifting up behind a scene. */
export const CodeRain: React.FC<{ amount: number; color?: string }> = ({ amount, color = pcColors.bad }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: amount * 0.5,
        pointerEvents: "none",
        maskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 70%, transparent 78%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 70%, transparent 78%)",
      }}
    >
      {CODE.map((line, i) => {
        const x = 40 + rnd(i * 3 + 1) * 860;
        const speed = 0.6 + rnd(i * 7 + 2) * 0.9;
        const y = ((rnd(i * 11 + 3) * 1900 - frame * speed) % 1900 + 1900) % 1900;
        const flick = rnd(frame * 0.5 + i) > 0.92 ? 0.2 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              letterSpacing: "0.08em",
              color,
              opacity: (0.35 + rnd(i * 5) * 0.5) * flick,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/** A red signal: a dot with expanding rings. `on` 0..1 fades it. */
export const Pulse: React.FC<{ size?: number; color?: string; on?: number; style?: React.CSSProperties }> = ({
  size = 60,
  color = pcColors.bad,
  on = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  if (on <= 0.001) return null;
  return (
    <div style={{ position: "absolute", width: size, height: size, opacity: on, pointerEvents: "none", ...style }}>
      {[0, 1, 2].map((i) => {
        const p = ((frame / 22 + i / 3) % 1 + 1) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${color}`,
              opacity: 1 - p,
              transform: `scale(${0.4 + p * 2.2})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: size * 0.28,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${size * 0.6}px ${pcColors.badGlow}`,
        }}
      />
    </div>
  );
};

/** A vertical red wall the transfers cannot pass. `hit` 0..1 flares it. */
export const Barrier: React.FC<{ height: number; hit?: number; style?: React.CSSProperties }> = ({ height, hit = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", width: 6, height, pointerEvents: "none", ...style }}>
      <div
        style={{
          position: "absolute",
          left: -3 - hit * 6,
          right: -3 - hit * 6,
          top: 0,
          bottom: 0,
          borderRadius: 6,
          background: `repeating-linear-gradient(180deg, ${pcColors.bad} 0 28px, transparent 28px 44px)`,
          backgroundPosition: `0 ${(frame * 2) % 44}px`,
          opacity: 0.85 + hit * 0.15,
          boxShadow: `0 0 ${26 + hit * 60}px ${pcColors.badGlow}`,
        }}
      />
      {hit > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: -90 * hit,
            right: -90 * hit,
            top: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, ${pcColors.bad}66, transparent)`,
            opacity: hit,
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------ figures */

/** A hooded figure, head and shoulders, drawn flat. The fraudster. */
export const Hooded: React.FC<{ height?: number; delay?: number; color?: string; style?: React.CSSProperties }> = ({
  height = 300,
  delay = 0,
  color = pcColors.surfaceLift,
  style,
}) => {
  const p = useIn(delay, "smooth");
  const w = height * 0.8;
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 80 100"
      style={{
        display: "block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {/* shoulders */}
      <path d="M2 100 C2 70 18 58 40 58 C62 58 78 70 78 100 Z" fill={color} stroke={pcColors.lineStrong} strokeWidth={1.5} />
      {/* hood */}
      <path d="M18 62 C14 30 24 8 40 6 C56 8 66 30 62 62 C56 54 50 50 40 50 C30 50 24 54 18 62 Z" fill={color} stroke={pcColors.lineStrong} strokeWidth={1.5} />
      {/* the dark inside the hood */}
      <ellipse cx={40} cy={36} rx={13} ry={17} fill={pcColors.ink2} />
      {/* two red points */}
      <circle cx={35} cy={36} r={1.8} fill={pcColors.bad} />
      <circle cx={45} cy={36} r={1.8} fill={pcColors.bad} />
    </svg>
  );
};

/** A bank as a line drawing: pediment, four columns, base. No name, no logo. */
export const BankBuilding: React.FC<{
  width?: number;
  delay?: number;
  color?: string;
  dim?: number;
  style?: React.CSSProperties;
}> = ({ width = 320, delay = 0, color = pcColors.paper, dim = 0, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 26], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const h = width * 0.82;
  const len = 420;
  const stroke = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinejoin: "miter" as const, strokeLinecap: "square" as const };
  return (
    <svg width={width} height={h} viewBox="0 0 100 82" style={{ display: "block", opacity: (0.3 + p * 0.7) * (1 - dim * 0.6), ...style }}>
      <g strokeDasharray={len} strokeDashoffset={len * (1 - p)}>
        <path d="M4 30 L50 6 L96 30 Z" {...stroke} />
        <path d="M8 30 L92 30 L92 36 L8 36 Z" {...stroke} />
        {[16, 36, 56, 76].map((x) => (
          <path key={x} d={`M${x} 36 L${x} 68 L${x + 8} 68 L${x + 8} 36`} {...stroke} />
        ))}
        <path d="M4 68 L96 68 L96 76 L4 76 Z" {...stroke} />
        <path d="M46 18 L54 18 L54 24 L46 24 Z" {...stroke} />
      </g>
    </svg>
  );
};

/** Three notes fanned into a stack. The money in the middle. */
export const NoteStack: React.FC<{ width?: number; delay?: number; style?: React.CSSProperties }> = ({ width = 320, delay = 0, style }) => (
  <div style={{ position: "relative", width, height: width * 0.62, ...style }}>
    {[-9, -2, 6].map((deg, i) => (
      <Banknote
        key={i}
        width={width}
        delay={delay + i * 4}
        style={{ position: "absolute", left: 0, top: i * 14, transform: `rotate(${deg}deg)`, transformOrigin: "50% 80%" }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------- guards */

/** A padlock. `closed` 0..1 drops the shackle. */
export const Padlock: React.FC<{
  size?: number;
  closed?: number;
  color?: string;
  lit?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ size = 300, closed = 1, color = pcColors.paper, lit = false, delay = 0, style }) => {
  const p = useIn(delay, "smooth");
  const glow = color === pcPalette.primary ? pcPalette.glow : "rgba(241,237,226,0.35)";
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      style={{
        display: "block",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        filter: lit ? `drop-shadow(0 0 ${size * 0.12}px ${glow})` : undefined,
        ...style,
      }}
    >
      {/* shackle */}
      <path
        d="M28 56 L28 36 A22 22 0 0 1 72 36 L72 56"
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="square"
        style={{ transform: `translateY(${(1 - closed) * -18}px)` }}
      />
      {/* body */}
      <rect x={14} y={54} width={72} height={58} rx={8} fill={color} />
      <circle cx={50} cy={78} r={7} fill={pcColors.ink2} />
      <rect x={46.5} y={82} width={7} height={14} rx={2} fill={pcColors.ink2} />
    </svg>
  );
};

/** A shield outline. `crack` 0..1 draws a fracture through it. */
export const Shield: React.FC<{
  size?: number;
  color?: string;
  lit?: boolean;
  crack?: number;
  delay?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 240, color = pcPalette.primary, lit = false, crack = 0, delay = 0, fill = false, style }) => {
  const p = useIn(delay, "bouncy");
  const glow = color === pcPalette.primary ? pcPalette.glow : "rgba(241,237,226,0.35)";
  const crackLen = 90;
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      style={{
        display: "block",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
        filter: lit ? `drop-shadow(0 0 ${size * 0.14}px ${glow})` : undefined,
        ...style,
      }}
    >
      <path
        d="M50 4 L92 20 L92 56 C92 84 72 102 50 111 C28 102 8 84 8 56 L8 20 Z"
        fill={fill ? `${color}22` : "none"}
        stroke={color}
        strokeWidth={6}
        strokeLinejoin="miter"
      />
      <path d="M30 56 L45 71 L72 40" fill="none" stroke={color} strokeWidth={7} strokeLinecap="square" opacity={1 - crack} />
      {crack > 0 && (
        <path
          d="M56 8 L46 34 L58 46 L42 66 L54 80 L44 108"
          fill="none"
          stroke={pcColors.bad}
          strokeWidth={5}
          strokeLinejoin="miter"
          strokeDasharray={crackLen}
          strokeDashoffset={crackLen * (1 - crack)}
        />
      )}
    </svg>
  );
};

/**
 * A moving lime segment travelling around a rounded rectangle — the check
 * that runs along the device's outline and touches nothing inside it.
 */
export const OutlineTrace: React.FC<{
  width: number;
  height: number;
  radius?: number;
  progress: number; // 0..1 position of the segment along the perimeter
  on?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ width, height, radius = 60, progress, on = 1, color = pcPalette.primary, style }) => {
  if (on <= 0.001) return null;
  const pad = 6;
  const perim = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;
  const seg = perim * 0.22;
  return (
    <svg
      width={width + pad * 2}
      height={height + pad * 2}
      style={{ position: "absolute", opacity: on, pointerEvents: "none", filter: `drop-shadow(0 0 18px ${pcPalette.glow})`, ...style }}
    >
      <rect x={pad} y={pad} width={width} height={height} rx={radius} fill="none" stroke={`${color}33`} strokeWidth={3} />
      <rect
        x={pad}
        y={pad}
        width={width}
        height={height}
        rx={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={`${seg} ${perim - seg}`}
        strokeDashoffset={-progress * perim}
      />
    </svg>
  );
};

/* --------------------------------------------------------------- data */

export type TileKind = "photo" | "message" | "contact" | "doc";

/** A generic private-data tile: a photo, a message, a contact, a document. */
export const DataTile: React.FC<{ kind: TileKind; size?: number; delay?: number; style?: React.CSSProperties }> = ({
  kind,
  size = 150,
  delay = 0,
  style,
}) => {
  const p = useIn(delay, "snappy");
  const ink = pcPalette.textDim;
  const glyph =
    kind === "photo" ? (
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60">
        <rect x={6} y={10} width={48} height={40} rx={4} fill="none" stroke={ink} strokeWidth={3} />
        <circle cx={42} cy={22} r={5} fill={ink} />
        <path d="M10 46 L24 30 L34 40 L40 35 L50 46 Z" fill={ink} />
      </svg>
    ) : kind === "message" ? (
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60">
        <path d="M8 10 H52 V40 H24 L12 50 V40 H8 Z" fill="none" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={16} y={20} width={28} height={3} fill={ink} />
        <rect x={16} y={28} width={20} height={3} fill={ink} />
      </svg>
    ) : kind === "contact" ? (
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60">
        <circle cx={30} cy={20} r={10} fill="none" stroke={ink} strokeWidth={3} />
        <path d="M10 52 C10 38 20 34 30 34 C40 34 50 38 50 52" fill="none" stroke={ink} strokeWidth={3} />
      </svg>
    ) : (
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60">
        <path d="M14 6 H38 L48 16 V54 H14 Z" fill="none" stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={20} y={26} width={20} height={3} fill={ink} />
        <rect x={20} y={34} width={20} height={3} fill={ink} />
        <rect x={20} y={42} width={14} height={3} fill={ink} />
      </svg>
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.14),
        background: `linear-gradient(160deg, ${pcColors.surfaceLift}, ${pcColors.surfaceStrong})`,
        border: `2px solid ${pcColors.lineStrong}`,
        boxShadow: pcColors.shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
        ...style,
      }}
    >
      {glyph}
    </div>
  );
};

/** A transparent safe: lime frame, corner ticks, a padlock on the lid. */
export const Safe: React.FC<{
  width: number;
  height: number;
  delay?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, delay = 0, children, style }) => {
  const p = useIn(delay, "snappy");
  const lock = useIn(delay + 10, "snappy");
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 34,
          border: `5px solid ${pcPalette.primary}`,
          background: `${pcPalette.primary}0C`,
          boxShadow: `0 0 60px ${pcPalette.glow}, inset 0 0 80px ${pcPalette.primary}14`,
        }}
      />
      {[
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].map(([cx, cy]) => (
        <div
          key={`${cx}${cy}`}
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            background: pcPalette.primary,
            left: cx ? undefined : 22,
            right: cx ? 22 : undefined,
            top: cy ? undefined : 22,
            bottom: cy ? 22 : undefined,
          }}
        />
      ))}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 34 }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", top: -54, marginLeft: -46 }}>
        <Padlock size={92} closed={lock} color={pcPalette.primary} delay={delay + 4} />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- icons */

/** A wallet, drawn flat. Electronic money. */
export const Wallet: React.FC<{ width?: number; delay?: number; style?: React.CSSProperties }> = ({ width = 220, delay = 0, style }) => {
  const p = useIn(delay, "smooth");
  const h = width * 0.7;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        borderRadius: width * 0.08,
        background: `linear-gradient(135deg, ${pcColors.surfaceLift}, ${pcColors.surfaceStrong})`,
        border: `2px solid ${pcColors.lineStrong}`,
        boxShadow: pcColors.shadow,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        fontFamily: theme.fonts.mono,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: -2, right: -2, top: h * 0.2, height: h * 0.16, background: pcColors.paper, opacity: 0.9 }} />
      <div
        style={{
          position: "absolute",
          right: -2,
          top: h * 0.45,
          width: width * 0.3,
          height: h * 0.3,
          borderRadius: `${h * 0.15}px 0 0 ${h * 0.15}px`,
          background: pcColors.surfaceStrong,
          border: `2px solid ${pcColors.lineStrong}`,
          borderRight: "none",
        }}
      >
        <div style={{ position: "absolute", left: "30%", top: "50%", width: h * 0.1, height: h * 0.1, marginTop: -h * 0.05, borderRadius: "50%", background: pcPalette.textDim }} />
      </div>
      <div style={{ position: "absolute", left: width * 0.08, bottom: h * 0.1, fontSize: width * 0.075, letterSpacing: "0.18em", color: pcPalette.textDim }}>
        E-WALLET
      </div>
    </div>
  );
};

/** A stylised fast-payments mark: a tile with a bolt and the letters СБП. */
export const SbpMark: React.FC<{ size?: number; delay?: number; style?: React.CSSProperties }> = ({ size = 180, delay = 0, style }) => {
  const p = useIn(delay, "bouncy");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2,
        background: `linear-gradient(160deg, ${pcColors.surfaceLift}, ${pcColors.surfaceStrong})`,
        border: `2px solid ${pcColors.lineStrong}`,
        boxShadow: pcColors.shadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.04,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) rotate(${interpolate(p, [0, 1], [-14, 0])}deg)`,
        fontFamily: theme.fonts.wide,
        fontWeight: 900,
        fontSize: size * 0.2,
        color: pcPalette.text,
        ...style,
      }}
    >
      <svg width={size * 0.36} height={size * 0.4} viewBox="0 0 36 40">
        <path d="M20 2 L4 24 H17 L14 38 L32 14 H19 Z" fill={pcPalette.text} />
      </svg>
      СБП
    </div>
  );
};

/** An arrow that draws itself, left → right. */
export const Arrow: React.FC<{ width?: number; delay?: number; color?: string; thick?: number; style?: React.CSSProperties }> = ({
  width = 120,
  delay = 0,
  color = pcPalette.text,
  thick = 6,
  style,
}) => {
  const p = useRamp(delay, delay + 12, theme.ease.out);
  const head = 18;
  return (
    <svg width={width} height={head * 2 + 4} viewBox={`0 0 ${width} ${head * 2 + 4}`} style={{ display: "block", overflow: "visible", ...style }}>
      <line x1={0} y1={head + 2} x2={Math.max(0, (width - head) * p)} y2={head + 2} stroke={color} strokeWidth={thick} strokeLinecap="square" />
      {p > 0.9 && (
        <path
          d={`M${width - head} 2 L${width} ${head + 2} L${width - head} ${head * 2 + 2}`}
          fill="none"
          stroke={color}
          strokeWidth={thick}
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={(p - 0.9) * 10}
        />
      )}
    </svg>
  );
};

/**
 * Digits that roll into place like the wheels of a lock: each glyph is a
 * strip of 0–9 sliding on a spring to its final value, masked to one line.
 */
export const LockDigits: React.FC<{ text: string; delay?: number; per?: number; size?: number; color?: string }> = ({
  text,
  delay = 0,
  per = 5,
  size = 200,
  color = pcPalette.text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");
  const lineH = size * 1.05;
  const show = interpolate(frame, [delay, delay + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.ease.out });
  return (
    <div style={{ display: "flex", fontFamily: WIDE, fontSize: size, fontWeight: 900, lineHeight: `${lineH}px`, letterSpacing: "-0.02em", color, opacity: show }}>
      {chars.map((c, i) => {
        const digit = /\d/.test(c) ? Number(c) : null;
        const p = spring({ frame: frame - delay - i * per, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
        if (digit === null) {
          return (
            <span key={i} style={{ display: "inline-block", opacity: p }}>
              {c}
            </span>
          );
        }
        // roll through two full turns and land on the digit
        const turns = 2 + digit / 10;
        const offset = interpolate(p, [0, 1], [0, turns * 10]);
        const pos = offset % 10;
        return (
          <span key={i} style={{ display: "inline-block", height: lineH, overflow: "hidden", position: "relative", width: size * 0.72, textAlign: "center" }}>
            <span style={{ position: "absolute", left: 0, right: 0, top: 0, display: "block", transform: `translateY(${-pos * lineH}px)` }}>
              {Array.from({ length: 11 }, (_, d) => (
                <span key={d} style={{ display: "block", height: lineH }}>
                  {d % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};
