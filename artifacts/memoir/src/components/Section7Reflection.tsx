import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const statements = [
  { text: 'I don\'t expect anything from you.', size: 'lg' },
  { text: 'I don\'t expect you to feel the same.', size: 'md' },
  { text: 'I simply wanted to be honest.', size: 'xl', accent: true },
];

export function Section7Reflection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stmtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      stmtRefs.current.forEach(el => { if (el) el.style.opacity = '1'; });
      if (heartRef.current) heartRef.current.style.opacity = '1';
      return;
    }

    if (heartRef.current) {
      gsap.fromTo(heartRef.current,
        { opacity: 0, scale: 0.5, rotation: -20 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'elastic.out(1,0.6)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }

    stmtRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: 0.3 + i * 0.25,
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="section-reflection"
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: '#080005' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(244,63,142,0.07) 0%, transparent 100%)' }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${i % 2 === 0 ? 2 : 3}px`, height: `${i % 2 === 0 ? 2 : 3}px`,
              left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%`,
              background: 'rgba(253,164,175,0.5)',
              boxShadow: '0 0 6px rgba(244,63,142,0.6)',
              animation: `glow-pulse ${2 + i * 0.5}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-center mb-16"
          style={{ color: 'rgba(244,63,142,0.4)' }}>
          What I Want
        </p>

        <div ref={heartRef} className="text-center mb-16 opacity-0 select-none"
          style={{ fontSize: '3rem' }} aria-hidden>
          🌸
        </div>

        <div className="flex flex-col items-center gap-10 text-center">
          {statements.map((s, i) => (
            <div key={i} ref={el => { stmtRefs.current[i] = el; }}
              className="opacity-0 font-serif"
              style={{
                fontSize: s.size === 'xl'
                  ? 'clamp(2rem, 6vw, 4.5rem)'
                  : s.size === 'lg'
                  ? 'clamp(1.6rem, 4.5vw, 3rem)'
                  : 'clamp(1.3rem, 3.5vw, 2.2rem)',
                color: s.accent ? '#f43f8e' : 'rgba(253,242,248,0.65)',
                fontStyle: s.accent ? 'italic' : 'normal',
                lineHeight: 1.3,
              }}>
              {s.text}
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <div className="h-[1px] w-48"
            style={{ background: 'linear-gradient(to right, transparent, rgba(244,63,142,0.5), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
