'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import { 
  Upload, Layers, Palette, RefreshCcw, Save, Loader2, Zap, Info, ChevronRight 
} from 'lucide-react';

export default function ReduceColorPage() {
  const searchParams = useSearchParams();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [isMonotone, setIsMonotone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colorsFromURL = searchParams.get('colors');
    if (colorsFromURL) {
      const colorArray = colorsFromURL.split(',').map(c => `#${c}`);
      setActiveColors(colorArray);
    }
  }, [searchParams]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!sourceImage) return alert("Please upload an image first.");
    setIsProcessing(true);
    // Algorithm logic placeholder
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const handleSave = async () => {
    if (!previewRef.current) return;
    
    const confirmSave = confirm("Confirm saving artwork? This will consume 50 XP.");
    if (!confirmSave) return;

    setIsSaving(true);
    try {
      const dataUrl = await toPng(previewRef.current, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `AURELIUS-PRINT-4C-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      // ตรงนี้คือจุดที่ระบบจะไปหัก XP ใน Database จริงๆ
      console.log("XP Deducted: 50"); 
    } catch (err) {
      alert("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 md:p-12 italic font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header System */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 text-cyan-500 mb-2">
              <Layers size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Art Engine v2.0</span>
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">
              REDUCE <span className="text-zinc-700">COLOR</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setIsMonotone(!isMonotone)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isMonotone ? 'bg-white text-black' : 'bg-transparent text-zinc-500'}`}>
              Monotone
            </button>
            <button onClick={() => setIsMonotone(false)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${!isMonotone ? 'bg-cyan-500 text-black' : 'bg-transparent text-zinc-500'}`}>
              4-Colors Print
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Image Processing Area */}
          <div className="lg:col-span-7 space-y-6">
            <div ref={previewRef} className="aspect-[4/3] bg-zinc-900/20 rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl group">
              {!sourceImage ? (
                <label className="cursor-pointer flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-cyan-500/10 transition-all">
                    <Upload size={24} className="text-zinc-600 group-hover:text-cyan-500" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Load Source Artwork</span>
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>
              ) : (
                <div className={`relative w-full h-full p-12 transition-all duration-1000 ${isMonotone ? 'grayscale contrast-125' : ''} ${isProcessing ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
                  <img src={sourceImage} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt="Preview" />
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Processing Pigments...</p>
                </div>
              )}

              {/* Identity Tag */}
              <div className="absolute top-8 left-8 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest">System Ready</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setSourceImage(null)} className="px-6 py-4 bg-zinc-900 text-zinc-500 rounded-2xl text-[10px] font-black uppercase hover:text-red-500 transition-colors">Clear</button>
              <button onClick={processImage} className="flex-1 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                <RefreshCcw size={14} /> Re-Compute Algorithm
              </button>
            </div>
          </div>

          {/* Right: Controls & XP Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5 space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-6">
                  <Palette size={14} /> Production Palette (CMYK Optimized)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {activeColors.map((hex, i) => (
                    <div key={i} className="bg-black/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl" style={{backgroundColor: hex}} />
                      <span className="text-sm font-mono font-bold">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                      <Zap size={18} className="text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tight">Export Protocol</p>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase">High-Res Print Ready</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white italic">-50 XP</p>
                    <p className="text-[7px] font-bold text-cyan-500 uppercase tracking-widest">Service Fee</p>
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving || !sourceImage}
                  className="w-full py-6 bg-white text-black rounded-[1.5rem] font-black text-[12px] uppercase italic flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all shadow-xl active:scale-95 disabled:opacity-30"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? 'Authenticating...' : 'Save & Deduct XP'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <div className="flex gap-4">
                <Info size={20} className="text-zinc-600 shrink-0" />
                <p className="text-[9px] font-bold leading-relaxed text-zinc-500 uppercase">
                  ภาพจะถูกประมวลผลโดยใช้เพียง 4 สีที่คุณเลือก เพื่อให้เหมาะกับงานพิมพ์ Screen Print หรือ Risograph ผลลัพธ์ที่ได้จะถูก Optimized ความคมชัดระดับ 300DPI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}