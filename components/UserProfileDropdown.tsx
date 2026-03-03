'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 👈 ใช้ไฟล์ที่พี่แก้กุญแจแล้ว
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, CreditCard, Shield } from 'lucide-react';

export default function UserProfileDropdown() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ดึงข้อมูล User ปัจจุบัน
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (!user) return null; // ถ้าไม่ได้ Login ก็ไม่ต้องโชว์

  return (
    <div className="relative inline-block text-left">
      {/* 🔘 Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-4 bg-zinc-900/50 border border-white/5 rounded-full hover:border-cyan-500/50 transition-all group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-[10px] font-black italic shadow-lg">
          {user.email?.substring(0, 2).toUpperCase()}
        </div>
        <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest italic">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {/* 📂 Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-56 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-3 border-b border-white/5 mb-2">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Identity Verified</p>
              <p className="text-[11px] font-bold text-white truncate">{user.email}</p>
            </div>

            <button onClick={() => router.push('/studio-pod')} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase italic text-zinc-400 hover:text-cyan-500 hover:bg-white/5 rounded-xl transition-all">
              <Shield size={14} /> My Studio Pod
            </button>

            <button onClick={() => router.push('/billing')} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase italic text-zinc-400 hover:text-cyan-500 hover:bg-white/5 rounded-xl transition-all">
              <CreditCard size={14} /> Billing System
            </button>

            <div className="h-[1px] bg-white/5 my-2" />

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase italic text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}