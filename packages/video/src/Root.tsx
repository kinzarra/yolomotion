import React from "react";
import { Composition } from "remotion";
import { templates } from "./templates";
import { DEFAULT_FPS, FORMATS } from "./formats";

export const Root: React.FC = () => (
  <>
    {templates.flatMap((t) =>
      t.formats.map((format) => {
        const { width, height } = FORMATS[format];
        const fps = t.fps ?? DEFAULT_FPS;
        return (
          <Composition
            key={`${t.id}-${format}`}
            id={`${t.id}-${format}`}
            component={t.component}
            schema={t.schema}
            defaultProps={t.defaultProps}
            durationInFrames={Math.round(t.durationInSeconds * fps)}
            fps={fps}
            width={width}
            height={height}
          />
        );
      }),
    )}
  </>
);
