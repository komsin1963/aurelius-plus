'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Zap, Loader2, ShieldCheck, ArrowLeft, Cpu, Gift, Globe, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
  const [user, setUser] = useState<any>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from('profiles')
          .select('neural_energy')
          .eq('id', session.user.id)
          .single();
        if (data) setUserXp(data.neural_energy);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  const handleDirectPurchase = (stripeUrl: string) => {
    if (!user) return alert("IDENTIFICATION REQUIRED: PLEASE LOGIN.");
    const finalUrl = `${stripeUrl}?client_reference_id=${user.id}`;
    window.location.href = finalUrl;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center text-cyan-500 font-mono animate-pulse">
      SYNCING_AURELIUS_SYSTEM...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 md:p-12 font-mono relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 md:mb-20">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-cyan-500 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter">
                REFILL <span className="text-cyan-400">RESOURCES</span>
              </h1>
              <p className="text-[8px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-2 italic">BY KOMSIN.COM • AURELIUS STUDIO</p>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-black">
              <Cpu size={20} fill="currentColor" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase italic tracking-tighter">AURELIUSX PROTOCOL</p>
              <p className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest">IDENTITY LINKED</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          {/* LEFT: STATUS & PROMO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 relative overflow-hidden">
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-4">CURRENT BALANCE</p>
              <div className="flex items-baseline gap-4">
                 <span className="text-5xl md:text-7xl font-black italic tracking-tighter">{userXp.toLocaleString()}</span>
                 <span className="text-cyan-500 font-black italic text-xl uppercase">XP</span>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">
                <ShieldCheck size={14} className="text-cyan-500" /> Secure Protocol Active
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-transparent border border-cyan-500/30 rounded-[2.5rem] p-8">
               <Gift className="text-cyan-400 mb-4" size={28} />
               <h3 className="text-lg font-black italic uppercase mb-2">Node Bonus</h3>
               <p className="text-zinc-400 text-[10px] leading-relaxed mb-6">
                  {user ? "5,000 XP ALREADY INJECTED" : "SIGN UP FOR 5,000 XP BONUS"}
               </p>
               {!user && (
                 /* 👇 เปลี่ยนจาก /register เป็น /auth-login เรียบร้อยครับ */
                 <Link href="/auth-login" className="inline-flex items-center gap-2 text-[10px] font-black text-black bg-cyan-400 px-6 py-3 rounded-full uppercase italic">
                    Sign Up Now <ArrowRight size={14} />
                 </Link>
               )}
            </div>
          </div>

          {/* RIGHT: SHOP ITEMS */}
          <div className="lg:col-span-8 space-y-6">
            <button 
              onClick={() => handleDirectPurchase('https://buy.stripe.com/3cIfZhagmb7e4Ao0gX3cc00')}
              className="group w-full bg-zinc-900/40 border-2 border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-cyan-500 transition-all duration-500"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
                  <Zap size={40} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] md:text-[12px] font-black text-cyan-500 uppercase italic">Primary Package</p>
                  <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter">25,000 XP</h4>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-4xl md:text-6xl font-black italic mb-4 group-hover:text-cyan-500 transition-colors">฿250</p>
                <div className="bg-cyan-500 text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase italic">BUY NOW</div>
              </div>
            </button>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-2xl flex items-center gap-4">
                  <Lock size={16} className="text-zinc-500" />
                  <p className="text-zinc-400 text-[9px] md:text-[11px] font-bold uppercase">Stripe & PromptPay</p>
               </div>
               <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-2xl flex items-center gap-4">
                  <Globe size={16} className="text-zinc-500" />
                  <p className="text-zinc-400 text-[9px] md:text-[11px] font-bold uppercase">Instant Delivery</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}