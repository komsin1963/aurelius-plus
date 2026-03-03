'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Zap, 
  LogOut, 
  Shield, 
  ChevronRight,
  Loader2,
  Cpu,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };
    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- 🚀 Ultra-Slim Glass Sidebar (แก้ปัญหาบังจอ) --- */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 w-16 md:w-20 h-[60vh] bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl rounded-[3rem] flex flex-col items-center py-8 z-50 transition-all duration-500 hover:w-24 hover:bg-white/[0.05] group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="mb-10">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <Cpu size={20} className="text-black" />
          </div>
        </div>
        
        <nav className="flex-1 space-y-6 flex flex-col items-center w-full px-2">
          <Link href="/dashboard" className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group/icon transition-all relative">
            <LayoutDashboard size={20} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-cyan-500 text-black text-[10px] font-black rounded opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none uppercase italic">Overview</span>
          </Link>
          <Link href="/redeem" className="p-3 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all group/icon relative">
            <Zap size={20} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-black rounded opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none uppercase italic">Redeem</span>
          </Link>
        </nav>

        <button onClick={handleLogout} className="p-3 rounded-2xl text-zinc-700 hover:text-rose-500 hover:bg-rose-500/5 transition-all group/icon relative">
          <LogOut size={20} />
          <span className="absolute left-full ml-4 px-2 py-1 bg-rose-500 text-white text-[10px] font-black rounded opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none uppercase italic">Eject</span>
        </button>
      </aside>

      {/* --- 🌊 Main Content (ขยับระยะขอบใหม่ให้อ่านง่ายขึ้น) --- */}
      <main className="pl-28 md:pl-40 lg:pl-52 min-h-screen p-8 md:p-12 lg:p-20 relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4 opacity-70">
              <Activity size={14} className="text-cyan-500" />
              <p className="text-[10px] font-black text-cyan-500 tracking-[0.5em] uppercase">Core Interface v2.5</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
              NEURAL<span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">LINK</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 bg-white/[0.02] border border-white/[0.05] p-3 pr-10 rounded-full backdrop-blur-xl hover:bg-white/[0.05] transition-all cursor-default group">
             <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-black rounded-full border border-white/10 flex items-center justify-center font-black text-xl text-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
               {profile?.full_name?.charAt(0) || 'K'}
             </div>
             <div>
               <p className="text-[9px] font-black text-zinc-500 tracking-widest uppercase mb-1">Authenticated</p>
               <p className="text-lg font-black italic tracking-tight">{profile?.full_name || 'Komsin Studio'}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* XP Main Card */}
          <div className="xl:col-span-2 relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 to-blue-600/50 rounded-[4rem] opacity-10 group-hover:opacity-30 transition duration-700 blur-sm"></div>
            <div className="relative bg-[#050508]/60 border border-white/10 p-10 md:p-16 rounded-[4rem] overflow-hidden backdrop-blur-md">
              
              <div className="flex justify-between items-start mb-20">
                 <div className="px-5 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    <p className="text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase">Access Level: Admin</p>
                 </div>
                 <Shield size={24} className="text-zinc-800 group-hover:text-cyan-500 transition-colors duration-500" />
              </div>

              <div className="relative z-10">
                <p className="text-[12px] font-black text-zinc-500 tracking-[0.7em] mb-8 uppercase italic">Neural Energy Balance</p>
                <div className="flex flex-wrap items-baseline gap-6 mb-12">
                  <span className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {(profile?.neural_energy || 0).toLocaleString()}
                  </span>
                  <span className="text-3xl font-black text-cyan-500 italic tracking-widest">XP</span>
                </div>
                
                <div className="space-y-4 max-w-xl">
                  <div className="flex justify-between text-[11px] font-black tracking-[0.3em] uppercase text-zinc-500">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div> System Stability</span>
                    <span className="text-cyan-400">Online</span>
                  </div>
                  <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[94%] shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="space-y-8">
            <Link href="/redeem" className="block group">
              <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] hover:bg-cyan-500 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <Zap size={80} className="text-white" />
                </div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-black transition-all">
                    <Zap size={28} />
                  </div>
                  <ChevronRight className="text-zinc-700 group-hover:text-black transition-all" />
                </div>
                <h4 className="text-2xl font-black italic uppercase group-hover:text-black transition-all relative z-10">Recharge</h4>
                <p className="text-[10px] font-black text-zinc-500 mt-2 uppercase tracking-widest group-hover:text-black/60 transition-all relative z-10 italic">Protocol: Neural_Boost</p>
              </div>
            </Link>

            <div className="bg-white/[0.01] border border-white/[0.05] p-10 rounded-[3rem] backdrop-blur-sm">
              <h4 className="text-[10px] font-black text-zinc-600 tracking-[0.5em] mb-8 uppercase italic border-b border-white/5 pb-4">Operator Logs</h4>
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                   <p className="text-[9px] font-black text-zinc-700 uppercase">Last Synchronization</p>
                   <p className="text-[11px] font-bold text-zinc-400 italic">02/03/2026 - SUCCESS</p>
                </div>
                <div className="flex flex-col gap-1">
                   <p className="text-[9px] font-black text-zinc-700 uppercase">Core Status</p>
                   <p className="text-[11px] font-bold text-cyan-500/80 italic animate-pulse">ACTIVE_RESONANCE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}