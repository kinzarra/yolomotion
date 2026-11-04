// Contact sheet of stills or thumbnails, one ffmpeg call (xstack), so a pass of
// 12 frames is read as one image instead of twelve.
//
//   node scripts/sheet.mjs <out.jpg> <cols> <tileW> <tileH> <files…>
//   e.g. node scripts/sheet.mjs /tmp/pass.jpg 3 540 960 out/<id>-reel-checks/t*.png
//
// zsh does not split an unquoted $var into words: pass files by glob or brace
// expansion ({a,b}-{0..5}.jpg), never as one string.
import { spawnSync } from "node:child_process";
const [out, colsS, wS, hS, ...files] = process.argv.slice(2);
const cols = +colsS, W = +wS, H = +hS;
const args = ["-v", "error", "-y"];
files.forEach((f) => args.push("-i", f));
let filt = files.map((_, i) => `[${i}]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=black[t${i}]`).join(";");
const layout = files.map((_, i) => `${(i % cols) * W}_${Math.floor(i / cols) * H}`).join("|");
filt += ";" + files.map((_, i) => `[t${i}]`).join("") + `xstack=inputs=${files.length}:layout=${layout}:fill=black[o]`;
args.push("-filter_complex", filt, "-map", "[o]", "-frames:v", "1", out);
const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
console.log("ok", out, files.length);
