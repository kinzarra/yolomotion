// The brain's look: soft matte porcelain (author 2026-10-26: «приятно и стильно»).
// Folds darken by sulcal depth, the light wraps softly, a lilac rim.
// The vertex stage ages the surface: spos (smooth, newborn) → pos (adult folds)
// by uFold, and uAtrophy opens the folds in old age. A lobe lights up as a soft
// colour wash weighted by the per-vertex lobe weights (wa, wb).
import * as THREE from "three";

const vertexShader = /* glsl */ `
  attribute vec3 spos;
  attribute vec3 snrm;
  attribute float curv;
  attribute vec3 wa;
  attribute vec3 wb;
  uniform float uFold;
  uniform float uAtrophy;
  uniform vec3 uActA;
  uniform vec3 uActB;
  uniform float uSelf;
  uniform vec3 uSelfCol;
  uniform vec3 uCol[6];
  varying vec3 vN;
  varying vec3 vPos;
  varying float vCurv;
  varying float vAct;
  varying vec3 vCol;
  void main() {
    vec3 nn = normalize(mix(snrm, normal, uFold));
    float deep = clamp(curv, 0.0, 1.0);
    vec3 p = mix(spos, position, uFold) - nn * uAtrophy * (0.3 + deep * 1.9);
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vPos = wp.xyz;
    vN = normalize(mat3(modelMatrix) * nn);
    vCurv = curv * mix(0.35, 1.0, uFold) + uAtrophy * 0.35 * deep;
    float w[6] = float[](wa.x * uActA.x, wa.y * uActA.y, wa.z * uActA.z, wb.x * uActB.x, wb.y * uActB.y, wb.z * uActB.z);
    float sum = uSelf;
    vec3 col = uSelfCol * uSelf;
    for (int i = 0; i < 6; i++) { sum += w[i]; col += uCol[i] * w[i]; }
    vAct = clamp(sum, 0.0, 1.0);
    vCol = col / max(sum, 0.0001);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform float uGlass;
  uniform float uDim;
  varying vec3 vN;
  varying vec3 vPos;
  varying float vCurv;
  varying float vAct;
  varying vec3 vCol;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vPos);
    vec3 L1 = normalize(vec3(-0.45, 0.8, 0.6));
    vec3 L2 = normalize(vec3(0.8, -0.2, -0.5));
    float sulc = smoothstep(-0.8, 0.25, vCurv);
    float crest = smoothstep(-0.45, -1.0, vCurv);
    float key = pow(clamp((dot(N, L1) + 0.45) / 1.45, 0.0, 1.0), 1.35);
    float fill = max(dot(N, L2), 0.0);
    float fr = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    float occ = mix(1.0, 0.36, sulc);

    vec3 base = mix(uBase, uDeep, sulc * 0.8);
    vec3 col = base * (0.09 + 0.86 * key) * occ + uRim * fill * 0.12;
    vec3 H = normalize(L1 + V);
    col += vec3(pow(max(dot(N, H), 0.0), 22.0) * 0.1 * (1.0 - sulc));
    col += uRim * fr * 0.55 + uBase * crest * key * 0.06;

    float a = vAct;
    vec3 wash = vCol * (0.2 + 0.8 * key) * mix(1.0, 0.42, sulc) + vCol * fr * 0.55 + vec3(pow(max(dot(N, H), 0.0), 22.0) * 0.08);
    col = mix(col, wash, a * 0.82) + vCol * a * 0.07;
    col *= uDim;

    col = mix(col, uRim * (0.25 + fr * 1.1) + vCol * a * 0.6, uGlass * 0.9);
    float alpha = mix(1.0, 0.004 + fr * 0.07 + a * 0.05, uGlass);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

export const makeBrainMaterial = (base: string, deep: string, rim: string, lobeColors: string[]) =>
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uBase: { value: new THREE.Color(base) },
      uDeep: { value: new THREE.Color(deep) },
      uRim: { value: new THREE.Color(rim) },
      uCol: { value: lobeColors.map((c) => new THREE.Color(c)) },
      uSelfCol: { value: new THREE.Color("#ffffff") },
      uSelf: { value: 0 },
      uActA: { value: new THREE.Vector3() },
      uActB: { value: new THREE.Vector3() },
      uFold: { value: 1 },
      uAtrophy: { value: 0 },
      uGlass: { value: 0 },
      uDim: { value: 1 },
    },
  });
