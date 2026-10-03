// The look lab: the same five beats — hook, number, photo, clip, CTA — that
// every reel is made of, printed in whichever look the props name. It is the
// catalogue the author picks a look from, and the smoke test that a look
// holds up on real media before a paid voiceover is spent on it.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Captions, Scene, VoLine, buildScenes, scenesDuration } from "../../reel";
import {
  Backdrop,
  BigNumber,
  Cta,
  Cuts,
  Evidence,
  Eyebrow,
  Finish,
  Headline,
  LookProvider,
  getLook,
  useCutZoom,
} from "../../looks";
import { LookLabProps } from "./schema";

export const SCENES = buildScenes({ hook: 3, number: 3, photo: 3, clip: 3, cta: 3 });
export const DURATION = scenesDuration(SCENES);

// Synthetic voiceover timings: the lab has no audio, but the captions still
// need a measured window to split, so each line declares one.
const LINES: VoLine[] = [
  { file: "hook", start: SCENES.hook.from + 0.3, raw: 2.4, pages: ["Пока ты +спишь, деньги дешевеют"] },
  { file: "number", start: SCENES.number.from + 0.2, raw: 2.5, pages: ["Три секунды на то, чтобы удержать"] },
  { file: "photo", start: SCENES.photo.from + 0.2, raw: 2.5, pages: ["Каждое фото движется и в палитре"] },
  { file: "clip", start: SCENES.clip.from + 0.2, raw: 2.5, pages: ["Каждый клип в рамке, на склейке !эффект"] },
  { file: "cta", start: SCENES.cta.from + 0.3, raw: 2.2, pages: ["Подписывайся, дальше +интереснее"] },
];

const Beat: React.FC<{ children: React.ReactNode; top?: number; left?: boolean }> = ({ children, top = 0, left }) => {
  const zoom = useCutZoom();
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoom})`,
        paddingTop: top,
        paddingLeft: left ? 72 : 60,
        paddingRight: left ? 72 : 60,
        display: "flex",
        flexDirection: "column",
        alignItems: left ? "flex-start" : "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Body: React.FC<LookLabProps> = (p) => {
  const look = getLook(p.look);
  const { fps } = useVideoConfig();
  const left = look.id === "swiss";
  const cuts = [SCENES.number, SCENES.photo, SCENES.clip, SCENES.cta].map((s) => Math.round(s.from * fps));
  return (
    <AbsoluteFill style={{ background: look.palette.bg }}>
      <Backdrop />

      <Scene spec={SCENES.hook} name="01 hook">
        <Beat top={300} left={left}>
          <Eyebrow text={p.eyebrow.replace("{look}", look.name)} />
          <div style={{ height: 70 }} />
          <Headline text={p.headline} size={left ? 190 : 150} delay={6} />
        </Beat>
      </Scene>

      <Scene spec={SCENES.number} name="02 number">
        <Beat top={420} left={left}>
          <BigNumber value={p.number} suffix={p.numberSuffix} label={p.numberLabel} delay={2} />
        </Beat>
      </Scene>

      <Scene spec={SCENES.photo} name="03 photo">
        <Beat top={330} left={left}>
          <Evidence src={p.photo} kind="photo" width={left ? 936 : 860} height={760} tag={p.photoTag} caption={p.photoCaption} delay={2} />
        </Beat>
      </Scene>

      <Scene spec={SCENES.clip} name="04 clip">
        <Beat top={300} left={left}>
          <Headline text={p.clipHeadline} size={left ? 120 : 96} delay={2} per={3} />
          <div style={{ height: 60 }} />
          <Evidence src={p.clip} kind="clip" width={left ? 936 : 900} height={left ? 527 : 506} tag="LIVE" figure={2} delay={6} />
        </Beat>
      </Scene>

      <Scene spec={SCENES.cta} name="05 cta">
        <Beat top={420} left={left}>
          <Headline text={"Подпишись,\nчтобы *успеть*"} size={left ? 150 : 120} delay={2} />
          <div style={{ height: 80 }} />
          <Cta text={p.cta} handle={p.handle} delay={16} />
        </Beat>
      </Scene>

      <Cuts cuts={cuts} />
      <Captions voiceover={LINES} rate={1} palette={look.palette} {...look.captions} />
      <Finish />
    </AbsoluteFill>
  );
};

export const LookLab: React.FC<LookLabProps> = (props) => (
  <LookProvider look={props.look}>
    <Body {...props} />
  </LookProvider>
);
