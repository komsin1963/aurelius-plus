'use client';

import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { 
  Upload, Zap, Download, Copy, Check, 
  RefreshCw, ArrowLeft, Maximize2 
} from 'lucide-react';
import Link from 'next/link';

export default function StudioX() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'BLACK' | 'WHITE'>('BLACK');
  
  // 🆕 State สำหรับ Compare Slider
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const processImage = async (file: File) => {
    setLoading(true);
    setImage(URL.createObjectURL(file));
    try {
      const blob = await removeBackground(file, {
        progress: (step: string, current: number, total: number) => {
          setProgress(Math.round((current / total) * 100));
        }
      });
      setResult(URL.createObjectURL(blob));
      setSliderPos(50); // Reset slider มาที่ตรงกลางเมื่อทำรูปใหม่เสร็จ
    } catch (err) {
      alert("AI Engine Error");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 ฟังก์ชันควบคุมการเลื่อน Slider
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing && e.type !== 'touchmove') return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - container.left) / container.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className={`min-h-screen ${viewMode === 'BLACK' ? 'bg-[#020203] text-white' : 'bg-[#f4f4f4] text-black'}`}>
      {/* HEADER (เหมือนเดิม) */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-2 rounded-lg"><Zap size={18} className="text-black" fill="currentColor" /></div>
          <div className="text-left">
            <h1 className="text-xl font-black italic uppercase">AURELIUS<span className="text-cyan-500">X</span></h1>
            <p className="text-[7px] font-black opacity-40 tracking-[0.4em]">BY KOMSIN.COM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900/80 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black italic italic">1,250,450 XP +</div>
          <button className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black italic flex items-center gap-2">ENTRY <ArrowLeft size={14} className="rotate-180" /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-20 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* 🆕 LEFT: IMAGE BOX WITH SLIDER */}
        <div 
          className={`aspect-square rounded-[3rem] border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden cursor-ew-resize ${viewMode === 'BLACK' ? 'bg-[#0a0a0c]' : 'bg-white'}`}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseDown={() => setIsResizing(true)}
          onMouseUp={() => setIsResizing(false)}
          onMouseLeave={() => setIsResizing(false)}
        >
           <p className="absolute top-10 left-10 text-[9px] font-black opacity-30 italic tracking-[0.5em] z-20">NEURAL PREVIEW</p>
           
           {!image ? (
             <label className="cursor-pointer flex flex-col items-center gap-4 z-20">
               <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center hover:border-cyan-500 transition-all">
                  <Upload size={30} className="text-zinc-700" />
               </div>
               <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
             </label>
           ) : (
             <div className="relative w-full h-full flex items-center justify-center p-10">
                {/* รูปต้นฉบับ (Background) */}
                <img src={image} className="max-h-full object-contain opacity-40 blur-[2px]" alt="Original" />
                
                {result && (
                  <>
                    {/* รูปที่ลบพื้นหลังแล้ว (Foreground พร้อม Clip) */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <img src={result} className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt="Result" />
                    </div>

                    {/* เส้น Slider */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-cyan-500 z-30 pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-[#020203] shadow-xl">
                         <Maximize2 size={12} className="text-black rotate-45" />
                      </div>
                    </div>

                    {/* Label บอกฝั่ง */}
                    <div className="absolute bottom-10 left-10 text-[8px] font-black bg-cyan-500 text-black px-2 py-1 rounded z-20">PROCESSED</div>
                    <div className="absolute bottom-10 right-10 text-[8px] font-black bg-zinc-800 text-white px-2 py-1 rounded z-20">ORIGINAL</div>
                  </>
                )}
             </div>
           )}

           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-50">
               <p className="text-5xl font-black italic text-white mb-2">{progress}%</p>
               <p className="text-[10px] font-black uppercase tracking-[1em] text-cyan-400">Computing...</p>
             </div>
           )}
        </div>

        {/* RIGHT: CONTROLS (คงไว้ตาม DESIGN 05) */}
        <div className="text-left">
          <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-1">THE CYBER</h3>
          <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-cyan-500">ENGINE X</h3>

          <div className="mt-16 space-y-12">
            <div>
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-4 italic">Viewport Background</p>
              <div className="flex gap-4">
                <button onClick={() => setViewMode('BLACK')} className={`flex-1 py-4 rounded-xl border-2 font-black italic text-[10px] tracking-widest transition-all ${viewMode === 'BLACK' ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-white/5 opacity-40'}`}>BLACK MATTER</button>
                <button onClick={() => setViewMode('WHITE')} className={`flex-1 py-4 rounded-xl border-2 font-black italic text-[10px] tracking-widest transition-all ${viewMode === 'WHITE' ? 'border-cyan-500 bg-white text-black' : 'border-white/5 opacity-40'}`}>PURE WHITE</button>
              </div>
            </div>

            <button 
              disabled={!result || loading}
              onClick={() => result && window.open(result)}
              className="w-full py-6 bg-cyan-500 text-black rounded-2xl font-black italic uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              CONFIRM & DOWNLOAD <Download size={20} />
            </button>

            <button onClick={() => {setImage(null); setResult(null);}} className="w-full text-center text-[9px] font-black opacity-20 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 tracking-widest">
               <RefreshCw size={12} /> RESET NEURAL ENGINE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}