'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Printer, Share2, Database, ArrowLeft, Lock,
  FileCode, Box, ChevronRight, Eraser, Zap, Terminal, ShieldCheck
} from 'lucide-react';

export default function ConnectHub() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [artwork, setArtwork] = useState<string | null>(null);

  // ตรวจสอบ Artwork ล่าสุดจากระบบ
  useEffect(() => {
    const savedImg = localStorage.getItem('currentArt') || localStorage.getItem('temp_artwork');
    if (savedImg) setArtwork(savedImg);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // รหัสผ่านชั่วคราว (คุณคมศิลป์สามารถเปลี่ยนได้ตามต้องการ)
    if (passcode === '2026') { 
      setIsAuthorized(true);
    } else {
      alert('ACCESS DENIED: INVALID PASSCODE');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-12 rounded-[3rem] text-center space-y-8">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto border border-cyan-500/20">
            <Lock className="text-cyan-500" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Staff Authorization</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">กรุณาระบุรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ENTER PASSCODE"
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-center text-xl font-black tracking-[1em] focus:border-cyan-500 outline-none transition-all"
            />
            <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-cyan-500 transition-all">
              Verify Identity
            </button>
          </form>
          <button onClick={() => router.back()} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
             Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  const staffModules = [
    { 
      id: 'S1', name: 'VECTOR ENGINE', icon: <FileCode size={24} />, 
      color: 'text-cyan-400', desc: 'SILK SCREEN READY: แปลงลายเป็น Vector คมชัดสูง',
      path: '/studio-pod/art/studio1' 
    },
    { 
      id: 'S2', name: 'NEURAL-MAX AI', icon: <Zap size={24} />, 
      color: 'text-purple-400', desc: 'UPSCALING: เพิ่มความละเอียดภาพด้วยระบบ AI อัจฉริยะ',
      path: '/studio-pod/art/master-artwork'
    },
    { 
      id: 'S3', name: 'REMOVE BG', icon: <Eraser size={24} />, 
      color: 'text-pink-400', desc: 'STUDIO TOOL: ลบพื้นหลังออกแบบอัตโนมัติ 1-Click',
      path: '#' 
    },
    { 
      id: 'S4', name: 'FABRIC MOCKUP', icon: <Box size={24} />, 
      color: 'text-amber-400', desc: 'PRODUCTION PREVIEW: จำลองลายสกรีนลงบนเนื้อผ้าจริง',
      path: '#' 
    },
    { 
      id: 'S5', name: 'ASSET VAULT', icon: <Database size={24} />, 
      color: 'text-blue-400', desc: 'STORAGE: คลังเก็บไฟล์แยกตามออเดอร์ลูกค้า',
      path: '#' 
    },
    { 
      id: 'S6', name: 'MASTER PRINT', icon: <Printer size={24} />, 
      color: 'text-green-400', desc: 'GENERATE MASTER: ส่งออกไฟล์พิมพ์ 300 DPI Native',
      path: '#' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-cyan-500/30">
      <nav className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/60 backdrop-blur-2xl z-50">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-all group">
          <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center group-hover:border-cyan-500/50">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
          </div>
          <span>Back to Pod</span>
        </button>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <span className="block text-[8px] font-black text-cyan-500 uppercase tracking-[0.4em] italic leading-tight">Staff Account</span>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter italic">komsin.com</p>
            </div>
            <div className="w-10 h-10 bg-zinc-900 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldCheck size={20} />
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 space-y-16">
        {/* ARTWORK PREVIEW & HEADER */}
        <section className="bg-zinc-900/30 border border-white/5 rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-80 bg-black rounded-[2rem] aspect-[3/4] overflow-hidden border border-white/10 relative group">
             {artwork ? (
                <img src={artwork} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Work" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black italic text-center text-[10px]">WAITING FOR DATA</div>
             )}
          </div>
          <div className="flex-1 text-center lg:text-left space-y-6">
             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                PRODUCTION <br/> <span className="text-cyan-500">CONNECT</span> HUB
             </h2>
             <p className="text-zinc-500 text-xs font-bold uppercase italic leading-loose max-w-xl">
                ศูนย์ควบคุมการผลิตสำหรับทีมงาน komsin.com <br/> เครื่องมือเตรียมไฟล์ขั้นสูงเพื่อคุณภาพงานพิมพ์ระดับสูงสุด
             </p>
          </div>
        </section>

        {/* STAFF MODULES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffModules.map((s) => (
            <div key={s.id} onClick={() => s.path !== '#' && router.push(s.path)} className="group relative p-10 bg-zinc-950 border border-white/5 rounded-[3rem] transition-all duration-500 hover:border-cyan-500/40 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col min-h-[250px] justify-between">
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-cyan-500 group-hover:text-black ${s.color}`}>
                  {s.icon}
                </div>
                <div className="mt-8">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">{s.name}</h4>
                  <p className="text-[10px] font-bold text-zinc-600 leading-relaxed uppercase tracking-widest italic group-hover:text-zinc-400 transition-colors mt-2">{s.desc}</p>
                </div>
              </div>
              <div className="relative z-10 pt-4 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[9px] font-black uppercase italic text-cyan-500 tracking-widest mr-2">Open Module</span>
                 <ChevronRight size={14} className="text-cyan-500" />
              </div>
            </div>
          ))}
        </div>

        <footer className="pt-20 pb-10 flex flex-col items-center gap-4 opacity-30">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[1em] italic">Aurelius Production Protocol • By komsin.com</p>
        </footer>
      </main>
    </div>
  );
}