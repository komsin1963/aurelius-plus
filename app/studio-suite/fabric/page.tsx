'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Layers, Zap, 
  Maximize2, Share2, Download,
  Lock, Eye
} from 'lucide-react';

export default function FabricMockup() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [finalArt, setFinalArt] = useState<string>("");
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const savedArt = localStorage.getItem('currentArt');
    if (savedArt) setFinalArt(savedArt);
  }, []);

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-50 bg-black/50 backdrop-blur-md">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-500 transition-all"
        >
          <ArrowLeft size={14} /> Back to Showcase
        </button>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
          Fabric Reality v1.0 / By komsin.com
        </p>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 👕 LEFT: FABRIC ENGINE VISUAL (7-Columns) */}
        <div className="lg:col-span-7 relative group">
          <div className={`relative rounded-[3rem] overflow-hidden bg-zinc-900 aspect-[4/5] border border-white/5 transition-all duration-700 ${zoom ? 'scale-110' : 'scale-100'}`}>
            
            {/* Base Mockup - นายแบบ/เสื้อเปล่า */}
            <img 
              src="/mockups/fabric-texture-base.jpg" 
              className="w-full h-full object-cover" 
              alt="Fabric Base" 
            />

            {/* Artwork Layer with Fabric Displacement Effect */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ top: '15%' }}
            >
              <div className="relative w-1/2 aspect-[25/30]">
                {finalArt && (
                  <img 
                    src={finalArt} 
                    className={`w-full h-full object-contain mix-blend-multiply opacity-80 transition-all duration-1000 ${!isUnlocked ? 'blur-xl grayscale' : 'blur-0'}`}
                    alt="Artwork on Fabric"
                  />
                )}
                
                {/* Fabric Grain Overlay - ทำให้ลายดูจมไปกับเนื้อผ้า */}
                {isUnlocked && (
                  <div className="absolute inset-0 bg-[url('/textures/fabric-grain.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                )}
              </div>
            </div>

            {/* Lock Overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Lock className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black italic uppercase mb-2">Fabric Reality Lock</h3>
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-8">ปลดล็อกระบบจำลองพื้นผิวผ้าเสมือนจริง</p>
                <button 
                  onClick={() => setIsUnlocked(true)}
                  className="px-10 py-5 bg-cyan-500 text-white rounded-full font-black italic uppercase hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  <Zap size={18} fill="currentColor" /> Unlock Engine (100 XP)
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          {isUnlocked && (
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button onClick={() => setZoom(!zoom)} className="p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-cyan-500 transition-colors">
                <Maximize2 size={20} className="text-cyan-500" />
              </button>
            </div>
          )}
        </div>

        {/* ⚡ RIGHT: SPECIFICATIONS (5-Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 mb-4">
              <Layers size={18} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Texture Processing</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">
              Fabric<br />Mockup.
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">Material Specs</h4>
              <ul className="space-y-3">
                <li className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-zinc-600">Fabric Type:</span>
                  <span>Heavy Cotton 20 Oz.</span>
                </li>
                <li className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-zinc-600">Print Method:</span>
                  <span>Direct to Garment (DTG)</span>
                </li>
                <li className="flex justify-between text-xs font-bold uppercase italic">
                  <span className="text-zinc-600">Canvas Size:</span>
                  <span className="text-cyan-500">25 X 30 CM</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="py-6 bg-zinc-900 border border-white/5 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                 <Share2 size={14} /> Export Preview
               </button>
               <button className="py-6 bg-zinc-900 border border-white/5 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                 <Download size={14} /> Save Asset
               </button>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5">
             <div className="flex items-center gap-4 opacity-30">
                <div className="h-[1px] flex-1 bg-white"></div>
                <p className="text-[8px] font-black uppercase tracking-widest italic">Aurelius Neural Fabric Engine</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}