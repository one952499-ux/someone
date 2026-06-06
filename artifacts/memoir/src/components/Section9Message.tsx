import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'Maybe this page will be forgotten tomorrow.', accent: false },
  { text: 'Maybe not.', accent: true },
  { text: 'Either way,', accent: false },
  { text: 'thank you for taking a few minutes', accent: false },
  { text: 'to read it.', accent: true },
];

export function Section9Message() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      lineRefs.current.forEach(el => { if (el) el.style.opacity = '1'; });
      if (flowerRef.current) flowerRef.current.style.opacity = '1';
      return;
    }

    if (flowerRef.current) {
      gsap.fromTo(flowerRef.current,
        { opacity: 0, scale: 0.3, rotation: -30 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }

    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 35, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: 0.3 + i * 0.22,
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="section-message"
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #080005, #0f0008)' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(244,63,142,0.08) 0%, transparent 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(to right, transparent, rgba(244,63,142,0.3), transparent)' }} />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.45em] mb-16"
          style={{ color: 'rgba(244,63,142,0.4)' }}>
          Final Words
        </p>

        <div ref={flowerRef} className="opacity-0 mb-16 select-none text-5xl" aria-hidden>
          🌹
        </div>

        <div className="flex flex-col items-center gap-6">
          {lines.map((line, i) => (
            <div key={i} ref={el => { lineRefs.current[i] = el; }}
              className="opacity-0 font-serif"
              style={{
                fontSize: line.accent
                  ? 'clamp(2rem, 6vw, 4.5rem)'
                  : 'clamp(1.3rem, 3.5vw, 2.4rem)',
                color: line.accent ? '#f43f8e' : 'rgba(253,242,248,0.55)',
                fontStyle: line.accent ? 'italic' : 'normal',
                lineHeight: 1.3,
              }}>
              {line.text}
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <div className="h-[1px] w-40"
            style={{ background: 'linear-gradient(to right, transparent, rgba(244,63,142,0.4), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
