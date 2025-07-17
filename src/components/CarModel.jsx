import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const CarModel = () => {
  const ref = useRef();
  const { scene } = useGLTF("/models/car.glb");

  return <primitive ref={ref} object={scene} scale={1.8} position={[0, -0.8, 0]} />;
};

export default CarModel;
