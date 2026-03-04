'use client';

import React, { useState, useRef } from 'react';
// @ts-ignore
import ColorThief from 'colorthief';
import { toJpeg } from 'html-to-image';
import { 
  Upload, Sparkles, Eye, EyeOff, Trash2, Download, Check, Copy, X, Palette
} from 'lucide-react';

// --- Helper Functions ---
const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16)
});

const rgbToCmyk = (hex: string) => {
  let { r, g, b } = hexToRgb(hex);
  let r_p = r / 255, g_p = g / 255, b_p = b / 255;
  let k = 1 - Math.max(r_p, g_p, b_p);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  let c = (1 - r_p - k) / (1 - k), m = (1 - g_p - k) / (1 - k), y = (1 - b_p - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
};

export default function PalettePage() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{hex: string, index: number} | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // ✅ ฟังก์ชัน Save ลงเครื่องทันที (ไม่มีหัก XP, ไม่มี API)
  const handleDirectDownload = async () => {
    if (!image || !captureRef.current) return;
    setIsSaving(true);
    
    try {
      const prevMode = isCleanMode;
      setIsCleanMode(true); // ปิดปุ่มต่างๆ ก่อนเซฟ
      await new Promise(r => setTimeout(r, 300));
      
      const dataUrl = await toJpeg(captureRef.current, { 
        quality: 1.0, 
        backgroundColor: '#020203', 
        pixelRatio: 2 
      });
      
      const link = document.createElement('a');
      link.download = `AURELIUS-SPEC-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      
      setIsCleanMode(prevMode);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
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
    if (imgRef.current?.complete) {
      const palette = colorThief.getPalette(imgRef.current, 4);
      setColors(palette.map((rgb: number[]) => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase()));
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-400 p-4 md:p-12 font-sans italic">
      <div ref={captureRef} className={`max-w-6xl mx-auto bg-[#020203] p-8 md:p-12 rounded-[3.5rem] border border-white/5 relative transition-all duration-700 ${isCleanMode ? 'border-transparent' : 'shadow-2xl'}`}>
        
        {/* Header */}
        <header className={`flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10 transition-opacity ${isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
              <Palette className="text-cyan-500" size={24} />
              AURELIUS <span className="text-zinc-700 font-light">PALETTE</span>
            </h1>
            <p className="text-[9px] font-bold tracking-[0.6em] text-zinc-500 uppercase mt-2">FREE DOWNLOAD ACCESS</p>
          </div>
          
          <div className="flex items-center gap-4">
            {image && (
              <>
                <button 
                  onClick={handleDirectDownload} 
                  disabled={isSaving} 
                  className="h-12 px-8 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-500 transition-all shadow-xl active:scale-95 disabled:opacity-20"
                >
                  {isSaving ? 'GENERATING...' : <><Download size={16}/> DOWNLOAD SPEC</>}
                </button>
                <button onClick={() => { setImage(null); setColors([]); }} className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-600 hover:text-red-500 transition-all flex items-center justify-center">
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={() => setIsCleanMode(!isCleanMode)} className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 text-white flex items-center justify-center hover:bg-zinc-800 transition-all">
              {isCleanMode ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Area */}
          <div className="relative aspect-square bg-zinc-900/10 rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden group">
            {!image ? (
              <label className="cursor-pointer flex flex-col items-center gap-5 group">
                <Upload size={40} className="text-zinc-800 group-hover:text-cyan-500 transition-all" />
                <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.5em]">Upload Source</span>
                <input type="file" className="hidden" onChange={handleImage} />
              </label>
            ) : (
              <img ref={imgRef} src={image} onLoad={extractColors} className="w-full h-full object-contain p-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" alt="Source" />
            )}
          </div>

          {/* Color List */}
          <div className="flex flex-col gap-5">
            {colors.length > 0 ? colors.map((hex, index) => {
              const cmyk = rgbToCmyk(hex);
              return (
                <div key={index} onClick={() => setSelectedColor({hex, index})} className="bg-zinc-900/20 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-8 hover:bg-zinc-900/40 transition-all cursor-pointer group">
                  <div className="w-20 h-20 rounded-2xl shadow-2xl border border-white/10" style={{ backgroundColor: hex }} />
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Plate 0{index + 1}</p>
                      <p className="text-sm font-mono font-bold text-white">{hex}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 border-t border-white/5 pt-4">
                      {['C','M','Y','K'].map((label) => (
                        <div key={label}>
                          <p className="text-[8px] font-black opacity-30 uppercase">{label}</p>
                          <p className="text-[12px] font-bold text-zinc-300">{(cmyk as any)[label.toLowerCase()]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }) : [...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-[2.5rem] border border-white/5 bg-zinc-900/10 animate-pulse" />)}
          </div>
        </div>

        {/* Brand Footer for Spec */}
        {(isCleanMode || isSaving) && (
          <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center opacity-40">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white italic">AURELIUS STUDIO PROTOCOL</p>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white italic">KOMSIN.COM</p>
          </div>
        )}
      </div>
    </div>
  );
}