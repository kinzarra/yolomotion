import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { templates } from "./templates";
import { DEFAULT_FPS, FORMATS } from "./formats";

export const Root: React.FC = () => (
  <>
    {templates.flatMap((t) =>
      t.formats.map((format) => {
        const { width, height } = FORMATS[format];
        const fps = t.fps ?? DEFAULT_FPS;
        const seconds = t.durationInSeconds;
        // Templates with a props-dependent length get a calculateMetadata, so
        // the duration follows whatever a caller sends (Studio props panel or
        // a render job's inputProps). The static durationInFrames below is the
        // defaultProps fallback Remotion still requires at registration time.
        const calculateMetadata: CalculateMetadataFunction<
          Record<string, unknown>
        > | undefined =
          typeof seconds === "function"
            ? ({ props }) => ({
                durationInFrames: Math.round(seconds(props) * fps),
              })
            : undefined;
        return (
          <Composition
            key={`${t.id}-${format}`}
            id={`${t.id}-${format}`}
            component={t.component}
            schema={t.schema}
            defaultProps={t.defaultProps}
            durationInFrames={Math.round(
              (typeof seconds === "function" ? seconds(t.defaultProps) : seconds) * fps,
            )}
            calculateMetadata={calculateMetadata}
            fps={fps}
            width={width}
            height={height}
          />
        );
      }),
    )}
  </>
);
