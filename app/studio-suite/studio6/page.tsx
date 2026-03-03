'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Globe, Zap, CheckCircle2, CloudLightning } from 'lucide-react';

export default function AutoMarketS6() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <div className="min-h-screen bg-[#020203] text-white p-8 lg:p-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-16 text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={16}/> Back to Hub
      </button>

      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <div className="w-24 h-24 bg-pink-500/10 border border-pink-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-pink-500 shadow-2xl shadow-pink-500/10">
            <ShoppingCart size={40} />
          </div>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter">Auto <span className="text-pink-500">Market</span></h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.6em]">S6 Protocol • Global Commerce Sync</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-zinc-900/30 rounded-[3rem] border border-white/5 space-y-6 hover:border-pink-500/20 transition-all">
              <div className="flex justify-between items-start">
                 <Globe className="text-zinc-600" size={32} />
                 <span className="px-4 py-1 bg-pink-500/10 text-pink-500 rounded-full text-[8px] font-black uppercase tracking-widest">Ready</span>
              </div>
              <h3 className="text-2xl font-black italic uppercase">Etsy Store</h3>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">เชื่อมต่อคลังสินค้าของคุณเข้ากับหน้าสาขา Etsy โดยตรง พร้อมระบบ Tag AI</p>
           </div>

           <div className="p-10 bg-zinc-900/30 rounded-[3rem] border border-white/5 space-y-6 hover:border-blue-500/20 transition-all">
              <div className="flex justify-between items-start">
                 <CloudLightning className="text-zinc-600" size={32} />
                 <span className="px-4 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[8px] font-black uppercase tracking-widest">Online</span>
              </div>
              <h3 className="text-2xl font-black italic uppercase">Printify Sync</h3>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">ส่งไฟล์ High-Res ไปยังโรงพิมพ์ทั่วโลกโดยอัตโนมัติเมื่อมีการสั่งซื้อ</p>
           </div>
        </div>

        <button 
          onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 2000); }}
          className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black italic uppercase text-2xl tracking-tighter hover:bg-pink-500 hover:text-white transition-all shadow-2xl shadow-pink-500/20 flex items-center justify-center gap-4"
        >
          {isSyncing ? <Zap className="animate-spin" /> : <Zap />}
          {isSyncing ? 'SYNCING PROTOCOL...' : 'PUBLISH TO ALL MARKETS'}
        </button>
      </div>
    </div>
  );
}