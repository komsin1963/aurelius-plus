'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, BarChart3, Search, Zap, 
  Activity, DollarSign, ShieldCheck, 
  Maximize2, Database, Palette, Info
} from 'lucide-react';

export default function PriceEvaluator() {
  const [image, setImage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ size: number; name: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInfo({ size: file.size, name: file.name });
      const reader = new FileReader();
      reader.onload = (f) => setImage(f.target?.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const runAnalysis = () => {
    if (!image || !fileInfo) return;
    setIsAnalyzing(true);
    
    const imgObj = new Image();
    imgObj.src = image;
    
    imgObj.onload = () => {
      // --- 🎨 ระบบวิเคราะห์สี (Color Analysis) ---
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200; 
      canvas.height = 200;
      ctx?.drawImage(imgObj, 0, 0, 200, 200);
      
      const imageData = ctx?.getImageData(0, 0, 200, 200).data;
      const uniqueColors = new Set();
      if (imageData) {
        for (let i = 0; i < imageData.length; i += 4) {
          const a = imageData[i+3];
          if (a > 10) {
            uniqueColors.add(`${imageData[i]},${imageData[i+1]},${imageData[i+2]}`);
          }
        }
      }

      // --- 📊 ข้อมูลทางเทคนิค ---
      const rawMb = fileInfo.size / (1024 * 1024);
      const width = imgObj.width;
      const height = imgObj.height;
      const totalPixels = width * height;
      const colorCount = uniqueColors.size;

      // --- ⚖️ Logic ประเมินราคา (Aurelius Scoring) ---
      let score = 0;
      if (rawMb >= 80) score += 40; // มาตรฐาน 92MB ของคุณ
      else if (rawMb >= 40) score += 20;

      if (totalPixels >= 24000000) score += 30; // มาตรฐาน 4500x5400
      else if (totalPixels >= 12000000) score += 15;

      if (colorCount > 1000) score += 30; // งานสีซับซ้อน/Graffiti เงาเยอะ
      else if (colorCount > 100) score += 15;
      else score += 5;

      let price = 2;
      let tier = "ESSENTIAL";
      if (score >= 80) { price = 6; tier = "MASTER BUNDLE"; }
      else if (score >= 45) { price = 3; tier = "PRODUCTION PRO"; }

      setResult({
        mb: rawMb.toFixed(1),
        resolution: `${width} x ${height}`,
        colors: colorCount.toLocaleString(),
        tier,
        price,
        recommendation: colorCount > 500 ? "High Complexity / Multi-color Asset" : "Clean Line / Minimalist Asset"
      });
      setIsAnalyzing(false);
    };
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-8 font-mono italic">
      <div className="max-w-6xl mx-auto">
        
        {/* NAV */}
        <nav className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <Link href="/studio-suite" className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all">
              <ArrowLeft size={18}/>
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                <BarChart3 className="text-cyan-500" /> Price <span className="text-cyan-500">Evaluator</span>
              </h1>
              <p className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mt-1 italic">Asset Value Analysis // By Komsin</p>
            </div>
          </div>
          <div className="hidden md:block bg-zinc-900 px-4 py-2 rounded-full border border-white/5 text-[8px] opacity-50 tracking-widest uppercase">
            Pricing Engine 2.0 Active
          </div>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: PREVIEW */}
          <div className="lg:col-span-7">
            <div className="aspect-square bg-zinc-900/10 rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
              {!image ? (
                <label className="cursor-pointer flex flex-col items-center gap-4 group">
                  <div className="p-10 bg-black rounded-[2rem] border border-white/5 group-hover:border-cyan-500 transition-all transform group-hover:-rotate-3">
                    <Search size={40} className="text-zinc-800 group-hover:text-cyan-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Load Production Asset</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              ) : (
                <div className="w-full h-full p-12 flex items-center justify-center relative">
                   <img src={image} className="max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                   {isAnalyzing && (
                     <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center z-50">
                        <Activity size={40} className="text-cyan-500 animate-spin mb-4" />
                        <span className="text-xl font-black italic tracking-tighter text-cyan-500 animate-pulse">EVALUATING DATA...</span>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: REPORT */}
          <div className="lg:col-span-5 space-y-6">
            <header className="mb-8">
              <h2 className="text-7xl font-black italic tracking-tighter leading-none mb-1 uppercase">Price</h2>
              <h2 className="text-7xl font-black italic tracking-tighter leading-none text-cyan-500 uppercase">Analysis</h2>
            </header>

            {!result ? (
              <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] space-y-6">
                 <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                    ระบบจะวิเคราะห์คุณภาพจากเนื้อไฟล์จริง (Raw Byte, Pixel Dimension, Color Shades) เพื่อจัดเข้า Tier $2, $3 หรือ $6
                 </p>
                 <button 
                  disabled={!image || isAnalyzing}
                  onClick={runAnalysis}
                  className="w-full py-6 bg-white text-black rounded-2xl font-black italic uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all disabled:opacity-20">
                   Start Analysis <Zap size={16} fill="currentColor" />
                 </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                {/* SUGGESTED PRICE */}
                <div className="p-10 bg-cyan-500/5 border border-cyan-500/20 rounded-[3rem]">
                   <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mb-4 italic flex items-center gap-2">
                     <DollarSign size={10} /> Recommended Market Price
                   </p>
                   <div className="flex items-baseline gap-2">
                      <h3 className="text-[120px] font-black italic tracking-tighter leading-none">${result.price}</h3>
                      <span className="text-xl font-black text-cyan-500 uppercase italic tracking-tighter">{result.tier}</span>
                   </div>
                </div>

                {/* TECH CARDS */}
                <div className="grid grid-cols-2 gap-4">
                  <StatItem icon={<Database size={12}/>} label="Raw Weight" value={`${result.mb} MB`} />
                  <StatItem icon={<Maximize2 size={12}/>} label="Resolution" value={result.resolution} />
                  <StatItem icon={<Palette size={12}/>} label="Color Depth" value={`${result.colors} Shades`} />
                  <StatItem icon={<ShieldCheck size={12}/>} label="License" value="Standard Com." />
                </div>

                <div className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5 flex items-start gap-4">
                   <Info size={14} className="text-cyan-500 mt-1 shrink-0" />
                   <p className="text-[9px] text-zinc-500 uppercase font-black leading-relaxed italic">
                     {result.recommendation}
                   </p>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => {setImage(null); setResult(null);}} className="p-6 bg-white/5 rounded-2xl text-zinc-500 hover:text-white border border-white/5 transition-all">
                     <ArrowLeft size={20} />
                   </button>
                   <button className="flex-1 py-6 bg-cyan-500 text-black rounded-2xl font-black italic uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cyan-400 shadow-xl shadow-cyan-500/20">
                     Confirm & Upload <ShieldCheck size={18} />
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
      <div className="flex items-center gap-2 text-[7px] text-zinc-600 font-black uppercase mb-2 tracking-widest">
        {icon} {label}
      </div>
      <div className="text-xs font-black italic text-white tracking-tighter truncate">{value}</div>
    </div>
  );
}