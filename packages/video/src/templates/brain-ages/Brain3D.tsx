// The 3D brain: two cortex hemispheres + the deep structures, all ageing in the
// vertex shader. Pure function of the pose, so every frame renders the same anywhere.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { continueRender, delayRender } from "remotion";
import { BrainMeshes, isDeep, loadBrain, MESHES, MeshId } from "./brainData";
import { makeBrainMaterial } from "./brainShader";
import { NeuralNet } from "./NeuralNet";
import { HIDDEN, LOBES, palette, Part } from "./palette";
import { BRAIN_Y, BrainPose, CAM_Z, FOV, H, W } from "./stage";

export { W, H, FOV, CAM_Z, BRAIN_Y } from "./stage";
export type { BrainPose } from "./stage";

export const useBrain = (): BrainMeshes | null => {
  const [brain, setBrain] = useState<BrainMeshes | null>(null);
  const [handle] = useState(() => delayRender("brain meshes"));
  useEffect(() => {
    loadBrain().then((b) => {
      setBrain(b);
      continueRender(handle);
    });
  }, [handle]);
  return brain;
};

const camera = new THREE.PerspectiveCamera(FOV, W / H, 10, 4000);
camera.position.set(0, 0, CAM_Z);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

/** Screen position (px) and depth of a model-space point under a pose. */
export const project = (p: THREE.Vector3, pose: BrainPose): [number, number, number] => {
  const v = p
    .clone()
    .multiplyScalar(pose.body.scale)
    .applyEuler(new THREE.Euler(pose.rotX, pose.rotY, 0, "XYZ"));
  v.y += BRAIN_Y;
  const z = v.z;
  v.project(camera);
  return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H, z];
};

const lobeColors = LOBES.map((l) => palette[l]);

export const Brain3D: React.FC<{ brain: BrainMeshes; pose: BrainPose }> = ({ brain, pose }) => {
  const mats = useMemo(
    () =>
      Object.fromEntries(
        MESHES.map((m) => [m, makeBrainMaterial(palette.brainBase, palette.brainDeep, palette.brainRim, lobeColors)]),
      ) as Record<MeshId, THREE.ShaderMaterial>,
    [],
  );
  const act = (p: Part) => pose.parts[p] ?? 0;
  for (const id of MESHES) {
    const m = mats[id];
    const u = m.uniforms;
    const self = isDeep(id) ? act(id) : 0;
    const hidden = isDeep(id) && HIDDEN.includes(id);
    u.uFold.value = isDeep(id) ? 1 : pose.body.fold;
    u.uAtrophy.value = isDeep(id) ? 0 : pose.body.atrophy;
    u.uActA.value.set(act("frontal"), act("motor"), act("parietal"));
    u.uActB.value.set(act("temporal"), act("occipital"), act("limbic"));
    u.uSelf.value = self;
    if (isDeep(id)) u.uSelfCol.value.set(palette[id]);
    // hidden structures stay faint glass until they are the subject
    const glass = hidden ? Math.max(0, 1 - self) : pose.glass * (1 - self);
    u.uGlass.value = glass;
    u.uDim.value = hidden ? pose.glass : 1;
    m.transparent = glass > 0.001;
    m.depthWrite = glass < 0.5;
    m.blending = glass > 0.5 ? THREE.AdditiveBlending : THREE.NormalBlending;
    m.visible = !hidden || pose.glass > 0.01;
  }
  const v = brain.ventricles.centre;
  return (
    <ThreeCanvas
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 10, far: 4000 }}
    >
      <group position={[0, BRAIN_Y, 0]}>
        <group rotation={[pose.rotX, pose.rotY, 0]} scale={pose.body.scale}>
          {MESHES.filter((id) => id !== "ventricles").map((id) => (
            <mesh key={id} geometry={brain[id].geo} material={mats[id]} renderOrder={HIDDEN.includes(id as Part) ? 0 : 1} />
          ))}
          <group position={[v.x, v.y, v.z]} scale={pose.body.ventricles}>
            <mesh geometry={brain.ventricles.geo} material={mats.ventricles} position={[-v.x, -v.y, -v.z]} renderOrder={0} />
          </group>
          <NeuralNet brain={brain} pose={pose} />
        </group>
      </group>
    </ThreeCanvas>
  );
};
