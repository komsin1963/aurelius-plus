'use client';

import React, { useState } from 'react';
import Upscaler from 'upscaler';
import ESRGAN_slim_2x from '@upscalerjs/esrgan-slim/2x';
import ESRGAN_slim_4x from '@upscalerjs/esrgan-slim/4x';
import { Upload, Zap, Download, Maximize2, Layers, FileSearch, AlertCircle } from 'lucide-react';

export default function NeuralMax() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState<2 | 4>(2);
  const [fileMeta, setFileMeta] = useState<{w: number, h: number, size: string, status: 'safe' | 'heavy' | 'danger'} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      const url = URL.createObjectURL(file);
      
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        
        // วิเคราะห์ความเสี่ยง (ถ้ากว้างหรือสูงเกิน 2000px ถือว่าหนักสำหรับ Neural Engine บน Browser)
        let status: 'safe' | 'heavy' | 'danger' = 'safe';
        if (w > 3000 || h > 3000 || fileSizeMB > 10) status = 'danger';
        else if (w > 1500 || h > 1500 || fileSizeMB > 5) status = 'heavy';

        setFileMeta({
          w,
          h,
          size: fileSizeMB.toFixed(2),
          status
        });
        setImage(url);
        setResult(null);
      };
      img.src = url;
    }
  };

  const processNeural = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    try {
      const upscaler = new Upscaler({
        model: scale === 2 ? ESRGAN_slim_2x : ESRGAN_slim_4x
      });

      const upscaledImage = await upscaler.upscale(image, {
        patchSize: 128, 
        padding: 4, 
        progress: (p) => setProgress(Math.round(p * 100))
      });
      setResult(upscaledImage);
    } catch (err) {
      console.error(err);
      alert("Neural Engine Error: เครื่องประมวลผลไม่ไหว ลองลดขนาดภาพก่อนนำเข้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Zap size={18} className="text-black" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">NEURAL<span className="text-cyan-500">MAX</span></h1>
            <p className="text-[7px] font-black opacity-40 tracking-[0.4em]">BY KOMSIN.COM</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-16 grid lg:grid-cols-2 gap-16">
        {/* PREVIEW AREA */}
        <div className="aspect-square rounded-[3rem] border border-white/5 bg-[#08080a] flex items-center justify-center relative overflow-hidden shadow-2xl">
           {!image ? (
             <label className="cursor-pointer flex flex-col items-center gap-4 group">
               <div className="p-6 rounded-full bg-white/5 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 transition-all">
                <Upload size={40} className="opacity-30 group-hover:opacity-100" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest italic opacity-30 group-hover:opacity-100 text-white">Load Raw Asset</p>
               <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
             </label>
           ) : (
             <div className="relative w-full h-full flex items-center justify-center p-8">
               <img src={result || image} className={`max-w-full max-h-full object-contain transition-all duration-700 ${loading ? 'blur-2xl opacity-20 scale-90' : 'scale-100'}`} alt="Preview" />
               <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             </div>
           )}
           
           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
               <p className="text-7xl font-black italic text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">{progress}%</p>
               <p className="text-[10px] font-black tracking-[1em] uppercase opacity-40 mt-4 text-white">Analyzing Pixels...</p>
             </div>
           )}
        </div>

        {/* CONTROLS */}
        <div className="space-y-8">
          <header>
            <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-white">IMAGE <br/><span className="text-cyan-500 text-7xl font-black">MAXIMIZER</span></h3>
          </header>

          {/* FILE INFO CHECKER */}
          {fileMeta && (
            <div className={`p-6 rounded-3xl border ${fileMeta.status === 'danger' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'} transition-all`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center gap-2 text-white">
                  <FileSearch size={12} className="text-cyan-500" /> Source Analysis
                </p>
                {fileMeta.status === 'danger' && (
                  <span className="flex items-center gap-1 text-[8px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full animate-pulse">
                    <AlertCircle size={10} /> HIGH RISK OF CRASH
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[8px] uppercase opacity-30 text-white">Dimensions</p>
                  <p className="text-lg font-black italic text-white">{fileMeta.w} × {fileMeta.h}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase opacity-30 text-white">Weight</p>
                  <p className="text-lg font-black italic text-white">{fileMeta.size} MB</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase opacity-30 text-white">Complexity</p>
                  <p className={`text-lg font-black italic uppercase ${fileMeta.status === 'safe' ? 'text-green-500' : fileMeta.status === 'heavy' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {fileMeta.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
             <p className="text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center gap-2 text-white">
               <Layers size={12} className="text-cyan-500" /> Target Multiplier
             </p>
             <div className="flex gap-4">
                {[2, 4].map((s) => (
                  <button key={s} onClick={() => {setScale(s as 2|4); setResult(null);}} 
                    className={`flex-1 py-5 rounded-2xl border-2 font-black italic transition-all duration-300 ${scale === s ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-white/5 opacity-30 hover:opacity-100 text-white'}`}>
                    {s}X RESOLUTION
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-4">
            <button disabled={!image || loading} onClick={processNeural}
              className="w-full py-6 bg-cyan-500 text-black rounded-2xl font-black italic uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all disabled:opacity-20 group">
              RUN ENGINE <Maximize2 size={18} className="inline ml-2 group-hover:scale-125 transition-transform" />
            </button>

            {result && (
               <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `komsin-upscaled-${scale}x.png`; a.click(); }}
                 className="w-full py-6 bg-white text-black rounded-2xl font-black italic uppercase tracking-[0.3em] hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                 DOWNLOAD PNG <Download size={18} />
               </button>
            )}
            
            {image && !loading && (
              <button onClick={() => {setImage(null); setFileMeta(null); setResult(null);}} className="w-full text-[9px] font-black opacity-20 uppercase tracking-[0.3em] hover:opacity-100 transition-opacity text-white">
                Clear Asset & Reset Engine
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}