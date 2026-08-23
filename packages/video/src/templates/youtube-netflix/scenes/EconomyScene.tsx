import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { youtubeNetflixPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "economy" beat.
export const EconomyScene: React.FC = () => (
  <AbsoluteFill>
    <BgMesh palette={youtubeNetflixPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>ECONOMY</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
