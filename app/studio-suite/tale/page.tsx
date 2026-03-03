'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, Download, ArrowLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';

export default function AriesAIStudio() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');

  // 💾 ฟังก์ชันเซฟ PNG สำรอง
  const downloadImage = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Komsin-Backup-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(generatedImage, '_blank');
    }
  };

  // 🚀 ฟังก์ชัน Combo: เซฟสำรอง + ส่งไปหน้า Vector
  const handleTransferWithBackup = async () => {
    await downloadImage(); // เซฟ PNG ลงเครื่องก่อน
    router.push(`/studio-suite/vector?source=${encodeURIComponent(generatedImage)}`);
  };

  const handleLaunchNode = async () => {
    if (!prompt.trim() || status === 'generating') return;
    setStatus('generating');
    try {
      const res = await fetch('/api/aries-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.url) {
        setGeneratedImage(data.url);
        setStatus('ready');
      } else throw new Error();
    } catch (e) { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono uppercase">
      <header className="flex justify-between items-center mb-10 text-[10px] font-black italic">
        <Link href="/studio-suite" className="text-zinc-600 hover:text-white flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Suite
        </Link>
        <div className="text-cyan-500 tracking-widest">Aurelius Studio | By Komsin</div>
      </header>

      <h1 className="text-4xl md:text-[80px] font-black italic leading-[0.85] mb-12 tracking-tighter">
        Aries AI Studio<br /> 
        <span className="text-zinc-900">Neural Manifest v3</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
          <textarea
            className="w-full h-64 bg-black border border-white/10 rounded-2xl p-6 text-sm text-zinc-300 outline-none focus:border-cyan-500/50 resize-none italic shadow-inner"
            placeholder="Describe your design vision..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleLaunchNode} 
            disabled={status === 'generating'}
            className="w-full py-7 mt-8 rounded-2xl font-black text-[13px] tracking-[0.4em] bg-white text-black hover:bg-cyan-400 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
          >
            {status === 'generating' ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
            {status === 'generating' ? 'Synthesizing...' : 'Launch Aries Node'}
          </button>
        </div>

        <div className="bg-[#080808] border border-white/5 rounded-[3.5rem] relative min-h-[550px] flex items-center justify-center overflow-hidden shadow-2xl group">
          {generatedImage ? (
            <div className="w-full h-full relative p-12">
              <img src={generatedImage} alt="By Komsin" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-6">
                <button 
                  onClick={handleTransferWithBackup}
                  className="bg-[#00FF66] text-black px-12 py-5 rounded-2xl font-black text-[10px] flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
                >
                  Open Vector & Backup PNG <MoveRight size={16}/>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-30 italic">
              <p className="text-[10px] font-black tracking-widest uppercase">
                {status === 'generating' ? 'Manifesting Image...' : 'Awaiting Sequence'}
              </p>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between opacity-20 text-[8px] font-black italic">
        <span>By Komsin Studio</span>
        <span>© 2026 komsin.com</span>
      </footer>
    </div>
  );
}