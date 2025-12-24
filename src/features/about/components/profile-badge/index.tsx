"use client";
import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Band } from "./band";

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload("/images/profile_card_3d.glb");
useTexture.preload("/images/profile_card_badge.png");

const ProfileBadge3D = () => (
  <div className="absolute -top-20 right-0 z-0 flex h-screen w-md origin-center scale-100 transform items-center justify-center">
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{ backgroundColor: "transparent" }}
    >
      <ambientLight intensity={Math.PI} />
      <Physics debug={false} gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer
          color="white"
          intensity={2}
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          color="white"
          intensity={3}
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          color="white"
          intensity={3}
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          color="white"
          intensity={10}
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  </div>
);

export { ProfileBadge3D };
