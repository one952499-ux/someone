import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { isWebGLAvailable } from "@/lib/webgl";
import { CanvasGuard } from "./CanvasGuard";

function LoadingGeometry({ exploding }: { exploding: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    if (exploding) {
      meshRef.current.scale.lerp(new THREE.Vector3(6, 6, 6), 0.08);
      if (matRef.current) matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, 0, 0.08);
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshPhysicalMaterial ref={matRef} color="#f43f8e" wireframe={false} transparent opacity={0.9}
        roughness={0} metalness={0.3} transmission={0.8} thickness={0.5} emissive="#be185d" emissiveIntensity={0.6} />
    </mesh>
  );
}

function WireFrame({ exploding }: { exploding: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x -= delta * 0.15;
    meshRef.current.rotation.z += delta * 0.1;
    if (exploding) meshRef.current.scale.lerp(new THREE.Vector3(8, 8, 8), 0.06);
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color="#fda4af" wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function ThreeScene({ exploding }: { exploding: boolean }) {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 60 }}>
      <color attach="background" args={["#080005"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#f43f8e" />
      <pointLight position={[-5, -3, -5]} intensity={2} color="#fb7185" />
      <LoadingGeometry exploding={exploding} />
      <WireFrame exploding={exploding} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={2.2} radius={0.8} />
      </EffectComposer>
    </Canvas>
  );
}

function CSSLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${100 + i * 60}px`, height: `${100 + i * 60}px`,
            border: `1px solid rgba(244,63,142,${0.4 - i * 0.1})`,
            animation: `spin ${3 + i * 1.5}s linear infinite`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            boxShadow: i === 0 ? '0 0 20px rgba(244,63,142,0.5)' : undefined,
          }} />
      ))}
      <div className="w-8 h-8 rounded-full" style={{
        background: 'radial-gradient(circle, #fda4af 0%, #f43f8e 50%, transparent 100%)',
        boxShadow: '0 0 30px rgba(244,63,142,0.9)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
    </div>
  );
}

export function Section1Loading({ onComplete }: { onComplete: () => void }) {
  const [exploding, setExploding] = useState(false);
  const [visible, setVisible] = useState(true);
  const webglOk = useRef(isWebGLAvailable());

  useEffect(() => {
    const timer = setTimeout(() => {
      setExploding(true);
      setTimeout(() => { setVisible(false); setTimeout(onComplete, 800); }, 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[200] overflow-hidden" style={{ background: '#080005' }}
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <div className="absolute inset-0">
            {webglOk.current ? (
              <CanvasGuard fallback={<CSSLoading />}><ThreeScene exploding={exploding} /></CanvasGuard>
            ) : <CSSLoading />}
          </div>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,0,5,0.7) 100%)' }} />
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4">
            <p className="text-[#fda4af]/40 text-[10px] uppercase tracking-[0.6em]">loading</p>
            <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div className="absolute top-0 left-0 h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #f43f8e, #fb7185)' }}
                initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
