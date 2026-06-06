import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: number | string;
  speed?: number;
  direction?: 'up' | 'random' | 'drift';
}

export function ParticleField({ 
  count = 1000, 
  color = 0xffffff, 
  speed = 1,
  direction = 'random'
}: ParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    // Adjust count for performance and motion settings
    const particleCount = prefersReducedMotion ? count / 4 : (isMobile ? count / 2 : count);
    
    const scene = new THREE.Scene();
    // Add subtle fog to blend particles into the background
    scene.fog = new THREE.FogExp2(0x050508, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 200; // x
      positions[i + 1] = (Math.random() - 0.5) * 200; // y
      positions[i + 2] = (Math.random() - 0.5) * 100 - 50; // z (push slightly back)

      // Velocity
      if (direction === 'up') {
        velocities[i] = (Math.random() - 0.5) * 0.05 * speed;
        velocities[i + 1] = (Math.random() * 0.1 + 0.05) * speed;
        velocities[i + 2] = 0;
      } else if (direction === 'drift') {
        velocities[i] = (Math.random() * 0.05 + 0.01) * speed; // drift right
        velocities[i + 1] = (Math.random() - 0.5) * 0.02 * speed;
        velocities[i + 2] = 0;
      } else {
        velocities[i] = (Math.random() - 0.5) * 0.05 * speed;
        velocities[i + 1] = (Math.random() - 0.5) * 0.05 * speed;
        velocities[i + 2] = (Math.random() - 0.5) * 0.05 * speed;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.5,
      transparent: true,
      opacity: 0.6,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    if (!prefersReducedMotion && !isMobile) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        targetX = mouseX * 0.01;
        targetY = mouseY * 0.01;

        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particles.geometry.attributes.velocity.array as Float32Array;

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Wrap around logic
          if (direction === 'up') {
            if (positions[i + 1] > 100) positions[i + 1] = -100;
          } else if (direction === 'drift') {
            if (positions[i] > 100) positions[i] = -100;
          } else {
            if (positions[i] > 100) positions[i] = -100;
            if (positions[i] < -100) positions[i] = 100;
            if (positions[i + 1] > 100) positions[i + 1] = -100;
            if (positions[i + 1] < -100) positions[i + 1] = 100;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (!prefersReducedMotion && !isMobile) {
        document.removeEventListener('mousemove', onDocumentMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [count, color, speed, direction]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}
