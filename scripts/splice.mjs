// Patch a long video without re-rendering all of it.
//
//   node scripts/splice.mjs <id> --at 85.1 --old-end 100.65 [--audio]
//
// Takes the current review mp4 out/<id>.mp4 (the old cut), the patch render
// out/<id>-part.mp4 (made by `ship … --seconds A-B`, starting at --at in the
// new timeline) and, with --audio, the fresh soundtrack out/<id>-audio.m4a
// (`ship … --audio`). Result: old[0, at) + part + old[old-end, end), video
// re-encoded frame-exactly, audio = the fresh soundtrack (or the old one cut the
// same way). Scenes after the patch are identical frames, only shifted, so they
// can be reused; the soundtrack is not (music ducking spans the cuts), which is
// why a retimed cut always takes a fresh --audio render.
import { execFileSync } from "node:child_process";
import { renameSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? Number(args[i + 1]) : undefined; };
const at = flag("at");
const oldEnd = flag("old-end");
if (!id || at === undefined || oldEnd === undefined) {
  console.error("usage: node scripts/splice.mjs <id> --at <s> --old-end <s> [--audio]");
  process.exit(1);
}
const out = (f) => path.join(root, "out", f);
const old = out(`${id}.mp4`), part = out(`${id}-part.mp4`), audio = out(`${id}-audio.m4a`), tmp = out(`${id}.splice.mp4`);
for (const f of [old, part, ...(args.includes("--audio") ? [audio] : [])]) if (!existsSync(f)) throw new Error(`missing ${f}`);

const fps = 30;
const fa = Math.round(at * fps), fe = Math.round(oldEnd * fps);
const useAudio = args.includes("--audio");
const filter =
  `[0:v]trim=start_frame=0:end_frame=${fa},setpts=PTS-STARTPTS[a];` +
  `[1:v]setpts=PTS-STARTPTS[b];` +
  `[0:v]trim=start_frame=${fe},setpts=PTS-STARTPTS[c];` +
  `[a][b][c]concat=n=3:v=1:a=0[v]` +
  (useAudio ? "" : `;[0:a]atrim=0:${at},asetpts=PTS-STARTPTS[x];[1:a]asetpts=PTS-STARTPTS[y];[0:a]atrim=start=${oldEnd},asetpts=PTS-STARTPTS[z];[x][y][z]concat=n=3:v=0:a=1[au]`);
const inputs = ["-i", old, "-i", part, ...(useAudio ? ["-i", audio] : [])];
execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[v]", "-map", useAudio ? "2:a" : "[au]",
  "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", String(fps), "-c:a", "aac", "-b:a", "320k", "-shortest", "-movflags", "+faststart", tmp], { stdio: "inherit" });
renameSync(tmp, old);
const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", old], { encoding: "utf8" }).trim();
console.log(`✓ out/${id}.mp4 spliced: ${(+dur).toFixed(2)} s (old ≤ ${at}s + part + old ≥ ${oldEnd}s${useAudio ? ", fresh soundtrack" : ""})`);
