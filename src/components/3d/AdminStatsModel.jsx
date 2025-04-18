import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const AdminStatsModel = ({ stats }) => {
  const groupRef = useRef();
  
  // Create refs for animated objects
  const studentBarRef = useRef();
  const feesBarRef = useRef();
  const paymentsBarRef = useRef();
  
  // Calculate max value for scaling
  const maxValue = Math.max(stats.students, stats.fees, stats.payments, 10);
  
  // Animation values
  const [hovered, setHovered] = useState(null);
  
  // Rotate the group
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.2;
    }
    
    // Animate bars
    if (studentBarRef.current) {
      const targetScale = [1, stats.students / maxValue * 5, 1];
      studentBarRef.current.scale.y = THREE.MathUtils.lerp(
        studentBarRef.current.scale.y,
        targetScale[1],
        0.05
      );
    }
    
    if (feesBarRef.current) {
      const targetScale = [1, stats.fees / maxValue * 5, 1];
      feesBarRef.current.scale.y = THREE.MathUtils.lerp(
        feesBarRef.current.scale.y,
        targetScale[1],
        0.05
      );
    }
    
    if (paymentsBarRef.current) {
      const targetScale = [1, stats.payments / maxValue * 5, 1];
      paymentsBarRef.current.scale.y = THREE.MathUtils.lerp(
        paymentsBarRef.current.scale.y,
        targetScale[1],
        0.05
      );
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base platform */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[12, 0.5, 6]} />
        <meshStandardMaterial color="#CBD5E0" />
      </mesh>
      
      {/* Student Bar */}
      <group position={[-4, -1.75, 0]}>
        <mesh 
          ref={studentBarRef}
          position={[0, 0.5, 0]} 
          scale={[1, 0.1, 1]}
          onPointerOver={() => setHovered('students')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial 
            color={hovered === 'students' ? "#3182CE" : "#4299E1"} 
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
        
        <Text
          position={[0, -0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          color="#2D3748"
          anchorX="center"
          anchorY="middle"
        >
          Students
        </Text>
        
        <Text
          position={[0, 0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.6}
          color="#2C5282"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {stats.students}
        </Text>
      </group>
      
      {/* Fees Bar */}
      <group position={[0, -1.75, 0]}>
        <mesh 
          ref={feesBarRef}
          position={[0, 0.5, 0]} 
          scale={[1, 0.1, 1]}
          onPointerOver={() => setHovered('fees')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial 
            color={hovered === 'fees' ? "#38A169" : "#48BB78"} 
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
        
        <Text
          position={[0, -0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          color="#2D3748"
          anchorX="center"
          anchorY="middle"
        >
          Fees
        </Text>
        
        <Text
          position={[0, 0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.6}
          color="#276749"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {stats.fees}
        </Text>
      </group>
      
      {/* Payments Bar */}
      <group position={[4, -1.75, 0]}>
        <mesh 
          ref={paymentsBarRef}
          position={[0, 0.5, 0]} 
          scale={[1, 0.1, 1]}
          onPointerOver={() => setHovered('payments')}
          onPointerOut={() => setHovered(null)}
        >
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial 
            color={hovered === 'payments' ? "#805AD5" : "#9F7AEA"} 
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
        
        <Text
          position={[0, -0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          color="#2D3748"
          anchorX="center"
          anchorY="middle"
        >
          Payments
        </Text>
        
        <Text
          position={[0, 0.5, 1.1]}
          rotation={[0, 0, 0]}
          fontSize={0.6}
          color="#553C9A"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {stats.payments}
        </Text>
      </group>
      
      {/* Title */}
      <Text
        position={[0, 3, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.7}
        color="#2D3748"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        College Fees Statistics
      </Text>
    </group>
  );
};

export default AdminStatsModel; 