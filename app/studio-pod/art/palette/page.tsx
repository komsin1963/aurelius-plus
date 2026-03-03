'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// @ts-ignore
import ColorThief from 'colorthief';
import { toJpeg } from 'html-to-image';
import { 
  Upload, Copy, Check, X, 
  Sparkles, Eye, EyeOff, Zap, ArrowRight, Trash2, Download, Info 
} from 'lucide-react';

// --- Functions คำนวณค่าสี ---
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToCmyk = (hex: string) => {
  let { r, g, b } = hexToRgb(hex);
  let r_p = r / 255, g_p = g / 255, b_p = b / 255;
  let k = 1 - Math.max(r_p, g_p, b_p);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  let c = (1 - r_p - k) / (1 - k), m = (1 - g_p - k) / (1 - k), y = (1 - b_p - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
};

export default function PaletteExtractor() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{hex: string, index: number} | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const clearAll = () => {
    setImage(null);
    setColors([]);
    setSelectedColor(null);
  };

  const downloadSpec = async () => {
    if (!image || !captureRef.current) return;
    setIsSaving(true);
    const prevMode = isCleanMode;
    setIsCleanMode(true);
    try {
      await new Promise(r => setTimeout(r, 150));
      const dataUrl = await toJpeg(captureRef.current, { quality: 1.0, backgroundColor: '#020203', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `AURELIUS-SPEC-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) { alert("Download Failed"); } 
    finally { setIsSaving(false); setIsCleanMode(prevMode); }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result as string); setColors([]); };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = () => {
    const colorThief = new ColorThief();
    if (imgRef.current && imgRef.current.complete) {
      const palette = colorThief.getPalette(imgRef.current, 8);
      setColors(palette.map((rgb: number[]) => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase()));
    }
  };

  // ✅ จุดที่แก้ไขลิงก์เป็น /studio-pod/art/reducecolor เพื่อแก้ปัญหา 404
  const transferToReduceColor = () => {
    if (colors.length === 0) return alert("กรุณาสกัดสีก่อนครับ");
    
    // คัด 4 สีแรกสำหรับงาน Reduce Color (Monotone)
    const productionColors = colors.slice(0, 4);
    const colorParams = productionColors.map(c => c.replace('#', '')).join(',');

    // 🚩 ส่งค่าไปยังหน้าที่คุณคมศิลป์สร้างใหม่
    router.push(`/studio-pod/art/reducecolor?colors=${colorParams}`);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-400 p-4 md:p-12 font-sans italic">
      <div ref={captureRef} className={`max-w-6xl mx-auto bg-[#020203] p-10 rounded-[40px] border border-white/5 relative transition-all duration-500 ${isCleanMode ? 'shadow-none border-transparent' : 'shadow-2xl'}`}>
        
        {/* Header Section */}
        <header className="mb-14 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black italic uppercase tracking-[-0.05em] text-white flex items-center gap-3">
              <Sparkles className="text-cyan-500" size={20} />
              AURELIUS <span className="text-zinc-600 font-light">STUDIO</span>
            </h1>
            <p className="text-[9px] font-bold opacity-30 tracking-[0.5em] uppercase mt-2 text-white">By komsin.com</p>
          </div>
          
          <div className={`flex items-center gap-3 transition-all duration-500 ${isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {image && (
              <>
                <button onClick={downloadSpec} disabled={isSaving} className="h-8 px-4 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-lg active:scale-95">
                  {isSaving ? 'GENERATING...' : <><Download size={12}/> DOWNLOAD SPEC</>}
                </button>
                <button onClick={clearAll} className="h-8 w-8 rounded-full bg-zinc-900 text-zinc-600 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center group">
                  <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
            <button onClick={() => setIsCleanMode(!isCleanMode)} className={`h-8 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isCleanMode ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-white'}`}>
              {isCleanMode ? <EyeOff size={12}/> : <Eye size={12}/>} CLEAN VIEW
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square bg-zinc-900/20 rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden group shadow-inner">
            {!image ? (
              <label className="cursor-pointer flex flex-col items-center gap-4 group">
                <Upload size={24} className="text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                <span className="text-[10px] font-bold opacity-20 uppercase tracking-[0.4em]">Upload Identity</span>
                <input type="file" className="hidden" onChange={handleImage} />
              </label>
            ) : (
              <img ref={imgRef} src={image} onLoad={extractColors} className="w-full h-full object-contain p-12 drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" alt="Source" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {colors.length > 0 ? colors.map((hex, index) => {
              const cmyk = rgbToCmyk(hex);
              return (
                <div key={index} onClick={() => setSelectedColor({hex, index})} className="bg-zinc-900/30 p-5 rounded-[2rem] border border-white/5 flex items-center gap-5 relative group cursor-pointer hover:bg-zinc-800 transition-all active:scale-95">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 shadow-lg" style={{ backgroundColor: hex }} />
                  <div className="flex-1 text-left">
                    <p className="text-[8px] font-black opacity-20 uppercase tracking-widest mb-1">Spec {index + 1}</p>
                    <p className="text-sm font-mono font-bold text-zinc-100 tracking-tight mb-2">{hex}</p>
                    <div className="flex gap-2 border-t border-white/5 pt-2">
                      {['C','M','Y','K'].map((label) => (
                        <div key={label} className="flex flex-col">
                          <span className="text-[7px] font-black text-cyan-500/60 leading-none">{label}</span>
                          <span className="text-[9px] font-bold text-zinc-400">{(cmyk as any)[label.toLowerCase()]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }) : [...Array(8)].map((_, i) => <div key={i} className="h-28 rounded-[2rem] border border-white/5 bg-zinc-900/10 animate-pulse" />)}
          </div>
        </div>

        {/* ✅ ปรับปรุงส่วนปุ่มส่งข้อมูลไปหน้า REDUCE COLOR */}
        {!isCleanMode && colors.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent p-8 rounded-[2.5rem] border border-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5 shadow-xl">
                    <Zap size={20} className="text-cyan-500 animate-pulse" fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[12px] font-black uppercase text-white tracking-widest italic flex items-center gap-2">
                      Process Reduce Color
                      <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-[7px] rounded border border-cyan-500/20 uppercase font-bold">4 colors mode</span>
                    </h4>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1 tracking-widest flex items-center gap-1.5 opacity-60">
                      <Info size={10} className="text-cyan-500" />
                      Ready for art processing: Sending 4 dominant colors to the reduction engine.
                    </p>
                  </div>
               </div>
               <button onClick={transferToReduceColor} className="px-8 py-4 bg-cyan-500 text-black rounded-xl font-black text-[10px] uppercase italic hover:bg-white hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.25)] group active:scale-95">
                 Initialize Art Engine <span className="text-[8px] bg-black/10 px-2 py-0.5 rounded opacity-70 group-hover:opacity-100 transition-opacity">PROCESS</span>
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {(isCleanMode || isSaving) && (
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[8px] font-black opacity-30 uppercase tracking-[1.2em] text-white">Official Aurelius Studio Specification | komsin.com</p>
          </div>
        )}
      </div>

      {/* Modal รายละเอียดสี */}
      {selectedColor && !isCleanMode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-[#0b0b0c] border border-white/10 p-10 rounded-[3rem] max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedColor(null)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"><X size={20}/></button>
            <div className="w-20 h-20 rounded-2xl mb-8 shadow-inner border border-white/5 mx-auto" style={{ backgroundColor: selectedColor.hex }} />
            <h3 className="text-lg font-black uppercase italic mb-6 text-white tracking-tighter text-center">Color Specification</h3>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center group">
              <span className="text-xl font-mono font-bold text-white tracking-tight">{selectedColor.hex}</span>
              <button onClick={() => { navigator.clipboard.writeText(selectedColor.hex); setCopiedIndex(selectedColor.index); setTimeout(() => setCopiedIndex(null), 1500); }} className="text-zinc-500 hover:text-cyan-500 transition-colors">
                {copiedIndex === selectedColor.index ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}