import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const moments = [
  { text: 'A few eye contacts during exams.', icon: '👁' },
  { text: 'Passing by in corridors.', icon: '🚶' },
  { text: 'Nothing special to anyone else.', icon: '🌫' },
  { text: 'Yet somehow memorable to me.', icon: '✨' },
];

export function Section5Growth() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      if (headingRef.current) headingRef.current.style.opacity = '1';
      itemRefs.current.forEach(el => { if (el) el.style.opacity = '1'; });
      return;
    }

    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' } }
      );
    }

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }, delay: i * 0.08 }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="section-growth"
      className="relative w-full py-32 px-6 overflow-hidden"
      style={{ background: '#080005' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(244,63,142,0.05) 0%, transparent 100%)',
          }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div ref={headingRef} className="text-center mb-20 opacity-0">
          <p className="font-sans text-[10px] uppercase tracking-[0.45em] mb-6"
            style={{ color: 'rgba(244,63,142,0.4)' }}>Small Moments</p>
          <h2 className="font-serif leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#fdf2f8' }}>
            The ordinary things that<br />
            <span className="italic" style={{ color: '#fda4af' }}>became extraordinary.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {moments.map((m, i) => (
            <div key={i} ref={el => { itemRefs.current[i] = el; }}
              className="opacity-0 relative overflow-hidden rounded-2xl px-8 py-7 flex items-center gap-6 transition-all duration-300"
              style={{
                background: 'rgba(244,63,142,0.04)',
                border: '1px solid rgba(244,63,142,0.1)',
                backdropFilter: 'blur(16px)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(244,63,142,0.35)';
                el.style.background = 'rgba(244,63,142,0.09)';
                el.style.boxShadow = '0 0 30px rgba(244,63,142,0.1)';
                el.style.transform = 'translateX(6px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(244,63,142,0.1)';
                el.style.background = 'rgba(244,63,142,0.04)';
                el.style.boxShadow = '';
                el.style.transform = 'translateX(0)';
              }}>
              <div className="text-2xl select-none" aria-hidden>{m.icon}</div>
              <p className="font-serif text-xl md:text-2xl" style={{ color: 'rgba(253,242,248,0.8)' }}>
                {m.text}
              </p>
              <div className="absolute right-0 top-0 bottom-0 w-[3px] rounded-l"
                style={{ background: `rgba(244,63,142,${0.2 + i * 0.15})` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
