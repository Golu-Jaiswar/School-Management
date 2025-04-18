import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';

const PaymentModel = (props) => {
  const groupRef = useRef();
  const cardRef = useRef();
  const coinRefs = useRef([]);
  
  // Animation states
  const [hovered, setHovered] = useState(false);
  
  // Rotate the group
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    
    // Animate the coins floating up and down
    coinRefs.current.forEach((coin, i) => {
      if (coin) {
        coin.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2 + 2;
      }
    });
    
    // Animate the card when hovered
    if (cardRef.current) {
      if (hovered) {
        cardRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.1;
      } else {
        cardRef.current.rotation.z = 0;
      }
    }
  });
  
  return (
    <group ref={groupRef} {...props}>
      {/* Credit Card */}
      <group 
        ref={cardRef} 
        position={[0, 0, 0]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox 
          args={[4, 2.5, 0.1]} 
          radius={0.1}
          smoothness={4}
        >
          <meshStandardMaterial 
            color={hovered ? "#4299E1" : "#2B6CB0"} 
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>
        
        {/* Card chip */}
        <mesh position={[-1.2, 0.5, 0.06]}>
          <boxGeometry args={[0.7, 0.7, 0.05]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Card number */}
        <Text
          position={[0, -0.2, 0.06]}
          fontSize={0.3}
          color="#E2E8F0"
          anchorX="center"
          anchorY="middle"
        >
          **** **** **** 1234
        </Text>
        
        {/* Card name */}
        <Text
          position={[-1, -0.8, 0.06]}
          fontSize={0.25}
          color="#E2E8F0"
          anchorX="left"
          anchorY="middle"
        >
          STUDENT NAME
        </Text>
      </group>
      
      {/* Coins (Create 6 coins in a circle) */}
      {[...Array(6)].map((_, i) => {
        const angle = (Math.PI * 2 / 6) * i;
        const radius = 4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <mesh 
            key={i}
            ref={el => (coinRefs.current[i] = el)}
            position={[x, 2, z]}
            rotation={[Math.PI/2, 0, angle]}
          >
            <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
            
            {/* Coin detail */}
            <mesh position={[0, 0.11, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
              <meshStandardMaterial color="#B7791F" metalness={0.7} roughness={0.2} />
            </mesh>
          </mesh>
        );
      })}
      
      {/* Payment text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.8}
        color="#4299E1"
        anchorX="center"
        anchorY="middle"
      >
        Secure Payment
      </Text>
    </group>
  );
};

export default PaymentModel; 