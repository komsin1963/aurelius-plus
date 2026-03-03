'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Upload, Download, Wand2, ArrowLeft, 
  ImageIcon, Zap, Lock, UserPlus, AlertCircle 
} from 'lucide-react';

export default function AILineArtLab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [xp, setXp] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [contrast, setContrast] = useState(150);
  const [brightness, setBrightness] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRegister = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setXp(5000); // เริ่มต้น 5,000 XP
      setIsProcessing(false);
    }, 1200);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isLoggedIn) {
      setIsProcessing(true);
      setError(null);
      const reader = new FileReader();
      reader.onload = (f) => {
        setImage(f.target?.result as string);
        setTimeout(() => setIsProcessing(false), 800);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ ฟังก์ชัน Export พร้อมระบบหัก 25 XP
  const handleExport = () => {
    if (!image || !canvasRef.current) return;

    // 1. ตรวจสอบ XP ก่อนดำเนินการ
    if (xp < 25) {
      setError("INSUFFICIENT XP: คุณต้องมีอย่างน้อย 25 XP");
      return;
    }
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = `grayscale(100%) contrast(${contrast}%) brightness(${brightness}%) invert(100%)`;
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `aurelius-lineart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 2. หัก XP ออก 25 แต้มหลังจาก Export สำเร็จ
        setXp(prev => prev - 25);
      }
      setIsProcessing(false);
    };
    img.src = image;
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-x-hidden relative text-left">
      {/* 🧭 NAVIGATION */}
      <nav className="relative z-50 p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/studio-pod" className="p-3 bg-zinc-900 rounded-xl hover:bg-white hover:text-black transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-black italic uppercase leading-none tracking-tighter text-white">AI LINE ART LAB</h1>
            <span className="text-[7px] font-black text-zinc-500 tracking-[0.4em] uppercase mt-1">By komsin.com</span>
          </div>
        </div>
        {isLoggedIn ? (
          <div className="bg-zinc-900 px-5 py-2 rounded-full border border-cyan-500/30 flex items-center gap-3">
            <Zap size={12} className="text-cyan-400" fill="currentColor" />
            <span className="text-[10px] font-black text-white italic">{xp.toLocaleString()} XP</span>
          </div>
        ) : (
          <button onClick={handleRegister} className="bg-purple-600 px-6 py-2.5 rounded-full text-[10px] font-black uppercase italic transition-all flex items-center gap-2 hover:bg-white hover:text-black">
            <UserPlus size={14} /> Claim 5,000 XP
          </button>
        )}
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 py-12">
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-zinc-900/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl transition-all ${!isLoggedIn && 'opacity-40 grayscale pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-purple-400 font-black uppercase italic text-xs tracking-widest text-left">
                <Wand2 size={20} /> Processor
              </div>
              <div className="text-[9px] font-black text-zinc-500 bg-white/5 px-3 py-1 rounded-lg">FEE: 25 XP</div>
            </div>
            
            <div className="space-y-8 text-left">
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white/5 border-2 border-dashed border-white/10 py-10 rounded-3xl flex flex-col items-center gap-3 hover:border-purple-500/50 transition-all group">
                <Upload size={24} className="text-zinc-500 group-hover:text-white" />
                <span className="text-[9px] font-black uppercase italic text-zinc-500 group-hover:text-white tracking-widest">Upload Source</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase italic text-zinc-500">
                    <span>Edge Threshold</span><span className="text-purple-400">{contrast}%</span>
                  </div>
                  <input type="range" min="100" max="1000" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase italic text-zinc-500">
                    <span>Line Weight</span><span className="text-cyan-400">{brightness}%</span>
                  </div>
                  <input type="range" min="50" max="250" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-[9px] font-black uppercase italic">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                onClick={handleExport}
                disabled={!image || isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase italic transition-all flex items-center justify-center gap-2 ${image ? 'bg-cyan-500 text-black hover:bg-white active:scale-95' : 'bg-zinc-800 text-zinc-600'}`}
              >
                <Download size={16} /> Export & Pay 25 XP
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-black rounded-[3rem] border border-white/5 relative flex items-center justify-center overflow-hidden min-h-[550px]">
          {!isLoggedIn ? (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-6">
               <Lock size={40} className="text-purple-500" />
               <h2 className="text-xl font-black italic uppercase">Protocol Locked</h2>
               <button onClick={handleRegister} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase italic">REGISTER TO UNLOCK</button>
            </div>
          ) : image ? (
            <div className="p-12 relative z-10">
               <img 
                src={image} 
                style={{ filter: `grayscale(1) contrast(${contrast}%) brightness(${brightness}%) invert(1)`, mixBlendMode: 'screen' }} 
                className="max-w-full max-h-[500px] shadow-2xl" 
                alt="preview" 
               />
            </div>
          ) : (
            <div className="opacity-20 flex flex-col items-center gap-4">
               <ImageIcon size={60} /><span className="text-[10px] font-black uppercase tracking-widest italic text-white">Awaiting Signal...</span>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {isProcessing && (
            <div className="absolute inset-0 z-[60] bg-[#020205]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-left">
               <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-[8px] font-black uppercase italic text-purple-400 tracking-[0.5em] animate-pulse">Synchronizing XP Node...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}