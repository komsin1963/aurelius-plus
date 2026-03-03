'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  Trash2, UploadCloud, FileDown, Loader2, Zap, Palette, Layers, Check, Coins 
} from 'lucide-react';

export default function AureliusCMYK_XP_FinalV2() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<'C' | 'M' | 'Y' | 'K' | null>(null);
  const [lpi, setLpi] = useState(45); 
  
  // โหลดคะแนนจากเครื่อง หรือถ้าไม่มีให้เริ่มที่ 1000
  const [userXP, setUserXP] = useState(1000);
  const SAVE_COST = 25; 

  // Effect สำหรับโหลดคะแนนครั้งแรก
  useEffect(() => {
    const savedXP = localStorage.getItem('aurelius_xp');
    if (savedXP) setUserXP(parseInt(savedXP));
  }, []);

  // ฟังก์ชันหักคะแนนและบันทึกลงเครื่อง
  const deductXP = (amount: number) => {
    const newXP = userXP - amount;
    setUserXP(newXP);
    localStorage.setItem('aurelius_xp', newXP.toString());
  };

  const lpiPresets = [
    { label: 'Low', value: 35, mesh: '80T - 100T' },
    { label: 'Med', value: 45, mesh: '100T - 120T' },
    { label: 'High', value: 55, mesh: '120T - 140T' },
  ];

  const processPlate = (type: 'C' | 'M' | 'Y' | 'K') => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sourceImage;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i+1] / 255;
        const b = data[i+2] / 255;
        const k = 1 - Math.max(r, g, b);
        let intensity = 0;
        if (type === 'C') intensity = (1 - r - k) / (1 - k) || 0;
        if (type === 'M') intensity = (1 - g - k) / (1 - k) || 0;
        if (type === 'Y') intensity = (1 - b - k) / (1 - k) || 0;
        if (type === 'K') intensity = k;
        data[i] = 0; data[i+1] = 0; data[i+2] = 0;
        data[i+3] = intensity * 255; 
      }
      ctx.putImageData(imageData, 0, 0);
      applyHalftone(ctx, canvas.width, canvas.height);
      drawMarksAndLabel(ctx, canvas.width, canvas.height, type);
      setSelectedPlate(type);
    };
  };

  const applyHalftone = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const dotSpacing = Math.max(2, Math.floor(w / (15 * lpi)));
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "black";
    for (let y = 0; y < h; y += dotSpacing) {
      for (let x = 0; x < w; x += dotSpacing) {
        const index = (y * w + x) * 4;
        const intensity = data[index + 3] / 255;
        if (intensity > 0.1) {
          const radius = (dotSpacing / 1.8) * Math.sqrt(intensity);
          ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  };

  const drawMarksAndLabel = (ctx: CanvasRenderingContext2D, w: number, h: number, plate: string) => {
    const margin = w * 0.05;
    const markSize = w * 0.02;
    ctx.strokeStyle = "black"; ctx.fillStyle = "black"; ctx.lineWidth = 2;
    const positions = [{ x: margin, y: margin }, { x: w - margin, y: margin }, { x: margin, y: h - margin }, { x: w - margin, y: h - margin }];
    positions.forEach((pos, index) => {
      ctx.beginPath();
      ctx.moveTo(pos.x - markSize, pos.y); ctx.lineTo(pos.x + markSize, pos.y);
      ctx.moveTo(pos.x, pos.y - markSize); ctx.lineTo(pos.x, pos.y + markSize);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(pos.x, pos.y, markSize/2, 0, Math.PI*2); ctx.stroke();
      if (index === 0) {
        ctx.font = `bold ${Math.floor(w * 0.03)}px sans-serif`; 
        ctx.textAlign = 'left';
        ctx.fillText(`${plate} (15x18)`, pos.x - (markSize/2), pos.y - markSize - 15);
      }
    });
  };

  const handleExportPDF = async () => {
    if (!previewRef.current || !selectedPlate) return;
    if (userXP < SAVE_COST) {
      alert(`XP ไม่พอ! (ต้องใช้ ${SAVE_COST} XP)`);
      return;
    }
    
    setIsProcessing(true);
    try {
      const dataUrl = await toPng(previewRef.current, { 
        quality: 1.0, 
        pixelRatio: 3, 
        backgroundColor: undefined 
      });
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: [15, 18] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 15, 18);
      
      // หัก XP จริงและบันทึกค่าลงเครื่อง
      deductXP(SAVE_COST);
      
      pdf.save(`AURELIUS-FILM-${selectedPlate}.pdf`);
    } catch (err) {
      alert("Export failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-sans italic tracking-tight uppercase">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Persistent XP */}
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 mb-2 font-black tracking-[0.4em] text-[10px]"><Zap size={16} /> CMYK XP SYSTEM</div>
            <h1 className="text-4xl font-black italic text-white">AURELIUS <span className="text-zinc-700">FILM-LAB</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
               <Coins size={20} className="text-yellow-500" />
               <span className="text-lg font-black tracking-widest text-white">{userXP} XP</span>
            </div>
            {sourceImage && (
              <button onClick={() => {setSourceImage(null); setSelectedPlate(null);}} className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className={`flex justify-center bg-white p-10 rounded-[3.5rem] min-h-[700px] items-center overflow-hidden shadow-2xl ${!selectedPlate && 'bg-zinc-900/20 opacity-40'}`}>
              {!sourceImage ? (
                <label className="cursor-pointer flex flex-col items-center gap-6 group">
                   <div className="p-8 bg-zinc-100 rounded-full group-hover:bg-cyan-100 transition-colors">
                      <UploadCloud size={40} className="text-zinc-800" />
                   </div>
                   <p className="text-[10px] font-black text-zinc-500 italic">LOAD MASTER ARTWORK (15x18)</p>
                   <input type="file" className="hidden" onChange={(e) => {
                     const file = e.target.files?.[0];
                     if(file) {
                       const reader = new FileReader();
                       reader.onload = (ev) => { if (typeof ev.target?.result === 'string') setSourceImage(ev.target.result); };
                       reader.readAsDataURL(file);
                     }
                   }} accept="image/*" />
                </label>
              ) : (
                <div ref={previewRef} className="relative w-[450px] h-[540px] flex items-center justify-center bg-white">
                  <canvas ref={canvasRef} className={`max-w-full max-h-full object-contain ${!selectedPlate ? 'hidden' : ''}`} />
                  {!selectedPlate && sourceImage && <img src={sourceImage} className="max-w-full max-h-full object-contain opacity-20 grayscale" alt="Preview" />}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* LPI Preset */}
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h3 className="text-[10px] font-black text-zinc-500 italic mb-6 flex items-center gap-2"><Layers size={14}/> LPI & MESH PRESET</h3>
              <div className="space-y-3">
                {lpiPresets.map((p) => (
                  <button key={p.value} onClick={() => {setLpi(p.value); setSelectedPlate(null);}} className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center ${lpi === p.value ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'}`}>
                    <div className="text-left font-black">
                      <div className="text-[12px]">{p.label} ({p.value} LPI)</div>
                      <div className="text-[8px] opacity-60">MESH: {p.mesh}</div>
                    </div>
                    {lpi === p.value && <Check size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Extraction & Saving */}
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(['C', 'M', 'Y', 'K'] as const).map((plate) => (
                  <button key={plate} onClick={() => processPlate(plate)} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center ${selectedPlate === plate ? 'bg-white border-white text-black scale-105 shadow-xl' : 'bg-black/40 border-white/5 text-zinc-500'}`}>
                    <span className="text-3xl font-black">{plate}</span>
                  </button>
                ))}
              </div>
              
              <button onClick={handleExportPDF} disabled={isProcessing || !selectedPlate} className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-[12px] flex flex-col items-center gap-1 hover:bg-cyan-500 hover:text-white transition-all shadow-xl disabled:opacity-20 active:scale-95 group">
                <div className="flex items-center gap-2">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <FileDown size={20} />}
                  <span>SAVE {selectedPlate ?? ''} FILM</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[8px] line-through opacity-40">50 XP</span>
                   <span className="text-[9px] font-black text-cyan-600 group-hover:text-white">PROMO: {SAVE_COST} XP</span>
                </div>
              </button>
            </div>
            
            <div className="p-6 bg-cyan-500/5 rounded-[2rem] border border-cyan-500/10 text-center">
               <p className="text-[9px] text-cyan-600 font-bold tracking-[0.2em]">SONGKRAN PROMO: 50% OFF XP FEE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}