import React, { useEffect, useRef } from "react";

export function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`;
      }
      
      requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full bg-indigo-500/50 blur-md pointer-events-none z-[100] mix-blend-screen hidden md:block"
    />
  );
}
