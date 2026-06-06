import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'We never really talked.', delay: 0 },
  { text: 'You probably don\'t know me.', delay: 0.15 },
  { text: 'But every semester ended', delay: 0.3 },
  { text: 'with the same feeling.', delay: 0.45 },
];

export function Section4Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      lineRefs.current.forEach(el => { if (el) el.style.opacity = '1'; });
      return;
    }

    if (dividerRef.current) {
      gsap.fromTo(dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }

    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, x: -40, filter: 'blur(10px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: lines[i].delay,
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="section-timeline"
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #080005, #0f0008, #080005)' }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${300 + i * 120}px`, height: `${50 + i * 20}px`,
              background: `radial-gradient(ellipse, rgba(244,63,142,0.06) 0%, transparent 70%)`,
              top: `${25 + i * 25}%`, left: `${5 + i * 15}%`,
              filter: 'blur(30px)',
              animation: `float-gentle ${8 + i * 2}s ease-in-out infinite alternate`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-center mb-20"
          style={{ color: 'rgba(244,63,142,0.4)' }}>
          The Silent Years
        </p>

        <div className="flex flex-col items-start gap-8 md:gap-10">
          {lines.map((line, i) => (
            <div key={i} ref={el => { lineRefs.current[i] = el; }}
              className="opacity-0 font-serif"
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                color: i === lines.length - 1 ? '#fda4af' : 'rgba(253,242,248,0.75)',
                fontStyle: i > 1 ? 'italic' : 'normal',
                paddingLeft: i > 0 ? `${i * 2}rem` : 0,
                lineHeight: 1.2,
              }}>
              {line.text}
            </div>
          ))}
        </div>

        <div ref={dividerRef} className="mt-20 h-[1px] origin-left"
          style={{ background: 'linear-gradient(to right, rgba(244,63,142,0.6), transparent)', width: '60%' }} />
      </div>
    </section>
  );
}
