// The cover for the channel page and search (PLAYBOOK §3: the feed shows
// frame 0, the cover works only where a thumbnail is shown). One still:
// the book with 10 000, the faces, the stamp — number, people, verdict.
import React from "react";
import { theme } from "../../../theme";
import { palette, colors } from "../palette";
import { BrandBar, Kinetic, SceneShell, Stamp } from "../ui";
import { People, TheBook } from "./HookScene";

const WIDE = `${theme.fonts.wide}, ${theme.fonts.mono}`;

export const CoverScene: React.FC<{ series: string; episode: string }> = ({ series, episode }) => (
  <SceneShell exit={false}>
    <BrandBar series={series} episode={episode} delay={-20} />
    <div style={{ position: "absolute", left: 72, right: 72, top: 236, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ maxWidth: 700 }}>
        <Kinetic text="СБЕРКНИЖКА" delay={-20} size={66} lineHeight={1} />
        <Kinetic text="ТВОИХ РОДИТЕЛЕЙ" delay={-14} size={58} lineHeight={1} color={palette.textDim} />
      </div>
      <div
        style={{
          padding: "10px 22px",
          background: colors.paper,
          color: colors.ink2,
          fontFamily: theme.fonts.mono,
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: "0.04em",
          transform: "rotate(-3deg)",
          boxShadow: colors.paperShadow,
        }}
      >
        1991
      </div>
    </div>
    <TheBook />
    {/* the faces are the hook: big, centre, the verdict across their chests */}
    <People at={-30} scale={1.62} left={24} top={860} />
    <div style={{ position: "absolute", left: 36, top: 1540, zIndex: 40 }}>
      <Stamp delay={-30} tone="bad" size={88} rotate={-6} style={{ fontFamily: WIDE }}>
        ПОТЕРЯНО 95%
      </Stamp>
    </div>
  </SceneShell>
);
