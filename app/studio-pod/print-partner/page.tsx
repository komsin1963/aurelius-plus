'use client';

import React from 'react';
import { ChevronLeft, Zap, Loader2, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PrintPartnerComingSoon() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-8 uppercase italic font-sans overflow-hidden relative">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full"></div>
      
      {/* BACK BUTTON */}
      <Link 
        href="/" 
        className="absolute top-12 left-8 md:left-16 flex items-center gap-2 text-zinc-500 hover:text-cyan-500 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black tracking-[0.3em]">BACK_TO_MARKET</span>
      </Link>

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
              <Zap size={40} className="text-cyan-500 animate-pulse" />
            </div>
            {/* Loading Ring */}
            <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin [animation-duration:3s]"></div>
          </div>
        </div>

        <h1 className="text-7xl md:text-[12vw] font-black leading-[0.8] tracking-tighter mb-4">
          COMING <br /> <span className="text-cyan-500">SOON</span>
        </h1>

        <div className="max-w-xl mx-auto">
          <p className="text-zinc-500 text-[11px] md:text-xs tracking-[0.2em] leading-relaxed mb-12 normal-case italic">
            เรากำลังร่วมมือกับโรงพิมพ์ระดับพรีเมียม เพื่อส่งมอบประสบการณ์ "FROM SCREEN TO FABRIC" ที่ดีที่สุดให้กับคุณ 
            ระบบการสั่งผลิตแบบครบวงจรจะเปิดให้บริการเร็วๆ นี้
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-8 py-4 rounded-2xl">
              <Loader2 className="animate-spin text-cyan-500" size={16} />
              <span className="text-[10px] font-black tracking-widest">SYSTEM_INTEGRATING...</span>
            </div>
            
            <Link 
              href="https://aureliusx.gumroad.com" 
              target="_blank"
              className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-cyan-500 transition-colors shadow-2xl"
            >
              VISIT_GLOBAL_STORE <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 opacity-30">
          <div className="flex items-center gap-2"><Globe size={14} /> <span className="text-[9px] font-bold tracking-widest">GLOBAL_PARTNERSHIP</span></div>
          <div className="w-[1px] h-4 bg-white"></div>
          <div className="flex items-center gap-2"><Zap size={14} /> <span className="text-[9px] font-bold tracking-widest">DTF_TECHNOLOGY</span></div>
        </div>
        <p className="text-cyan-500 text-[9px] font-black tracking-[0.5em] opacity-50">BY KOMSIN / AURELIUS STUDIO</p>
      </div>

    </div>
  );
}