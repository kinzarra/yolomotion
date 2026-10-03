// 02 agents — the strobe resolves into the new era. The headline stacks with
// the voice (NEW ERA → AI REVOLUTION → EVERYTHING RUNS ON AGENTS), the author
// sits back with his arms crossed (his own drawing for this beat) and the
// platform's capabilities orbit him while the robot works.
//
// The orbit is a real ellipse in depth, not a ring of badges. The far half of
// every revolution is painted BEFORE the cutout and the near half after, so a
// chip travels behind his shoulder and comes back out the other side. Paint
// order is the only thing that sells it: with everything drawn after him the
// chips read as stickers pinned to the glass in front of the shot, which is
// exactly what the first cut looked like.
//
// The beat ends on the cut the author asked for: the TikTok flash, whose
// other half opens the MCP scene.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../../theme";
import { usePunch } from "../../../reel";
import { mcpColors, mcpPalette } from "../palette";
import { CUT2 } from "../timeline";
import {
  Cutout,
  Glitch,
  IconName,
  Kinetic,
  Label,
  SceneShell,
  TikTokCut,
  ToolPill,
  cutZoom,
} from "../ui";

const NODES: { icon: IconName; label: string }[] = [
  { icon: "search", label: "Creator Search" },
  { icon: "chart", label: "Audience Analytics" },
  { icon: "overlap", label: "Audience Overlap" },
  { icon: "table", label: "Media Plans" },
  { icon: "megaphone", label: "Campaigns" },
];

// The ellipse the chips run on, in frame pixels, and the numbers matter more
// than they look. A rounder orbit put its far arc up at head height, where the
// silhouette is only a couple of hundred pixels wide, so a chip crossed the
// back without ever being hidden by anything and the depth was theoretical.
// Flattening it and dropping it onto his chest is what makes the effect read:
// the far arc (y ≈ 1062) runs across his torso and the near arc (y ≈ 1320)
// across his crossed arms, so the SAME chip is occluded on the way out and
// paints over him on the way back. `lift` tilts the far side up a touch, the
// way a ring looks when the camera sits slightly above it.
const ORBIT = { x: 540, y: 1200, rx: 452, ry: 120, spin: 40, lift: 18 } as const;
const T = { era: 0.25, revolution: 0.95, agents: 2.7 } as const;

type Node = {
  key: string;
  icon: IconName;
  label: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
  depth: number;
  anchor: number; // -100%..0% horizontal anchor, so a label hangs inward
  hero: boolean;
};

export const AgentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inK = frame; // the incoming half of the cut from the hook
  const outK = frame - Math.round(CUT2.at * fps);
  const hit = usePunch(Math.round(T.revolution * fps) + 4, 14);
  const ring = spring({ frame: frame - 4, fps, config: theme.spring.smooth });

  // One pass over the orbit: position, and how far away each chip is.
  // depth 0 = the far side (behind him), 1 = the near side (in front).
  const nodes: Node[] = NODES.map((node, i) => {
    const a = ((i / NODES.length) * 360 - 90 + t * ORBIT.spin) * (Math.PI / 180);
    const depth = (Math.sin(a) + 1) / 2;
    const side = Math.cos(a); // +1 at the right extreme, -1 at the left
    const p = spring({ frame: frame - 8 - i * 3, fps, config: theme.spring.bouncy });
    return {
      key: node.label,
      icon: node.icon,
      label: node.label,
      x: ORBIT.x + Math.cos(a) * ORBIT.rx,
      // The far side rides a little higher — an ellipse seen from slightly
      // above, which is what puts the back of the orbit across his shoulders.
      y: ORBIT.y + Math.sin(a) * ORBIT.ry - (1 - depth) * ORBIT.lift,
      // Perspective: the far side is small, dim and slightly out of focus.
      scale: interpolate(depth, [0, 1], [0.66, 1.06]) * interpolate(p, [0, 1], [0.4, 1]),
      opacity: p * interpolate(depth, [0, 1], [0.5, 1]),
      blur: interpolate(depth, [0, 1], [1.2, 0]),
      depth,
      // A pill is wide and the orbit is wider than the frame's safe area, so
      // a centred label runs off the edge at the extremes. Anchoring it by the
      // inner edge instead keeps the orbit honest and the text on screen:
      // centred at top and bottom, right-aligned at the right extreme.
      anchor: -50 - 50 * side,
      hero: i === 0,
    };
  });
  const behind = nodes.filter((n) => n.depth < 0.5);
  const front = nodes.filter((n) => n.depth >= 0.5);

  const Chip: React.FC<{ n: Node }> = ({ n }) => (
    <div
      style={{
        position: "absolute",
        left: n.x,
        top: n.y,
        transform: `translate(${n.anchor}%, -50%) scale(${n.scale})`,
        opacity: n.opacity,
        filter: n.blur > 0.05 ? `blur(${n.blur}px)` : "none",
      }}
    >
      <ToolPill icon={n.icon} label={n.label} size={22} hero={n.hero} />
    </div>
  );

  // The ring is one ellipse drawn twice and clipped at its own waistline, so
  // its far arc is occluded by him and its near arc passes over his chest.
  const Ring: React.FC<{ half: "far" | "near" }> = ({ half }) => (
    <div
      style={{
        position: "absolute",
        left: ORBIT.x - ORBIT.rx,
        top: ORBIT.y - ORBIT.ry - ORBIT.lift,
        width: ORBIT.rx * 2,
        height: ORBIT.ry * 2 + ORBIT.lift,
        clipPath: half === "far" ? "inset(0 0 52% 0)" : "inset(48% 0 0 0)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: ORBIT.lift,
          width: "100%",
          height: ORBIT.ry * 2,
          borderRadius: "50%",
          border: `2px dashed ${mcpColors.lineStrong}`,
          opacity: ring * (half === "far" ? 0.5 : 0.85),
          transform: `scale(${interpolate(ring, [0, 1], [0.7, 1])})`,
        }}
      />
    </div>
  );

  return (
    <SceneShell>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform:
            `translate(${hit.shake * 0.5}px, 0) ` +
            `scale(${cutZoom(inK, "in") * cutZoom(outK, "out") * (1 + hit.pop * 0.03)})`,
        }}
      >
        <Glitch amount={hit.energy * 0.5} bands={5} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 90, top: 268 }}>
            <Label delay={Math.round(T.era * fps)}>WELCOME TO THE NEW ERA</Label>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 326 }}>
            <Kinetic text="THE AI REVOLUTION" size={126} weight={800} align="center" delay={Math.round(T.revolution * fps)} per={4} />
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 606 }}>
            <Kinetic
              text="EVERYTHING RUNS ON AGENTS"
              size={64}
              weight={700}
              color={mcpPalette.accent}
              align="center"
              delay={Math.round(T.agents * fps)}
              per={2}
            />
          </div>
        </Glitch>

        {/* ---- behind him: the far arc, the far chips, the robot ---- */}
        <Ring half="far" />
        {behind.map((n) => (
          <Chip key={n.key} n={n} />
        ))}
        <div style={{ position: "absolute", left: 816, top: 820 }}>
          <Cutout src="footage/yoloco-mcp/cut-robot.png" height={182} delay={16} float={1.3} glow />
        </div>

        {/* ---- him ---- */}
        <div style={{ position: "absolute", left: 540, top: 1348, transform: "translate(-50%, -100%)" }}>
          <Cutout src="footage/yoloco-mcp/cut-philipp-agents.png" height={634} delay={3} float={0.8} />
        </div>

        {/* ---- in front of him: the near arc and the near chips ---- */}
        <Ring half="near" />
        {front.map((n) => (
          <Chip key={n.key} n={n} />
        ))}
      </div>
      <TikTokCut k={inK} phase="in" />
      <TikTokCut k={outK} phase="out" />
    </SceneShell>
  );
};
