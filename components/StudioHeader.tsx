'use client';
import { useState } from 'react'; // 👈 เพิ่ม useState เพื่อเปิด/ปิดเมนูมือถือ
import { Zap, ArrowRight, User, Menu, X } from 'lucide-react'; // 👈 เพิ่มไอคอนเมนู
import Link from 'next/link';

interface StudioHeaderProps {
  studioNumber: string;
  studioName: string;
}

export default function StudioHeader({ studioNumber, studioName }: StudioHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 ตัวแปรเช็คสถานะเมนูมือถือ

  return (
    <div className="max-w-[1600px] mx-auto mb-10 border-b border-white/5 pb-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        
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

        {/* [CENTER] Desktop Navigation - เมนูที่พี่อยากให้เห็น (โชว์เฉพาะคอม) */}
        <nav className="hidden lg:flex items-center gap-8 mb-1">
          {['ABOUT', 'FEATURES', 'GALLERY', 'PRICING'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[10px] font-black text-zinc-500 hover:text-cyan-500 tracking-[0.3em] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* [RIGHT] Actions & Mobile Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* ปุ่ม 3 ขีดสำหรับมือถือ (โชว์เฉพาะมือถือ) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 bg-zinc-900 border border-white/5 rounded-2xl text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-3">
            <Link 
              href="/library" 
              className="flex items-center gap-3 bg-white text-black px-6 md:px-8 py-3 rounded-2xl font-black uppercase italic text-[10px] hover:bg-cyan-500 hover:scale-105 transition-all shadow-xl group"
            >
              ENTER POD <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-colors">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* [MOBILE MENU] แสดงเมื่อกดปุ่ม 3 ขีด */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 z-50 py-6 flex flex-col items-center gap-6 animate-in slide-in-from-top duration-300">
          {['ABOUT', 'FEATURES', 'GALLERY', 'PRICING'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="text-[12px] font-black text-zinc-400 hover:text-cyan-500 tracking-[0.4em]"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}