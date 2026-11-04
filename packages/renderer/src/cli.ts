// CLI wrapper over renderJob — the same call shape a future API/queue will use.
//   npm run render -- <compositionId> [--props path/to/props.json] [--out out/file.mp4]
// Example:
//   npm run render -- digital-ruble-reel --out out/digital-ruble-reel.mp4
import fs from "node:fs";
import path from "node:path";
import { renderJob, fromRepoRoot } from "./render.js";

const args = process.argv.slice(2);
const compositionId = args.find((a) => !a.startsWith("--"));

const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};

if (!compositionId) {
  console.error(
    "Usage: npm run render -- <compositionId> [--props file.json] [--out file.mp4]",
  );
  process.exit(1);
}

const propsPath = flag("props");
const inputProps = propsPath
  ? JSON.parse(fs.readFileSync(fromRepoRoot(propsPath), "utf8"))
  : undefined;

const outPath = fromRepoRoot(flag("out") ?? path.join("out", `${compositionId}.mp4`));
fs.mkdirSync(path.dirname(outPath), { recursive: true });

console.log(`Rendering ${compositionId} → ${outPath}`);
const started = Date.now();

// --seconds 85.1-104.45 renders only that span (frames at 30 fps, inclusive);
// --audio renders the whole soundtrack alone as AAC.
const span = flag("seconds");
const fps = 30;
const frameRange = span
  ? (span.split("-").map((v, i) => (i === 0 ? Math.round(Number(v) * fps) : Math.round(Number(v) * fps) - 1)) as [number, number])
  : undefined;
await renderJob({
  compositionId,
  inputProps,
  outPath,
  frameRange,
  codec: args.includes("--audio") ? "aac" : undefined,
  onProgress: (done, total) => {
    if (done % 30 === 0 || done === total) {
      console.log(`  ${done}/${total} frames`);
    }
  },
});

console.log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
