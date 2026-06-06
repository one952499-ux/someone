import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'Because some things are easier to write', emphasis: false },
  { text: 'than to say.', emphasis: true },
  { text: 'And because I didn\'t want these feelings', emphasis: false },
  { text: 'to remain completely unspoken.', emphasis: true },
];

export function Section6Moments() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      lineRefs.current.forEach(el => { if (el) el.style.opacity = '1'; });
      if (quoteRef.current) quoteRef.current.style.opacity = '1';
      return;
    }

    if (quoteRef.current) {
      gsap.fromTo(quoteRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }

    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          delay: 0.2 + i * 0.2,
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="section-moments"
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #080005, #100007, #080005)' }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,142,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float-gentle 10s ease-in-out infinite',
          }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,113,133,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float-gentle 13s ease-in-out infinite reverse',
          }} />
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <p ref={labelRef} className="font-sans text-[10px] uppercase tracking-[0.45em] text-center mb-20"
          style={{ color: 'rgba(244,63,142,0.4)' }}>
          Why This Website?
        </p>

        <div ref={quoteRef} className="opacity-0 text-center mb-16 font-serif select-none"
          style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', color: 'rgba(244,63,142,0.12)', lineHeight: 0.7 }}
          aria-hidden>
          &ldquo;
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          {lines.map((line, i) => (
            <div key={i} ref={el => { lineRefs.current[i] = el; }}
              className="opacity-0 font-serif"
              style={{
                fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
                color: line.emphasis ? '#fda4af' : 'rgba(253,242,248,0.6)',
                fontStyle: line.emphasis ? 'italic' : 'normal',
                lineHeight: 1.3,
              }}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
