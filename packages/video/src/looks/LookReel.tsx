// <Reel> dressed in a look: palette, backdrop, finishing stack and caption
// style all come from the look the job asked for; a template's own
// `captions` only overrides what it must (position, an act-change colour).
import React from "react";
import { Reel, ReelProps } from "../reel";
import { LookProvider } from "./context";
import { Backdrop, Finish } from "./layers";
import { Cuts } from "./kit";
import { getLook, LookId } from "./presets";

type Without<T> = T extends unknown ? Omit<T, "palette" | "backdrop" | "finish"> : never;

export type LookReelProps = Without<ReelProps> & {
  look: LookId;
  cuts?: number[]; // boundary frames for the look's cut effect
};

export const LookReel: React.FC<LookReelProps> = ({ look: id, cuts = [], children, ...rest }) => {
  const look = getLook(id);
  const reel = {
    ...rest,
    palette: look.palette,
    backdrop: <Backdrop />,
    finish: <Finish />,
    ...(rest.captions === false ? {} : { captions: { ...look.captions, ...(rest.captions ?? {}) } }),
  } as ReelProps;
  return (
    <LookProvider look={id}>
      <Reel {...reel}>
        {children}
        <Cuts cuts={cuts} />
      </Reel>
    </LookProvider>
  );
};
