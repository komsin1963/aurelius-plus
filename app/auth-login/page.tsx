'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Fingerprint, Sparkles, KeyRound, Users } from 'lucide-react';

export default function StudioAuth() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  // 🔑 รหัสผ่านเดียวที่ใช้ทั้งพี่ komsin และทีมงาน
  const MASTER_PASS = "2026"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('verifying');

    setTimeout(() => {
      if (password === MASTER_PASS) {
        setStatus('success');
        // ✅ ออกตั๋วผ่านทางให้ทีมงานเข้าห้อง Private ได้ทุกคน
        localStorage.setItem('studio_access_token', 'unlocked_by_master_key'); 
        router.push('/studio-suite'); 
      } else {
        setStatus('error');
        setPassword('');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 font-sans italic selection:bg-cyan-500/30">
      <div className="w-full max-w-[380px] relative z-10">
        <div className={`bg-zinc-900/40 border ${status === 'error' ? 'border-red-500/50' : 'border-white/5'} backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-2xl transition-all duration-500`}>
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 transition-all duration-700 ${status === 'success' ? 'bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-black border border-white/10 shadow-xl'}`}>
               {status === 'success' ? <ShieldCheck className="text-white" size={32} /> : <Users className="text-zinc-600" size={32} />}
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white leading-none">
              AURELIUS <span className="text-cyan-500">SUITE</span>
            </h1>
            <p className="text-[7px] font-black text-zinc-600 tracking-[0.5em] uppercase mt-2 italic text-center">
              TEAM & ADMIN TERMINAL
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                autoFocus
                type="password" 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'verifying' || status === 'success'}
                className="w-full bg-black/60 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-2xl font-black text-center text-cyan-500 focus:outline-none focus:border-cyan-500/50 transition-all tracking-[0.5em] placeholder:tracking-normal placeholder:text-[10px] placeholder:text-zinc-800 uppercase"
                required 
              />
            </div>

            <button 
              disabled={status === 'verifying' || password.length < 1 || status === 'success'}
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase italic tracking-[0.2em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
            >
              {status === 'verifying' ? <Loader2 className="animate-spin" size={16} /> : 
               status === 'success' ? 'Connection Established' : 
               <><Sparkles size={14} /> Log in to Suite</>}
            </button>
          </form>

          {status === 'error' && (
            <p className="text-center text-red-500 text-[8px] font-black uppercase mt-6 tracking-widest animate-pulse italic">
              Verification Failed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}