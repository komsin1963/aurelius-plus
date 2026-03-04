'use client';

import { useState, useEffect, useRef } from 'react';
import { Zap, Loader2, ArrowLeft, CheckCircle2, Ticket, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function RedeemPage() {
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{xp: number} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus เมื่อเข้าหน้าจอ
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleRedeem = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return toast.error("ACCESS_DENIED: EMPTY_CODE");
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/redeem', { // 🚩 เช็ค Path นี้ใน /app/api ของพี่ด้วย
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode })
      });

      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || "INVALID_PROTOCOL");
      }

      setSuccessData({ xp: result.amount });
      toast.success("ENERGY_CORE_INJECTED", {
        style: { background: '#000', color: '#06b6d4', border: '1px solid #06b6d4' }
      });
    } catch (err: any) {
      toast.error(err.message || "SYNC_ERROR", {
        icon: <ShieldAlert className="text-red-500" />
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 italic animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-zinc-950 border-2 border-cyan-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_0_70px_rgba(6,182,212,0.4)] relative">
          <CheckCircle2 size={40} className="text-cyan-500" />
          <div className="absolute inset-0 rounded-[2.5rem] bg-cyan-500 opacity-20 animate-ping"></div>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-2 italic text-center">SYNC_SUCCESS</h2>
        <p className="text-cyan-500 font-black text-2xl md:text-3xl mb-12 animate-pulse">
          +{successData.xp.toLocaleString()} XP AUTHORIZED
        </p>
        <Link href="/studio-pod" className="px-16 py-6 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.5em] hover:bg-cyan-500 hover:text-white transition-all active:scale-95 shadow-2xl">
          RETURN_TO_HUB
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-sans italic selection:bg-cyan-500/30 uppercase">
      <Toaster position="top-center" reverseOrder={false} />
      
      <main className="max-w-xl mx-auto py-12 md:py-20">
        {/* Back Link - ชี้ไปหน้า Studio Pod แทน Dashboard เดิม */}
        <Link href="/studio-pod" className="inline-flex items-center gap-3 text-[10px] font-black text-zinc-700 hover:text-cyan-500 tracking-[0.6em] mb-12 transition-all hover:-translate-x-2">
          <ArrowLeft size={14} /> BACK_TO_SYSTEM
        </Link>

        <div className="bg-zinc-900/10 border border-white/5 p-8 md:p-16 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
          {/* Decorative Ticket Icon */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.05] -rotate-12 translate-x-12 -translate-y-12 pointer-events-none">
            <Ticket size={280} className="text-white" />
          </div>

          <div className="relative z-10">
            <header className="mb-16">
               <h1 className="text-6xl font-black text-white tracking-tighter mb-4 italic leading-none">
                 REDEEM <span className="text-cyan-500">CORE</span>
               </h1>
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-cyan-500"></div>
                  <p className="text-[9px] font-black text-zinc-600 tracking-[0.5em]">INPUT SECURITY PROTOCOL TO RECHARGE</p>
               </div>
            </header>

            <div className="space-y-8">
              <div className="relative group">
                <input 
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleRedeem()}
                  placeholder="CODE-XXXX-XXXX"
                  className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] py-12 px-6 text-3xl font-black tracking-[0.25em] text-white text-center focus:border-cyan-500/50 focus:bg-black transition-all placeholder:text-zinc-900 shadow-inner group-hover:border-white/20"
                />
              </div>

              <button 
                onClick={handleRedeem}
                disabled={isProcessing || !code.trim()}
                className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-[13px] tracking-[0.5em] hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-10 active:scale-[0.97] shadow-xl group"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin text-cyan-500" />
                ) : (
                  <><Zap size={20} fill="currentColor" className="group-hover:animate-bounce" /> INJECT XP ENERGY</>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[9px] font-bold text-zinc-800 tracking-[1em] opacity-50">
          AureliusX Infrastructure • Protocol v4.0
        </p>
      </main>
    </div>
  );
}