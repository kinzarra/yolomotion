// Batch still extraction — the verification loop of the motion-graphics skill,
// as one command. `npx remotion still` re-bundles per frame (~30s each); this
// bundles once and renders every requested frame from that bundle.
//   npm run stills -- <compositionId> [--times 1.2,5,12.5] [--frames 30,200]
//                     [--every 2.5] [--out dir] [--props file.json]
// Files are named by timestamp (t12.5.png) so a frame maps back to the
// timeline without arithmetic.
import fs from "node:fs";
import path from "node:path";
import { renderStill, selectComposition } from "@remotion/renderer";
import { getBundle, fromRepoRoot } from "./render.js";

const args = process.argv.slice(2);
const compositionId = args.find((a) => !a.startsWith("--"));

const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};

const numbers = (raw: string | undefined): number[] =>
  raw
    ? raw
        .split(",")
        .map((v) => Number(v.trim()))
        .filter((v) => Number.isFinite(v))
    : [];

if (!compositionId) {
  console.error(
    "Usage: npm run stills -- <compositionId> [--times 1.2,5] [--frames 30,200] [--every 2.5] [--out dir] [--props file.json]",
  );
  process.exit(1);
}

const propsPath = flag("props");
const inputProps = propsPath
  ? JSON.parse(fs.readFileSync(fromRepoRoot(propsPath), "utf8"))
  : {};

const outDir = fromRepoRoot(flag("out") ?? path.join("out", `${compositionId}-checks`));

const serveUrl = await getBundle();
const composition = await selectComposition({
  serveUrl,
  id: compositionId,
  inputProps,
});

const { fps, durationInFrames } = composition;
const explicit = [
  ...numbers(flag("times")).map((t) => Math.round(t * fps)),
  ...numbers(flag("frames")),
];

// No frames asked for → sample the whole timeline on a fixed grid, which is
// what "check the render" means most of the time.
const every = Number(flag("every") ?? 2.5);
const sampled =
  explicit.length > 0
    ? explicit
    : Array.from({ length: Math.floor(durationInFrames / (every * fps)) + 1 }, (_, i) =>
        Math.round(i * every * fps),
      );

const frames = [...new Set(sampled)]
  .map((f) => Math.min(Math.max(f, 0), durationInFrames - 1))
  .sort((a, b) => a - b);

fs.mkdirSync(outDir, { recursive: true });
console.log(`${compositionId}: ${frames.length} stills → ${outDir}`);

for (const frame of frames) {
  const seconds = (frame / fps).toFixed(1);
  const outPath = path.join(outDir, `t${seconds}.png`);
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: outPath,
    inputProps,
    overwrite: true,
  });
  console.log(`  frame ${frame} (${seconds}s) → ${path.basename(outPath)}`);
}
