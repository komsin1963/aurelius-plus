'use client';

import React from 'react';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#020203] text-white">
      <main className="flex-1 flex flex-col relative z-10 overflow-x-hidden">
        {/* Global Background Decor */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        </div>
        
        {/* Render Content Pages */}
        <div className="relative z-20">
          {children}
        </div>
      </main>
    </div>
  );
}