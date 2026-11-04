// Loads public/brain/*.bin (built by scripts/brain-mesh.mjs) once per tab.
import * as THREE from "three";
import { staticFile } from "remotion";
import { DEEP, Deep } from "./palette";

export const MESHES = ["cortex_lh", "cortex_rh", ...DEEP] as const;
export type MeshId = (typeof MESHES)[number];

export type MeshData = {
  geo: THREE.BufferGeometry;
  pos: Float32Array;
  nrm: Float32Array;
  spos: Float32Array;
  snrm: Float32Array;
  curv: Float32Array;
  w: Float32Array;
  /** centroid (model space, centred) */
  centre: THREE.Vector3;
};
export type BrainMeshes = Record<MeshId, MeshData>;
export const isDeep = (m: MeshId): m is Deep => (DEEP as readonly string[]).includes(m);

let cache: Promise<BrainMeshes> | null = null;

export const loadBrain = (): Promise<BrainMeshes> => {
  if (cache) return cache;
  cache = (async () => {
    const { meshes } = (await (await fetch(staticFile("brain/meshes.json"))).json()) as {
      meshes: Record<string, { vertices: number; indices: number }>;
    };
    const raw = await Promise.all(
      MESHES.map(async (id) => {
        const buf = await (await fetch(staticFile(`brain/${id}.bin`))).arrayBuffer();
        const n = meshes[id].vertices;
        let o = 0;
        const f32 = (w: number) => {
          const a = new Float32Array(buf, o, n * w);
          o += n * w * 4;
          return a;
        };
        const pos = f32(3), nrm = f32(3), spos = f32(3), snrm = f32(3), curv = f32(1), w = f32(6);
        const idx = new Uint32Array(buf, o, meshes[id].indices);
        return { id, pos, nrm, spos, snrm, curv, w, idx };
      }),
    );
    const box = new THREE.Box3();
    const v = new THREE.Vector3();
    for (const { pos } of raw)
      for (let i = 0; i < pos.length; i += 3) box.expandByPoint(v.set(pos[i], pos[i + 1], pos[i + 2]));
    const mid = box.getCenter(new THREE.Vector3());
    const out = {} as BrainMeshes;
    for (const r of raw) {
      const shift = (a: Float32Array) => {
        for (let i = 0; i < a.length; i += 3) {
          a[i] -= mid.x;
          a[i + 1] -= mid.y;
          a[i + 2] -= mid.z;
        }
      };
      shift(r.pos);
      if (r.spos !== r.pos && r.spos.byteOffset !== r.pos.byteOffset) shift(r.spos);
      const c = new THREE.Vector3();
      for (let i = 0; i < r.pos.length; i += 3) c.add(v.set(r.pos[i], r.pos[i + 1], r.pos[i + 2]));
      c.divideScalar(r.pos.length / 3);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(r.pos, 3));
      g.setAttribute("normal", new THREE.BufferAttribute(r.nrm, 3));
      g.setAttribute("spos", new THREE.BufferAttribute(r.spos, 3));
      g.setAttribute("snrm", new THREE.BufferAttribute(r.snrm, 3));
      g.setAttribute("curv", new THREE.BufferAttribute(r.curv, 1));
      g.setAttribute("wa", new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(r.w, 6), 3, 0));
      g.setAttribute("wb", new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(r.w, 6), 3, 3));
      g.setIndex(new THREE.BufferAttribute(r.idx, 1));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 200);
      out[r.id] = { geo: g, pos: r.pos, nrm: r.nrm, spos: r.spos, snrm: r.snrm, curv: r.curv, w: r.w, centre: c };
    }
    return out;
  })();
  return cache;
};
