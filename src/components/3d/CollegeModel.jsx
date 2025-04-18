import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Html } from '@react-three/drei';

const CollegeModel = (props) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Use spring for smooth animation
  const { scale, rotation, color } = useSpring({
    scale: clicked ? 1.2 : 1,
    rotation: hovered ? [0, Math.PI / 4, 0] : [0, 0, 0],
    color: hovered ? '#3182CE' : '#2C5282',
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Rotate the model slowly
  useFrame((state, delta) => {
    // Only auto-rotate when not hovered or clicked
    if (!hovered && !clicked) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  // Define colors
  const roofColor = '#E53E3E'; // Red
  const windowColor = '#EDF2F7'; // Light gray

  return (
    <animated.group 
      ref={ref} 
      {...props}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setClicked(!clicked)}
    >
      {/* Info text on hover */}
      {hovered && (
        <Html position={[0, 4, 0]} center>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px',
            fontFamily: 'Arial',
            fontSize: '14px',
            width: '150px',
            textAlign: 'center'
          }}>
            {clicked ? 'Click again to shrink' : 'College Building Model'}
          </div>
        </Html>
      )}
      
      {/* Main Building */}
      <animated.mesh position={[0, -2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 5, 4]} />
        <animated.meshStandardMaterial color={color} />
      </animated.mesh>
      
      {/* Roof */}
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      
      {/* Front Door */}
      <mesh position={[0, -3, 2.01]} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#4A5568" />
      </mesh>
      
      {/* Windows - Front */}
      <Window position={[-2.5, -1.5, 2.01]} />
      <Window position={[2.5, -1.5, 2.01]} />
      <Window position={[-2.5, 0, 2.01]} />
      <Window position={[2.5, 0, 2.01]} />
      
      {/* Windows - Back */}
      <Window position={[-2.5, -1.5, -2.01]} />
      <Window position={[2.5, -1.5, -2.01]} />
      <Window position={[-2.5, 0, -2.01]} />
      <Window position={[2.5, 0, -2.01]} />
      
      {/* Windows - Left */}
      <Window position={[-4.01, -1.5, -1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[-4.01, -1.5, 1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[-4.01, 0, -1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[-4.01, 0, 1]} rotation={[0, Math.PI/2, 0]} />
      
      {/* Windows - Right */}
      <Window position={[4.01, -1.5, -1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[4.01, -1.5, 1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[4.01, 0, -1]} rotation={[0, Math.PI/2, 0]} />
      <Window position={[4.01, 0, 1]} rotation={[0, Math.PI/2, 0]} />
      
      {/* Steps */}
      <mesh position={[0, -4, 3]} receiveShadow>
        <boxGeometry args={[3, 0.3, 2]} />
        <meshStandardMaterial color="#A0AEC0" />
      </mesh>
      
      {/* Columns */}
      <Column position={[-3, -2.5, 2]} />
      <Column position={[3, -2.5, 2]} />
      
      {/* Flag Pole */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#A0AEC0" />
      </mesh>
      
      {/* Flag */}
      <mesh position={[1, 3.5, 0]} castShadow>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#ED8936" side={2} />
      </mesh>
    </animated.group>
  );
};

// Window component
const Window = (props) => {
  return (
    <mesh {...props} castShadow>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color="#EDF2F7" />
    </mesh>
  );
};

// Column component
const Column = (props) => {
  return (
    <mesh {...props} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 5]} />
      <meshStandardMaterial color="#E2E8F0" />
    </mesh>
  );
};

export default CollegeModel; 