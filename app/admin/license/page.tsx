'use client';

import React from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, AlertCircle, 
  Cpu, ArrowLeft, Download, Scale
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LicensePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6 uppercase italic font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-20">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-cyan-500 transition-colors mb-12 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> BACK TO SYSTEM
          </button>
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" size={24} />
            <span className="text-cyan-500 text-[10px] font-black tracking-[0.6em]">LICENSE PROTOCOL v1.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter italic uppercase">
            USAGE <br /> <span className="text-cyan-500 text-7xl md:text-9xl">RIGHTS</span>
          </h1>
        </header>

        {/* LICENSE SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl">
            <h3 className="text-cyan-500 font-black text-xl mb-6 flex items-center gap-2 italic">
              <CheckCircle2 size={20} /> WHAT IS ALLOWED?
            </h3>
            <ul className="space-y-4 text-[11px] font-bold tracking-widest text-zinc-400">
              <li className="flex gap-3 leading-relaxed">
                <span className="text-white">✓</span> COMMERCIAL USE: SELL T-SHIRTS, PRINTS, AND PHYSICAL GOODS.
              </li>
              <li className="flex gap-3 leading-relaxed">
                <span className="text-white">✓</span> UNLIMITED PROJECTS: USE ON AS MANY PERSONAL OR CLIENT PROJECTS.
              </li>
              <li className="flex gap-3 leading-relaxed">
                <span className="text-white">✓</span> MODIFICATION: YOU CAN RECOLOR, RESIZE, AND ALTER THE ASSETS.
              </li>
              <li className="flex gap-3 leading-relaxed">
                <span className="text-white">✓</span> SOCIAL MEDIA: USE IN ADVERTISEMENTS AND DIGITAL CONTENT.
              </li>
            </ul>
          </div>

          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl">
            <h3 className="text-red-500 font-black text-xl mb-6 flex items-center gap-2 italic">
              <AlertCircle size={20} /> PROHIBITED ACTIONS
            </h3>
            <ul className="space-y-4 text-[11px] font-bold tracking-widest text-zinc-400">
              <li className="flex gap-3 leading-relaxed uppercase">
                <span className="text-red-500 font-black">✕</span> NO RESELLING: DO NOT RESELL RAW SVG/FILES AS YOUR OWN.
              </li>
              <li className="flex gap-3 leading-relaxed">
                <span className="text-red-500 font-black">✕</span> NO DISTRIBUTION: DO NOT SHARE DOWNLOAD LINKS PUBLICLY.
              </li>
              <li className="flex gap-3 leading-relaxed">
                <span className="text-red-500 font-black">✕</span> NO NFT RE-MINTING: DO NOT SELL AS DIGITAL ASSETS WITHOUT ALTERATION.
              </li>
            </ul>
          </div>
        </div>

        {/* FULL LEGAL TEXT SECTION */}
        <section className="border-t border-white/5 pt-16">
          <div className="flex items-center gap-4 mb-10">
            <Scale className="text-zinc-600" size={20} />
            <h2 className="text-2xl font-black italic tracking-tight">THE LEGAL ARCHIVE</h2>
          </div>
          <div className="space-y-10">
            <div className="border-l-2 border-zinc-800 pl-8">
              <h4 className="text-xs font-black text-white mb-4 tracking-widest">01. OWNERSHIP</h4>
              <p className="text-[10px] text-zinc-500 leading-loose tracking-widest uppercase italic">
                ASSETS ARE CREATED BY <span className="text-white">KOMSIN</span> UNDER <span className="text-cyan-500">AURELIUS STUDIO</span>. 
                UPON PURCHASE, YOU RECEIVE A NON-EXCLUSIVE LICENSE. OWNERSHIP OF THE ARTWORK REMAINS WITH KOMSIN.
              </p>
            </div>

            <div className="border-l-2 border-zinc-800 pl-8">
              <h4 className="text-xs font-black text-white mb-4 tracking-widest">02. REFUND POLICY</h4>
              <p className="text-[10px] text-zinc-500 leading-loose tracking-widest uppercase italic font-sans">
                เนื่องจากเป็นสินค้าดิจิทัล (DIGITAL PRODUCTS) เมื่อมีการดาวน์โหลดแล้ว ทางสตูดิโอขอสงวนสิทธิ์ในการไม่คืนเงินทุกกรณี 
                <br />
                <span className="text-zinc-600">DUE TO THE NATURE OF DIGITAL GOODS, ALL SALES ARE FINAL. NO REFUNDS.</span>
              </p>
            </div>
            
            <div className="border-l-2 border-zinc-800 pl-8">
              <h4 className="text-xs font-black text-white mb-4 tracking-widest">03. ATTRIBUTION</h4>
              <p className="text-[10px] text-zinc-500 leading-loose tracking-widest uppercase italic">
                CREDITING "AURELIUS STUDIO" OR "KOMSIN" IS NOT REQUIRED BUT GREATLY APPRECIATED.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER CALLOUT */}
        <footer className="mt-40 bg-cyan-500/5 border border-cyan-500/20 p-12 rounded-[3rem] text-center">
          <p className="text-zinc-400 text-[10px] font-black tracking-[0.5em] mb-4">NEED CUSTOM LICENSE?</p>
          <a href="mailto:admin@komsin.com" className="text-white text-3xl font-black italic hover:text-cyan-500 transition-colors uppercase tracking-tighter">
            CONTACT:admin@komsin.com
          </a>
        </footer>

        <div className="mt-20 text-center opacity-20">
           <span className="text-[8px] font-black tracking-[1.5em]">KOMSIN.COM MASTER ARCHIVE © 2026</span>
        </div>

      </div>
    </div>
  );
}