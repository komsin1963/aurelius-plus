'use client';

import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, Home, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#050000] text-white flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* 🔴 Background Security Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* 🛡️ Warning Icon Section */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-zinc-900 border border-red-500/30 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <ShieldAlert size={80} className="text-red-500 mx-auto group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          {/* Floating Lock Icon */}
          <div className="absolute -bottom-4 -right-4 bg-red-600 p-3 rounded-2xl shadow-xl border-4 border-[#050000]">
            <Lock size={20} className="text-white" />
          </div>
        </div>

        {/* ⚠️ Error Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500">Security Breach Attempted</span>
          </div>

          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
            Access <span className="text-red-600">Denied</span>
          </h1>
          
          <div className="max-w-md mx-auto">
            <p className="text-zinc-500 text-xs font-bold uppercase leading-relaxed tracking-widest italic">
              ERROR_CODE: 403_FORBIDDEN <br />
              พิกัดนี้สงวนไว้สำหรับระดับ <span className="text-red-500">ADMINISTRATOR</span> เท่านั้น <br />
              ข้อมูลการพยายามเข้าถึงถูกบันทึกในระบบ Sentinel เรียบร้อยแล้ว
            </p>
          </div>
        </div>

        {/* 🧭 Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase italic transition-all shadow-lg shadow-red-600/20 active:scale-95 group">
            <Home size={16} /> กลับสู่ฐานบัญชาการ
          </Link>
          
          <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase italic transition-all active:scale-95 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> หน้าแดชบอร์ด
          </Link>
        </div>

        {/* 📡 Footer Status */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-4 opacity-30">
          <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.4em] italic text-zinc-500">
            <span className="flex items-center gap-2"><Zap size={10} /> Node: Secure_01</span>
            <span className="flex items-center gap-2"><ShieldAlert size={10} /> Protocol: Sentinel_V2</span>
          </div>
          <p className="text-[7px] font-black uppercase tracking-widest text-zinc-700">© 2026 komsin.com • Security Division</p>
        </div>
      </div>

    </div>
  );
}