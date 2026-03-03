'use client';

import React, { useEffect, useState } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, Maximize2, Share2, ArrowRight, Power, Activity,
  Settings, Rocket, Shield, Loader2, Palette, Shirt, 
  LayoutDashboard, Smartphone, Chrome, Users
} from 'lucide-react';

export default function StudioSuitePrivate() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // 🛡️ Security Gate: ตรวจสอบสิทธิ์ Master Key
  useEffect(() => {
    const isAuth = localStorage.getItem('studio_access_token');
    if (isAuth === 'unlocked_by_master_key') {
      setIsAuthorized(true);
    } else {
      router.replace('/auth-login'); 
    }
  }, [router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('studio_access_token');
    setTimeout(() => router.replace('/'), 800);
  };

  // 🛠️ Nodes ทั้ง 7 สำหรับทีมงานและ Admin
  const productionNodes = [
    { 
      name: 'Compose Studio', 
      desc: 'Advanced CMYK Split, Dot Screen & Registration Marks.',
      path: '/studio-suite/compose', 
      Icon: Palette, 
      status: 'Live',
      color: 'hover:border-cyan-500/40',
      iconColor: 'text-cyan-400'
    },
    { 
      name: 'Social Studio', 
      desc: 'Automated TikTok/Reels & IG Post formatting engine.',
      path: '/studio-suite/social', 
      Icon: Smartphone, 
      status: 'Ready',
      color: 'hover:border-pink-500/40',
      iconColor: 'text-pink-500'
    },
    { 
      name: 'Crop Studio', 
      desc: 'Professional T-Shirt Mockup Production.',
      path: '/studio-suite/crop', 
      Icon: Shirt, 
      status: 'Active',
      color: 'hover:border-white/40',
      iconColor: 'text-white'
    },
    { 
      name: 'Aries Node', 
      desc: 'The Pioneer Art Generator (Main Engine).',
      path: '/studio-suite/tale', 
      Icon: Rocket, 
      status: 'Active',
      color: 'hover:border-red-500/40',
      iconColor: 'text-red-500'
    },
    { 
      name: 'StudioX', 
      desc: 'High-end Production Background Removal.',
      path: '/studio-suite/studiox/',
      Icon: Zap, 
      status: 'Ready',
      color: 'hover:border-purple-500/40',
      iconColor: 'text-purple-500'
    },
    { 
      name: 'Neural-Max', 
      desc: 'AI Resolution Enhancement for Large Format Print.',
      path: '/studio-suite/neural-max', 
      Icon: Maximize2, 
      status: 'Ready',
      color: 'hover:border-cyan-500/40',
      iconColor: 'text-cyan-500'
    },
    { 
      name: 'Vector Engine', 
      desc: 'Jpg/Png to SVG/Vector Conversion Pipeline.',
      path: '/studio-suite/vector', 
      Icon: Chrome, 
      status: 'Ready',
      color: 'hover:border-green-500/40',
      iconColor: 'text-green-500'
    }
  ];

  if (!isAuthorized) return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center font-mono italic text-zinc-600">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Initializing Team Node...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-mono italic tracking-tighter selection:bg-purple-500/30 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* PRIVATE HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-center mb-16 border-b border-white/5 pb-10 gap-8">
          <div className="flex items-center gap-8 text-left">
            <div className="w-20 h-20 bg-white flex items-center justify-center rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 duration-500">
              <Settings className="text-black animate-[spin_12s_linear_infinite]" size={36} />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter italic">
                Aurelius <span className="text-purple-500">Suite</span>
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded flex items-center gap-2">
                  <Users size={12} className="text-purple-400" />
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest text-left">
                    Team Production Access
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                   <Shield size={10} className="text-zinc-600" />
                   <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">KMS-ADMIN-V4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 bg-zinc-900 border border-white/5 px-8 py-5 rounded-[1.5rem] hover:bg-white hover:text-black transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl">
              <LayoutDashboard size={18} /> Market Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-500/10 border border-red-500/20 p-5 rounded-[1.5rem] text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              {isLoggingOut ? <Loader2 className="animate-spin" size={24} /> : <Power size={24} />}
            </button>
          </div>
        </header>

        {/* NODES GRID */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productionNodes.map((node) => (
            <Link 
              key={node.name} 
              href={node.path} 
              className={`group bg-[#0A0A0A] border border-white/5 p-8 rounded-[3rem] ${node.color} hover:bg-zinc-900/50 transition-all flex flex-col justify-between min-h-[300px] relative overflow-hidden text-left shadow-2xl`}
            >
              <div>
                <div className="mb-8 bg-black w-16 h-16 rounded-[1.5rem] flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-inner">
                  <node.Icon size={28} className={node.iconColor} />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter transition-colors">
                  {node.name}
                </h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity pr-2">
                  {node.desc}
                </p>
              </div>

              <div className="flex justify-between items-center mt-10">
                <div className="bg-black/80 px-5 py-2 rounded-full border border-white/5 flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{node.status}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700" 
                   style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </Link>
          ))}
        </main>

        {/* STATUS FOOTER */}
        <footer className="mt-24 bg-zinc-900/20 rounded-[3rem] p-10 border border-white/5 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-10">
            <div className="flex items-center gap-4 text-left">
              <Activity size={18} className="text-purple-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest leading-none mb-1">Engine Load</span>
                <span className="text-[11px] font-black text-white italic tracking-widest">24.08% / OPTIMAL</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest leading-none mb-1">Security Node</span>
              <span className="text-[11px] font-black text-cyan-500 italic tracking-widest uppercase">AES-256 Enabled</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic leading-none">
              © 2026 KOMSIN.COM • NEURAL PROTOCOL
            </p>
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">
              All Rights Reserved / Team Access v4.0.2
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}