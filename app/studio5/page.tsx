'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Loader2, Zap, LayoutGrid, ArrowUpRight, ShieldCheck, Cpu, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Studio5Page() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [recentWorks, setRecentWorks] = useState<any[]>([]);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();
      if (profile) setCredits(profile.credits || 0);
      fetchRecentWorks(user.id);
    }
  };

  const fetchRecentWorks = async (userId: string) => {
    const { data, error } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(4);
    if (!error) setRecentWorks(data || []);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleGenerate = async () => {
    if (credits <= 0) {
      alert("เครดิตของคุณหมดแล้ว กรุณาเติมพลังงาน XP เพื่อใช้งานต่อ");
      return;
    }

    setLoading(true);
    try {
      // 1. เรียกใช้งาน AI API (Replicate)
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const prediction = await response.json();
      if (response.status !== 201) throw new Error(prediction.detail);

      // 2. รอผลลัพธ์จาก AI (Polling)
      let result = prediction;
      while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await fetch("/api/predictions/" + result.id);
        result = await res.json();
      }

      if (result.status === "succeeded") {
        const generatedUrl = result.output[result.output.length - 1];

        // 3. หักเครดิตในฐานข้อมูล
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: credits - 1 })
          .eq('id', user.id);
        
        if (updateError) throw updateError;

        // 4. บันทึกลงตาราง usage_logs
        await supabase.from('usage_logs').insert([{
          user_id: user.id,
          prompt: prompt,
          image_url: generatedUrl,
          details: "Aurelius Studio 5 Engine",
        }]);

        setCredits(prev => prev - 1);
        setResultImage(generatedUrl);
        fetchRecentWorks(user.id);
      } else {
        alert("การประมวลผลล้มเหลว กรุณาลองใหม่อีกครั้ง");
      }
      
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในระบบ Neural Engine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Brand */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowUpRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-[225deg]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        {/* Header & Credit Display */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
              Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">5</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Engine v5.0 Active • By komsin</p>
          </div>

          <div className="bg-[#0b0b12] p-6 rounded-[2rem] flex items-center gap-6 border border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Power XP</span>
              <span className="text-3xl font-black italic text-cyan-400">{credits}</span>
            </div>
            <Link href="/recharge" className="p-4 bg-cyan-500 text-black rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Zap size={18} fill="currentColor" />
            </Link>
          </div>
        </div>

        {/* Main Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-7 space-y-8">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision (e.g. A futuristic city by komsin style)..."
              className="w-full h-72 bg-[#0b0b12] border border-white/10 rounded-[3rem] p-10 text-xl focus:border-cyan-500/50 transition-all resize-none placeholder:text-slate-800"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all disabled:opacity-20 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Cpu size={20} />
                  <span>Ignite Generation Core</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#0b0b12] border border-white/10 rounded-[3.5rem] aspect-square flex items-center justify-center overflow-hidden shadow-2xl relative">
              {resultImage ? (
                <img src={resultImage} className="w-full h-full object-cover animate-in zoom-in duration-700" alt="Result" />
              ) : (
                <div className="text-center space-y-4">
                  <ImageIcon className="text-slate-900 mx-auto" size={80} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Awaiting Neural Input</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                   <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest">Rendering...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Works Section */}
        <div className="space-y-10 border-t border-white/5 pt-16">
          <h2 className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Recent Masterpieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recentWorks.length > 0 ? recentWorks.map((work) => (
              <div key={work.id} className="group relative aspect-square bg-[#0b0b12] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-lg">
                <img src={work.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" alt="Past work" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                   <p className="text-[8px] font-bold uppercase truncate text-cyan-400">{work.prompt}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 border border-dashed border-white/5 rounded-[2.5rem] text-center text-slate-700 font-black uppercase tracking-widest text-xs">
                Your gallery is empty
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
            Aurelius Studio Intelligence • Developed By komsin
          </p>
        </footer>
      </div>
    </div>
  );
}