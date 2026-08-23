import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { usePunch } from "../../../reel";
import { theme } from "../../../theme";
import { mbColors, mbPalette } from "../palette";
import { BrandBar, Cutout, SceneShell, Scanlines, Slam, useIn } from "../ui";

// 28.5–35.5s. The escalation ladder: one rung per era, each rung a stylised
// era tile rather than borrowed footage. The ladder shifts up as rungs land so
// the newest one always sits in the middle of the frame, then it recedes and
// MRBEAST slams over it.
const RUNGS = [
  { at: 4, sub: "2017", label: "COUNT TO 100,000", kind: "count" as const },
  { at: 44, sub: "2018 →", label: "BIGGER CHALLENGES", kind: "grid" as const },
  { at: 100, sub: "2019 →", label: "MILLIONS OF VIEWS", kind: "chart" as const },
];
const NAME_AT = 168;

const TILE_W = 230;
const TILE_H = Math.round((TILE_W * 9) / 16);

const EraTile: React.FC<{
  kind: "count" | "grid" | "chart";
  p: number;
  photo?: string;
}> = ({ kind, p, photo }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        width: TILE_W,
        height: TILE_H,
        flexShrink: 0,
        borderRadius: 14,
        overflow: "hidden",
        background: mbColors.tape,
        border: `1px solid ${mbColors.line}`,
        boxShadow: mbColors.shadow,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${mbColors.tapeLift}, ${mbColors.tape} 74%)`,
        }}
      />
      {kind === "count" && photo && (
        <Img
          src={staticFile(`images/${photo}`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 40%",
            filter: "grayscale(1) contrast(1.05) brightness(0.8)",
          }}
        />
      )}
      {kind === "count" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.fonts.mono,
            fontSize: 34,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: mbColors.white,
            opacity: 0.9,
          }}
        >
          100,000
        </div>
      )}
      {kind === "grid" && (
        <div
          style={{
            position: "absolute",
            inset: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 8,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 5,
                background: mbColors.surfaceLift,
                border: `1px solid ${mbColors.line}`,
                opacity: interpolate(p, [0.2 + i * 0.16, 0.55 + i * 0.16], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(p, [0.2 + i * 0.16, 0.55 + i * 0.16], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}
            />
          ))}
        </div>
      )}
      {kind === "chart" && (
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 16,
            top: 20,
            display: "flex",
            alignItems: "flex-end",
            gap: 9,
          }}
        >
          {[0.16, 0.28, 0.44, 0.66, 1].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100 * Math.min(1, Math.max(0, (p - i * 0.1) * 2.2))}%`,
                borderRadius: 3,
                background: "rgba(246,246,248,0.78)",
              }}
            />
          ))}
        </div>
      )}
      <Scanlines opacity={0.22} period={4} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 46%, transparent 38%, rgba(0,0,0,0.6) 94%)`,
        }}
      />
      {/* the tape keeps rolling so the ladder never sits dead */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "rgba(246,246,248,0.14)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${((frame * 1.1) % 100).toFixed(1)}%`,
            background: "rgba(246,246,248,0.5)",
          }}
        />
      </div>
    </div>
  );
};

const Rung: React.FC<{
  at: number;
  sub: string;
  label: string;
  kind: "count" | "grid" | "chart";
  first: boolean;
  photo?: string;
}> = ({ at, sub, label, kind, first, photo }) => {
  const p = useIn(at, "smooth");
  const link = useIn(at - 8, "snappy");
  return (
    <>
      {!first && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: TILE_W / 2,
            height: 66,
            opacity: link,
          }}
        >
          <div
            style={{
              width: 3,
              flex: 1,
              background: mbColors.lineStrong,
              transformOrigin: "top",
              transform: `scaleY(${link})`,
            }}
          />
          <div
            style={{
              width: 15,
              height: 15,
              borderRight: `3px solid ${mbColors.lineStrong}`,
              borderBottom: `3px solid ${mbColors.lineStrong}`,
              transform: `rotate(45deg) translate(-4px, -4px) scale(${link})`,
            }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          opacity: p,
          transform: `translateX(${interpolate(p, [0, 1], [-56, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        }}
      >
        <EraTile kind={kind} p={p} photo={photo} />
        <div>
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: mbPalette.textDim,
            }}
          >
            {sub}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: theme.fonts.display,
              fontSize: 50,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: mbPalette.text,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </>
  );
};

export const TimelineScene: React.FC<{ photo: string; cutout: string }> = ({
  photo,
  cutout,
}) => {
  const frame = useCurrentFrame();
  const hit = usePunch(NAME_AT, 18);

  // The ladder recentres itself as rungs land, then steps back for the name.
  const shift = interpolate(frame, [4, 44, 100, NAME_AT], [16, 0, -16, -40], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recede = interpolate(frame, [NAME_AT - 6, NAME_AT + 10], [1, 0.2], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underline = interpolate(frame, [NAME_AT + 10, NAME_AT + 26], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <AbsoluteFill
        style={{ transform: `translate(${hit.shake * 0.3}px, ${hit.shake * 0.7}px)` }}
      >
        <BrandBar chapter="06 · THE ESCALATION" />

        <div
          style={{
            position: "absolute",
            left: 150,
            top: 520,
            width: 800,
            display: "flex",
            flexDirection: "column",
            opacity: recede,
            transform: `translateY(${shift}px)`,
          }}
        >
          {RUNGS.map((r, i) => (
            <Rung
              key={r.label}
              {...r}
              first={i === 0}
              photo={r.kind === "count" ? photo : undefined}
            />
          ))}
        </div>

        {/* the man the ladder was building — he lands under his own name */}
        <Cutout
          photo={cutout}
          height={620}
          delay={NAME_AT - 12}
          tilt={-2}
          dim={0.6}
          style={{ bottom: "auto", top: 410, left: 540, marginLeft: -288 }}
        />

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 860,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // clears the cut-out's scissor line, which lands at ~1030
            gap: 46,
          }}
        >
          <Slam text="MRBEAST" at={NAME_AT} size={166} />
          {frame >= NAME_AT && (
            <div
              style={{
                width: 560 * underline,
                height: 10,
                borderRadius: 5,
                background: mbPalette.primary,
                boxShadow: `0 0 40px ${mbPalette.glow}`,
              }}
            />
          )}
        </div>

        <AbsoluteFill
          style={{
            background: mbColors.white,
            opacity: hit.energy * 0.12,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};
