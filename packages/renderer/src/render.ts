// Programmatic render pipeline: bundle → select composition → render.
// This module is the seed of the SaaS render worker: a job is just
// { compositionId, inputProps, outPath } and can arrive from a queue later.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, type CancelSignal } from "@remotion/renderer";

// Воркеру, который живёт поверх renderJob, нужен и способ его отменить.
export { makeCancelSignal } from "@remotion/renderer";

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
  // Воркер отдаёт сюда makeCancelSignal(): SIGTERM обрывает рендер посреди
  // кадра, и джоб возвращается в очередь вместо зависания до SIGKILL.
  cancelSignal?: CancelSignal;
};

let cachedBundle: Promise<string> | null = null;

// Bundling takes seconds; cache it so a worker process bundles once per deploy.
export const getBundle = (): Promise<string> => {
  cachedBundle ??= bundle({ entryPoint: VIDEO_ENTRY });
  return cachedBundle;
};

// Remotion sizes its render pool from the HOST's core count. In a container
// with a cpus: limit that oversubscribes badly (bare metal shows 32 cores, the
// cgroup grants 6), so the worker's compose file sets RENDER_CONCURRENCY to
// its cpus: value. Unset (laptops, CI) keeps Remotion's default.
const envConcurrency = (): number | null => {
  const raw = process.env.RENDER_CONCURRENCY;
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`RENDER_CONCURRENCY must be a positive integer, got "${raw}"`);
  }
  return n;
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
    concurrency: envConcurrency(),
    cancelSignal: job.cancelSignal,
    outputLocation: job.outPath,
    inputProps,
    onProgress: ({ renderedFrames }) => {
      job.onProgress?.(renderedFrames, composition.durationInFrames);
    },
  });

  return job.outPath;
};
