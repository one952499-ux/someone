import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { isWebGLAvailable } from '@/lib/webgl';
import { CanvasGuard } from './CanvasGuard';

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 4000 : 8000;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color('#f43f8e');
    const c2 = new THREE.Color('#fda4af');
    const radius = 5, branches = 3, spin = 1.2, rPow = 3, rand = 0.25;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      const spinA = r * spin;
      const branchA = ((i % branches) / branches) * Math.PI * 2;
      const rx = Math.pow(Math.random(), rPow) * (Math.random() < .5 ? 1 : -1) * rand * r;
      const ry = Math.pow(Math.random(), rPow) * (Math.random() < .5 ? 1 : -1) * rand * r;
      const rz = Math.pow(Math.random(), rPow) * (Math.random() < .5 ? 1 : -1) * rand * r;
      positions[i3]     = Math.cos(branchA + spinA) * r + rx;
      positions[i3 + 1] = ry * 0.3;
      positions[i3 + 2] = Math.sin(branchA + spinA) * r + rz;
      const mixed = c1.clone().lerp(c2, r / radius);
      const v = 0.12;
      colors[i3]     = THREE.MathUtils.clamp(mixed.r + (Math.random() - .5) * v, 0, 1);
      colors[i3 + 1] = THREE.MathUtils.clamp(mixed.g + (Math.random() - .5) * v, 0, 1);
      colors[i3 + 2] = THREE.MathUtils.clamp(mixed.b + (Math.random() - .5) * v, 0, 1);
    }
    return { positions, colors };
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    if (window.innerWidth >= 768) window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x, mouse.current.y * 0.5, 0.05
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} sizeAttenuation vertexColors transparent opacity={0.9}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function CoreGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.3; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#fda4af" transparent opacity={0.95} />
    </mesh>
  );
}

function CSSHeroBackground() {
  return (
    <div className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at center, #2d0018 0%, #150010 40%, #080005 100%)' }}>
      {[
        { w: 400, h: 400, x: '20%', y: '30%', c: 'rgba(244,63,142,0.12)', blur: 80 },
        { w: 300, h: 300, x: '70%', y: '60%', c: 'rgba(251,113,133,0.08)', blur: 60 },
        { w: 200, h: 200, x: '50%', y: '20%', c: 'rgba(253,164,175,0.1)', blur: 50 },
      ].map((orb, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.w, height: orb.h, left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.c} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`, transform: 'translate(-50%, -50%)',
          }} />
      ))}
    </div>
  );
}

export function Section2Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [webglOk] = useState(isWebGLAvailable);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if Hero section is visible (height is 100vh)
      const scrollPos = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsHeroVisible(scrollPos < heroHeight + 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = titleRef.current?.querySelectorAll('.word');
    if (!pref && words?.length) {
      gsap.fromTo(words,
        { opacity: 0, y: 40, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
      );
    } else if (words?.length) {
      gsap.set(words, { opacity: 1, filter: 'blur(0px)' });
    }
    gsap.fromTo(tagRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 2.0, ease: 'power2.out' });
    gsap.fromTo(btnRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, delay: 2.6, ease: 'power3.out' });
    gsap.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 3.2, ease: 'power2.out' });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const words = ['To', 'someone', 'who', 'unknowingly', 'became', 'a', 'part', 'of', 'my', 'college', 'journey.'];

  return (
    <section id="section-hero"
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080005' }}>
      <div className="absolute inset-0">
        {webglOk && isHeroVisible ? (
          <CanvasGuard fallback={<CSSHeroBackground />}>
            <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} camera={{ position: [0, 2, 7], fov: 55 }}>
              <color attach="background" args={['#080005']} />
              <Galaxy />
              <CoreGlow />
              <EffectComposer>
                <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} intensity={2} radius={0.8} />
              </EffectComposer>
            </Canvas>
          </CanvasGuard>
        ) : <CSSHeroBackground />}
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #080005, transparent)' }} />

      <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
        <span ref={tagRef}
          className="inline-block text-[10px] md:text-xs uppercase tracking-[0.45em] mb-8 opacity-0"
          style={{ color: 'rgba(253,164,175,0.7)' }}>
          A quiet confession
        </span>

        <h1 ref={titleRef} className="font-serif leading-[1.15] mb-8"
          style={{ fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)', color: '#fdf2f8' }}>
          {words.map((word, i) => (
            <span key={i} className="word inline-block opacity-0 mr-[0.22em]"
              style={{ filter: 'blur(12px)' }}>
              {word}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef}
          className="font-serif italic text-sm md:text-base max-w-md leading-relaxed opacity-0 mb-10"
          style={{ color: 'rgba(253,164,175,0.55)', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}>
          "This isn't a proposal. It's just a story I've kept<br />to myself for a long time."
        </p>

        <a ref={btnRef} href="#section-beginning"
          className="opacity-0 inline-block px-8 py-3 rounded-full font-sans text-xs uppercase tracking-[0.3em] transition-all duration-400"
          style={{
            background: 'rgba(244,63,142,0.12)',
            border: '1px solid rgba(244,63,142,0.35)',
            color: '#fda4af',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,142,0.22)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(244,63,142,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,142,0.12)';
            (e.currentTarget as HTMLElement).style.boxShadow = '';
          }}>
          Read the Story
        </a>
      </div>

      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: 'rgba(253,164,175,0.3)' }}>scroll</span>
        <div className="w-[1px] h-10 relative overflow-hidden">
          <div className="absolute inset-0 animate-bounce"
            style={{ background: 'linear-gradient(to bottom, rgba(244,63,142,0.7), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
