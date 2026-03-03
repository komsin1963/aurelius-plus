'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, Mail, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // สลับหน้า Login / Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // 🔓 LOGIN
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('ACCESS GRANTED');
        router.push('/studio-pod'); // Login เสร็จไป Studio Pod
      }
    } else {
      // 📝 SIGN UP
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('REGISTER SUCCESS! PLEASE CHECK EMAIL');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-zinc-900/50 p-10 rounded-[3rem] border border-white/5 text-center backdrop-blur-xl">
        <Zap size={40} className="mx-auto text-cyan-500 mb-6" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
          {isLogin ? 'SYSTEM ACCESS' : 'CREATE IDENTITY'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-zinc-600" size={18} />
            <input 
              type="email" placeholder="EMAIL ADDRESS" 
              className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 outline-none focus:border-cyan-500 transition-all text-xs font-bold"
              onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-5 text-zinc-600" size={18} />
            <input 
              type="password" placeholder="PASSWORD" 
              className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 pl-14 outline-none focus:border-cyan-500 transition-all text-xs font-bold"
              onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic hover:bg-cyan-500 transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'ESTABLISH LINK' : 'INITIALIZE PROTOCOL')}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white"
        >
          {isLogin ? "Need an Account? Initialize here" : "Already have Identity? Access here"}
        </button>
      </div>
    </div>
  );
}