"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, Save, Power, FilePlus } from 'lucide-react'; // เพิ่ม Icon เพื่อความสวยงาม

export default function AureliusFixedMaster() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("READY");
  const [isDragging, setIsDragging] = useState(false);
  const [lastSave, setLastSave] = useState<string>("-");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [script, setScript] = useState(`// AURELIUS TERMINAL BY KOMSIN\napp.activeDocument.activeLayer.translate(100, 100);`);

  // --- 1. ระบบ AUTO-DOWNLOAD & MESSAGE LISTENER ---
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // ตรวจสอบที่มาของข้อมูลเพื่อความปลอดภัย
      if (e.source !== iframeRef.current?.contentWindow) return;
      
      if (e.data instanceof ArrayBuffer) {
        const blob = new Blob([e.data], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const timestamp = new Date().getTime();
        link.download = `Aurelius_Project_${timestamp}_By_komsin.png`;
        link.click();
        
        setStatus("DOWNLOADED ✅");
        setLastSave(new Date().toLocaleTimeString());
        setTimeout(() => setStatus("READY"), 3000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // --- 2. ระบบ AUTO-SAVE TIMER ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSaveEnabled && status === "READY") {
      interval = setInterval(() => {
        runScript(`app.activeDocument.saveToOE("png");`);
      }, 300000); // 5 นาที
    }
    return () => clearInterval(interval);
  }, [autoSaveEnabled, status]);

  // --- 3. ฟังก์ชันหลัก (Core Functions) ---
  
  const sendToPhotopea = async (file: File) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    setStatus("IMPORTING...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const message = {
        files: [arrayBuffer],
        environment: { saveStep: true, open: true }
      };
      iframeRef.current.contentWindow.postMessage(message, "*");
      setStatus("READY");
    } catch (error) {
      console.error("Import Error:", error);
      setStatus("ERROR ❌");
    }
  };

  const runScript = (customScript?: string) => {
    const scriptToRun = customScript || script;
    setStatus("RUNNING...");
    iframeRef.current?.contentWindow?.postMessage({ script: scriptToRun }, "*");
    setTimeout(() => setStatus("READY"), 2000);
  };

  const openAdvanced = () => {
    setStatus("INIT CANVAS...");
    const initScript = `app.documents.add(4500, 5400, 300, "Aurelius_Work", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);`;
    iframeRef.current?.contentWindow?.postMessage({ script: initScript, environment: { saveStep: true } }, "*");
  };

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="px-6 h-[60px] flex justify-between items-center bg-black border-b border-white/10 z-30 shadow-2xl">
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
            AURELIUS <span className="text-cyan-400">STUDIO</span>
          </h1>
          <p className="text-[8px] text-zinc-500 tracking-[0.4em] uppercase font-bold mt-1">BY KOMSIN</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-1.5 rounded-full border border-white/5">
            <span className="text-[10px] text-zinc-600 uppercase italic">Status:</span>
            <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">{status}</span>
            <div className={`w-2 h-2 rounded-full ${status === 'READY' ? 'bg-cyan-500 animate-pulse' : 'bg-yellow-500 animate-bounce'}`}></div>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-grow flex overflow-hidden relative">
        
        {/* SIDEBAR: ASSET & CONTROL */}
        <aside 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) sendToPhotopea(e.dataTransfer.files[0]); }}
          className={`w-[320px] min-w-[320px] h-full p-5 flex flex-col gap-6 border-r border-white/10 overflow-y-auto bg-[#050505] z-20 transition-all ${isDragging ? 'bg-cyan-950/20 ring-2 ring-inset ring-cyan-500/50' : ''}`}
        >
          {/* Asset Manager */}
          <section className="space-y-3">
            <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase underline underline-offset-8 decoration-cyan-500/30">Asset Manager</h3>
            <div className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${isDragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/5 bg-zinc-900/30'}`}>
              <span className="text-[8px] font-black tracking-widest text-zinc-600 uppercase">
                {isDragging ? 'Drop Image' : 'Drag & Drop Assets'}
              </span>
            </div>
            <label className="block">
              <div className="h-10 bg-white text-black text-[9px] font-black flex items-center justify-center rounded-xl hover:bg-cyan-400 cursor-pointer uppercase tracking-widest transition-all">
                <FilePlus size={14} className="mr-2"/> Select File
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && sendToPhotopea(e.target.files[0])} />
            </label>
          </section>

          {/* Terminal & Auto-Save */}
          <section className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
              <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">System Monitor</h3>
              <button 
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className={`p-1 rounded ${autoSaveEnabled ? 'text-cyan-400' : 'text-zinc-700'}`}
              >
                <Power size={14} />
              </button>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between text-[7px] uppercase font-bold text-zinc-500">
                <span>Auto-Save (5m):</span>
                <span className={autoSaveEnabled ? 'text-green-500' : 'text-red-500'}>{autoSaveEnabled ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex justify-between text-[7px] uppercase font-bold text-zinc-500">
                <span>Last Backup:</span>
                <span className="text-cyan-400">{lastSave}</span>
              </div>
            </div>
            
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="w-full h-24 bg-black border border-white/5 rounded-lg p-3 text-[10px] font-mono text-cyan-500/80 outline-none resize-none" />
            <button onClick={() => runScript()} className="w-full h-10 bg-cyan-600 text-black font-black text-[9px] rounded-xl hover:bg-cyan-400 uppercase tracking-widest transition-all">
              Run Terminal ⚡
            </button>
          </section>

          {/* Studio Manual */}
          <section className="mt-auto pt-4 border-t border-white/5 opacity-50">
             <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Industrial Protocol</div>
             <div className="text-[7px] text-zinc-700 leading-relaxed uppercase font-bold">
                PROJ: 4500x5400px @300DPI<br/>
                AUTH: BY KOMSIN
             </div>
          </section>
        </aside>

        {/* PHOTOPEA ENGINE */}
        <section className="flex-grow flex flex-col bg-zinc-950 overflow-hidden relative">
          <div className="px-5 h-[45px] border-b border-white/5 bg-black flex justify-between items-center shadow-lg">
            <span className="text-[8px] font-black text-zinc-700 tracking-widest uppercase italic font-mono flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Precision Engine V3.0 // komsin.com
            </span>
            <button onClick={openAdvanced} className="h-7 px-4 bg-zinc-900 text-white text-[8px] font-black rounded-full border border-white/10 hover:bg-cyan-500 hover:text-black transition-all uppercase">
              Initialize Canvas
            </button>
          </div>
          
          <div className="flex-grow relative bg-[#1e1e1e]">
            <iframe 
              ref={iframeRef} 
              src="https://www.photopea.com#%7B%22environment%22:%7B%7D%7D" 
              className="absolute inset-0 border-none w-full h-full"
              title="Photopea Engine" 
            />
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="h-[35px] border-t border-white/5 flex items-center justify-between px-6 bg-black">
        <p className="text-[8px] text-zinc-700 uppercase tracking-[0.4em] font-mono italic">
          AURELIUS STUDIO • INDUSTRIAL STANDARD
        </p>
        <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest">
          {new Date().getFullYear()} © komsin.com
        </p>
      </footer>
    </div>
  );
}