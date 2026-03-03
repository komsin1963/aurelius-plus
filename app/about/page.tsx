'use client';

import React from 'react';
import { 
  Target, Cpu, Terminal, Instagram, Mail, ArrowRight, Zap, Award 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6 uppercase italic font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND GRID DECOR */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-24 border-b border-white/5 pb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" size={20} />
              <span className="text-cyan-500 text-[10px] font-black tracking-[0.6em]">CREATOR DOSSIER v2.0</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black leading-[0.7] tracking-tighter italic">
              KOM <br /> <span className="text-cyan-500">SIN</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-black tracking-[0.5em] text-zinc-500 mb-2 uppercase italic">ESTABLISHED 2026</p>
             <p className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">AURELIUS STUDIO <br/> FOUNDER</p>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* PROFILE AREA */}
          <div className="lg:col-span-1">
            <div className="relative aspect-square bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
              <img 
                src="/assets/profile.webp" 
                alt="Komsin" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-100 scale-105 group-hover:scale-100"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x800/0a0a0a/06b6d4?text=KOMSIN"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
            </div>
            
            <div className="mt-8 space-y-4">
               <a href="https://instagram.com/aurelius.studio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-zinc-500 hover:text-cyan-500 transition-colors cursor-pointer group">
                  <Instagram size={18} />
                  <span className="text-[10px] font-black tracking-widest group-hover:translate-x-1 transition-transform">@AURELIUS.STUDIO</span>
               </a>
               <div className="flex items-center gap-4 text-zinc-500 hover:text-cyan-500 transition-colors cursor-pointer">
                  <Mail size={18} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic font-sans underline decoration-cyan-500/30">CONTACT:admin@komsin.com</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-16">
            
            {/* 1. THE FOUNDER (ประวัติเดิม) */}
            <section className="space-y-8 text-left">
              <div className="flex items-center gap-4 mb-4">
                <Award className="text-cyan-500" size={24} />
                <h2 className="text-3xl font-black tracking-tight italic">THE FOUNDER</h2>
              </div>
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm md:text-base font-bold leading-relaxed tracking-widest italic border-l-2 border-cyan-500/50 pl-6">
                  ผมชื่อ <span className="text-white font-black">คมศิลป์</span> ผู้ก่อตั้ง <span className="text-cyan-500">Aurelius Studio</span> 
                  ศิษย์เก่า <span className="text-white underline decoration-zinc-700">"เพาะช่าง" (Poh-Chang)</span> 
                  พื้นฐานของผมคือการหลอมรวมศิลปะดั้งเดิมเข้ากับโครงสร้างแบบ Industrial และ Cyberpunk
                </p>
                <p className="text-zinc-500 text-[11px] font-black leading-relaxed tracking-[0.2em] italic uppercase">
                  I am <span className="text-white">Komsin</span>, a graduate of the <span className="text-white">Poh-Chang Academy of Arts</span>. 
                  My mission is to fuse traditional art aesthetics with professional industrial structures.
                </p>
              </div>
            </section>

            {/* 2. THE INSPIRATION (แรงบันดาลใจ Studio-Pod) */}
            <section className="space-y-8 text-left border-t border-white/5 pt-12">
              <div className="flex items-center gap-4 mb-4">
                <Target className="text-cyan-500" size={24} />
                <h2 className="text-3xl font-black tracking-tight italic">STUDIO-POD GENESIS</h2>
              </div>
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm md:text-base font-bold leading-relaxed tracking-widest italic border-l-2 border-white/20 pl-6">
                  <span className="text-cyan-500 uppercase">Studio-Pod</span> เกิดจากประสบการณ์หน้างานที่พบปัญหาความยุ่งยากในการเตรียมไฟล์สกรีน 
                  ผมจึงสร้าง "นิเวศน์เครื่องมือ" นี้ขึ้นเพื่อทลายขีดจำกัดงานพิมพ์ ให้กลายเป็นความแม่นยำระดับ <span className="text-white">Master Asset</span>
                </p>
                <p className="text-zinc-500 text-[11px] font-black leading-relaxed tracking-[0.2em] italic uppercase">
                  Created to solve real-world production pain points. 
                  Every tool is precision-engineered to bridge the gap between creative vision and technical reality.
                </p>
              </div>
            </section>

            {/* CTA: LINK TO STUDIO-POD */}
            <div className="pt-10 flex flex-wrap gap-6 justify-start">
              <Link href="/studio-pod" className="bg-cyan-500 text-black px-12 py-6 rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-white transition-all active:scale-95 uppercase italic shadow-[0_15px_40px_rgba(6,182,212,0.3)] group">
                LAUNCH STUDIO-POD <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-40 border-t border-white/5 pt-20 pb-10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-20">
            <span className="text-[8px] font-black tracking-[1em]">KOMSIN.COM MASTER ARCHIVE</span>
            <span className="text-[8px] font-black tracking-[1em]">DESIGNED BY KOMSIN © 2026</span>
        </footer>

      </div>
    </div>
  );
}