import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.95, // Snappier duration to feel responsive
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    // Connect Lenis scroll with GSAP ScrollTrigger updates
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Use GSAP's requestAnimationFrame ticker for smooth synchronization
    const updatePhysics = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updatePhysics);

    return () => {
      gsap.ticker.remove(updatePhysics);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

