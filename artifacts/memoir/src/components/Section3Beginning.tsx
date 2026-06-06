import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: '2023.', big: true },
  { text: 'First semester.', big: true },
  { text: 'Hundreds of new faces.', big: false },
  { text: 'One of them stayed in my mind.', big: false },
];

function SplitChars({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={style}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block" style={{ opacity: 0, filter: 'blur(6px)' }}>
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  );
}

export function Section3Beginning() {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      lineRefs.current.forEach(el => {
        el?.querySelectorAll('.char').forEach(c => {
          (c as HTMLElement).style.opacity = '1';
          (c as HTMLElement).style.filter = 'blur(0px)';
        });
      });
      return;
    }
    lineRefs.current.forEach((el) => {
      if (!el) return;
      const chars = el.querySelectorAll('.char');
      gsap.fromTo(chars,
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.028, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 83%' } }
      );
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="section-beginning"
      className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden"
      style={{ background: '#080005' }}>
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(244,63,142,0.25) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      <div className="absolute right-[-2%] top-1/2 -translate-y-1/2 select-none pointer-events-none font-serif"
        style={{ fontSize: 'clamp(5rem, 18vw, 15rem)', lineHeight: 1, color: 'rgba(244,63,142,0.03)' }} aria-hidden>
        2023
      </div>
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
        <div className="h-full w-full"
          style={{ background: 'linear-gradient(to right, transparent, rgba(244,63,142,0.5), transparent)' }} />
      </div>

      <div className="max-w-2xl w-full flex flex-col gap-10 md:gap-16 relative z-10">
        {lines.map((line, i) => (
          <div key={i} ref={el => { lineRefs.current[i] = el; }}
            style={{ paddingLeft: i > 1 ? `${(i - 1) * 1.8}rem` : 0 }}>
            <SplitChars
              text={line.text}
              className="font-serif"
              style={{
                fontSize: line.big ? 'clamp(2.8rem, 8vw, 6rem)' : 'clamp(1.4rem, 4vw, 2.8rem)',
                color: line.big ? '#fda4af' : 'rgba(253,242,248,0.7)',
                fontStyle: !line.big ? 'italic' : 'normal',
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
