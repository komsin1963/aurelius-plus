'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Users, ShieldCheck, Activity, Zap, Mail, Calendar, UserCheck } from 'lucide-react';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const ADMIN_EMAIL = 'komplusone@gmail.com';

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        
        // ดึงรายชื่อและข้อมูลจากตาราง profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) setUsers(data);
        setLoading(false);
      } else {
        router.push('/'); 
      }
    };
    checkAdminAndFetchData();
  }, [router]);

  if (!isAdmin) return <div className="bg-[#020203] min-h-screen text-zinc-800 p-10 uppercase font-black italic flex items-center justify-center">Unauthorized Access</div>;

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-16 font-sans italic">
      <div className="max-w-7xl mx-auto">
        
        {/* Header (แบบเดียวกับภาพที่พี่ส่งมา) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-5xl font-black italic uppercase text-cyan-500 tracking-tighter flex items-center gap-4">
              <ShieldCheck size={48} />
              ADMIN <span className="text-white font-light">COMMAND</span>
            </h1>
            <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 uppercase mt-4">Authorized Personnel Only: komsin.com</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/30 px-5 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">System Online</span>
          </div>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Users Card */}
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <Users className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all" size={120} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Total Active Users</p>
            <div className="flex items-end gap-3">
              <span className="text-7xl font-black tracking-tighter">{users.length}</span>
              <span className="text-cyan-500 text-[10px] font-black uppercase mb-3">Accounts</span>
            </div>
          </div>

          {/* Neural Energy Card */}
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Neural Energy Load</p>
            <span className="text-7xl font-black tracking-tighter">98<span className="text-3xl text-zinc-800">%</span></span>
            <div className="mt-4 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[98%] shadow-[0_0_100px_cyan]"></div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-cyan-500/5 border border-cyan-500/10 p-8 rounded-[2.5rem] flex flex-col justify-center">
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all active:scale-95 shadow-xl">
              <Zap size={14} fill="currentColor" />
              Manage Profiles
            </button>
          </div>
        </div>

        {/* User Inventory List (ส่วนที่เพิ่มมาใหม่) */}
        <section className="bg-zinc-900/10 border border-white/5 rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
               <Activity size={16} className="text-cyan-500" />
               Personnel Registry
             </h3>
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Database Sync: Active</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase font-black text-zinc-700 tracking-[0.2em]">
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Access Email</th>
                  <th className="px-8 py-6">Registered On</th>
                  <th className="px-8 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-cyan-500 font-black">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-white uppercase">{u.full_name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <Mail size={12} /> {u.email || 'No Data'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <Calendar size={12} /> {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-lg">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}