'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, Activity, Wallet, PieChart, TrendingUp } from 'lucide-react';

// ดึงหมวดหมู่ทั้งหมดที่คุณมี
const CATEGORIES = [
  'thai-art', 'cyber', 'retro', 'industrial', 
  'pop-art', 'graffiti', 'minimal', '3d', 
  'pixel', 'vector', 'holidays'
];

export default function ValueAssetDashboard() {
  // คำนวณมูลค่าสินทรัพย์ทั้งหมด (11 หมวด x 16 ชิ้น)
  const totalAssets = CATEGORIES.length * 16;
  
  // Logic คำนวณเงินรวมต่อหมวด: 
  // - ฟรี 1 ($0)
  // - ไฟล์เดี่ยว 1 ($2.50)
  // - Bundle 14 ($6.00 x 14) 
  const pricePerCategory = 0 + 2.50 + (6.00 * 14);
  const totalMarketValue = CATEGORIES.length * pricePerCategory;

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center justify-center p-6 font-sans italic">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-4xl w-full">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
          <div className="relative bg-zinc-900 border border-cyan-500/30 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12">
            <PieChart size={40} className="text-cyan-500 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            ASSET <span className="text-cyan-500">VALUE</span>
          </h1>
          <p className="text-zinc-500 font-black tracking-[0.3em] text-[10px]">AURELIUS STUDIO PORTFOLIO EVALUATION</p>
        </div>

        {/* Evaluation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md">
            <Wallet className="text-cyan-500 mb-4 mx-auto" size={24} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total Assets</p>
            <h2 className="text-4xl font-black mt-2 text-white">{totalAssets} <span className="text-sm">FILES</span></h2>
          </div>

          <div className="bg-cyan-500 border border-cyan-400 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <TrendingUp className="text-black mb-4 mx-auto" size={24} />
            <p className="text-[10px] text-cyan-900 font-black uppercase tracking-widest">Market Valuation</p>
            <h2 className="text-4xl font-black mt-2 text-black">${totalMarketValue.toLocaleString()}</h2>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md">
            <Activity className="text-cyan-500 mb-4 mx-auto" size={24} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Avg. Yield / Cat</p>
            <h2 className="text-4xl font-black mt-2 text-white">${pricePerCategory.toFixed(2)}</h2>
          </div>
        </div>

        <div className="space-y-6 pt-8">
          <p className="text-zinc-400 text-[10px] leading-relaxed max-w-md mx-auto font-black uppercase tracking-[0.2em]">
            ระบบคำนวณมูลค่าจาก <br/>
            <span className="text-cyan-500 italic">11 CATEGORIES / {totalAssets} DIGITAL ITEMS</span> <br/>
            ภายใต้โครงสร้างราคามาตรฐาน komsin.com
          </p>

          {/* Progress Bar */}
          <div className="flex flex-col items-center gap-2">
             <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 w-full animate-pulse" />
             </div>
             <span className="text-[8px] text-cyan-500 font-black tracking-widest">CALCULATION COMPLETE</span>
          </div>
        </div>

        <div className="pt-6">
          <Link href="/market" className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all group shadow-2xl">
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> 
            Enter Market Studio
          </Link>
        </div>
      </div>

      {/* Industrial Footer Label */}
      <div className="fixed bottom-10 left-10 opacity-30 hidden md:block text-left border-l-2 border-cyan-500 pl-4">
          <p className="text-[8px] font-black tracking-[0.5em] uppercase">Authorized_By_Komsin</p>
          <p className="text-[8px] font-black tracking-[0.5em] uppercase text-cyan-500">Asset_Valuation_Protocol_v2.5</p>
      </div>
    </div>
  );
}