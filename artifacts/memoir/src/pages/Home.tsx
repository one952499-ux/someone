import { useState } from "react";
import { Section1Loading } from "@/components/Section1Loading";
import { SmoothScroll } from "@/components/SmoothScroll";
import { GlobalCursor } from "@/components/GlobalCursor";
import { NavDots } from "@/components/NavDots";
import { PetalField } from "@/components/PetalField";
import { Section2Hero } from "@/components/Section2Hero";
import { Section3Beginning } from "@/components/Section3Beginning";
import { Section4Timeline } from "@/components/Section4Timeline";
import { Section5Growth } from "@/components/Section5Growth";
import { Section6Moments } from "@/components/Section6Moments";
import { Section7Reflection } from "@/components/Section7Reflection";
import { Section9Message } from "@/components/Section9Message";
import { Section10Ending } from "@/components/Section10Ending";

export function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <main
      className="min-h-screen font-sans antialiased overflow-x-hidden"
      style={{ background: '#080005', color: '#fdf2f8', cursor: 'none' }}
    >
      <GlobalCursor />

      {!loadingComplete && (
        <Section1Loading onComplete={() => setLoadingComplete(true)} />
      )}

      {loadingComplete && (
        <>
          <PetalField />
          <NavDots />
          <SmoothScroll>
            <Section2Hero />
            <Section3Beginning />
            <Section4Timeline />
            <Section5Growth />
            <Section6Moments />
            <Section7Reflection />
            <Section9Message />
            <Section10Ending />
          </SmoothScroll>
        </>
      )}
    </main>
  );
}
