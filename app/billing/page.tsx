"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CreditCard, Zap, Download, Loader2 } from 'lucide-react';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import { supabase } from '@/lib/supabase'; // 👈 นำเข้าตัวเชื่อมต่อที่พี่แก้กุญแจแล้ว

export default function BillingPage() {
  const [xpBalance, setXpBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูล XP จริงจากฐานข้อมูล
  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.id)
          .single();
        if (data) setXpBalance(data.xp);
      }
      setLoading(false);
    };
    fetchBalance();
  }, []);

  const transactions = [
    { id: 'TXN-9901', date: '2026-02-15', amount: '+50,000 XP', status: 'Success', method: 'PromptPay' },
    { id: 'TXN-9854', date: '2026-02-10', amount: '-1,200 XP', status: 'Success', method: 'Art Market Purchase' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-cyan-500/30">
      {/* 🧭 NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 shadow-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <ChevronLeft size={20} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            <div className="flex flex-col text-left">
              <h1 className="text-sm font-black italic uppercase text-white leading-none tracking-tighter">Billing & XP</h1>
              <span className="text-[7px] tracking-[0.4em] text-zinc-500 font-black uppercase italic">Financial Node</span>
            </div>
          </Link>
          <UserProfileDropdown />
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-12">
        {/* ⚡ CURRENT BALANCE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <Zap className="absolute right-[-20px] bottom-[-20px] size-64 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Available Balance</p>
              <h2 className="text-6xl font-black italic mt-2 tracking-tighter">
                {loading ? <Loader2 className="animate-spin inline" size={40} /> : xpBalance.toLocaleString()} <span className="text-2xl">XP</span>
              </h2>
              <Link href="/topup">
                <button className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase italic hover:bg-white hover:text-black transition-all shadow-xl">
                  Refill Resources
                </button>
              </Link>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center backdrop-blur-md">
             <CreditCard className="text-cyan-500 mb-4" size={40} />
             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Subscription Status</p>
             <h3 className="text-xl font-black italic uppercase mt-1">Free Tier</h3>
             <span className="text-[8px] text-cyan-500/50 mt-2 font-bold italic uppercase tracking-tighter">Upgrade Coming Soon</span>
          </div>
        </div>

        {/* 📜 TRANSACTION HISTORY (UI เหมือนเดิมของพี่) */}
        {/* ... ส่วน Table ของพี่ ... */}
      </main>

      {/* 🛡️ FOOTER */}
      <footer className="py-10 text-center">
        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
          By komsin.com • AURELIUS-V2 Secure Protocol
        </span>
      </footer>
    </div>
  );
}