import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

const TechIcons = () => {
  const icons = [
    { icon: 'react', position: [0, 0, 0], size: 1.5, color: '#61DAFB' },
    { icon: 'node', position: [3, 1, 0], size: 1.2, color: '#68A063' },
    { icon: 'python', position: [-2, -1, 1], size: 1.3, color: '#3776AB' },
    { icon: 'database', position: [1, -2, -1], size: 1.1, color: '#F29111' }
  ];

  return (
    <>
      {icons.map((item, index) => (
        <mesh key={index} position={item.position}>
          <sphereGeometry args={[item.size, 32, 32]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
      ))}
    </>
  );
};

const FloatingTech = () => {
  return (
    <div className="floating-tech">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <TechIcons />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={2}
            rotateSpeed={0.5}
          />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FloatingTech;