'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, Download, ArrowRight, 
  Zap, Globe, ShieldCheck, Loader2, Home 
} from 'lucide-react';

// แยก Component ออกมาเพื่อรองรับ useSearchParams ใน Next.js 13+ (App Router)
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  // ดึงค่าจาก URL ที่เราตั้งไว้ใน Stripe Redirect URL
  const type = searchParams.get('type') || 'xp'; 
  const amount = searchParams.get('amount') || '25,000'; 
  const filePath = searchParams.get('file');
  const sessionId = searchParams.get('session_id'); // Stripe จะแนบตัวนี้มาให้

  const handleDownload = async () => {
    if (!filePath) return;
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download-private', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert("Download Error - Please contact komsin.com");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center px-6 selection:bg-cyan-500 font-sans relative overflow-hidden">
      
      {/* BACKGROUND GLOW - ปรับให้ดูเป็น Aurelius Studio Pod */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl text-center border-t-white/10">
          
          <div className="relative z-10">
            {/* SUCCESS ICON - พร้อม Glow Effect */}
            <div className="w-24 h-24 bg-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-transform hover:rotate-0 duration-500">
              <CheckCircle2 size={48} className="text-black" />
            </div>

            <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4 leading-none">
              Protocol <span className="text-cyan-500">Fulfilled</span>
            </h1>
            
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic opacity-80">
              BY KOMSIN.COM • IDENTITY LINKED
            </p>

            {/* --- CASE 1: XP REFILL --- */}
            {type === 'xp' && (
              <div className="bg-zinc-950/50 border border-cyan-500/20 rounded-[2rem] p-8 mb-10 shadow-inner group hover:border-cyan-500/40 transition-colors">
                <p className="text-zinc-500 text-[9px] font-black uppercase mb-2 tracking-widest">Neural Energy Injected</p>
                <div className="flex items-center justify-center gap-4">
                  <Zap size={32} className="text-cyan-500 fill-cyan-500 animate-pulse" />
                  <span className="text-5xl font-black text-white italic tracking-tighter">+{amount} XP</span>
                </div>
                <div className="mt-6 flex items-center justify-center gap-3">
                   <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                   <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">System Online</p>
                   <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
                </div>
              </div>
            )}

            {/* --- CASE 2: ASSET PURCHASE --- */}
            {type === 'asset' && (
              <div className="space-y-6 mb-10 text-left">
                <div className="bg-zinc-950/50 border border-white/5 rounded-[2rem] p-8">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-4 tracking-widest text-center">Secure Asset Download</p>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all active:scale-95 uppercase italic"
                  >
                    {isDownloading ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
                    Access Private Repository
                  </button>
                </div>
              </div>
            )}

            {/* --- ACTION BUTTONS --- */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/studio-pod')}
                className="flex items-center justify-center gap-2 py-5 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-zinc-400 hover:bg-white/5 hover:text-white transition-all italic"
              >
                <Home size={14} /> Studio Pod
              </button>
              <button 
                onClick={() => router.push('/market')}
                className="flex items-center justify-center gap-2 py-5 rounded-2xl bg-cyan-500 text-black text-[10px] font-black uppercase hover:bg-white transition-all italic shadow-lg shadow-cyan-500/20"
              >
                Asset Market <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* TRUST FOOTER */}
        <div className="mt-12 flex justify-center gap-8 opacity-30 grayscale hover:opacity-100 transition-opacity duration-700">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white">
            <ShieldCheck size={14} className="text-cyan-500" /> Encryption Active
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white">
            <Globe size={14} className="text-cyan-500" /> Node: {sessionId ? sessionId.substring(0,12).toUpperCase() : 'GLOBAL-MAINNET'}
          </div>
        </div>
      </div>
    </div>
  );
}

// หุ้มด้วย Suspense เพื่อป้องกัน Error เวลาทำ Static Site Generation (Build)
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020203] flex items-center justify-center text-cyan-500">INITIALIZING...</div>}>
      <SuccessContent />
    </Suspense>
  );
}