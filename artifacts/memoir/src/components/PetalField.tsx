import React, { useMemo } from 'react';

const PETAL_COUNT = 18;

export function PetalField() {
  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 10 + 6,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 14,
      sway: Math.random() * 8 + 14,
      opacity: Math.random() * 0.35 + 0.12,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden>
      {petals.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size * 1.4,
            opacity: p.opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite, petal-sway ${p.sway}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform',
          }}
        >
          <svg viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${p.rotate}deg)` }}>
            <ellipse cx="10" cy="14" rx="7" ry="12" fill="rgba(244,63,142,0.6)" />
            <ellipse cx="10" cy="14" rx="5" ry="10" fill="rgba(253,164,175,0.4)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
