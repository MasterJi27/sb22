import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Torus, Octahedron } from '@react-three/drei';

export function FloatingShapes() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      group.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Icosahedron
        args={[1, 1]}
        position={[-4, 2, -5]}
        scale={0.6}
      >
        <meshPhongMaterial
          color="#4B9EF9"
          wireframe
          opacity={0.6}
          transparent
        />
      </Icosahedron>

      <Torus
        args={[1.5, 0.3, 16, 32]}
        position={[4, -2, -5]}
        rotation={[Math.PI / 4, 0, 0]}
        scale={0.5}
      >
        <meshPhongMaterial
          color="#4B9EF9"
          wireframe
          opacity={0.4}
          transparent
        />
      </Torus>

      <Octahedron
        args={[1]}
        position={[0, 3, -3]}
        scale={0.4}
      >
        <meshPhongMaterial
          color="#4B9EF9"
          wireframe
          opacity={0.5}
          transparent
        />
      </Octahedron>
    </group>
  );
}