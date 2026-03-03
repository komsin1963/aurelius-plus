'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, ShoppingCart, Download, Image as ImageIcon, Zap, Cpu, Printer } from 'lucide-react';
import Link from 'next/link';

export default function BundlePage() {
  const specs = [
    { label: "Format", value: "PNG / SVG (Vector Locked)" },
    { label: "Resolution", value: "4000x4000 px (300 DPI)" },
    { label: "Color Mode", value: "CMYK Optimized for DTG/DTF" },
    { label: "Background", value: "Transparent (Zero Alpha)" }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-mono relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 mb-12 text-[10px] font-black uppercase tracking-widest italic transition-all">
          <ArrowLeft size={16} /> Return_to_Market
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: PRODUCT PREVIEW */}
          <div className="space-y-6">
            <div className="aspect-square bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden group relative shadow-2xl">
              <img 
                src="/path-to-your-bundle-image.jpg" // แทนที่ด้วยรูป ideogram-v3...
                alt="Cyber-Industrial Bundle"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <div className="flex items-center gap-3 bg-cyan-500 text-black px-4 py-2 rounded-xl font-black italic text-xs uppercase tracking-tighter shadow-lg">
                  <Zap size={14} fill="currentColor" /> Premium Assets
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-crosshair">
                   <div className="w-full h-full flex items-center justify-center text-zinc-800 italic text-[10px]">Preview_Node_0{i}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & CHECKOUT */}
          <div className="space-y-10">
            <div>
              <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic flex items-center gap-2">
                <Cpu size={14} /> Available_Deployment: DTG / DTF
              </p>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
                CYBER-INDUSTRIAL <br />
                <span className="text-white/20">GRAFFITI BUNDLE</span>
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md font-bold uppercase italic">
                ชุดลายกราฟิกสไตล์อุตสาหกรรมไซเบอร์ ออกแบบมาเพื่อการพิมพ์สกรีนระบบดิจิทัลโดยเฉพาะ สีสด คมชัด รองรับงานพิมพ์ลงบนเสื้อผ้าทุกประเภท
              </p>
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec, i) => (
                <div key={i} className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-[10px] font-bold text-zinc-300 uppercase italic tracking-tighter">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* PRICE & ACTION */}
            <div className="p-10 bg-gradient-to-br from-zinc-900 to-black border border-cyan-500/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Printer size={80} />
               </div>
               
               <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black italic text-white tracking-tighter">฿250</span>
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">/ Lifetime Access</span>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                    <CheckCircle2 size={16} className="text-cyan-500" /> Commercial License Included
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                    <CheckCircle2 size={16} className="text-cyan-500" /> High-Resolution Master Files
                  </div>
               </div>

               <button className="w-full bg-cyan-500 hover:bg-white text-black py-6 rounded-2xl font-black text-sm uppercase italic tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3">
                  Initialize_Purchase <ShoppingCart size={20} />
               </button>
               
               <p className="text-center mt-6 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                 Instant Neural Injection • Secured by komsin.com
               </p>
            </div>

            {/* TRUST BADGE */}
            <div className="flex items-center justify-between px-6 py-4 border border-white/5 rounded-2xl text-zinc-600">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic">
                  <ImageIcon size={14} /> Master_File_Verified
               </div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic">
                  <Download size={14} /> Instant_Delivery
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}