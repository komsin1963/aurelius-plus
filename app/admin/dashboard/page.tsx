'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, DollarSign, Download, 
  TrendingUp, Users, ArrowUpRight, 
  Zap, Eye, Calendar, ChevronRight,
  Lock, ShieldAlert, KeyRound, Loader2, Timer, Fingerprint,
  CreditCard, Package
} from 'lucide-react';

// ==========================================
// 1. ส่วนหน้าแดชบอร์ดสถิติ (ADMIN DASHBOARD)
// ==========================================
function AdminDashboard() {
  const [stats] = useState({
    monthlyVisits: 12400,
    totalRevenue: 45250.00,
    totalRecharge: 28400,
    activeUsers: 856
  });

  const monthlyData = [
    { month: 'JAN', revenue: 32000, visits: 8000 },
    { month: 'FEB', revenue: 38000, visits: 10500 },
    { month: 'MAR', revenue: 45250, visits: 12400 },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-10 font-sans italic animate-in fade-in duration-700">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">
            CORE <span className="text-cyan-500 italic">CONTROL</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-zinc-500 text-[8px] tracking-[0.4em] uppercase font-black">System Live / Analytics v4.0</p>
          </div>
        </div>
        <div className="flex gap-3 text-[9px] font-black uppercase">
          <div className="bg-zinc-900 border border-white/5 px-6 py-3 rounded-xl flex items-center gap-2">
            <Calendar size={14} /> March 2026
          </div>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 text-left">
        <StatCard title="Visits" value={stats.monthlyVisits.toLocaleString()} icon={<Eye size={20} />} trend="+14.2%" color="text-purple-500" />
        <StatCard title="Recharge" value={`฿${stats.totalRecharge.toLocaleString()}`} icon={<Zap size={20} />} trend="+8.5%" color="text-yellow-500" />
        <StatCard title="Revenue" value={`฿${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+22.1%" color="text-cyan-500" />
        <StatCard title="Users" value={stats.activeUsers.toLocaleString()} icon={<Users size={20} />} trend="+42" color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CHART */}
        <section className="lg:col-span-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase italic">Performance</h2>
            <div className="flex gap-4 text-[8px] font-black uppercase">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Revenue</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-700"></span> Visits</div>
            </div>
          </div>
          <div className="h-[250px] flex items-end justify-around gap-4 px-4">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex justify-center items-end gap-1 h-[200px]">
                  <div style={{ height: `${(d.visits/15000)*100}%` }} className="w-4 bg-zinc-800 rounded-t-lg transition-all group-hover:bg-zinc-700"></div>
                  <div style={{ height: `${(d.revenue/50000)*100}%` }} className="w-4 bg-cyan-500 rounded-t-lg transition-all group-hover:bg-white"></div>
                </div>
                <p className="mt-4 text-[9px] font-black text-zinc-600 uppercase">{d.month}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT FEED */}
        <section className="lg:col-span-4 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 text-left">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {[
              { user: 'Komsin Admin', action: 'Recharge 5,000 XP', amount: '+ ฿500.00' },
              { user: 'User_9921', action: 'Premium Pass', amount: '+ ฿1,200.00' },
              { user: 'Anon_Alpha', action: 'Recharge 1,000 XP', amount: '+ ฿120.00' },
            ].map((t, idx) => (
              <div key={idx} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                <div>
                  <p className="text-[9px] font-black uppercase">{t.user}</p>
                  <p className="text-[8px] text-zinc-500 italic uppercase">{t.action}</p>
                </div>
                <p className="text-[9px] font-black text-green-500">{t.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-zinc-900/40 transition-all">
      <div className={`absolute -right-2 -top-2 p-8 opacity-5 group-hover:opacity-20 transition-all ${color}`}>{icon}</div>
      <p className="text-[9px] font-black text-zinc-500 tracking-[0.2em] uppercase mb-2 italic">{title}</p>
      <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
      <div className="flex items-center gap-1.5 mt-3">
        <ArrowUpRight size={10} className="text-green-500" />
        <span className="text-[8px] font-black text-green-500 uppercase">{trend}</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. ส่วนหน้าด่านตรวจรหัส (ADMIN GATE)
// ==========================================
export default function AdminSecretGate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const MASTER_KEY = "2026"; 
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 30;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTime > 0) {
      interval = setInterval(() => setLockTime((prev) => prev - 1), 1000);
    } else if (lockTime === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTime]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError(false);

    setTimeout(() => {
      if (pin === MASTER_KEY) {
        setIsAuthenticated(true);
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setError(true);
        setPin('');
        setLoading(false);
        if (nextAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setLockTime(LOCK_DURATION);
        }
      }
    }, 800);
  };

  // ✅ เมื่อผ่านรหัสแล้ว จะคืนค่า Component Dashboard
  if (isAuthenticated) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 font-sans italic selection:bg-cyan-500">
      <div className="w-full max-w-md relative">
        <div className={`bg-zinc-900/40 border ${isLocked ? 'border-orange-500/50' : error ? 'border-red-500/50' : 'border-white/5'} backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl transition-all duration-500`}>
          
          <div className="flex flex-col items-center mb-10">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 ${isLocked ? 'bg-orange-500' : error ? 'bg-red-500' : 'bg-white text-black'}`}>
              {isLocked ? <Timer size={32} /> : loading ? <Loader2 className="animate-spin" size={32} /> : <Fingerprint size={32} />}
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">AURELIUS <span className="text-cyan-500 text-xl">CONTROL</span></h1>
            <p className="text-[8px] font-black text-zinc-500 tracking-[0.4em] uppercase mt-2">
              {isLocked ? `LOCKED: ${lockTime}S` : `SECURITY CHECK: ${attempts}/${MAX_ATTEMPTS}`}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6 text-left">
            <input 
              disabled={isLocked || loading}
              type="password"
              placeholder={isLocked ? "WAIT FOR UNLOCK" : "••••"}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.8em] text-cyan-500 focus:outline-none focus:border-cyan-500 transition-all placeholder:tracking-normal placeholder:text-sm"
            />
            <button 
              disabled={loading || pin.length < 4 || isLocked}
              className={`w-full py-6 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${isLocked ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black hover:bg-cyan-500'}`}
            >
              {isLocked ? `LOCKED (${lockTime}S)` : loading ? 'CHECKING...' : 'LOGIN SYSTEM'}
            </button>
          </form>

          {error && !isLocked && (
            <p className="text-center text-red-500 text-[9px] font-black uppercase mt-6 tracking-widest animate-pulse">Access Denied: Invalid Key</p>
          )}
        </div>
        <p className="mt-8 text-center text-[7px] font-black text-zinc-800 tracking-[0.5em] uppercase italic">Secure Node / komsin.com</p>
      </div>
    </div>
  );
}