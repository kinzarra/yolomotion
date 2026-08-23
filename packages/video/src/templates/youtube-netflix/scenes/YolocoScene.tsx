import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { youtubeNetflixPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "yoloco" beat.
export const YolocoScene: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => (
  <AbsoluteFill>
    <BgMesh palette={youtubeNetflixPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>{ctaLabel}</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
