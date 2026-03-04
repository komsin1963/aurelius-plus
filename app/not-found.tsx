'use client';

import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image'; // ต้องมี library นี้ครับ
import { Download, Palette, Sparkles, RefreshCw } from 'lucide-react';

export default function PaletteEngine() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันดาวน์โหลดภาพลงเครื่องทันที
  const downloadSpec = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      // จับภาพเฉพาะส่วนที่เป็นการ์ด Specification
      const dataUrl = await toJpeg(exportRef.current, { 
        quality: 0.95,
        backgroundColor: '#020203',
        pixelRatio: 2 // เพิ่มความชัด
      });
      
      // สร้าง Link ลับเพื่อสั่งดาวน์โหลด
      const link = document.createElement('a');
      link.download = `AURELIUS-SPEC-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-8 font-sans italic">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Control */}
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
              <Palette className="text-cyan-500" size={32} />
              Aurelius <span className="text-zinc-700">Palette</span>
            </h1>
            <p className="text-[10px] font-bold tracking-[0.5em] text-zinc-500 uppercase mt-2">4-Color CMYK Engine</p>
          </div>

          <button 
            onClick={downloadSpec}
            disabled={isExporting}
            className="group relative px-8 py-4 bg-white text-black rounded-2xl overflow-hidden transition-all hover:bg-cyan-500 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
              SAVE SPEC TO DEVICE
            </span>
          </button>
        </div>

        {/* 🚩 ส่วนที่ถูกจับภาพ (Export Area) */}
        <div 
          ref={exportRef} 
          className="bg-[#020203] p-12 rounded-[3rem] border border-white/5"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* ฝั่งรูปภาพ */}
            <div className="aspect-square bg-zinc-900/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} className="w-full h-full object-contain p-8" alt="Source" />
              ) : (
                <div className="text-zinc-800 font-black text-6xl opacity-20">NO IMAGE</div>
              )}
            </div>

            {/* ฝั่งค่าสี (Plates) */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-6 bg-zinc-900/20 p-6 rounded-[2rem] border border-white/5 hover:bg-zinc-900/40 transition-all">
                  <div className={`w-20 h-20 rounded-2xl shadow-xl bg-zinc-800`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-cyan-500 tracking-widest uppercase">Plate 0{i}</span>
                      <span className="text-sm font-mono text-zinc-400">#HEXCODE</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[9px] font-bold text-zinc-600">
                      <div>C: 0%</div>
                      <div>M: 0%</div>
                      <div>Y: 0%</div>
                      <div>K: 0%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ลายน้ำด้านล่างภาพที่ Save */}
          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-end opacity-20">
             <div className="text-[10px] font-black tracking-widest">AURELIUS STUDIO POD SYSTEM</div>
             <div className="text-[10px] font-black tracking-widest text-right">GEN-ID: {Date.now()}</div>
          </div>
        </div>

      </div>
    </div>
  );
}