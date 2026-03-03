'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Instagram, Send, Smartphone, 
  Download, Image as ImageIcon, Palette, Upload, 
  FileCode, CheckCircle2, X 
} from 'lucide-react';
import { toJpeg } from 'html-to-image'; // ใช้ toJpeg แทน

// Import Libs
import { multiRecolorSVG, svgToDataUri } from './_lib/svg-processor';
import { exportBundleAsZip } from './_lib/zip-service';

export default function SocialAssets() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // --- STATES ---
  const [assets, setAssets] = useState<{name: string, content: string, type: string}[]>([]);
  const [activeIndex, setActiveIndex] = useState(0); 
  const [selectedFormat, setSelectedFormat] = useState('reels');
  const [colors, setColors] = useState({ primary: '#00FFFF', secondary: '#050505' });
  const [isOriginal, setIsOriginal] = useState(false);

  // --- FUNCTIONS ---
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setAssets(prev => [...prev, { 
            name: file.name.replace(/\.[^/.]+$/, ""), 
            content: content,
            type: file.type 
          }]);
        };
        if (file.type === "image/svg+xml") {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeAsset = (index: number) => {
    const newAssets = assets.filter((_, i) => i !== index);
    setAssets(newAssets);
    if (activeIndex >= newAssets.length) {
      setActiveIndex(Math.max(0, newAssets.length - 1));
    }
  };

  const processedPreview = useMemo(() => {
    if (assets.length === 0) return "";
    const current = assets[activeIndex] || assets[0];
    if (current.type !== "image/svg+xml" || isOriginal) {
      return current.type === "image/svg+xml" ? svgToDataUri(current.content) : current.content;
    }
    return svgToDataUri(multiRecolorSVG(current.content, colors));
  }, [assets, colors, isOriginal, activeIndex]);

  // 1. SAVE PNG (สำหรับงาน Social ทั่วไป)
  const handleSavePNG = () => {
    if (!processedPreview) return;
    const link = document.createElement('a');
    link.download = `Komsin-${selectedFormat}.png`;
    link.href = processedPreview;
    link.click();
  };

  // 2. SAVE JPG (สำหรับอัปโหลดขึ้นหน้า Market / Supabase)
  const handleSaveJPG = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toJpeg(previewRef.current, { 
        quality: 0.85,
        backgroundColor: '#050505' 
      });
      const link = document.createElement('a');
      link.download = `Aurelius-Market-${assets[activeIndex]?.name || 'thumb'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('JPG Save Error:', err);
    }
  };

  const handleDownloadZip = async () => {
    if (assets.length === 0) return alert("LOAD ASSETS FIRST!");
    const processedFiles = assets.map(asset => {
      let finalData = asset.content;
      if (asset.type === "image/svg+xml" && !isOriginal) {
        finalData = multiRecolorSVG(asset.content, colors);
      }
      return {
        name: `${asset.name}${isOriginal ? '' : '-custom'}`,
        data: finalData,
        type: asset.type === "image/svg+xml" ? 'svg' : (asset.type.split('/')[1] as any)
      };
    });
    await exportBundleAsZip(processedFiles, `Aurelius_Bundle_By_Komsin`);
  };

  const formats = [
    { id: 'reels', name: 'TikTok / Reels', ratio: 'aspect-[9/16] w-[280px]', icon: <Smartphone size={16} /> },
    { id: 'post', name: 'IG Post', ratio: 'aspect-square w-[380px]', icon: <Instagram size={16} /> },
    { id: 'story', name: 'Market Thumb (600px)', ratio: 'w-[300px] h-[300px]', icon: <Send size={16} /> }, 
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans uppercase italic selection:bg-cyan-500">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-black tracking-tighter italic">AURELIUS <span className="text-cyan-500">STUDIO</span></h2>
          <input type="file" accept=".svg,.png,.jpg,.jpeg" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-zinc-800 transition">
            <Upload size={14} /> LOAD ASSETS
          </button>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleSavePNG} className="border border-white/10 px-4 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:bg-white/5 transition-all uppercase text-zinc-400">
            <ImageIcon size={14} /> PNG
          </button>

          {/* ปุ่ม JPG เด่นขึ้นมานิดนึงสำหรับงาน Market */}
          <button onClick={handleSaveJPG} className="bg-zinc-800 text-yellow-500 border border-yellow-500/20 px-4 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:bg-zinc-700 transition-all uppercase">
            <ImageIcon size={14} /> JPG (MARKET)
          </button>

          <button onClick={handleDownloadZip} className="bg-cyan-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95 uppercase">
            <Download size={14} /> EXPORT ZIP ($6.00)
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <button 
            onClick={() => setIsOriginal(!isOriginal)}
            className={`w-full py-4 rounded-2xl font-black text-[10px] border-2 transition-all flex items-center justify-center gap-3 ${isOriginal ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-zinc-800 text-zinc-500'}`}
          >
            {isOriginal ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-zinc-700" />}
            {isOriginal ? "USING ORIGINAL COLORS" : "USE ORIGINAL COLORS"}
          </button>

          {assets.length > 0 && (
            <section className="p-5 bg-zinc-900/20 border border-white/5 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-center px-2">
                <p className="text-[8px] font-black text-zinc-500 tracking-widest italic">{assets.length} ASSETS LOADED</p>
                <button onClick={() => {setAssets([]); setActiveIndex(0);}} className="text-[8px] text-red-500/50 hover:text-red-500 font-black transition-colors">CLEAR ALL</button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {assets.map((asset, idx) => (
                  <div key={idx} onClick={() => setActiveIndex(idx)} 
                    className={`group relative flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${activeIndex === idx ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-zinc-900/40 border-transparent hover:border-zinc-800'}`}>
                    <div className="w-10 h-10 bg-black rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                      <img src={asset.type === "image/svg+xml" ? svgToDataUri(asset.content) : asset.content} className="w-full h-full object-contain" />
                    </div>
                    <p className={`text-[9px] font-black truncate flex-1 ${activeIndex === idx ? 'text-cyan-400' : 'text-zinc-500'}`}>{asset.name.toUpperCase()}</p>
                    <button onClick={(e) => {e.stopPropagation(); removeAsset(idx);}} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-all"><X size={14}/></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] mb-4">SELECT FORMAT</h3>
            {formats.map((f) => (
              <button key={f.id} onClick={() => setSelectedFormat(f.id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${selectedFormat === f.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                <span className={selectedFormat === f.id ? 'text-cyan-400' : 'text-zinc-500'}>{f.icon}</span>
                <span className="text-xs font-black tracking-widest">{f.name}</span>
              </button>
            ))}
          </section>

          <section className={`p-6 bg-zinc-900/30 rounded-3xl border border-white/5 space-y-4 transition-all ${isOriginal ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] flex items-center gap-2"><Palette size={14} /> LIVE RECOLOR</h3>
            <div className="flex flex-col gap-3">
              <input type="color" value={colors.primary} onChange={(e) => setColors({...colors, primary: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
              <input type="color" value={colors.secondary} onChange={(e) => setColors({...colors, secondary: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer rounded-lg overflow-hidden" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 bg-zinc-950 rounded-[3rem] border border-zinc-900 flex justify-center items-center p-12 min-h-[700px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.03),transparent_70%)]" />
          
          {assets.length > 0 ? (
            <div 
              ref={previewRef}
              className={`${formats.find(f => f.id === selectedFormat)?.ratio} bg-black flex items-center justify-center p-12 relative border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden`}
            >
               <img src={processedPreview} alt="Preview" className="w-full h-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.2)]" />
               <div className="absolute bottom-6 left-6 opacity-20 text-[8px] font-black tracking-widest uppercase">
                  AURELIUS STUDIO ARCHIVE / BY KOMSIN
               </div>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-10">
               <Upload className="mx-auto" size={48} />
               <p className="text-[10px] font-black tracking-[0.8em]">SYSTEM STANDBY</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}