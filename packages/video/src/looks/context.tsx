// The active look travels by context, so a scene written against the kit
// never threads a `look` prop through every primitive.
import React from "react";
import { getLook, Look, LookId } from "./presets";

const LookContext = React.createContext<Look>(getLook("riso"));

export const LookProvider: React.FC<{ look: LookId; children: React.ReactNode }> = ({
  look,
  children,
}) => <LookContext.Provider value={getLook(look)}>{children}</LookContext.Provider>;

export const useLook = () => React.useContext(LookContext);
