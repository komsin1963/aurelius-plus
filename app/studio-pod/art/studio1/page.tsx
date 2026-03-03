'use client';

import React, { useState, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { 
  Upload, Zap, Download, RefreshCw, ArrowLeft, Maximize2, Gift, Loader2, UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Studio01() {
  // --- 🛰️ STATE ระบบ XP (เน้นใช้งานได้จริงทันที) ---
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState<number>(5000); // เริ่มต้นให้เลย 5,000 XP สำหรับทดสอบ
  const [isSyncing, setIsSyncing] = useState(false);

  // --- 🎨 STATE ประมวลผลภาพ ---
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'BLACK' | 'WHITE'>('BLACK');
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const COST = 500;

  // 🔄 พยายามดึง User เฉพาะตอนโหลด ถ้าไม่มีก็ไม่เป็นไร
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('neural_energy').eq('id', session.user.id).single();
        if (data) setXp(data.neural_energy);
      }
    };
    checkUser();
  }, []);

  // 🎁 ฟังก์ชันเติม XP (บวกเพิ่มในหน้าจอทันที ไม่ต้องรอ Login)
  const handleGiftXP = async () => {
    const amount = 5000;
    setXp(current => current + amount);
    
    // ถ้า Login อยู่ ให้ Update ลง DB ด้วยแบบเงียบๆ
    if (user) {
      await supabase.from('profiles').update({ neural_energy: xp + amount }).eq('id', user.id);
    }
    alert(`NEURAL ENERGY UPDATED: +${amount.toLocaleString()} XP`);
  };

  // ✂️ ฟังก์ชันลบพื้นหลัง (ปลดล็อคให้ใช้งานได้เลย)
  const processImage = async (file: File) => {
    if (xp < COST) return alert("พลังงาน XP ไม่เพียงพอ กรุณาเติมพลังงานทดลอง");
    
    setLoading(true);
    setImage(URL.createObjectURL(file));
    try {
      const blob = await removeBackground(file, {
        progress: (step, current, total) => setProgress(Math.round((current / total) * 100))
      });
      const resultUrl = URL.createObjectURL(blob);
      setResult(resultUrl);
      setSliderPos(50);

      // หักแต้มในหน้าจอทันที
      setXp(current => current - COST);
      
      // ถ้า Login อยู่ ค่อยไปหักใน DB
      if (user) {
        await supabase.from('profiles').update({ neural_energy: xp - COST }).eq('id', user.id);
      }
    } catch (err) {
      alert("AI Engine Error");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isResizing && e.type !== 'touchmove') return;
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const position = ((x - container.left) / container.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className={`min-h-screen font-mono italic ${viewMode === 'BLACK' ? 'bg-[#020203] text-white' : 'bg-[#f4f4f4] text-black'}`}>
      
      {/* 🧭 NAVIGATION (ENTRY ไปหน้าลงทะเบียน) */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-2 rounded-lg shadow-lg">
             <Zap size={18} className="text-black" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase leading-none italic">Studio <span className="text-cyan-500">01</span></h1>
            <p className="text-[7px] font-black opacity-40 tracking-[0.4em] mt-1">BY KOMSIN.COM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900/80 text-white px-5 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3">
            <Zap size={14} className="text-cyan-500" fill="currentColor" />
            <span className="text-[11px] font-black tracking-tighter uppercase">
              {xp.toLocaleString()} XP
            </span>
          </div>

          <Link href="/register"> {/* เปลี่ยนเป็น Path หน้าลงทะเบียนของคุณ */}
            <button className="bg-white text-black hover:bg-cyan-500 px-6 py-2.5 rounded-2xl text-[10px] font-black italic flex items-center gap-2 transition-all active:scale-95 shadow-lg">
              ENTRY <ArrowLeft size={14} className="rotate-180" />
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-16 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: NEURAL CANVAS */}
        <div 
          className={`aspect-square rounded-[3rem] border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden cursor-ew-resize transition-all duration-700 ${viewMode === 'BLACK' ? 'bg-[#0a0a0c]' : 'bg-white shadow-zinc-200'}`}
          onMouseMove={handleMouseMove}
          onMouseDown={() => setIsResizing(true)}
          onMouseUp={() => setIsResizing(false)}
          onMouseLeave={() => setIsResizing(false)}
        >
           {!image ? (
             <label className="cursor-pointer flex flex-col items-center gap-6 group">
               <div className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-zinc-800 flex items-center justify-center group-hover:border-cyan-500 transition-all duration-500">
                  <Upload size={32} className="text-zinc-700 group-hover:text-cyan-500" />
               </div>
               <p className="text-[10px] font-black opacity-30 tracking-[0.5em] group-hover:opacity-100 transition-all uppercase italic">Import Neural Asset</p>
               <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])} />
             </label>
           ) : (
             <div className="relative w-full h-full flex items-center justify-center p-10">
                <img src={image} className="max-h-full object-contain opacity-20 blur-[2px]" alt="Original" />
                {result && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                      <img src={result} className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt="Result" />
                    </div>
                    <div className="absolute top-0 bottom-0 w-[2.5px] bg-cyan-500 z-30 shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{ left: `${sliderPos}%` }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-[#020203] shadow-lg">
                         <Maximize2 size={14} className="text-black rotate-45" />
                      </div>
                    </div>
                  </>
                )}
             </div>
           )}

           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl z-50 text-white">
               <Loader2 size={40} className="text-cyan-500 animate-spin mb-4" />
               <p className="text-6xl font-black italic mb-2 tracking-tighter">{progress}%</p>
               <p className="text-[10px] font-black uppercase tracking-[1em] text-cyan-400">Computing...</p>
             </div>
           )}
        </div>

        {/* RIGHT: ENGINE CONTROLS */}
        <div className="text-left">
          <h3 className="text-7xl font-black italic uppercase tracking-tighter leading-[0.85] mb-2">NEURAL</h3>
          <h3 className="text-7xl font-black italic uppercase tracking-tighter leading-[0.85] text-cyan-500">ENGINE</h3>

          <div className="mt-16 space-y-12">
            <div>
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-4 italic">Environment Switch</p>
              <div className="flex gap-4">
                <button onClick={() => setViewMode('BLACK')} className={`flex-1 py-4 rounded-2xl border-2 font-black italic text-[10px] transition-all ${viewMode === 'BLACK' ? 'border-cyan-500 bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'border-white/5 opacity-40'}`}>DARK SPACE</button>
                <button onClick={() => setViewMode('WHITE')} className={`flex-1 py-4 rounded-2xl border-2 font-black italic text-[10px] transition-all ${viewMode === 'WHITE' ? 'border-cyan-500 bg-white text-black shadow-lg' : 'border-white/5 opacity-40'}`}>LIGHT ROOM</button>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                disabled={!result || loading}
                onClick={() => result && window.open(result)}
                className="w-full py-6 bg-cyan-500 text-black rounded-[2rem] font-black italic uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 shadow-cyan-500/30"
              >
                CONFIRM & DOWNLOAD <Download size={20} />
              </button>

              <button onClick={handleGiftXP} className="w-full text-center text-[9px] font-black opacity-20 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 tracking-widest uppercase italic">
                 <UserPlus size={12} /> Claim Trial Energy (5,000 XP)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}