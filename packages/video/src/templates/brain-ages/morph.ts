// CPU twin of the vertex shader's ageing, for things that ride the surface
// (neurons, label anchors). Keep in sync with brainShader.ts.
import * as THREE from "three";
import { Body } from "./ages";
import { MeshData } from "./brainData";

const n = new THREE.Vector3();
const s = new THREE.Vector3();

export const morphPoint = (m: MeshData, i: number, body: Body, lift: number, out: THREE.Vector3) => {
  const f = body.fold;
  n.set(
    m.snrm[i * 3] + (m.nrm[i * 3] - m.snrm[i * 3]) * f,
    m.snrm[i * 3 + 1] + (m.nrm[i * 3 + 1] - m.snrm[i * 3 + 1]) * f,
    m.snrm[i * 3 + 2] + (m.nrm[i * 3 + 2] - m.snrm[i * 3 + 2]) * f,
  ).normalize();
  s.set(
    m.spos[i * 3] + (m.pos[i * 3] - m.spos[i * 3]) * f,
    m.spos[i * 3 + 1] + (m.pos[i * 3 + 1] - m.spos[i * 3 + 1]) * f,
    m.spos[i * 3 + 2] + (m.pos[i * 3 + 2] - m.spos[i * 3 + 2]) * f,
  );
  const deep = Math.max(0, Math.min(1, m.curv[i]));
  return out.copy(s).addScaledVector(n, lift - body.atrophy * (0.3 + deep * 1.9));
};
