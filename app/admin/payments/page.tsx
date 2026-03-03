'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  CheckCircle, XCircle, Clock, ExternalLink, 
  ShieldAlert, RefreshCw, Eye, Wallet, BarChart3, TrendingUp
} from 'lucide-react';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [summary, setSummary] = useState({ pending_count: 0, approved_count: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. ตรวจสอบสิทธิ์ Admin (เฉพาะคุณคมศิลป์เท่านั้น)
  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profile?.is_admin) {
      setIsAdmin(true);
      fetchData(); // ถ้าเป็นแอดมิน ให้ดึงข้อมูลทันที
    } else {
      router.push('/unauthorized'); // หรือหน้าแจ้งเตือนไม่มีสิทธิ์
    }
  };

  // 2. ดึงข้อมูลทั้งหมด
  const fetchData = async () => {
    setLoading(true);
    
    // ดึงรายการแจ้งโอน
    const { data: reqData } = await supabase
      .from('payment_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (reqData) setRequests(reqData);

    // ดึงยอดสรุปรายได้ (จาก View ที่สร้างไว้)
    const { data: summaryData } = await supabase
      .from('admin_financial_summary')
      .select('*')
      .single();
    
    if (summaryData) setSummary(summaryData);
    
    setLoading(false);
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  // 3. ฟังก์ชันอนุมัติ (ใช้ RPC ที่สร้างไว้ใน Supabase)
  const handleApprove = async (id: string) => {
    if (!confirm("ยืนยันการอนุมัติและเติมแต้มให้ลูกค้า?")) return;
    setProcessingId(id);
    
    const { error } = await supabase.rpc('approve_payment', { request_id: id });
    
    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      fetchData(); // อัปเดตข้อมูลใหม่หลังอนุมัติ
    }
    setProcessingId(null);
  };

  // แสดงหน้า Loading ระหว่างเช็กสิทธิ์
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-500 font-black italic uppercase tracking-widest text-xs">Verifying Admin Protocol...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white p-4 lg:p-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500 font-black text-[10px] uppercase tracking-widest">
            <ShieldAlert size={14} /> Admin Terminal v1.0
          </div>
          <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Financial <br/><span className="text-cyan-500">Summary</span>
          </h1>
        </div>
        <button 
          onClick={fetchData} 
          className="p-4 bg-zinc-900 rounded-full hover:bg-white hover:text-black transition-all shadow-lg shadow-cyan-500/5"
        >
          <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* STATS CARDS (สรุปรายได้) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-gradient-to-br from-cyan-500/20 to-zinc-900/40 border border-cyan-500/30 p-8 rounded-[3rem] backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Total Revenue</p>
            <TrendingUp size={16} className="text-cyan-500" />
          </div>
          <h2 className="text-5xl font-black italic tracking-tighter">฿{summary.total_revenue.toLocaleString()}</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">Approved Income by komsin</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem]">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Pending Requests</p>
          <h2 className="text-5xl font-black italic tracking-tighter">{summary.pending_count}</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">Waiting for verification</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem]">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Total Sales</p>
          <h2 className="text-5xl font-black italic tracking-tighter">{summary.approved_count}</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-4 italic">Successfully processed</p>
        </div>
      </div>

      {/* PAYMENT LIST SECTION */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
          <Clock size={20} className="text-cyan-500" /> Recent Transactions
        </h2>
        
        <div className="space-y-4">
          {requests.length === 0 && !loading && (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10 text-zinc-600 font-black italic uppercase">
              No payment history found.
            </div>
          )}

          {requests.map((req) => (
            <div key={req.id} className={`bg-zinc-900/40 border ${req.status === 'pending' ? 'border-cyan-500/40' : 'border-white/5'} p-5 lg:p-8 rounded-[2.5rem] transition-all hover:bg-zinc-900/60`}>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                
                {/* Slip Preview */}
                <div className="relative group w-full lg:w-32 aspect-[3/4] lg:aspect-square shrink-0">
                  <img 
                    src={req.slip_url} 
                    alt="Slip" 
                    className="w-full h-full object-cover rounded-3xl border border-white/10"
                  />
                  <a href={req.slip_url} target="_blank" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-3xl">
                    <Eye size={24} className="text-cyan-400" />
                  </a>
                </div>

                {/* Details */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 italic">
                      {new Date(req.created_at).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-white/90 truncate">{req.user_email}</h3>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-[10px] text-zinc-400 font-black italic uppercase tracking-widest border-r border-white/10 pr-4">{req.item_name}</p>
                    <p className="text-[10px] text-cyan-500 font-black italic uppercase tracking-widest">+{req.xp_value.toLocaleString()} XP</p>
                    <p className="text-[10px] text-white font-black italic uppercase tracking-widest">฿{req.amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Approve Button */}
                <div className="w-full lg:w-auto">
                  {req.status === 'pending' ? (
                    <button 
                      onClick={() => handleApprove(req.id)}
                      disabled={processingId === req.id}
                      className="w-full lg:w-40 py-4 bg-cyan-500 text-black rounded-2xl font-black italic uppercase text-[10px] hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {processingId === req.id ? <RefreshCw className="animate-spin" size={14}/> : <><CheckCircle size={14}/> Approve</>}
                    </button>
                  ) : (
                    <div className="flex flex-col items-center opacity-30 italic font-black text-[8px] uppercase tracking-widest text-green-500">
                      <CheckCircle size={28} className="mb-1" />
                      Success
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="max-w-6xl mx-auto mt-20 pb-10 border-t border-white/5 pt-10 text-center">
        <p className="text-[10px] text-zinc-600 font-black italic uppercase tracking-[0.3em]">
          Aurelius Studio Management Terminal &bull; By komsin
        </p>
      </div>
    </div>
  );
}