'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Printer, Download, Search, Clock, 
  CheckCircle2, AlertCircle, ArrowLeft, RefreshCw,
  Activity, ShieldCheck, Package, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MasterOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    fetchOrders();

    // 🛰️ Real-time Sync: เมื่อมีการ Unlock ภาพใหม่ รายการจะเด้งขึ้นทันที
    const channel = supabase
      .channel('production-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'artworks' }, 
        () => fetchOrders()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        id, created_at, upscaled_url, is_master_unlocked,
        profiles:user_id ( full_name )
      `)
      .eq('is_master_unlocked', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
      setStats({
        total: data.length,
        pending: data.length // คุณสามารถเพิ่มเงื่อนไข status เพิ่มเติมได้ในอนาคต
      });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-10 font-sans selection:bg-orange-500/30">
      
      {/* 🧭 NAVIGATION & COMMAND CENTER HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
          <Link href="/studio-pod/connect" className="group w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">Production Queue</h1>
              {/* 🟢 ONLINE STATUS INDICATOR */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">Node Online</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold tracking-[0.4em] uppercase">Aurelius X • Operations Control • By komsin.com</p>
          </div>
        </div>

        {/* 📊 MINI STATS PANEL */}
        <div className="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
          <div className="px-4 flex flex-col items-center">
             <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Assets</span>
             <span className="text-xl font-black italic text-white leading-none">{stats.total}</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <button onClick={fetchOrders} className="p-3 bg-zinc-800 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-500 group">
            <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} group-hover:rotate-180`} />
          </button>
        </div>
      </header>

      {/* 📦 PRODUCTION LIST */}
      <main className="max-w-7xl mx-auto">
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6 flex gap-6 hover:bg-zinc-900/40 transition-all group relative overflow-hidden">
                
                {/* Master Thumbnail */}
                <div className="relative w-36 h-36 bg-black rounded-[1.5rem] overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                  <img src={order.upscaled_url} className="w-full h-full object-contain p-3" alt="Master Asset" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/50">4000px High-Res</span>
                  </div>
                </div>

                {/* Details Area */}
                <div className="flex flex-col justify-between w-full py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Production Ready</span>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-200">
                          {order.profiles?.full_name || 'Client: Anonymous'}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-700">ID: {order.id.slice(0,8).toUpperCase()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-bold uppercase italic">
                      <Clock size={12} className="text-zinc-700" />
                      {new Date(order.created_at).toLocaleString('th-TH')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <a 
                      href={order.upscaled_url} 
                      target="_blank" 
                      download={`Aurelius_Master_${order.id.slice(0,8)}.png`}
                      className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-2xl text-[10px] font-black uppercase italic hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      <Download size={16} /> Download Master
                    </a>
                    <button className="p-3.5 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-all border border-white/5 group-hover:border-orange-500/30">
                      <Printer size={18} className="text-zinc-400 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Background Decor */}
                <Activity size={120} className="absolute right-[-20px] bottom-[-20px] text-white opacity-[0.02] -rotate-12 pointer-events-none" />
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-48 border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
               <Package size={32} className="text-zinc-700" />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-500 mb-2">Queue is Empty</h3>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Waiting for incoming production requests...</p>
          </div>
        )}
      </main>

      {/* 🛡️ SECURITY FOOTER */}
      <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] italic">
          <ShieldCheck size={14} className="text-green-500" /> Operator Status: Authorized [KOMSIN]
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">© 2026 komsin.com system protocol</p>
      </footer>
    </div>
  );
}