import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function PlaceholderBox() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6b7280" metalness={0.15} roughness={0.55} />
    </mesh>
  );
}

export function ScenePlaceholder() {
  return (
    <div className="absolute inset-0 bg-canvas" data-testid="scene-canvas">
      <Canvas camera={{ position: [8, 6, 8], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={["#0b0e14"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 10, 4]} intensity={1.1} />
        <gridHelper args={[20, 20, "#2a3140", "#1a1f2a"]} />
        <PlaceholderBox />
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  );
}
