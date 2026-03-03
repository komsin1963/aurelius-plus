'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  User, Zap, History, Shield, Crown, Star, Database, 
  Loader2, CreditCard, Settings, LogOut, ChevronRight, FileText
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูล Profile และ Activity Logs จาก Supabase
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // ดึงข้อมูล Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // ดึงประวัติกิจกรรม (Activity Logs)
        const { data: logsData } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (logsData) setLogs(logsData);
      }
    } catch (error) {
      console.error('Neural Link Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic animate-pulse">Accessing Neural Records</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-zinc-300 p-4 md:p-10 font-sans selection:bg-cyan-500/30 uppercase italic">
      <Toaster position="bottom-right" />
      
      <main className="max-w-6xl mx-auto space-y-10">
        
        {/* 👤 SECTION 1: USER IDENTITY HEADER */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:border-cyan-500/50 transition-all duration-500">
                <User size={40} className="text-zinc-700 group-hover:text-cyan-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 p-2 rounded-xl shadow-lg border border-black/20">
                <Crown size={14} fill="black" className="text-black" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-white tracking-tighter mb-1">
                {profile?.full_name || 'AURELIUS OPERATOR'}
              </h1>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-[10px] font-black bg-cyan-500/10 text-cyan-500 px-4 py-1 rounded-full border border-cyan-500/20 tracking-widest">
                  {profile?.rank || 'JUNIOR OPERATOR'}
                </span>
                <span className="text-[9px] font-black text-zinc-600 tracking-widest uppercase">
                  LVL. {profile?.level || 1}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 relative z-10">
            <button className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-zinc-500 hover:text-white">
              <Settings size={20} />
            </button>
            <button 
                onClick={() => supabase.auth.signOut()}
                className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/20 transition-all text-red-500/50 hover:text-red-500"
            >
              <LogOut size={20} />
            </button>
          </div>
        </section>

        {/* ⚡ SECTION 2: CURRENCY & STATUS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* XP WALLET */}
          <div className="lg:col-span-7 bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
            <Zap size={120} fill="currentColor" className="absolute -bottom-4 -right-4 text-cyan-500 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700" />
            
            <div className="relative z-10">
              <p className="text-[10px] font-black text-zinc-500 tracking-[0.3em] mb-6">NEURAL ENERGY BALANCE</p>
              <div className="flex items-baseline gap-4 mb-10">
                <h3 className="text-6xl font-black text-white tracking-tighter italic">
                  {(profile?.xp || 0).toLocaleString()}
                </h3>
                <span className="text-cyan-500 font-black text-xl italic tracking-tighter underline decoration-cyan-500/30 underline-offset-8">XP</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/billing" className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-[11px] tracking-widest hover:bg-cyan-500 transition-all shadow-xl shadow-white/5 uppercase italic">
                  <CreditCard size={16} /> Recharge Credits
                </Link>
                {/* ปุ่ม Claim ถูกลบออกเพื่อให้ดูสะอาดขึ้น */}
              </div>
            </div>
          </div>

          {/* SECONDARY STATS */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/30 transition-all">
              <div>
                <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1">CURRENT LEVEL</p>
                <p className="text-3xl font-black text-white italic uppercase tracking-tighter">Level {profile?.level || 1}</p>
              </div>
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Star size={24} className="text-amber-500" fill="currentColor" />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-cyan-500/30 transition-all">
              <div>
                <p className="text-[9px] font-black text-zinc-500 tracking-widest mb-1">SYSTEM AUTH</p>
                <p className="text-xl font-black text-white italic tracking-tighter">VERIFIED OPERATOR</p>
              </div>
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                <Shield size={24} className="text-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 📂 SECTION 3: PROTOCOL HISTORY */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black italic uppercase tracking-[0.4em] flex items-center gap-3 text-white">
              <History size={18} className="text-cyan-500" /> Protocol History
            </h2>
            <span className="text-[8px] font-black text-zinc-600 tracking-widest uppercase italic">Showing last 6 executions</span>
          </div>
          
          <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-md shadow-2xl">
             {logs.length > 0 ? (
               <div className="divide-y divide-white/5">
                 {logs.map((log) => (
                   <div key={log.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 text-zinc-600 group-hover:text-cyan-500 group-hover:border-cyan-500/20 transition-all">
                           <Database size={18} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-zinc-300 uppercase tracking-tight group-hover:text-white transition-colors">{log.task}</p>
                           <p className="text-[8px] font-black text-zinc-600 mt-1 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-cyan-500 italic tracking-tighter">{log.cost} XP</p>
                        <button className="text-[7px] font-black text-zinc-700 hover:text-cyan-400 mt-1 transition-colors uppercase flex items-center gap-1 ml-auto">
                          Details <ChevronRight size={8} />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-20 text-center flex flex-col items-center gap-4 opacity-20">
                 <FileText size={40} />
                 <p className="text-[10px] font-black uppercase tracking-[0.5em]">No protocols initiated yet.</p>
               </div>
             )}
          </div>
        </div>

        {/* 🏢 FOOTER BRANDING */}
        <footer className="pt-20 pb-10 flex flex-col items-center gap-6">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="text-center space-y-3">
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 italic">
               Aurelius Sentinel <span className="text-cyan-500/50">Production Interface</span>
             </p>
             <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">
               © 2026 Developed by <span className="text-zinc-500 hover:text-white transition-colors cursor-pointer">komsin.com</span>
             </p>
          </div>
        </footer>

      </main>
    </div>
  );
}