// The render conveyor: every reel renders on the author's server (vibesrv),
// never on the Mac. One shared tree is synced once (rsync is incremental), then
// each id renders in the worker container and its mp4 comes back to
// out/<id>.mp4 for the panel; status.json of each brief is updated on the way.
// After the download the server copy is deleted and the mp4 goes to S3
// (deliver --renders-only): vibesrv is a shared box, renders must not pile up.
//
//   npm run ship -- <id> [<id> …]        # renders <id>-reel for each
//   npm run ship -- <id> --comp other-reel
//
// Login: ~/.ssh/config Host vibesrv (Cloudflare Access) + SSH_PASSWORD from .env.
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const compFlag = args.indexOf("--comp");
const comp = compFlag >= 0 ? args[compFlag + 1] : null;
const secFlag = args.indexOf("--seconds");
const seconds = secFlag >= 0 ? args[secFlag + 1] : null;
const audioOnly = args.includes("--audio");
// A patch render (--seconds a-b) lands as out/<id>-part.mp4, an audio render as out/<id>-audio.m4a;
// the review mp4 out/<id>.mp4 is untouched until scripts/splice.mjs assembles it.
const ids = args.filter((a, i) => !a.startsWith("--") && (compFlag < 0 || i !== compFlag + 1) && (secFlag < 0 || i !== secFlag + 1));
if (!ids.length) { console.error("usage: npm run ship -- <id> [<id> …]"); process.exit(1); }

const askpass = path.join(tmpdir(), "yolomotion-askpass.sh");
writeFileSync(askpass, `#!/bin/sh\ngrep '^SSH_PASSWORD=' "${root}/.env" | cut -d= -f2- | sed "s/^['\\"]//;s/['\\"]$//"\n`);
chmodSync(askpass, 0o700);
const env = { ...process.env, SSH_ASKPASS: askpass, SSH_ASKPASS_REQUIRE: "force", DISPLAY: ":0" };
const run = (cmd, a, opts = {}) => {
  const r = spawnSync(cmd, a, { env, stdio: opts.quiet ? "pipe" : "inherit", encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} ${a.slice(0, 2).join(" ")} failed${r.stderr ? `: ${r.stderr.slice(-400)}` : ""}`);
  return r.stdout;
};
const ssh = (script, quiet = false) => run("ssh", ["-o", "ConnectTimeout=30", "vibesrv", script], { quiet });

const status = (id, s, note) => {
  const f = path.join(root, "studio/briefs", id, "status.json");
  if (!existsSync(f)) return;
  const m = JSON.parse(readFileSync(f, "utf8"));
  Object.assign(m, { status: s, note, updated: new Date().toISOString() });
  writeFileSync(f, JSON.stringify(m, null, 2));
};

// Cloudflare Access: the server token expires (overnight); a stale .lock left by
// an interrupted login then blocks every new one. Clear it and log in again:
// the author confirms one page in the browser.
const cfDir = path.join(process.env.HOME, ".cloudflared");
const host = "sshvtnl.tech-4.eu";
const hasToken = existsSync(cfDir) && readdirSync(cfDir).some((f) => f.startsWith(host) && f.endsWith("-token"));
if (!hasToken) {
  for (const f of existsSync(cfDir) ? readdirSync(cfDir) : []) if (f.startsWith(host) && f.endsWith(".lock")) rmSync(path.join(cfDir, f));
  console.log("▸ вход Cloudflare Access истёк: подтверди страницу в браузере");
  run("cloudflared", ["access", "login", `https://${host}`], { quiet: true });
}

const T = "render-jobs/_tree";
console.log("▸ sync → vibesrv");
ssh(`mkdir -p ~/${T}/packages/video ~/${T}/packages/renderer ~/${T}/out && chmod 777 ~/${T}/out`, true);
const rs = ["-az", "--delete", "--exclude", ".DS_Store", "--exclude", "_src", "-e", "ssh"];
run("rsync", [...rs, "packages/video/src", "packages/video/public", "packages/video/remotion.config.ts", `vibesrv:${T}/packages/video/`].map((x) => x), { quiet: true });
run("rsync", [...rs, "packages/renderer/src", `vibesrv:${T}/packages/renderer/`], { quiet: true });

const failed = [];
for (const id of ids) {
  const c = comp ?? `${id}-reel`;
  const name = audioOnly ? `${id}-audio` : seconds ? `${id}-part-${seconds.replace(/[^0-9]+/g, "_")}` : id;
  const ext = audioOnly ? "m4a" : "mp4";
  const extra = audioOnly ? " --audio" : seconds ? ` --seconds ${seconds}` : "";
  const t0 = Date.now();
  console.log(`▸ render ${c} on vibesrv`);
  status(id, "rendering", `рендер на vibesrv: ${c}`);
  try {
    const out = ssh(`cd ~/${T} && J=$PWD && docker run --rm -v $J/out:/out yolomotion-worker:latest rm -f /out/${name}.${ext}; \
docker run --rm --cpus 3 --memory 8g -v $J/packages/video/src:/app/packages/video/src:ro -v $J/packages/video/public:/app/packages/video/public:ro \
-v $J/packages/renderer/src:/app/packages/renderer/src:ro -v $J/out:/out yolomotion-worker:latest npm run render -- ${c} --out /out/${name}.${ext}${extra} > out/${name}.log 2>&1; \
grep -v "network requests" out/${name}.log | grep -iE "\\[reel\\]|error" | grep -v "^\\s*at " | head -8; test -s out/${name}.${ext}`, true);
    if (out.trim()) console.log(out.trim());
    run("scp", ["-q", `vibesrv:${T}/out/${name}.${ext}`, path.join(root, "out", `${name}.${ext}`)], { quiet: true });
    const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(root, "out", `${name}.${ext}`)], { encoding: "utf8" }).trim();
    const min = ((Date.now() - t0) / 60000).toFixed(1);
    console.log(`✓ out/${name}.${ext}  ${(+dur).toFixed(1)} s  (${min} мин)`);
    ssh(`cd ~/${T} && docker run --rm -v $PWD/out:/out yolomotion-worker:latest rm -f /out/${name}.${ext}; rm -f out/${name}.log`, true);
    if (name !== id) continue; // a part or an audio track: splice.mjs assembles the review mp4
    status(id, "review", `рендер vibesrv готов: out/${id}.mp4, ${(+dur).toFixed(1)} с`);
    // The server keeps nothing: the mp4 is home (out/) and goes to S3 next; the log only matters on failure.
    // The container wrote the mp4 as root, so a container removes it.
    ssh(`cd ~/${T} && docker run --rm -v $PWD/out:/out yolomotion-worker:latest rm -f /out/${id}.mp4; rm -f out/${id}.log`, true);
    const up = spawnSync("npm", ["run", "-s", "deliver", "--", id, "--renders-only"], { cwd: root, encoding: "utf8" });
    console.log(up.status === 0 ? `✓ s3: ${id}.mp4 (npm run deliver -- ${id} для кода и ассетов)` : `! s3 не залит: ${(up.stderr || up.stdout).trim().split("\n").pop()}`);
  } catch (e) {
    failed.push(id);
    console.log(`✗ ${id}: ${e.message.split("\n")[0]} , лог: ssh vibesrv cat ~/${T}/out/${id}.log`);
    status(id, "review", "рендер на vibesrv упал, лог в ~/render-jobs/_tree/out/<id>.log");
  }
}
process.exit(failed.length ? 1 : 0);
