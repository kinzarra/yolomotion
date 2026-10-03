import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { dubaiEconomyPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "cta" beat.
export const CtaScene: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => (
  <AbsoluteFill>
    <BgMesh palette={dubaiEconomyPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>{ctaLabel}</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
