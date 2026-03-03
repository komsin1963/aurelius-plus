'use client';
import { Zap, ArrowRight, User } from 'lucide-react';
import Link from 'next/link'; // 👈 นำเข้า Link เพื่อใช้เปลี่ยนหน้า

interface StudioHeaderProps {
  studioNumber: string;
  studioName: string;
}

export default function StudioHeader({ studioNumber, studioName }: StudioHeaderProps) {
  return (
    <div className="max-w-[1600px] mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
      
      {/* [LEFT] Logo & Branding */}
      <Link href="/" className="flex items-center gap-5 group cursor-pointer">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-500">
          <Zap size={30} className="text-white fill-white" />
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            AURELIUS<span className="text-cyan-500">X</span>
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-[1px] w-8 bg-zinc-800" />
            <h3 className="text-zinc-500 text-[12px] font-black uppercase tracking-[0.4em] italic">
              STUDIO {studioNumber} <span className="text-zinc-300">{studioName}</span>
            </h3>
          </div>
        </div>
      </Link>

      {/* [RIGHT] Navigation & System Status */}
      <div className="flex flex-col items-end gap-4">
        {/* System Tag */}
        <div className="flex flex-col items-end gap-1 opacity-50">
          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">INTELLIGENCE SYSTEM</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-zinc-400 uppercase italic border-b border-cyan-500/30">komsin.com</span>
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* 🚀 ปุ่มทางเข้าใหม่ (Sign In to Studio Pod) */}
        <div className="flex items-center gap-3">
          <Link 
            href="/library" // 👈 แก้ให้ไปหน้าที่พี่ต้องการ (เช่น /library หรือ /dashboard)
            className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-2xl font-black uppercase italic text-[10px] hover:bg-cyan-500 hover:scale-105 transition-all shadow-xl group"
          >
            ENTER STUDIO POD <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {/* ปุ่มตัวเลือกเสริมสำหรับ Staff */}
          <button className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-colors">
            <User size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}