// A fine neural net riding the cortex: tiny neurons on the crests, hairline
// wires to their nearest neighbours, impulses as thin streaks of light.
// Author 2026-10-26: neurons must not be shiny or fat. An active lobe fires
// more often; the rest of the brain keeps a quiet background chatter.
import React, { useMemo } from "react";
import * as THREE from "three";
import { BrainMeshes, MeshData } from "./brainData";
import { morphPoint } from "./morph";
import { LOBES, palette } from "./palette";
import { BrainPose, FOV, H } from "./stage";

const NEURONS = 2600;
const LINKS = 3;
const MAX_LINK = 13; // mm
const LIFT = 0.9; // mm above the surface
const TAIL = 9;
const SCALE = H / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Net = {
  nodes: { m: MeshData; i: number }[];
  edges: Uint32Array;
  edgeSeed: Float32Array;
};

const buildNet = (brain: BrainMeshes): Net => {
  const rand = rng(20261026);
  const nodes: Net["nodes"] = [];
  for (const m of [brain.cortex_lh, brain.cortex_rh]) {
    const nv = m.pos.length / 3;
    let got = 0;
    for (let t = 0; got < NEURONS / 2 && t < NEURONS * 40; t++) {
      const i = Math.floor(rand() * nv);
      if (m.curv[i] > -0.2) continue; // crests only: where the eye sees them
      nodes.push({ m, i });
      got++;
    }
  }
  // wire each neuron to its nearest neighbours in the same hemisphere (adult positions)
  const P = nodes.map(({ m, i }) => [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]);
  const cell = (x: number) => Math.floor(x / MAX_LINK);
  const grid = new Map<string, number[]>();
  P.forEach(([x, y, z], k) => {
    const key = `${cell(x)},${cell(y)},${cell(z)}`;
    (grid.get(key) ?? grid.set(key, []).get(key)!).push(k);
  });
  const edges: number[] = [];
  const seen = new Set<string>();
  P.forEach(([x, y, z], a) => {
    const cand: [number, number][] = [];
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++)
          for (const b of grid.get(`${cell(x) + dx},${cell(y) + dy},${cell(z) + dz}`) ?? []) {
            if (b === a || nodes[b].m !== nodes[a].m) continue;
            const d = Math.hypot(P[b][0] - x, P[b][1] - y, P[b][2] - z);
            if (d < MAX_LINK) cand.push([d, b]);
          }
    cand.sort((p, q) => p[0] - q[0]);
    for (const [, b] of cand.slice(0, LINKS)) {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(k)) {
        seen.add(k);
        edges.push(a, b);
      }
    }
  });
  const edgeSeed = new Float32Array(edges.length / 2).map(() => rand());
  return { nodes, edges: Uint32Array.from(edges), edgeSeed };
};

const pointVS = /* glsl */ `
  attribute vec3 aColor;
  attribute float aGlow;
  attribute float aSize;
  uniform float uScale;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vColor = aColor;
    vGlow = aGlow;
    gl_PointSize = max(1.5, aSize * uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const pointFS = /* glsl */ `
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0 || vGlow <= 0.001) discard;
    float core = smoothstep(0.55, 0.0, d);
    float halo = exp(-d * d * 3.0) * 0.3;
    gl_FragColor = vec4(vColor * (core * 0.85 + halo) * vGlow, 1.0);
    #include <colorspace_fragment>
  }
`;
const pointsMaterial = () =>
  new THREE.ShaderMaterial({
    vertexShader: pointVS,
    fragmentShader: pointFS,
    uniforms: { uScale: { value: SCALE } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

const tmp = new THREE.Vector3();

export const NeuralNet: React.FC<{ brain: BrainMeshes; pose: BrainPose }> = ({ brain, pose }) => {
  const net = useMemo(() => buildNet(brain), [brain]);
  const N = net.nodes.length;
  const E = net.edges.length / 2;
  const lobeCol = useMemo(() => LOBES.map((l) => new THREE.Color(palette[l])), []);
  const calm = useMemo(() => new THREE.Color(palette.neuron), []);

  const g = useMemo(() => {
    const attr = (geo: THREE.BufferGeometry, name: string, n: number, w: number) =>
      geo.setAttribute(name, new THREE.BufferAttribute(new Float32Array(n * w), w));
    const pointAttrs = [["position", 3], ["aColor", 3], ["aGlow", 1], ["aSize", 1]] as const;
    const neurons = new THREE.BufferGeometry();
    for (const [k, w] of pointAttrs) attr(neurons, k, N, w);
    const wires = new THREE.BufferGeometry();
    attr(wires, "position", E * 2, 3);
    attr(wires, "color", E * 2, 3);
    const pulses = new THREE.BufferGeometry();
    for (const [k, w] of pointAttrs) attr(pulses, k, E * TAIL, w);
    for (const geo of [neurons, wires, pulses]) geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 200);
    return {
      neurons,
      wires,
      pulses,
      mNeurons: pointsMaterial(),
      mPulses: pointsMaterial(),
      mWires: new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, [N, E]);

  const lobeAct = LOBES.map((l) => pose.parts[l] ?? 0);
  const fade = 1 - pose.glass * 0.55;

  const nPos = g.neurons.getAttribute("position").array as Float32Array;
  const nCol = g.neurons.getAttribute("aColor").array as Float32Array;
  const nGlow = g.neurons.getAttribute("aGlow").array as Float32Array;
  const nSize = g.neurons.getAttribute("aSize").array as Float32Array;
  const act = new Float32Array(N);
  const col: THREE.Color[] = [];
  net.nodes.forEach(({ m, i }, k) => {
    morphPoint(m, i, pose.body, LIFT, tmp);
    nPos.set([tmp.x, tmp.y, tmp.z], k * 3);
    let a = 0;
    const c = new THREE.Color(0, 0, 0);
    for (let l = 0; l < 6; l++) {
      const w = m.w[i * 6 + l] * lobeAct[l];
      a += w;
      c.r += lobeCol[l].r * w;
      c.g += lobeCol[l].g * w;
      c.b += lobeCol[l].b * w;
    }
    a = Math.min(1, a);
    act[k] = a;
    const cc = a > 0.001 ? calm.clone().lerp(c.multiplyScalar(1 / a), Math.min(1, a * 1.2)) : calm.clone();
    col.push(cc);
    nCol.set([cc.r, cc.g, cc.b], k * 3);
    nGlow[k] = (0.26 + 0.34 * a) * fade;
    nSize[k] = 0.7 + 0.35 * a;
  });

  const wPos = g.wires.getAttribute("position").array as Float32Array;
  const wCol = g.wires.getAttribute("color").array as Float32Array;
  const pPos = g.pulses.getAttribute("position").array as Float32Array;
  const pCol = g.pulses.getAttribute("aColor").array as Float32Array;
  const pGlow = g.pulses.getAttribute("aGlow").array as Float32Array;
  const pSize = g.pulses.getAttribute("aSize").array as Float32Array;
  const t = pose.time;
  for (let e = 0; e < E; e++) {
    const a = net.edges[e * 2];
    const b = net.edges[e * 2 + 1];
    wPos.set(nPos.subarray(a * 3, a * 3 + 3), e * 6);
    wPos.set(nPos.subarray(b * 3, b * 3 + 3), e * 6 + 3);
    const ea = Math.max(act[a], act[b]);
    const rate = 0.06 + 0.6 * ea;
    const len = Math.hypot(nPos[a * 3] - nPos[b * 3], nPos[a * 3 + 1] - nPos[b * 3 + 1], nPos[a * 3 + 2] - nPos[b * 3 + 2]);
    const travel = 0.22 + len / 55; // seconds along this wire
    const period = travel / (0.5 + 0.4 * ea);
    const phase = t / period + net.edgeSeed[e] * 9.1;
    const cycle = Math.floor(phase);
    const u = (phase - cycle) * (period / travel);
    const fires = hash(e, cycle) < rate && u <= 1;
    const [from, to] = hash(e + 0.5, cycle) < 0.5 ? [b, a] : [a, b];
    const c = act[a] >= act[b] ? col[a] : col[b];
    const lit = (0.045 + 0.1 * ea + (fires ? 0.1 + 0.12 * ea : 0)) * fade;
    for (let k = 0; k < 2; k++) wCol.set([c.r * lit, c.g * lit, c.b * lit], e * 6 + k * 3);
    for (let s = 0; s < TAIL; s++) {
      const idx = e * TAIL + s;
      const us = u - s * 0.045;
      if (!fires || us < 0 || us > 1) {
        pGlow[idx] = 0;
        continue;
      }
      for (let d = 0; d < 3; d++) pPos[idx * 3 + d] = nPos[from * 3 + d] + (nPos[to * 3 + d] - nPos[from * 3 + d]) * us;
      const k = 1 - s / TAIL;
      pCol.set([c.r, c.g, c.b], idx * 3);
      pGlow[idx] = (s === 0 ? 0.75 : 0.5 * k * k) * (0.5 + 0.5 * Math.max(ea, 0.2)) * fade;
      pSize[idx] = s === 0 ? 0.95 + 0.25 * ea : 0.75 * k + 0.25;
    }
    // the receiving neuron brightens softly as the impulse lands
    if (fires && u > 0.8) {
      const f = (u - 0.8) / 0.2;
      nGlow[to] += f * (0.35 + 0.3 * ea) * fade;
      nSize[to] += f * 0.5;
    }
  }
  for (const geo of [g.neurons, g.pulses, g.wires])
    for (const k of Object.keys(geo.attributes)) geo.getAttribute(k).needsUpdate = true;

  return (
    <group>
      <lineSegments geometry={g.wires} material={g.mWires} renderOrder={2} />
      <points geometry={g.neurons} material={g.mNeurons} renderOrder={3} />
      <points geometry={g.pulses} material={g.mPulses} renderOrder={4} />
    </group>
  );
};
