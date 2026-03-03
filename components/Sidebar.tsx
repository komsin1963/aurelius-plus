'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Shirt, Palette, Zap, CreditCard, ShieldCheck, Box, Layers, Brush } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // รายการ Studio 1-6 และระบบ Billing
  const studios = [
    { name: 'Studio Hub', href: '/studio-pod', icon: LayoutGrid },
    { name: 'S1: Mockup Lab', href: '/studio-pod/art/studio', icon: Shirt },
    { name: 'S2: Artwork Gen', href: '/studio-pod/art-gen', icon: Brush },
    { name: 'S3: Brand Identity', href: '/studio-pod/brand', icon: Box },
    { name: 'S4: Layers Suite', href: '/studio-pod/layers', icon: Layers },
    { name: 'Showcase', href: '/studio-pod/art/showcase', icon: Palette },
    { name: 'Billing / QR', href: '/studio-pod/billing', icon: CreditCard },
  ];

  return (
    <aside className="w-20 hover:w-64 bg-[#050505] border-r border-white/5 transition-all duration-300 group z-50 sticky top-0 h-screen flex flex-col shadow-2xl">
      {/* LOGO AREA */}
      <div className="h-24 flex items-center justify-center border-b border-white/5">
        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-transform group-hover:rotate-12">
          <Zap size={20} fill="black" />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {studios.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={`flex items-center h-12 rounded-xl transition-all duration-200 ${pathname === item.href ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
              <div className="w-12 flex-shrink-0 flex items-center justify-center"><item.icon size={18} /></div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-black uppercase tracking-widest italic ml-2">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* FOOTER: OWNER BRANDING */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg">
            <ShieldCheck size={14} className="text-black" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
            <p className="text-[10px] font-black uppercase text-white leading-none truncate">คมศิลป์</p>
            <p className="text-[8px] font-bold text-cyan-500/50 uppercase tracking-tighter mt-1">komsin.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}