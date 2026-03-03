'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowLeft, Download, Maximize2, Upload, 
  Printer, Zap, ShieldCheck, Layers, Trash2,
  Info, AlertCircle, CheckCircle2, X
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InkjetXLStudio() {
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(200);
  const [bleed, setBleed] = useState(5);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DIAGNOSTICS STATES ---
  const [diagnostics, setDiagnostics] = useState<{
    dpi: number; widthPx: number; heightPx: number;
    qualityScore: 'POOR' | 'GOOD' | 'MASTER';
  } | null>(null);

  const [suggestions, setSuggestions] = useState<{
    maxSafeWidth: number; maxSafeHeight: number; recommendation: string;
  } | null>(null);

  // 💡 ปรับราคา XP ให้สอดคล้องกับหน้า Shop (99 บาท = 200 XP)
  const getExportCost = () => {
    if (scaleFactor <= 200) return 5;   // ขยายปกติใช้ 5 XP
    if (scaleFactor <= 400) return 20;  // ขยายใหญ่ใช้ 20 XP
    return 50;                         // ระดับ Master ใช้ 50 XP
  };

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('neural_energy').eq('id', user.id).single();
        if (data) setXp(data.neural_energy);
      }
    };
    getData();
  }, []);

  const runDiagnostics = (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      const mockDpi = Math.round((w / 10) * 2.54 / 5);
      const score = w > 3000 ? 'MASTER' : w > 1500 ? 'GOOD' : 'POOR';
      setDiagnostics({ dpi: mockDpi, widthPx: w, heightPx: h, qualityScore: score });
      
      const safeW = Math.round((w / 150) * 2.54);
      const safeH = Math.round((h / 150) * 2.54);
      setSuggestions({
        maxSafeWidth: safeW, maxSafeHeight: safeH,
        recommendation: w < 1500 ? "แนะนำให้ใช้ Studio 01 ช่วยปรับเส้นก่อน" : "ไฟล์พร้อมสำหรับพิมพ์ Large Format"
      });
    };
  };

  const handleExport = async () => {
    if (!selectedFileUrl) return alert("กรุณาอัปโหลด Artwork");
    const cost = getExportCost();
    if (xp < cost) return alert(`Neural Energy ไม่เพียงพอ (ต้องการ ${cost} XP)`);

    setIsProcessing(true);
    try {
      // 💾 ตัด XP จริงใน Database
      const { error } = await supabase.from('profiles').update({ neural_energy: xp - cost }).eq('id', user.id);
      
      if (!error) {
        setXp(prev => prev - cost);
        // บันทึก Log การใช้ XP
        await supabase.from('transactions').insert({
          user_id: user.id, amount: -cost, type: 'spend',
          description: `Inkjet XL Export: ${scaleFactor}%`
        });
      }

      await new Promise(r => setTimeout(r, 2000)); // จำลอง AI ทำงาน
      setIsExportSuccess(true);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการประมวลผล");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 font-sans selection:bg-cyan-500/30">
      
      {/* --- SUCCESS MODAL --- */}
      {isExportSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="relative max-w-lg w-full bg-zinc-900 border border-cyan-500/30 rounded-[3rem] p-10 text-center shadow-[0_0_80px_rgba(6,182,212,0.2)]">
            <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-black" />
            </div>
            <h2 className="text-2xl font-black italic uppercase mb-2 text-cyan-500">Export Ready</h2>
            <p className="text-[10px] font-black uppercase text-zinc-500 mb-8 italic">Processed by Aurelius Engine v3</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Scale Output</p>
                <p className="text-xl font-black italic text-white">{scaleFactor}%</p>
              </div>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Energy Spent</p>
                <p className="text-xl font-black italic text-cyan-500">{getExportCost()} XP</p>
              </div>
            </div>

            <a href={selectedFileUrl || '#'} download={`Aurelius_XL_${scaleFactor}.png`} className="w-full bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic text-xs hover:bg-cyan-500 hover:text-white transition-all">
              Download Master File <Download size={18} />
            </a>
            
            <button onClick={() => setIsExportSuccess(false)} className="mt-4 text-[9px] font-black text-zinc-500 uppercase hover:text-white transition-colors italic tracking-widest">
              Close Preview
            </button>
            <p className="mt-8 text-[8px] font-black text-zinc-700 uppercase italic">By komsin.com</p>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <Link href="/shop" className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5 text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-zinc-500 uppercase italic mb-1 tracking-widest">Available Energy</span>
          <div className="bg-cyan-500/10 px-6 py-2 rounded-full border border-cyan-500/20 font-black text-cyan-400 text-[11px] tracking-widest shadow-lg uppercase shadow-cyan-900/10">
            {xp.toLocaleString()} XP
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-[16/10] bg-[#050505] border-2 border-dashed border-white/5 rounded-[3.5rem] flex items-center justify-center overflow-hidden group">
            {selectedFileUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-12">
                <img src={selectedFileUrl} className="max-h-full max-w-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" alt="Preview" />
                <button onClick={() => setSelectedFileUrl(null)} className="absolute top-10 right-10 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all"><Trash2 size={20} /></button>
                {/* Bleed Guide */}
                <div className="absolute inset-0 border border-cyan-500/10 pointer-events-none rounded-[3.5rem]" style={{ margin: `${bleed * 4}px` }} />
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-6 group">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-all border border-white/5 shadow-2xl"><Upload size={32} className="text-zinc-600 group-hover:text-white" /></div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 block mb-2 italic">Studio 03 Engine</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase italic">Import Artwork to Analyze</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) { setSelectedFileUrl(URL.createObjectURL(file)); runDiagnostics(file); }
                }} />
              </label>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center z-50 animate-in fade-in">
                <Zap size={60} className="text-cyan-500 animate-pulse mb-6" />
                <p className="text-[10px] font-black uppercase italic tracking-[1em] text-cyan-500">Neural Scaling Active...</p>
              </div>
            )}
          </div>
          
          {/* Diagnostics Section */}
          {diagnostics && (
            <div className="grid md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 italic">DPI Check</p>
                <p className="text-sm font-black italic text-white">{diagnostics.dpi} DPI <span className="text-[9px] text-zinc-600">(Calculated)</span></p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 italic">Dimension</p>
                <p className="text-sm font-black italic text-white">{diagnostics.widthPx} x {diagnostics.heightPx} PX</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 text-right">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 italic">Grade</p>
                <p className={`text-sm font-black italic ${diagnostics.qualityScore === 'MASTER' ? 'text-cyan-500' : 'text-yellow-500'}`}>{diagnostics.qualityScore}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/40 p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-xl h-full flex flex-col">
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-3">
              <Printer size={22} className="text-cyan-500" /> XL Config
            </h2>

            <div className="space-y-12 flex-1">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] font-black text-zinc-500 uppercase italic">Neural Scale</label>
                  <span className="text-2xl font-black italic text-cyan-500">{scaleFactor}%</span>
                </div>
                <input type="range" min="100" max="800" step="100" value={scaleFactor} onChange={(e) => setScaleFactor(Number(e.target.value))} className="w-full accent-cyan-500 h-1 rounded-full cursor-pointer bg-zinc-800" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] font-black text-zinc-500 uppercase italic">Bleed Margin</label>
                  <span className="text-2xl font-black italic text-white">{bleed} cm</span>
                </div>
                <input type="range" min="0" max="10" step="1" value={bleed} onChange={(e) => setBleed(Number(e.target.value))} className="w-full accent-white h-1 rounded-full cursor-pointer bg-zinc-800" />
              </div>

              {suggestions && (
                <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl">
                  <div className="flex items-center gap-2 text-[8px] font-black text-cyan-500 uppercase mb-3 italic tracking-widest">
                    <Info size={14} /> AI Recommendation
                  </div>
                  <p className="text-xs font-black italic text-white mb-1 uppercase tracking-tighter">Safe Size: {suggestions.maxSafeWidth}x{suggestions.maxSafeHeight} CM</p>
                  <p className="text-[9px] text-zinc-500 font-bold italic">"{suggestions.recommendation}"</p>
                </div>
              )}
            </div>

            <div className="pt-10 border-t border-white/5 mt-auto">
              <div className="flex justify-between mb-6 items-center">
                <span className="text-[9px] font-black uppercase text-zinc-500 italic tracking-widest">Processing Fee</span>
                <span className="text-lg font-black italic text-cyan-400">{getExportCost()} XP</span>
              </div>
              
              <button 
                onClick={handleExport}
                disabled={isProcessing || !selectedFileUrl}
                className="w-full bg-white text-black py-6 rounded-3xl flex items-center justify-center gap-4 group hover:bg-cyan-500 hover:text-white transition-all shadow-2xl disabled:opacity-20"
              >
                <span className="text-xs font-black uppercase italic tracking-widest">Execute Export XL</span>
                <Zap size={20} className="fill-current" />
              </button>
              
              <p className="mt-8 text-[8px] text-center font-bold text-zinc-700 uppercase italic tracking-[0.4em]">
                komsin.com • Inkjet Master
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}