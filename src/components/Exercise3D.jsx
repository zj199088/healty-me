import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D 人物模型组件
const Character = ({ exerciseType, isAnimating }) => {
  const meshRef = useRef();
  const [animationProgress, setAnimationProgress] = useState(0);

  // 根据运动类型定义不同的动画
  const animateCharacter = (delta) => {
    if (!isAnimating) return;

    setAnimationProgress((prev) => {
      const newProgress = prev + delta * 0.5;
      return newProgress > 1 ? 0 : newProgress;
    });

    if (meshRef.current) {
      switch (exerciseType) {
        case 'squat':
          // 深蹲动画
          const squatAngle = Math.sin(animationProgress * Math.PI) * Math.PI / 6;
          meshRef.current.children[1].rotation.x = -squatAngle; // 大腿
          meshRef.current.children[1].children[0].rotation.x = squatAngle; // 小腿
          break;
        case 'pushup':
          // 俯卧撑动画
          const pushupAngle = Math.sin(animationProgress * Math.PI) * Math.PI / 4;
          meshRef.current.rotation.x = pushupAngle;
          break;
        case 'bicep-curl':
          // 二头肌弯举动画
          const curlAngle = Math.sin(animationProgress * Math.PI) * Math.PI / 2;
          meshRef.current.children[2].rotation.x = -curlAngle; // 右臂
          meshRef.current.children[3].rotation.x = -curlAngle; // 左臂
          break;
        default:
          break;
      }
    }
  };

  useFrame((state) => {
    animateCharacter(state.clock.getDelta());
  });

  return (
    <group ref={meshRef} position={[0, -2, 0]}>
      {/* 头部 */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffdab9" />
      </mesh>
      
      {/* 身体 */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="#3498db" />
        
        {/* 右腿 */}
        <mesh position={[0.3, -0.75, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
          <meshStandardMaterial color="#3498db" />
          
          {/* 右脚 */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.2]} />
            <meshStandardMaterial color="#3498db" />
          </mesh>
        </mesh>
        
        {/* 左腿 */}
        <mesh position={[-0.3, -0.75, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
          <meshStandardMaterial color="#3498db" />
          
          {/* 左脚 */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.2]} />
            <meshStandardMaterial color="#3498db" />
          </mesh>
        </mesh>
      </mesh>
      
      {/* 右臂 */}
      <mesh position={[0.6, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 32]} />
        <meshStandardMaterial color="#3498db" />
        
        {/* 右手 */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ffdab9" />
        </mesh>
      </mesh>
      
      {/* 左臂 */}
      <mesh position={[-0.6, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 32]} />
        <meshStandardMaterial color="#3498db" />
        
        {/* 左手 */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ffdab9" />
        </mesh>
      </mesh>
    </group>
  );
};

// 3D 场景组件
const Exercise3DScene = ({ exerciseType, isAnimating, onInteraction }) => {
  const { camera } = useThree();
  
  // 设置相机位置
  useEffect(() => {
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      {/* 方向光 */}
      <directionalLight position={[5, 10, 5]} intensity={1} />
      {/* 地面 */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {/* 人物模型 */}
      <Character exerciseType={exerciseType} isAnimating={isAnimating} />
      {/* 轨道控制器 */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={10}
      />
      {/* 运动名称文本 */}
      <Text 
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1).replace('-', ' ')}
      </Text>
    </>
  );
};

// 主组件
const Exercise3D = () => {
  const [exerciseType, setExerciseType] = useState('squat');
  const [isAnimating, setIsAnimating] = useState(false);

  const exerciseOptions = [
    { value: 'squat', label: '深蹲' },
    { value: 'pushup', label: '俯卧撑' },
    { value: 'bicep-curl', label: '二头肌弯举' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">3D 运动指导</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">选择运动类型：</label>
          <div className="flex space-x-4">
            {exerciseOptions.map((option) => (
              <button
                key={option.value}
                className={`px-4 py-2 rounded-md ${exerciseType === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setExerciseType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <button
            className={`px-6 py-2 rounded-md ${isAnimating ? 'bg-red-500' : 'bg-green-500'} text-white font-medium`}
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? '停止动画' : '开始动画'}
          </button>
        </div>
        
        <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
          <Canvas>
            <Exercise3DScene 
              exerciseType={exerciseType} 
              isAnimating={isAnimating} 
              onInteraction={() => {}}
            />
          </Canvas>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium mb-2">运动指导：</h3>
          <p className="text-gray-700">
            {exerciseType === 'squat' && '保持背部挺直，缓慢下蹲，膝盖不要超过脚尖，然后起身。'}
            {exerciseType === 'pushup' && '保持身体成一直线，缓慢下降，然后推起身体。'}
            {exerciseType === 'bicep-curl' && '手臂自然下垂，缓慢弯曲肘部，将哑铃举至肩部，然后缓慢放下。'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exercise3D;