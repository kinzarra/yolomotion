import React from "react";
import { AbsoluteFill } from "remotion";
import { BgMesh } from "../../../components/Layers";
import { dubaiEconomyPalette } from "../palette";
import { Headline } from "../ui";

// TODO: the "hook" beat.
export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <BgMesh palette={dubaiEconomyPalette} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Headline>HOOK</Headline>
    </AbsoluteFill>
  </AbsoluteFill>
);
