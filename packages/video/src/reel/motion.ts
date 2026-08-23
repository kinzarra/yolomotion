// Palette-independent motion primitives every reel needs. The styled pieces
// (type, panels, chips) stay per-template because they carry the reel's look;
// these three only carry timing, so they live in the engine.
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type SpringName = keyof typeof theme.spring;

/** Spring entrance 0→1. Drive opacity + translate + scale off one value. */
export const useIn = (delay = 0, config: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

/** Eased, clamped 0→1 ramp for non-spring moves: bars, sweeps, typing, counters. */
export const useRamp = (from: number, to: number, easing = theme.ease.out) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * Impact: a 0 → 1 → 0 decay for slams, so a scale punch, a frame shake and a
 * flash can all come off the same envelope and stay in sync. Dead before `at`
 * and after the window, so it never leaks into neighbouring beats.
 */
export const usePunch = (at: number, life = 16) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + life], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const decay = 1 - t;
  return {
    shake: frame < at ? 0 : Math.sin((frame - at) * 1.5) * decay * decay * 26,
    pop: frame < at ? 0 : Math.sin(t * Math.PI) * decay,
    energy: frame < at ? 0 : decay * decay,
  };
};
