'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Paintbrush, Zap, Scissors, Maximize, 
  Layers, Palette, ArrowLeft, ChevronRight, LayoutDashboard,
  Printer, Film, Eye
} from 'lucide-react';

export default function StudioPodDashboard() {
  // ข้อมูลเครื่องมือทั้งหมด 9 ตัว
  const tools = [
    {
      title: "Line Art",
      desc: "DTP Screen Tool",
      icon: <Layers size={32} />,
      href: "/studio-pod/art/line-art-lab",
      color: "hover:border-purple-500/50",
      iconColor: "text-purple-500",
      tag: "NEW"
    },
    {
      title: "Palette",
      desc: "Free Color Engine",
      icon: <Palette size={32} />,
      href: "/studio-pod/art/palette",
      color: "hover:border-cyan-500/50",
      iconColor: "text-cyan-500"
    },
    {
      title: "Art Studio",
      desc: "Mockup Designer",
      icon: <Paintbrush size={32} />,
      href: "/studio-pod/art/studio",
      color: "hover:border-blue-500/50",
      iconColor: "text-blue-500"
    },
    {
      title: "Remove BG",
      desc: "Pay Per Job (XP)",
      icon: <Scissors size={32} />,
      href: "/studio-pod/art/studio1",
      color: "hover:border-emerald-500/50",
      iconColor: "text-emerald-500"
    },
    {
      title: "AI Upscale",
      desc: "DTP AI Power",
      icon: <Maximize size={32} />,
      href: "/studio-pod/art/upscale",
      color: "hover:border-fuchsia-500/50",
      iconColor: "text-fuchsia-500"
    },
    {
      title: "Vectorize",
      desc: "Instant SVG",
      icon: <Zap size={32} />,
      href: "/studio-pod/art/vectorize",
      color: "hover:border-orange-500/50",
      iconColor: "text-orange-500"
    },
    {
      title: "CMYK Lab",
      desc: "Color Separation",
      icon: <Printer size={32} />,
      href: "/studio-pod/art/reducecolor",
      color: "hover:border-red-500/50",
      iconColor: "text-red-500",
      tag: "HOT"
    },
    {
      title: "Film Output",
      desc: "Halftone Engine",
      icon: <Film size={32} />,
      href: "/studio-pod/art/separator",
      color: "hover:border-yellow-500/50",
      iconColor: "text-yellow-500"
    },
    {
      title: "Mockup",
      desc: "Digital Mockup",
      icon: <Eye size={32} />,
      href: "/studio-pod/art/mockup",
      color: "hover:border-green-500/50",
      iconColor: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans p-6 selection:bg-cyan-500/30 relative overflow-x-hidden uppercase italic">
      
      {/* 🌑 BACKGROUND EFFECT */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
      </div>

      {/* 🔙 TOP NAVIGATION */}
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-[100] py-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black tracking-widest">Return to Hub</span>
        </Link>
        <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-zinc-500 tracking-widest">Operator: Komsin.com</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full bg-[#020203] rounded-full flex items-center justify-center">
                    <LayoutDashboard size={12} className="text-cyan-500" />
                </div>
            </div>
        </div>
      </div>

      {/* 🔝 MAIN HEADER */}
      <header className="max-w-7xl mx-auto pt-16 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 mb-6">
           <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
           <span className="text-[8px] font-black tracking-[0.4em] text-zinc-400">System Online: Studio-Pod v2.5</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-white mb-4">
          STUDIO<span className="text-cyan-500">POD</span>
        </h1>
        <p className="text-[10px] font-black tracking-[0.6em] text-zinc-600">Centralized Production Interface</p>
      </header>

      {/* 🎛️ 9 MAIN TOOLS GRID (3x3) */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href} className="group">
            <div className={`h-full bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] relative flex flex-col transition-all duration-500 ${tool.color} hover:bg-zinc-900/40 hover:-translate-y-2 shadow-xl hover:shadow-cyan-500/10`}>
              
              {tool.tag && (
                <div className="absolute top-6 right-8 bg-white text-black text-[8px] font-black px-2 py-0.5 rounded-sm italic">
                  {tool.tag}
                </div>
              )}

              <div className={`${tool.iconColor} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {tool.icon}
              </div>

              <h3 className="text-2xl font-black mb-1 text-white tracking-tighter">
                {tool.title}
              </h3>
              
              <p className="text-zinc-500 text-[10px] font-bold mb-8 tracking-widest leading-relaxed opacity-60">
                {tool.desc}
              </p>

              <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity border-t border-white/5 pt-4">
                <span className={`text-[9px] font-black tracking-widest ${tool.iconColor}`}>Initialize Protocol</span>
                <ChevronRight size={14} className={tool.iconColor} />
              </div>
            </div>
          </Link>
        ))}

      </main>

      {/* 🛡️ FOOTER BY KOMSIN */}
      <footer className="max-w-6xl mx-auto mt-24 pb-12 flex flex-col items-center gap-6 text-center">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="space-y-2">
          <p className="text-[9px] font-black text-zinc-700 tracking-[0.5em]">
            © 2026 AURELIUS STUDIO PROTOCOL
          </p>
          <p className="text-[8px] font-bold text-cyan-500/40 tracking-widest">
            OPERATED BY KOMSIN.COM
          </p>
        </div>
      </footer>
    </div>
  );
}