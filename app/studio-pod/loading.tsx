'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Zap, ArrowRight, Terminal, Cpu, Layout, Box } from 'lucide-react';

export default function StudioHub() {
  const router = useRouter();
  const [xp, setXp] = useState<number>(0);
  const [user, setUser] = useState<any>(null);

  // ดึงยอด XP จริงมาโชว์ให้ชื่นใจยามเช้า
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('profiles')
          .select('neural_energy')
          .eq('id', session.user.id)
          .single();
        if (data) setXp(data.neural_energy);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden bg-[#020203] text-white font-mono italic">
      {/* Background Effect: ตกแต่งพื้นหลังให้ดูมีมิติ */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="space-y-8">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
              System Online: AureliusX Core
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-zinc-600 text-2xl md:text-3xl font-black uppercase tracking-tighter">Welcome To</h2>
            <h1 className="text-7xl md:text-[12rem] font-black italic uppercase tracking-[ -0.05em] leading-[0.8] mb-4">
              STUDIO <span className="text-white">POD</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-white/5 pt-12">
            <div className="space-y-4 text-left">
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em]">
                CHIEF OPERATOR
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center">
                  <Cpu size={20} className="text-cyan-500" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter italic">KOMSIN.COM</span>
              </div>
            </div>

            {/* XP STATUS CARD: โชว์ยอดล้าน XP แบบจัดเต็ม */}
            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] flex items-center gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-right relative z-10">
                <span className="block text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">Neural Energy Reserve</span>
                <span className="text-4xl font-black italic tracking-tighter">
                  {xp.toLocaleString()} <span className="text-zinc-500 text-sm ml-1 uppercase">XP</span>
                </span>
              </div>
              <div className="w-16 h-16 bg-white text-black rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <Zap size={28} fill="currentColor" />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN ACTION SECTION: เข้าสู่ Studio 01 ทันที */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => router.push('/studio-pod/art/studio1')}
            className="md:col-span-2 group relative p-12 rounded-[4rem] border border-white/10 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl"
          >
            <div className="absolute top-12 right-12 text-white/5 group-hover:text-cyan-500/10 transition-colors">
               <Layout size={180} />
            </div>
            <div className="relative z-10 space-y-16">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1 bg-cyan-500 text-[10px] font-black text-black rounded-full uppercase tracking-widest">Active</span>
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Module: Studio-01</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black italic uppercase tracking-tighter group-hover:text-cyan-500 transition-colors">Neural Studio</h2>
                <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-sm uppercase tracking-wider">
                  ระบบลบพื้นหลังอัจฉริยะ (Local GPU Processing) พร้อมใช้งานด้วยพลังงาน {xp.toLocaleString()} XP ของคุณ
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] group-hover:translate-x-4 transition-transform text-white">
                Enter Studio <ArrowRight size={18} className="text-cyan-500" />
              </div>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-6">
            <div className="p-8 rounded-[3rem] border border-white/5 bg-zinc-900/10 space-y-6">
               <div className="flex items-center gap-3 text-zinc-600">
                  <Box size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Assets Management</span>
               </div>
               <div className="space-y-2">
                 <div className="h-[2px] w-full bg-zinc-800" />
                 <div className="h-[2px] w-[60%] bg-cyan-500" />
               </div>
               <p className="text-[10px] text-zinc-500 font-bold italic leading-relaxed uppercase">
                 ระบบพร้อมรองรับงาน Alpha PNG คุณภาพสูงผ่าน Secure Node ของคุณเอง
               </p>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <footer className="pt-20 pb-10 text-center border-t border-white/5">
           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[1em] italic">
             Aurelius Systems &copy; 2026 by komsin.com
           </p>
        </footer>
      </main>
    </div>
  );
}