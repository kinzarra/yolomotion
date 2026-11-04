// A one-second composition whose frame 0 is the cover image for the upload.
//   npm run stills -- sberbook-1991-cover-reel --times 0
import React from "react";
import { Reel, Scene, buildScenes, scenesDuration } from "../../reel";
import { defineTemplate } from "../types";
import { palette } from "./palette";
import { sberbook1991Schema, Sberbook1991Props } from "./schema";
import { CoverScene } from "./scenes/CoverScene";

const SCENES = buildScenes({ cover: 1 });

const Cover: React.FC<Sberbook1991Props> = ({ series, episode }) => (
  <Reel palette={palette} voiceoverDir="sberbook-1991" voiceover={[]} voRate={1} captions={false} gradeOpacity={0.08}>
    <Scene spec={SCENES.cover} name="cover">
      <CoverScene series={series} episode={episode} />
    </Scene>
  </Reel>
);

export const sberbook1991Cover = defineTemplate({
  id: "sberbook-1991-cover",
  name: "Сберкнижка 1991 — обложка",
  description: "The cover still for sberbook-1991 (frame 0).",
  schema: sberbook1991Schema,
  defaultProps: { series: "ДЕНЬГИ · ПРОСТО", episode: "ВЫПУСК 10" },
  durationInSeconds: scenesDuration(SCENES),
  formats: ["reel"],
  component: Cover,
});
