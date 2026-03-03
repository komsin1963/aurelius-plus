'use client';

import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquare, Mail, Zap, Cpu, Terminal, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // จำลองการส่งข้อมูล
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-mono selection:bg-cyan-500 relative overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-all mb-8 text-[10px] font-black uppercase tracking-[0.3em] italic">
            <ArrowLeft size={16} /> Termination_Return
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
               <Terminal size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                CONTACT <span className="text-cyan-400">OPERATOR</span>
              </h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-3 italic">
                SECURE COMMUNICATION LINE • KOMSIN.COM
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: DIRECT CHANNELS */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] italic mb-8">Priority_Channels</p>
            
            {/* LINE APP */}
            <a href="https://line.me/ti/p/@your_line" target="_blank" className="group flex items-center justify-between p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-500">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">IMMEDIATE RESPONSE</p>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">LINE OFFICIAL</h4>
                  </div>
               </div>
               <Zap size={20} className="text-zinc-800 group-hover:text-green-500 transition-colors" />
            </a>

            {/* EMAIL */}
            <a href="mailto:support@komsin.com" className="group flex items-center justify-between p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-500">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-1">OFFICIAL ENQUIRY</p>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">DIRECT EMAIL</h4>
                  </div>
               </div>
               <Zap size={20} className="text-zinc-800 group-hover:text-cyan-500 transition-colors" />
            </a>

            <div className="p-8 bg-zinc-900/10 border border-dashed border-white/10 rounded-[2.5rem]">
               <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic mb-4">
                  <ShieldCheck size={14} className="text-cyan-500" /> Security Note
               </div>
               <p className="text-[10px] text-zinc-600 leading-relaxed font-bold uppercase tracking-tighter">
                  All communications are monitored for quality assurance and secure data injection purposes. Node stability: 99.9%
               </p>
            </div>
          </div>

          {/* RIGHT: MESSAGE SYSTEM */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                  <Cpu size={18} className="text-cyan-500 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Internal_Message_Protocol</span>
               </div>

               {status === 'sent' ? (
                 <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                       <Send size={32} className="text-black translate-x-1 -translate-y-1" />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase mb-2">Signal Received</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Operator will respond shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-8 text-[9px] font-black text-cyan-500 border-b border-cyan-500/30 uppercase tracking-widest italic hover:text-white transition-colors">Send another signal</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Subject_ID</label>
                          <input required type="text" placeholder="YOUR NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Return_Address</label>
                          <input required type="email" placeholder="EMAIL@PROTOCOL.COM" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Data_Payload</label>
                       <textarea required rows={5} placeholder="ENTER YOUR MESSAGE HERE..." className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xs font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700 resize-none"></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={status === 'sending'}
                      className="w-full bg-cyan-500 hover:bg-white text-black py-5 rounded-2xl font-black text-xs uppercase italic tracking-widest transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {status === 'sending' ? 'TRANSMITTING...' : 'EXECUTE_SEND'} <Send size={16} />
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}