// Brain model → light meshes for three.js, ready to age.
// Source: brainder.org «Brain for Blender» (A. M. Winkler, CC BY-SA 3.0):
//   pial_Full_obj (whole hemispheres), pial_DK_obj (Desikan-Killiany labels), subcortical_obj (aseg).
// Usage: node scripts/brain-mesh.mjs <pial_DK_obj dir> <subcortical_obj dir> <pial_Full_obj dir>
//
// Writes public/brain/<mesh>.bin + meshes.json. Per vertex, in blocks:
//   pos 3 · nrm 3 · spos 3 · snrm 3 · curv 1 · w 6   then Uint32 indices.
// spos/snrm: the hemisphere smoothed almost flat of folds (the newborn look; the shader
//   blends spos → pos as the brain folds up). curv: sulcal depth (~-1 crest .. 1 fold floor,
//   like FreeSurfer ?h.sulc) mixed with local curvature. w: soft lobe weights
//   (frontal, motor, parietal, temporal, occipital, limbic) diffused over the surface, so a
//   lobe lights up with a soft edge. Coordinates: RAS mm → y-up (x right, y up, z anterior).
import fs from "node:fs";
import path from "node:path";
import { MeshoptSimplifier } from "meshoptimizer";

const [dkDir, subDir, fullDir] = process.argv.slice(2);
if (!dkDir || !subDir || !fullDir) {
  console.error("usage: node scripts/brain-mesh.mjs <pial_DK_obj> <subcortical_obj> <pial_Full_obj>");
  process.exit(1);
}
const OUT = path.resolve(import.meta.dirname, "../public/brain");

const LOBES = {
  frontal: ["superiorfrontal", "rostralmiddlefrontal", "caudalmiddlefrontal", "parsopercularis",
    "parstriangularis", "parsorbitalis", "lateralorbitofrontal", "medialorbitofrontal", "frontalpole"],
  motor: ["precentral", "paracentral"],
  parietal: ["superiorparietal", "inferiorparietal", "supramarginal", "postcentral", "precuneus"],
  temporal: ["superiortemporal", "middletemporal", "inferiortemporal", "bankssts", "fusiform",
    "transversetemporal", "entorhinal", "temporalpole", "parahippocampal"],
  occipital: ["lateraloccipital", "lingual", "cuneus", "pericalcarine"],
  limbic: ["rostralanteriorcingulate", "caudalanteriorcingulate", "posteriorcingulate",
    "isthmuscingulate", "insula", "unknown"],
};
const LOBE_NAMES = Object.keys(LOBES);
const SUB = {
  cerebellum: { files: ["Left-Cerebellum-Cortex", "Right-Cerebellum-Cortex"], keep: 0.4 },
  brainstem: { files: ["Brain-Stem"], keep: 0.6 },
  hippocampus: { files: ["Left-Hippocampus", "Right-Hippocampus"], keep: 1 },
  amygdala: { files: ["Left-Amygdala", "Right-Amygdala"], keep: 1 },
  callosum: { files: ["CC_Anterior", "CC_Mid_Anterior", "CC_Central", "CC_Mid_Posterior", "CC_Posterior"], keep: 1 },
  ventricles: { files: ["Left-Lateral-Ventricle", "Right-Lateral-Ventricle"], keep: 0.6 },
};
const CORTEX_KEEP = 0.42;

const key = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

function readObj(file) {
  const v = [];
  const f = [];
  const keys = [];
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/).map(Number);
      v.push(x, z, y);
      keys.push(key(x, z, y));
    } else if (line.startsWith("f ")) {
      const idx = line.trim().split(/\s+/).slice(1).map((s) => parseInt(s, 10) - 1);
      for (let i = 1; i + 1 < idx.length; i++) f.push(idx[0], idx[i], idx[i + 1]);
    }
  }
  return { v: new Float32Array(v), f: new Uint32Array(f), keys };
}

// merge files, welding shared vertices
function mergeObjs(files) {
  const v = [];
  const f = [];
  const seen = new Map();
  for (const file of files) {
    const m = readObj(file);
    const local = m.keys.map((k, i) => {
      if (seen.has(k)) return seen.get(k);
      const id = v.length / 3;
      seen.set(k, id);
      v.push(m.v[i * 3], m.v[i * 3 + 1], m.v[i * 3 + 2]);
      return id;
    });
    for (const i of m.f) f.push(local[i]);
  }
  return { v: new Float32Array(v), f: new Uint32Array(f) };
}

function adjacency(nv, f) {
  const sets = Array.from({ length: nv }, () => new Set());
  for (let i = 0; i < f.length; i += 3) {
    const [a, b, c] = [f[i], f[i + 1], f[i + 2]];
    sets[a].add(b).add(c); sets[b].add(a).add(c); sets[c].add(a).add(b);
  }
  return sets.map((s) => Uint32Array.from(s));
}

// area-weighted normals, pointed out of the mesh (FreeSurfer winding varies)
function normals(v, f) {
  const nv = v.length / 3;
  const n = new Float32Array(v.length);
  for (let i = 0; i < f.length; i += 3) {
    const [a, b, c] = [f[i], f[i + 1], f[i + 2]];
    const ux = v[b * 3] - v[a * 3], uy = v[b * 3 + 1] - v[a * 3 + 1], uz = v[b * 3 + 2] - v[a * 3 + 2];
    const wx = v[c * 3] - v[a * 3], wy = v[c * 3 + 1] - v[a * 3 + 1], wz = v[c * 3 + 2] - v[a * 3 + 2];
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    for (const k of [a, b, c]) { n[k * 3] += nx; n[k * 3 + 1] += ny; n[k * 3 + 2] += nz; }
  }
  const mid = [0, 1, 2].map((d) => { let t = 0; for (let i = 0; i < nv; i++) t += v[i * 3 + d]; return t / nv; });
  let out = 0;
  for (let i = 0; i < nv; i++) for (let d = 0; d < 3; d++) out += n[i * 3 + d] * (v[i * 3 + d] - mid[d]);
  const sign = out < 0 ? -1 : 1;
  for (let i = 0; i < nv; i++) {
    const l = (Math.hypot(n[i * 3], n[i * 3 + 1], n[i * 3 + 2]) || 1) * sign;
    for (let d = 0; d < 3; d++) n[i * 3 + d] /= l;
  }
  return n;
}

// average over neighbours `iters` times with weight `lam`; `w` channels per vertex
function diffuse(arr, w, adj, iters, lam) {
  let cur = Float64Array.from(arr);
  for (let it = 0; it < iters; it++) {
    const next = new Float64Array(cur.length);
    for (let i = 0; i < adj.length; i++) {
      const a = adj[i];
      for (let d = 0; d < w; d++) {
        let s = 0;
        for (const j of a) s += cur[j * w + d];
        next[i * w + d] = a.length ? cur[i * w + d] * (1 - lam) + (s / a.length) * lam : cur[i * w + d];
      }
    }
    cur = next;
  }
  return cur;
}

// Melt the folds: strong Laplacian smoothing, then stretch back per axis to the
// hemisphere's own bounding box, so the newborn shape keeps the adult proportions.
function melt(v, adj, iters) {
  const cur = Float32Array.from(diffuse(v, 3, adj, iters, 0.7));
  const box = (a) => [0, 1, 2].map((d) => {
    let lo = Infinity, hi = -Infinity;
    for (let i = d; i < a.length; i += 3) { lo = Math.min(lo, a[i]); hi = Math.max(hi, a[i]); }
    return [lo, hi];
  });
  const b0 = box(v);
  const b1 = box(cur);
  for (let i = 0; i < cur.length; i++) {
    const d = i % 3;
    const t = (cur[i] - b1[d][0]) / (b1[d][1] - b1[d][0] || 1);
    cur[i] = b0[d][0] + t * (b0[d][1] - b0[d][0]) * 0.97 + (b0[d][1] - b0[d][0]) * 0.015;
  }
  return cur;
}

function normalise(d) {
  const s = Float32Array.from(d).sort();
  const nv = d.length;
  const med = s[Math.floor(nv / 2)];
  const span = Math.max(s[Math.floor(nv * 0.97)] - med, med - s[Math.floor(nv * 0.03)]) || 1;
  return d.map((x) => Math.max(-1, Math.min(1, (x - med) / span)));
}

function localCurv(v, n, adj) {
  const c = new Float32Array(adj.length);
  for (let i = 0; i < adj.length; i++) {
    const a = adj[i];
    if (!a.length) continue;
    let t = 0;
    for (let d = 0; d < 3; d++) {
      let s = 0;
      for (const j of a) s += v[j * 3 + d];
      t += (s / a.length - v[i * 3 + d]) * n[i * 3 + d];
    }
    c[i] = t;
  }
  return normalise(Float32Array.from(diffuse(c, 1, adj, 2, 0.5)));
}

function simplifyCompact(v, f, keep) {
  let idx = f;
  if (keep < 1) [idx] = MeshoptSimplifier.simplify(f, v, 3, Math.floor((f.length / 3) * keep) * 3, 0.01, []);
  const map = new Int32Array(v.length / 3).fill(-1);
  const order = [];
  const nf = new Uint32Array(idx.length);
  for (let i = 0; i < idx.length; i++) {
    if (map[idx[i]] < 0) { map[idx[i]] = order.length; order.push(idx[i]); }
    nf[i] = map[idx[i]];
  }
  return { order, f: nf };
}

const pick = (arr, w, order) => {
  const out = new Float32Array(order.length * w);
  order.forEach((o, i) => { for (let d = 0; d < w; d++) out[i * w + d] = arr[o * w + d]; });
  return out;
};

const manifest = {};
function write(name, { pos, nrm, spos, snrm, curv, w, f }) {
  const nv = pos.length / 3;
  const blocks = [pos, nrm, spos, snrm, curv, w, f];
  fs.writeFileSync(path.join(OUT, `${name}.bin`), Buffer.concat(blocks.map((a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength))));
  manifest[name] = { vertices: nv, indices: f.length };
  console.log(name.padEnd(12), nv, "verts", f.length / 3, "tris");
}

await MeshoptSimplifier.ready;
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f));

for (const h of ["lh", "rh"]) {
  const { v, f, keys } = readObj(path.join(fullDir, `${h}.pial.obj`));
  const nv = v.length / 3;
  const adj = adjacency(nv, f);
  const n = normals(v, f);
  const label = new Map();
  LOBE_NAMES.forEach((lobe, li) => {
    for (const l of LOBES[lobe]) {
      const p = path.join(dkDir, `${h}.pial.DK.${l}.obj`);
      if (fs.existsSync(p)) for (const k of readObj(p).keys) label.set(k, li);
    }
  });
  const onehot = new Float32Array(nv * 6);
  keys.forEach((k, i) => { onehot[i * 6 + (label.get(k) ?? 5)] = 1; });
  const w = diffuse(onehot, 6, adj, 26, 0.7);
  const spos = melt(v, adj, 120);
  const snrm = normals(spos, f);
  const depth = new Float32Array(nv);
  for (let i = 0; i < nv; i++) {
    let t = 0;
    for (let d = 0; d < 3; d++) t += (spos[i * 3 + d] - v[i * 3 + d]) * n[i * 3 + d];
    depth[i] = t;
  }
  const dn = normalise(depth);
  const lc = localCurv(v, n, adj);
  const curv = dn.map((x, i) => Math.max(-1, Math.min(1, x * 0.8 + lc[i] * 0.3)));
  const { order, f: nf } = simplifyCompact(v, f, CORTEX_KEEP);
  write(`cortex_${h}`, {
    pos: pick(v, 3, order), nrm: pick(n, 3, order), spos: pick(spos, 3, order), snrm: pick(snrm, 3, order),
    curv: pick(curv, 1, order), w: pick(Float32Array.from(w), 6, order), f: nf,
  });
}

for (const [name, { files, keep }] of Object.entries(SUB)) {
  const { v, f } = mergeObjs(files.map((x) => path.join(subDir, `${x}.obj`)).filter((p) => fs.existsSync(p)));
  const adj = adjacency(v.length / 3, f);
  const n = normals(v, f);
  const curv = localCurv(v, n, adj);
  const { order, f: nf } = simplifyCompact(v, f, keep);
  const pos = pick(v, 3, order);
  const nrm = pick(n, 3, order);
  write(name, { pos, nrm, spos: pos, snrm: nrm, curv: pick(curv, 1, order), w: new Float32Array(order.length * 6), f: nf });
}
fs.writeFileSync(path.join(OUT, "meshes.json"), JSON.stringify({ lobes: LOBE_NAMES, meshes: manifest }, null, 1));
