'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // ใช้ตัวแปรเดียวกับหน้าอื่นเพื่อความนิ่ง
import { ArrowLeft, Clock, Zap, PlusCircle, LayoutGrid, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TransactionHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setHistory(data);
        if (error) console.error("History Error:", error);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 font-mono italic relative overflow-hidden">
      {/* 🌌 Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-3 mb-10 opacity-40 hover:opacity-100 transition-all text-[10px] uppercase font-black tracking-widest"
        >
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to System
        </button>

        <header className="mb-16 border-l-4 border-cyan-500 pl-8">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">
            NEURAL <span className="text-cyan-500 text-outline-sm">LOGS</span>
          </h1>
          <p className="text-[9px] font-black opacity-30 tracking-[0.4em] uppercase">Transaction & Computing History • By komsin.com</p>
        </header>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-4 p-8 bg-zinc-900/20 rounded-[2rem] border border-white/5">
                <div className="animate-spin text-cyan-500"><Database size={20}/></div>
                <div className="animate-pulse text-zinc-500 text-[10px] font-black uppercase tracking-widest">Accessing Neural Database...</div>
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div 
                key={item.id} 
                className="group bg-zinc-900/20 hover:bg-zinc-900/40 border border-white/5 hover:border-cyan-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex gap-6 items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 ${item.amount < 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'}`}>
                    {item.amount < 0 ? <Zap size={22} fill="currentColor" /> : <PlusCircle size={22} />}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black italic uppercase text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {item.description || 'Neural Processing'}
                    </h4>
                    <div className="flex items-center gap-4">
                      <p className="text-[9px] text-zinc-600 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                        <Clock size={11} /> {new Date(item.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className="text-[7px] bg-white/5 px-2 py-0.5 rounded text-zinc-500 font-black uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                </div>
                <div className={`text-2xl font-black italic tracking-tighter ${item.amount < 0 ? 'text-zinc-400' : 'text-cyan-400'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} <span className="text-[10px] opacity-50 ml-1">XP</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                <LayoutGrid size={40} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-600 italic uppercase font-black text-[10px] tracking-[0.3em]">No records in the neural stream.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}