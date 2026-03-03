'use client';

import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Lock, 
  Globe, 
  CreditCard,
  Zap
} from 'lucide-react';

export default function PayPalLinkPage() {
  // เปลี่ยนเป็นลิงก์สินค้า 11DOG ของคุณคมศิลป์บน Gumroad
  const GUMROAD_URL = "https://aureliusx.gumroad.com/l/11dog-pack"; 

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-6 font-sans italic uppercase">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[180px] opacity-10" />
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card Container */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl text-center">
          
          {/* Studio Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <ShieldCheck size={14} className="text-cyan-500" />
              <span className="text-[9px] font-black tracking-[0.3em] text-cyan-500">AURELIUS_ENCRYPTED_V2</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic">
              AURELIUS <span className="text-cyan-500">STUDIO</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.4em] mt-3">SECURE_ASSET_DELIVERY</p>
          </div>

          {/* User Info Section */}
          <div className="bg-black/40 rounded-3xl border border-white/5 p-6 mb-8">
             <div className="w-20 h-20 rounded-2xl bg-zinc-800 mx-auto mb-4 overflow-hidden border border-white/10 shadow-xl">
                {/* รูปโลโก้ Aurelius Studio ที่คุณเพิ่งสร้าง */}
                <img src="/assets/profile.webp" alt="Aurelius Studio" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
             </div>
             <h3 className="text-xl font-black tracking-tight text-cyan-500">KOMSIN</h3>
             <p className="text-[9px] text-zinc-600 font-black tracking-widest mt-1 underline">AURELIUS STUDIO FOUNDER</p>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <a 
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 w-full bg-white text-black py-6 rounded-2xl font-black text-sm hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)] active:scale-95"
            >
              <CreditCard size={18} />
              GET 11DOG COLLECTION
              <ExternalLink size={14} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            
            <p className="text-[8px] text-zinc-600 font-bold leading-relaxed px-6">
              YOU ARE REDIRECTING TO GUMROAD SECURE PAYMENT. <br />
              HIGH-RES ASSETS (94.4MB) WILL BE DELIVERED INSTANTLY.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-white/5 flex justify-center gap-8 text-zinc-700">
             <Lock size={16} />
<Globe size={16} />
<Zap size={16} />
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-10 text-center space-y-2 opacity-30">
           <p className="text-[9px] font-black tracking-[0.6em] text-zinc-500">
             BY KOMSIN • AURELIUS STUDIO
           </p>
           <div className="flex justify-center items-center gap-4">
              <div className="h-px w-8 bg-zinc-800" />
              <span className="text-[7px] font-bold tracking-[0.2em]">KOMSIN.COM</span>
              <div className="h-px w-8 bg-zinc-800" />
           </div>
        </div>
      </div>
    </div>
  );
}