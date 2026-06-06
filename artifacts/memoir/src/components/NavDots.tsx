import React from "react";

export function NavDots() {
  // We have 8 main sections on the page.
  // Ideally we would observe intersection, but for simplicity we will just render them.
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 hidden md:flex">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-white/20 hover:bg-white/50'}`}
        />
      ))}
    </div>
  );
}
