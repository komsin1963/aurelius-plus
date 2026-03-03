'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, Trash2, Download, 
  Share2, Sliders, CloudUpload, 
  Image as ImageIcon, Loader2, Coins
} from 'lucide-react';
import { toJpeg } from 'html-to-image';

export default function MockupSuite() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [userXP, setUserXP] = useState(5000);
  const [artwork, setArtwork] = useState<string | null>(null);
  const [artName, setArtName] = useState('UNNAMED ART');
  const [tshirtColor, setTshirtColor] = useState<'black' | 'white'>('black');
  const [scale, setScale] = useState(38);
  const [brightness, setBrightness] = useState(100);
  const [posY, setPosY] = useState(-15);
  
  const [isSaved, setIsSaved] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setArtwork(ev.target?.result as string);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
      setArtName(file.name.replace(/\.[^/.]+$/, "").toUpperCase());
    }
  };

  const handleSaveWithXP = async () => {
    if (!artwork) return alert("กรุณาอัปโหลดลายก่อนใช้งานเครื่องยนต์ครับ");
    if (userXP < 50) return alert("XP ของคุณไม่เพียงพอ");

    // ✅ FIX: เข้าถึง Element โดยตรงเพื่อลดโอกาสเกิด Padding ส่วนเกิน
    if (!previewRef.current) return;
    
    setIsSaving(true);
    try {
      // ✅ ADJUSTED: ปรับ Pixel Ratio เป็น 2 เพื่อความคมชัด และตัดพื้นที่ส่วนเกิน
      const dataUrl = await toJpeg(previewRef.current, { 
        quality: 0.95,
        width: 1000,   // บังคับความกว้างไฟล์ที่ Save
        height: 1000,  // บังคับความสูงไฟล์ที่ Save
        pixelRatio: 2, // เพิ่มความละเอียดภาพ (จะได้ภาพ 2000x2000 ที่คมชัดมาก)
        style: {
          borderRadius: '0', // ลบมุมโค้งออกตอนเซฟภาพ
        }
      });

      const link = document.createElement('a');
      link.download = `[AURELIUS]-${artName}.jpg`;
      link.href = dataUrl;
      link.click();

      setUserXP(userXP - 50);
      setIsSaved(true);
    } catch (err) { 
      alert("เกิดข้อผิดพลาดในการประมวลผลภาพ"); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleSocialShareXP = () => {
    if (!isSaved) return;
    setIsPublishing(true);
    setTimeout(() => {
      setUserXP(prev => prev + 50);
      alert("🚀 รับโบนัสคืน +50 XP!");
      setIsPublishing(false);
      setIsSaved(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8 font-sans italic selection:bg-cyan-500">
      
      {/* 🔝 HEADER */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all"><ArrowLeft size={18} /></button>
          <div className="text-left text-white">
            <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">AURELIUS <span className="text-cyan-500">MOCKUP</span></h2>
            <p className="text-[7px] text-zinc-600 tracking-[0.4em] uppercase mt-1 font-black">PRECISION RENDER v3.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 border border-white/5 rounded-full px-5 py-2.5 flex items-center gap-2.5">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black italic tracking-widest">{userXP.toLocaleString()} XP</span>
          </div>
          <button 
            onClick={handleSaveWithXP} 
            disabled={isSaving}
            className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-cyan-500 transition-all uppercase shadow-xl"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Save (-50 XP)
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 🛠️ CONTROLS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 space-y-6 backdrop-blur-md text-left">
            <div className="flex items-center gap-3 text-cyan-500">
              <ImageIcon size={18} />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Asset Core</h3>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-zinc-800 rounded-[2rem] cursor-pointer hover:border-cyan-500/50 bg-black/40 group overflow-hidden transition-all">
               {artwork ? (
                 <img src={artwork} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
               ) : (
                 <CloudUpload size={24} className="text-zinc-700 group-hover:text-cyan-500" />
               )}
               <input type="file" className="hidden" onChange={handleArtUpload} accept="image/*" />
            </label>
            <div className="flex gap-2">
               <div className="flex-1 py-3 px-4 bg-zinc-900 rounded-xl text-[8px] font-black text-zinc-500 truncate">{artName}</div>
               <button onClick={() => setArtwork(null)} className="p-3 bg-zinc-900 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={14} /></button>
            </div>
          </section>

          <section className="p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 space-y-6 backdrop-blur-md text-left">
            <div className="flex items-center gap-3 text-cyan-500">
              <Sliders size={18} />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Visual Tuning</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Scale', val: scale, set: setScale, min: 20, max: 60, unit: '%' },
                { label: 'Vertical Pos', val: posY, set: setPosY, min: -80, max: 80, unit: 'px' },
                { label: 'Brightness', val: brightness, set: setBrightness, min: 50, max: 120, unit: '%' }
              ].map((s) => (
                <div key={s.label} className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase">
                    <span>{s.label}</span><span className="text-cyan-500">{s.val}{s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 appearance-none accent-cyan-500 cursor-pointer rounded-full" />
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={handleSocialShareXP} 
            disabled={!isSaved || isPublishing}
            className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase transition-all flex items-center justify-center gap-3 ${isSaved ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-zinc-800 text-zinc-600 opacity-50'}`}
          >
            <Share2 size={16} /> {isPublishing ? 'PUBLISHING...' : 'SHARE ASSET (+50 XP)'}
          </button>
        </div>

        {/* 📺 MOCKUP PREVIEW (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* ✅ RENDER TARGET: ตัวนี้คือสิ่งที่จะถูก Save เป็นรูป */}
          <div className="relative p-1 bg-zinc-900 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div 
              ref={previewRef} 
              className="w-[500px] h-[500px] bg-black relative flex items-center justify-center overflow-hidden"
              style={{ minWidth: '500px', minHeight: '500px' }} // บังคับขนาดขั้นต่ำตอน Render
            >
              {/* BASE */}
              <img 
                src={tshirtColor === 'black' ? "/mockups/flat-black.jpg" : "/mockups/flat-white.jpg"} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Mockup Base" 
              />
              
              {/* ARTWORK ENGINE */}
              <div style={{ width: `${scale}%`, marginTop: `${posY}px` }} className="absolute z-10 aspect-[25/30] flex items-center justify-center pointer-events-none transition-all duration-75">
                 {artwork && (
                    <img src={artwork} className="max-w-full max-h-full object-contain shadow-sm" 
                      style={{ 
                        mixBlendMode: tshirtColor === 'black' ? 'screen' : 'multiply', 
                        filter: `brightness(${brightness}%) contrast(1.05)`, 
                        opacity: 0.98 
                      }} 
                    />
                 )}
              </div>
              
              {/* WATERMARK */}
              <div className="absolute bottom-6 right-8 opacity-20 text-[6px] font-black tracking-[0.4em] uppercase text-white italic">AURELIUS STUDIO</div>
            </div>
          </div>

          {/* COLOR SELECTOR */}
          <div className="mt-8 bg-zinc-900/50 p-6 rounded-full border border-white/5 flex gap-10">
            {['black', 'white'].map((color) => (
              <button key={color} onClick={() => setTshirtColor(color as any)} className="flex flex-col items-center gap-2 group">
                <div className={`w-8 h-8 rounded-full border-2 transition-all ${tshirtColor === color ? 'border-cyan-500 scale-125 ring-4 ring-cyan-500/20' : 'border-zinc-800'} ${color === 'black' ? 'bg-black' : 'bg-white'}`}></div>
                <span className={`text-[8px] font-black uppercase italic ${tshirtColor === color ? 'text-cyan-500' : 'text-zinc-600'}`}>{color}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}