'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
// @ts-ignore
import ImageTracer from 'imagetracerjs';
import { 
  ArrowLeft, Download, Zap, Trash2, 
  Sliders, Upload, ExternalLink, CheckCircle2 
} from 'lucide-react';

function VectorContent() {
  const [image, setImage] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSent, setIsSent] = useState(false); // สถานะการส่งไป Inkscape
  const [ltres, setLtres] = useState(0.5); // ปรับ Default เป็น 0.5 เพื่อความคมชัดของคุณคมศิลป์

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setSvgOutput(null);
        setIsSent(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAll = () => {
    setImage(null);
    setSvgOutput(null);
    setIsProcessing(false);
    setIsSent(false);
  };

  const runVectorEngine = () => {
    if (!image) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        ImageTracer.imageToSVG(
          image,
          (svgString: string) => {
            setSvgOutput(svgString);
            setIsProcessing(false);
          },
          { ltres: ltres, scale: 1, strokewidth: 0.5, numberofcolors: 16 }
        );
      } catch (e) {
        setIsProcessing(false);
      }
    }, 100);
  };

  // --- 🚀 ฟังก์ชันส่งไฟล์ไปเตรียมเปิดใน Inkscape ---
  const sendToInkscape = () => {
    if (!svgOutput) return;
    
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // ตั้งชื่อไฟล์ให้ค้นหาง่ายในโฟลเดอร์ Download
    const fileName = `KMS_INK_${Date.now()}.svg`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // แสดง Feedback ว่าส่งสำเร็จ
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white p-8 font-mono italic uppercase">
      <div className="max-w-7xl mx-auto">
        
        {/* NAV SECTION */}
        <nav className="flex justify-between items-center mb-16 bg-zinc-900/20 p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/studio-suite/tale" className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-black italic">Neural <span className="text-cyan-500">Tracing</span></h1>
          </div>
          {image && (
            <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black text-[10px]">
              <Trash2 size={14} /> NEW PROJECT
            </button>
          )}
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* WORKSPACE */}
          <div className="space-y-6">
            <div className="aspect-square bg-zinc-900/10 rounded-[3rem] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {image ? (
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                   {svgOutput ? (
                     <div className="max-w-full max-h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]" dangerouslySetInnerHTML={{ __html: svgOutput }} />
                   ) : (
                     <img src={image} className="max-h-full object-contain opacity-50" />
                   )}
                   {isProcessing && (
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                        <Zap size={40} className="text-cyan-400 animate-pulse mb-4" />
                        <span className="text-xl font-black tracking-widest">TRACING PATHS...</span>
                     </div>
                   )}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-6 group">
                  <div className="p-12 bg-white/5 rounded-full border border-white/10 group-hover:border-cyan-500 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Upload size={48} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="block text-[14px] font-black tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">IMPORT MASTER PNG</span>
                    <span className="text-[8px] text-zinc-700 mt-2 block underline">BY KOMSIN STUDIO SYSTEM</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="space-y-8">
            <header>
              <h2 className="text-7xl font-black italic tracking-tighter leading-none mb-2">Vector</h2>
              <h2 className="text-7xl font-black italic tracking-tighter leading-none text-cyan-500">Engine</h2>
            </header>

            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="flex items-center gap-2 text-zinc-400"><Sliders size={14} /> Path Fidelity</span>
                  <span className="text-cyan-400 italic font-black">LTRES: {ltres.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0.05" max="2.0" step="0.05" 
                  value={ltres} 
                  onChange={(e) => setLtres(parseFloat(e.target.value))} 
                  className="w-full accent-cyan-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" 
                />
            </div>

            <div className="space-y-4">
              <button 
                disabled={!image || isProcessing}
                onClick={runVectorEngine}
                className={`w-full py-8 rounded-[2rem] font-black tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${!svgOutput ? 'bg-white text-black hover:bg-cyan-500' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}
              >
                {isProcessing ? 'PROCESSING...' : svgOutput ? 'RE-TRACE ASSET' : 'START NEURAL TRACING'}
              </button>

              {svgOutput && (
                <button 
                  onClick={sendToInkscape} 
                  className={`w-full py-8 rounded-[2rem] font-black tracking-[0.4em] flex items-center justify-center gap-3 transition-all transform active:scale-95 ${isSent ? 'bg-green-500 text-black' : 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]'}`}
                >
                  {isSent ? <CheckCircle2 size={24} /> : <ExternalLink size={24} />}
                  {isSent ? 'SENT TO LOCAL' : 'SEND TO INKSCAPE'}
                </button>
              )}
            </div>
            
            <footer className="pt-6 opacity-20 text-[7px] text-center font-black tracking-[1em]">
              Aurelius Pipeline // komsin.com
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VectorizeEngine() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <VectorContent />
    </Suspense>
  );
}