'use client';

import { useState } from 'react';
import { Zap, Loader2, ArrowLeft, CheckCircle2, ShieldCheck, Ticket } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function RedeemPage() {
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{xp: number} | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return toast.error("ENTER_PROTOCOL_CODE");
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setSuccessData({ xp: result.amount });
      toast.success("ENERGY_CORE_INJECTED");
    } catch (err: any) {
      toast.error(err.message || "SYNC_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 italic">
        <div className="w-24 h-24 bg-zinc-950 border-2 border-cyan-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
          <CheckCircle2 size={40} className="text-cyan-500" />
        </div>
        <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-2 italic">SYNC_SUCCESS</h2>
        <p className="text-cyan-500 font-black text-2xl mb-12">+{successData.xp.toLocaleString()} XP AUTHORIZED</p>
        <Link href="/dashboard" className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-cyan-500 transition-all active:scale-95 shadow-2xl">
          RETURN_TO_HUB
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-sans italic selection:bg-cyan-500/30 uppercase">
      <Toaster position="top-center" />
      <main className="max-w-xl mx-auto py-20">
        <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-zinc-700 hover:text-cyan-500 tracking-[0.5em] mb-12 transition-colors">
          <ArrowLeft size={14} /> BACK_TO_SYSTEM
        </Link>

        <div className="bg-zinc-900/10 border border-white/5 p-12 rounded-[4rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl border-white/5">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] -rotate-12 translate-x-10 -translate-y-10 pointer-events-none">
            <Ticket size={240} className="text-white" />
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl font-black text-white tracking-tighter mb-2 italic leading-none">REDEEM <span className="text-cyan-500">CORE</span></h1>
            <p className="text-[10px] font-bold text-zinc-600 tracking-[0.5em] mb-16">INPUT SECURITY PROTOCOL TO RECHARGE</p>

            <div className="space-y-6">
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                placeholder="PROTOCOL-CODE-XXXX"
                className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] py-10 px-6 text-2xl font-black tracking-[0.2em] text-white text-center focus:border-cyan-500/50 outline-none transition-all placeholder:text-zinc-900 shadow-inner"
              />
              <button 
                onClick={handleRedeem}
                disabled={isProcessing}
                className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-[12px] tracking-[0.5em] hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-20 active:scale-[0.98] shadow-lg"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> INJECT XP ENERGY</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}