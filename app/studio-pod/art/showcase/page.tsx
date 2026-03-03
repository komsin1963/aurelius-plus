'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, Share2, Briefcase, 
  ArrowLeft, ShieldCheck, Zap, 
  Coins, Maximize2
} from 'lucide-react';

export default function ArtShowcase() {
  const router = useRouter();
  const [finalArt, setFinalArt] = useState<string>("");
  const [xpBonus, setXpBonus] = useState(0);

  // 1. ดึงภาพจากระบบ Generator ที่เซฟไว้ใน localStorage
  useEffect(() => {
    const savedArt = localStorage.getItem('currentArt');
    if (savedArt) {
      setFinalArt(savedArt);
    }
  }, []);

  // 2. ฟังก์ชัน Share เพื่อรับ XP เพิ่ม
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Aurelius Artwork',
          text: 'สร้างผลงาน AI สุดล้ำที่ Aurelius Studio by komsin.com',
          url: window.location.href,
        });
      }
      setXpBonus(500);
      alert("SYSTEM: แชร์ไอเดียสำเร็จ! รับโบนัส +500 XP Neural Energy");
    } catch (error) {
      console.log('Sharing interrupted');
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* 🧭 NAVIGATION */}
      <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-black/50 backdrop-blur-xl z-50">
        <button 
          onClick={() => router.push('/studio-pod/art/generator')} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-500 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Generator
        </button>
        
        <div className="flex items-center gap-4">
           {xpBonus > 0 && (
             <div className="flex items-center gap-2 text-green-400 animate-in slide-in-from-right duration-500">
               <Coins size={14} className="animate-bounce" />
               <span className="text-[10px] font-black tracking-widest">+{xpBonus} XP EARNED</span>
             </div>
           )}
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic hidden sm:block">
             AURELIUS STUDIO / By komsin.com
           </p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pb-20 mt-10">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            THE <span className="text-cyan-500">SHOWCASE</span>
          </h1>
          <div className="flex items-center justify-center lg:justify-start gap-4 mt-4 opacity-40">
            <div className="h-[1px] w-20 bg-white"></div>
            <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Neural Production v1.5</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* 🖼️ LEFT: ARTWORK ONLY PREVIEW */}
          <div className="relative group w-full max-w-[600px] mx-auto lg:mx-0">
            <div className="relative rounded-[4rem] overflow-hidden bg-zinc-900/20 aspect-square border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex items-center justify-center group">
              
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

              {finalArt ? (
                <img 
                  src={finalArt} 
                  alt="Final Masterpiece" 
                  className="w-full h-full object-contain relative z-10 animate-in fade-in zoom-in duration-700 p-8" 
                />
              ) : (
                <div className="text-center space-y-4 opacity-20">
                    <Maximize2 size={48} className="mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Artwork Detected</p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-32 w-full animate-scan pointer-events-none z-20" />
              
              <div className="absolute top-10 left-10 z-30">
                 <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Master File 1:1</span>
                 </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-end px-4">
               <div>
                  <p className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.4em]">Neural Asset ID</p>
                  <h3 className="text-xl font-black italic uppercase">ARLS-2026-X1</h3>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em]">Operator</p>
                  <p className="text-[10px] font-black text-white italic tracking-widest">Komsin Intelligence</p>
               </div>
            </div>
          </div>

          {/* ⚡ RIGHT: DETAILS & ACTIONS */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Masterpiece Verified</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">Art Confirmed<br/>Production Ready.</h2>
              <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-md uppercase italic">
                ไฟล์งานศิลปะของคุณได้รับการประมวลผลเป็น <span className="text-white">High-Definition Master</span> เรียบร้อยแล้ว 
                พร้อมสำหรับการนำไปพิมพ์ลงบนเสื้อผ้าผ่านระบบ <span className="text-white border-b border-white/20">komsin.com</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-sm group hover:border-cyan-500/30 transition-all duration-500 text-center lg:text-left">
                <p className="text-[9px] font-black text-zinc-600 mb-2 tracking-widest uppercase italic">PRODUCTION REWARD</p>
                <p className="text-4xl font-black italic text-cyan-500">+{ (2500 + xpBonus).toLocaleString() }</p>
              </div>
              <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-sm text-center lg:text-left">
                <p className="text-[9px] font-black text-zinc-600 mb-2 tracking-widest uppercase italic">ASSET STATUS</p>
                <p className="text-4xl font-black italic text-white uppercase tracking-tighter">MINTED</p>
              </div>
            </div>

            {/* ปุ่มกดหลัก: แก้ไขให้ Link ไปหน้า Master Artwork */}
            <div className="space-y-5 pt-6">
              <button 
                onClick={() => router.push('/studio-pod/art/master-artwork')}
                className="w-full py-9 bg-white text-black rounded-[2.5rem] font-black italic uppercase text-2xl tracking-tighter hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98] group"
              >
                <Download size={26} className="group-hover:translate-y-1 transition-transform" /> 
                Download Master File
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleShare}
                  className="py-6 bg-zinc-900/80 rounded-[2.2rem] font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-3 group"
                >
                  <Share2 size={18} className="text-cyan-500 group-hover:scale-125 transition-transform" /> 
                  Share (+500 XP)
                </button>
                <button 
                  onClick={() => router.push('/studio-pod/art/generator')} 
                  className="py-6 bg-zinc-900/80 rounded-[2.2rem] font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-3 group"
                >
                  <Briefcase size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" /> 
                  New Design
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-4 pt-10 border-t border-white/5">
                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">© 2026 AURELIUS BY KOMSIN</p>
                <div className="flex gap-2 text-zinc-800">
                   <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}