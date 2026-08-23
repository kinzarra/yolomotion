import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { youtubeNetflixPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "crazy" beat.
export const CrazyScene: React.FC = () => (
  <AbsoluteFill>
    <BgMesh palette={youtubeNetflixPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>CRAZY</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
