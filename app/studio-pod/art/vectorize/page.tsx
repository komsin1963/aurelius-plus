'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// @ts-ignore
import ImageTracer from 'imagetracerjs';
import { supabase } from '@/lib/supabase';
import { 
  Upload, Zap, Download, ArrowLeft, 
  MousePointer2, ShieldCheck, X, Loader2, Sliders
} from 'lucide-react';

export default function VectorizeLab() {
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState(0); 
  const [image, setImage] = useState<string | null>(null);
  const [svgResult, setSvgResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // ⚡ ใหม่: ฟีเจอร์ควบคุมความละเอียด (Simplify Path)
  const [smoothness, setSmoothness] = useState(0.5); 

  const JOB_COST_XP = 50; 

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase.from('profiles').select('neural_energy').eq('id', session.user.id).single();
        if (profile) setXp(profile.neural_energy);
      } else {
        setXp(500); 
      }
    };
    initSession();
  }, []);

  const handleVectorize = async () => {
    if (!image) return;
    if (xp < JOB_COST_XP) {
      alert("พลังงาน XP ของคุณไม่เพียงพอ กรุณาเติมเงินหรือรอรอบแจกฟรีครับ");
      return;
    }

    setIsProcessing(true);

    try {
      // 🎨 ImageTracer Options ที่ปรับตามค่า Smoothness
      // ltres: Linear Tolerance (ยิ่งสูงยิ่งจุดน้อย/เส้นเรียบ)
      // qtres: Quadratic Tolerance
      const options = {
        ltres: smoothness * 2, 
        qtres: smoothness * 3,
        scale: 1,
        strokewidth: 1,
        blurradius: smoothness > 1 ? 1 : 0, // เบลอภาพเล็กน้อยถ้าต้องการความสมูทสูง
      };

      ImageTracer.imageToSVG(
        image,
        async (svgString: string) => {
          setSvgResult(svgString);
          const newXp = xp - JOB_COST_XP;
          setXp(newXp);

          if (user) {
            await supabase.from('profiles').update({ neural_energy: newXp }).eq('id', user.id);
          }
          setIsProcessing(false);
        },
        options // ใช้ Option ที่ปรับแต่งมาแล้ว
      );
    } catch (err) {
      console.error(err);
      alert("Error: ไม่สามารถประมวลผลภาพได้");
      setIsProcessing(false);
    }
  };

  const downloadSVG = () => {
    if (!svgResult) return;
    const blob = new Blob([svgResult], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aurelius_Vector_${Date.now()}.svg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30"
         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      
      {/* 🧭 NAVIGATION */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/studio-pod" className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all active:scale-95">
            <ArrowLeft size={18}/>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Aurelius <span className="text-cyan-500">Vector Lab</span></h1>
            <p className="text-[7px] font-black opacity-30 tracking-[0.4em] mt-1 italic uppercase leading-none">OPERATOR: {user ? user.email.split('@')[0] : 'GUEST'} • BY KOMSIN.COM</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="bg-zinc-950 px-6 py-2.5 rounded-xl border border-cyan-500/20 text-cyan-400 font-black italic text-[10px] tracking-widest uppercase flex items-center gap-2">
              <Zap size={12} fill="currentColor" /> {xp.toLocaleString()} XP
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-16 grid lg:grid-cols-12 gap-16">
        
        {/* 🖼️ VIEWPORT: LEFT */}
        <div className="lg:col-span-7 aspect-square rounded-[3.5rem] border border-white/5 bg-[#08080a] flex items-center justify-center relative overflow-hidden shadow-2xl group transition-all duration-500">
            {!image ? (
               <label className="cursor-pointer flex flex-col items-center gap-5 z-10 group">
                 <div className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-zinc-800 flex items-center justify-center group-hover:border-cyan-500 group-hover:bg-cyan-500/5 transition-all">
                    <Upload size={32} className="text-zinc-700 group-hover:text-cyan-500" />
                 </div>
                 <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] italic text-center">Import Image Asset</p>
                 <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) setImage(URL.createObjectURL(file));
                 }} />
               </label>
            ) : (
              <div className="p-12 h-full w-full flex items-center justify-center z-10">
                 {svgResult ? (
                    <div className="w-full h-full flex flex-col items-center gap-6">
                       <div 
                         className="w-full h-full bg-white rounded-[2rem] overflow-hidden p-8 flex items-center justify-center" 
                         dangerouslySetInnerHTML={{ __html: svgResult }} 
                       />
                       <span className="text-[9px] font-black text-cyan-500 italic tracking-[0.4em] uppercase animate-pulse">Neural Path Generated</span>
                    </div>
                 ) : (
                   <img src={image} className={`max-h-full object-contain ${isProcessing ? 'blur-3xl opacity-20' : ''} transition-all duration-700`} alt="Preview" />
                 )}
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center z-20">
                <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[1em] text-cyan-500 animate-pulse text-center pl-[1em]">Deducting XP & Tracing...</p>
              </div>
            )}

            {image && !isProcessing && (
               <button onClick={() => { setImage(null); setSvgResult(null); }}
                 className="absolute top-8 right-8 p-3 bg-black/50 text-zinc-500 rounded-full hover:text-white border border-white/5 backdrop-blur-md z-30">
                 <X size={20} />
               </button>
            )}
        </div>

        {/* 🛠️ CONTROLS: RIGHT */}
        <div className="lg:col-span-5 space-y-8 text-left py-4">
          <header>
            <h3 className="text-8xl font-black italic uppercase tracking-tighter leading-[0.8] mb-2">NEURAL</h3>
            <h3 className="text-8xl font-black italic uppercase tracking-tighter leading-[0.8] text-cyan-500">TRACING</h3>
          </header>

          {/* ⚡ SIMPLIFY CONTROL PANEL (User Version) */}
          <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 space-y-6 backdrop-blur-sm">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3 text-zinc-400 font-black text-[9px] uppercase italic tracking-widest">
                 <Sliders size={14} className="text-cyan-500" /> Smoothness
               </div>
               <span className="text-[10px] font-black text-cyan-500 italic">{smoothness.toFixed(1)}</span>
            </div>
            
            <input 
              type="range" min="0.1" max="2.0" step="0.1" 
              value={smoothness} 
              onChange={(e) => {setSmoothness(parseFloat(e.target.value)); setSvgResult(null);}}
              className="w-full accent-cyan-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
            />
            
            <div className="flex justify-between text-[8px] font-black uppercase opacity-30 italic">
               <span>Detail</span>
               <span>Smooth</span>
            </div>

            <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black opacity-30 uppercase mb-1 italic">Process Cost</p>
              <p className="text-4xl font-black italic text-white flex items-center gap-3">
                {JOB_COST_XP} <span className="text-[12px] text-cyan-500 font-bold opacity-50 uppercase tracking-widest">XP / IMAGE</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {!svgResult ? (
                <button disabled={!image || isProcessing} onClick={handleVectorize}
                 className="w-full py-8 bg-white text-black rounded-3xl font-black italic uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:bg-zinc-800 disabled:opacity-20">
                 Execute Trace <Zap size={18} fill="currentColor" />
               </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={downloadSVG}
                  className="w-full py-8 bg-cyan-500 text-black rounded-3xl font-black italic uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/20 active:scale-95">
                  <Download size={20} /> Download Asset
                </button>
                <button onClick={() => { setImage(null); setSvgResult(null); }}
                  className="text-center text-[8px] font-black opacity-30 uppercase tracking-[0.5em] italic mt-4 hover:opacity-100 transition-opacity">
                  Trace Another Image
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}