'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Eye, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AdminTerminal() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase.from('payment_requests').select('*').order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (req: any) => {
    try {
      // 1. ดึงและเติม XP
      const { data: profile } = await supabase.from('profiles').select('neural_energy').eq('id', req.user_id).single();
      const newXP = (profile?.neural_energy || 0) + req.xp_value;

      await supabase.from('profiles').update({ neural_energy: newXP }).eq('id', req.user_id);
      // 2. อัปเดตสถานะเป็นสำเร็จ
      await supabase.from('payment_requests').update({ status: 'completed' }).eq('id', req.id);

      alert(`เติม XP ให้คุณ ${req.user_email} เรียบร้อย!`);
      fetchRequests();
    } catch (e) { alert("เกิดข้อผิดพลาด"); }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-400 p-8 font-mono">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-8">
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Payment <span className="text-cyan-500">Terminal</span></h1>
        <button onClick={fetchRequests} className={`p-3 bg-white/5 rounded-full hover:bg-white/10 ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={20}/>
        </button>
      </header>

      <div className="max-w-7xl mx-auto space-y-4">
        {requests.length > 0 ? requests.map((req) => (
          <div key={req.id} className={`bg-zinc-900/50 border ${req.status === 'completed' ? 'border-green-500/20' : 'border-white/5'} p-8 rounded-[2rem] flex items-center justify-between`}>
            <div className="flex items-center gap-6">
              <div className="p-4 bg-cyan-500/10 text-cyan-500 rounded-2xl"><User size={24}/></div>
              <div>
                <p className="text-white text-sm font-bold italic">{req.user_email}</p>
                <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest">{req.item_name} (+{req.xp_value.toLocaleString()} XP)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={req.slip_url} target="_blank" className="text-[10px] font-black uppercase italic bg-white/5 px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all">View Slip</a>
              {req.status === 'pending' ? (
                <button onClick={() => handleApprove(req)} className="bg-cyan-500 text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase italic">Approve</button>
              ) : (
                <div className="text-green-500 text-[10px] font-black uppercase italic border border-green-500/20 px-8 py-3 rounded-xl bg-green-500/5 flex items-center gap-2"><CheckCircle size={14}/> Completed</div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-[3rem]">
            <ShieldAlert size={40} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-[10px] font-black uppercase italic text-zinc-700 tracking-[0.4em]">Ready for new protocols</p>
          </div>
        )}
      </div>
    </div>
  );
}