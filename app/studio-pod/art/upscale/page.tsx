'use client';

import React, { useState } from 'react';
import Upscaler from 'upscaler';
import x2 from '@upscalerjs/esrgan-slim/2x';
import x4 from '@upscalerjs/esrgan-slim/4x';
import { 
  Upload, Zap, Download, Sparkles, RefreshCw, 
  Layers, Maximize, ArrowLeft, Loader2, FileSearch, AlertCircle, Coins
} from 'lucide-react';
import Link from 'next/link';

export default function NeuralMaxFree() {
  const [xp, setXp] = useState(5000); // สมมติค่าเริ่มต้น
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scaleMode, setScaleMode] = useState<2 | 4>(2);
  const [error, setError] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{w: number, h: number, size: string, status: 'safe' | 'heavy' | 'danger'} | null>(null);

  // คำนวณค่าธรรมเนียมตาม Scale
  const fee = scaleMode === 2 ? 50 : 100;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        
        let status: 'safe' | 'heavy' | 'danger' = 'safe';
        if (w > 3000 || h > 3000 || fileSizeMB > 10) status = 'danger';
        else if (w > 1500 || h > 1500 || fileSizeMB > 5) status = 'heavy';

        setFileMeta({ w, h, size: fileSizeMB.toFixed(2), status });
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startUpscale = async () => {
    if (!image) return;

    // 🛡️ เช็ค XP ก่อนเริ่มทำงาน
    if (xp < fee) {
      setError(`INSUFFICIENT XP: ต้องการ ${fee} XP สำหรับการประมวลผลนี้`);
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const upscaler = new Upscaler({ model: scaleMode === 2 ? x2 : x4 });
      
      const upscaled = await upscaler.upscale(image, {
        patchSize: 128,
        padding: 4,
        progress: (p) => setProgress(Math.round(p))
      });
      
      setResult(upscaled);
      // ✅ หัก XP หลังจากประมวลผลสำเร็จ
      setXp(prev => prev - fee);
    } catch (err) {
      console.error(err);
      setError("AI Engine Error: ทรัพยากรเครื่องไม่เพียงพอ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-8 font-mono italic selection:bg-cyan-500/30">
      {/* 🧭 NAVIGATION */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/studio-pod" className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all active:scale-95">
            <ArrowLeft size={18}/>
          </Link>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Neural<span className="text-cyan-500">Max</span></h1>
            <p className="text-[7px] font-black opacity-30 tracking-[0.4em] mt-1 uppercase">AURELIUS NODE v2.5</p>
          </div>
        </div>
        
        {/* 💰 XP DISPLAY */}
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 px-5 py-2 rounded-full border border-cyan-500/30 flex items-center gap-3">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black text-white italic">{xp.toLocaleString()} XP</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* 🖼️ PREVIEW AREA */}
        <div className="aspect-square bg-zinc-900/10 rounded-[4rem] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl group">
          {!image ? (
            <label className="cursor-pointer flex flex-col items-center gap-6 group">
              <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-white/5 group-hover:border-cyan-500 group-hover:bg-cyan-500/5 transition-all">
                <Upload size={30} className="text-zinc-500 group-hover:text-cyan-500"/>
              </div>
              <p className="text-[10px] font-black opacity-30 tracking-[0.5em] group-hover:opacity-100 uppercase">Load Asset</p>
              <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
            </label>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-12">
               <img src={result || image} className={`max-h-full object-contain ${loading ? 'blur-2xl opacity-20' : ''} transition-all duration-700 drop-shadow-2xl`} alt="Preview" />
               {result && <div className="absolute top-8 right-8 bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[9px] font-black shadow-lg shadow-cyan-500/50">RENDER COMPLETE</div>}
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl z-50">
              <Loader2 size={40} className="text-cyan-500 animate-spin mb-4" />
              <p className="text-7xl font-black italic text-white tracking-tighter">{progress}%</p>
              <p className="text-[9px] font-black uppercase tracking-[1em] opacity-40 mt-4 italic">Reconstructing Pixels...</p>
            </div>
          )}
        </div>

        {/* ⚙️ INFO & CONTROL */}
        <div className="text-left space-y-8">
          <header>
            <h2 className="text-8xl font-black italic tracking-tighter leading-[0.8] mb-2 text-white uppercase">Neural</h2>
            <h2 className="text-8xl font-black italic tracking-tighter leading-[0.8] text-cyan-500 uppercase italic">Up-Scale</h2>
          </header>

          {/* 🔍 ANALYSIS CARD */}
          {fileMeta && (
            <div className={`p-6 rounded-[2rem] border transition-all ${fileMeta.status === 'danger' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-4 text-white">
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center gap-2"><FileSearch size={12}/> AI Analysis</p>
                {fileMeta.status === 'danger' && <span className="text-[8px] font-black text-red-500 animate-pulse uppercase italic">! High Latency Risk</span>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-[8px] opacity-30 uppercase text-white font-black">Original</p><p className="text-sm font-black italic text-white">{fileMeta.w}x{fileMeta.h}</p></div>
                <div><p className="text-[8px] opacity-30 uppercase text-white font-black">Target</p><p className="text-sm font-black italic text-cyan-500">{fileMeta.w * scaleMode}x{fileMeta.h * scaleMode}</p></div>
                <div><p className="text-[8px] opacity-30 uppercase text-white font-black">Engine Load</p><p className={`text-sm font-black italic uppercase ${fileMeta.status === 'safe' ? 'text-green-500' : fileMeta.status === 'heavy' ? 'text-yellow-500' : 'text-red-500'}`}>{fileMeta.status}</p></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            {[
              { id: 2, label: 'HD STANDARD', scale: '2X', icon: <Sparkles size={16}/>, cost: 50 },
              { id: 4, label: 'ULTRA SHARP', scale: '4X', icon: <Zap size={16}/>, cost: 100 }
            ].map((m) => (
              <button 
                key={m.id} 
                onClick={() => {setScaleMode(m.id as 2|4); setResult(null); setError(null);}} 
                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-4 active:scale-95 relative overflow-hidden ${scaleMode === m.id ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-white/5 opacity-30 hover:opacity-50'}`}
              >
                <div className={`p-3 rounded-xl ${scaleMode === m.id ? 'bg-cyan-500 text-black' : 'bg-zinc-800'}`}>{m.icon}</div>
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase mb-1">{m.label}</p>
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-black italic">{m.scale}</span>
                    <span className={`text-[10px] font-black italic mb-1 ${scaleMode === m.id ? 'text-cyan-500' : 'text-zinc-500'}`}>{m.cost} XP</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-[1.5rem] flex items-center gap-4 text-red-500 text-[10px] font-black uppercase italic">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button 
            disabled={!image || loading} 
            onClick={result ? () => { const a = document.createElement('a'); a.href = result; a.download = `Aurelius_NeuralMax_${scaleMode}x.png`; a.click(); } : startUpscale}
            className={`w-full py-7 rounded-[2.5rem] font-black italic uppercase tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${result ? 'bg-cyan-500 text-black shadow-cyan-500/30' : 'bg-white text-black hover:bg-cyan-500'}`}
          >
            {result ? <><Download size={20}/> Get Asset</> : loading ? 'Processing...' : `Initialize Upscale (${fee} XP)`}
          </button>
          
          {image && !loading && (
            <button onClick={() => {setImage(null); setFileMeta(null); setResult(null); setError(null);}} className="w-full text-[8px] font-black opacity-20 uppercase tracking-[0.5em] hover:opacity-100 transition-opacity text-white text-center">
              Terminate Process & Clear Cache
            </button>
          )}
        </div>
      </main>

      <footer className="mt-16 text-center opacity-10">
        <p className="text-[8px] font-black tracking-[0.8em] uppercase italic">Engineered for Precision by Komsin - 2026</p>
      </footer>
    </div>
  );
}