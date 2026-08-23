// Programmatic render pipeline: bundle → select composition → render.
// This module is the seed of the SaaS render worker: a job is just
// { compositionId, inputProps, outPath } and can arrive from a queue later.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const here = path.dirname(fileURLToPath(import.meta.url));
export const VIDEO_ENTRY = path.resolve(here, "../../video/src/index.ts");
export const REPO_ROOT = path.resolve(here, "../../..");

// npm runs a workspace script with cwd set to the package, so a relative CLI
// path would resolve inside packages/renderer/ — a render silently landing in
// the wrong directory. Paths are taken relative to the repo root instead,
// which is what every documented example assumes. Absolute paths pass through.
export const fromRepoRoot = (value: string): string => path.resolve(REPO_ROOT, value);

export type RenderJob = {
  compositionId: string; // e.g. "logo-sting-landscape"
  inputProps?: Record<string, unknown>;
  outPath: string;
  codec?: "h264" | "h265" | "vp8" | "vp9" | "prores";
  crf?: number;
  onProgress?: (renderedFrames: number, totalFrames: number) => void;
};

let cachedBundle: Promise<string> | null = null;

// Bundling takes seconds; cache it so a worker process bundles once per deploy.
export const getBundle = (): Promise<string> => {
  cachedBundle ??= bundle({ entryPoint: VIDEO_ENTRY });
  return cachedBundle;
};

export const renderJob = async (job: RenderJob): Promise<string> => {
  const serveUrl = await getBundle();
  const inputProps = job.inputProps ?? {};

  const composition = await selectComposition({
    serveUrl,
    id: job.compositionId,
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: job.codec ?? "h264",
    crf: job.crf ?? 17,
    outputLocation: job.outPath,
    inputProps,
    onProgress: ({ renderedFrames }) => {
      job.onProgress?.(renderedFrames, composition.durationInFrames);
    },
  });

  return job.outPath;
};
