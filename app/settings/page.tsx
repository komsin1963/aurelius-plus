'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, User, Shield, Bell, Cpu, 
  Save, RefreshCw, Mail, CheckCircle2, Globe 
} from 'lucide-react';
import UserProfileDropdown from '@/components/UserProfileDropdown';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Operator Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security Node', icon: <Shield size={18} /> },
    { id: 'system', label: 'System Engine', icon: <Cpu size={18} /> },
    { id: 'notify', label: 'Signal Alerts', icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-cyan-500/30">
      <nav className="fixed top-0 left-0 right-0 z-[100] p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 shadow-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <ChevronLeft size={20} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            <div className="flex flex-col text-left">
              <h1 className="text-sm font-black italic uppercase text-white leading-none">System Settings</h1>
              <span className="text-[7px] tracking-[0.4em] text-zinc-500 font-black uppercase italic">Aurelius Control Unit</span>
            </div>
          </Link>
          <UserProfileDropdown />
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest transition-all ${
                activeTab === item.id ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 lg:p-12 backdrop-blur-sm">
            <div className="relative z-10">
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Operator <span className="text-cyan-500 text-4xl">Identity</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase px-2">Operator Name</label>
                                <input type="text" defaultValue="Komsin Studio" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-cyan-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase px-2">System Email</label>
                                <input type="email" readOnly defaultValue="admin@komsin.com" className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-5 py-4 text-sm font-bold text-cyan-400 cursor-default outline-none" />
                            </div>
                        </div>
                        <div className="p-6 border border-white/5 bg-black/40 rounded-3xl flex items-center justify-between group hover:border-cyan-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center"><Globe className="text-cyan-400" /></div>
                                <div>
                                    <p className="text-xs font-black italic uppercase text-white">Primary Domain Control</p>
                                    <p className="text-[9px] font-bold text-cyan-500 uppercase mt-1">komsin.com • ACTIVE</p>
                                </div>
                            </div>
                            <Link href="https://my.z.com/th/" target="_blank" className="text-[9px] font-black uppercase italic text-zinc-500 hover:text-cyan-500">DNS Management</Link>
                        </div>
                    </div>
                )}
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-600">
                        <RefreshCw size={12} className="animate-spin" />
                        <span className="text-[8px] font-black uppercase italic text-zinc-500">Node Syncing: Success</span>
                    </div>
                    <button className="bg-white text-black px-10 py-4 rounded-xl font-black text-[10px] uppercase italic hover:bg-cyan-500 transition-all flex items-center gap-3">
                        <Save size={14} /> Commit Changes
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}