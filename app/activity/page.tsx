'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  History, ArrowLeft, Search, Filter, 
  Download, Database, Zap, Clock, 
  ChevronRight, ExternalLink, RefreshCw, 
  CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-zinc-300 p-4 md:p-12 font-sans selection:bg-cyan-500/30 uppercase italic">
      <main className="max-w-5xl mx-auto space-y-12">
        
        {/* 🛰️ HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-[9px] font-black text-zinc-600 hover:text-cyan-500 transition-all tracking-[0.4em] mb-4">
              <ArrowLeft size={12} /> RETURN TO COMMANDER
            </Link>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              Activity <span className="text-cyan-500">Logs</span>
            </h1>
            <p className="text-[10px] font-black text-zinc-700 tracking-[0.5em] mt-3">NEURAL CORE TRANSACTION LEDGER</p>
          </div>

          <div className="flex flex-wrap gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="SEARCH PROTOCOL..." 
                  className="bg-zinc-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all w-64"
                />
             </div>
             <button onClick={fetchLogs} className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
        </div>

        {/* 📑 LOGS CONTAINER */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black tracking-[0.5em] text-zinc-700 animate-pulse">Syncing Database...</p>
            </div>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="group bg-zinc-900/20 border border-white/5 hover:border-cyan-500/30 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-8 flex-1">
                  {/* Icon Status */}
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 
                    ${log.cost < 0 
                      ? 'bg-red-500/5 border-red-500/10 text-red-500 group-hover:bg-red-500/10' 
                      : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/10'}`}>
                    {log.cost < 0 ? <Zap size={24} /> : <Download size={24} />}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <span className={`text-[8px] font-black px-3 py-1 rounded-full tracking-widest 
                         ${log.cost < 0 ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                         {log.cost < 0 ? 'OUTGOING_PROTOCOL' : 'INCOMING_DATA'}
                       </span>
                       <span className="text-zinc-700 text-[8px] font-black tracking-widest">#{log.id.slice(0, 8)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{log.task}</h4>
                    <div className="flex items-center gap-4 text-zinc-600 text-[9px] font-bold tracking-widest">
                       <div className="flex items-center gap-1.5"><Clock size={10} /> {new Date(log.created_at).toLocaleString()}</div>
                       <div className="flex items-center gap-1.5"><Database size={10} /> NEURAL_CORE_01</div>
                    </div>
                  </div>
                </div>

                {/* Amount & Action */}
                <div className="flex items-center gap-10">
                   <div className="text-right">
                      <p className={`text-2xl font-black italic tracking-tighter ${log.cost < 0 ? 'text-zinc-400' : 'text-cyan-500'}`}>
                        {log.cost > 0 ? `+${log.cost.toLocaleString()}` : log.cost.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-zinc-700 tracking-widest mt-1">XP ENERGY UNITS</p>
                   </div>
                   <button className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-cyan-500 hover:text-black transition-all">
                      <ExternalLink size={16} />
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20">
               <FileText size={48} className="mx-auto mb-6" />
               <p className="text-[10px] font-black tracking-[1em]">NO LOGS DETECTED IN HISTORY</p>
            </div>
          )}
        </div>

        {/* 🏢 FOOTER */}
        <footer className="pt-20 pb-12 flex flex-col items-center gap-8">
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="text-center space-y-3">
             <p className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-700 italic">
               Aurelius Studio <span className="text-cyan-500/40">Ledger Subsystem</span>
             </p>
             <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">
               BY <span className="text-zinc-600">KOMSIN.COM</span> • 2026 PROTOCOL
             </p>
          </div>
        </footer>

      </main>
    </div>
  );
}