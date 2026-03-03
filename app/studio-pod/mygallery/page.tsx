"use client";
import { useState } from 'react';
import { 
  Maximize2, Download, Printer, X, Box, Database, ShieldCheck, Zap 
} from 'lucide-react';

export default function AureliusVault() {
  // 📸 รายชื่อไฟล์ตามจริงที่พี่ใช้ (ตรวจสอบชื่อไฟล์ใน public/gallery ให้ตรงกันนะครับ)
  const [images] = useState([
    { id: 'AX-V1-001', name: 'Thunder Giant V1', filename: 'mockup_001.jpg' },
    { id: 'AX-V1-002', name: 'Electro Yaksa V2', filename: 'mockup_002.jpg' },
    { id: 'AX-V1-003', name: 'Cyber Guardian V3', filename: 'mockup_003.jpg' },
    { id: 'AX-V1-004', name: 'Neon Sentinel V4', filename: 'mockup_004.jpg' },
    { id: 'AX-V1-005', name: 'Volt Overlord V5', filename: 'mockup_005.jpg' },
    { id: 'AX-V1-006', name: 'Thunder Giant V1', filename: 'mockup_006.jpg' },
    { id: 'AX-V1-007', name: 'Electro Yaksa V2', filename: 'mockup_007.jpg' },
    { id: 'AX-V1-008', name: 'Cyber Guardian V3', filename: 'mockup_008.jpg' },
    { id: 'AX-V1-009', name: 'Neon Sentinel V4', filename: 'mockup_009.jpg' },
    { id: 'AX-V1-010', name: 'Volt Retro V5', filename: 'mockup_010.jpg' },
    { id: 'AX-V1-011', name: 'Thunder Retro V1', filename: 'mockup_011.jpg' },
    { id: 'AX-V1-012', name: 'Electro Retro V2', filename: 'mockup_012.jpg' },
    { id: 'AX-V1-013', name: 'Cyber Retro V3', filename: 'mockup_013.jpg' },
    { id: 'AX-V1-0014', name: 'Neon Retro V4', filename: 'mockup_014.jpg' },
    { id: 'AX-V1-015', name: 'Volt Cyber Rabbit V5', filename: 'mockup_015.jpg' },
  ]);

  const [selectedImg, setSelectedImg] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8 font-sans italic selection:bg-cyan-500/30">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 mb-2">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-cyan-500/60">Verified_Asset_Vault</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            AURELIUS <span className="text-cyan-500 text-7xl block mt-1">VAULT</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
           <div className="flex items-center gap-3 justify-end text-cyan-400 font-black">
             <span className="text-4xl italic tracking-tighter">{images.length}</span>
             <span className="text-[9px] uppercase font-bold text-zinc-500 leading-none text-left">Active<br/>Mockups</span>
          </div>
        </div>
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="group relative bg-zinc-900/10 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]"
          >
            {/* Image Box */}
            <div 
              className="aspect-[3/4] cursor-zoom-in overflow-hidden relative bg-black"
              onClick={() => setSelectedImg(img)}
            >
              <img 
                src={`/gallery/${img.filename}`} 
                alt={img.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e:any) => {
                    e.target.src = "https://via.placeholder.com/400x533/020205/06b6d4?text=AURELIUS+ASSET";
                }}
              />
              
              {/* ✨ ลายน้ำ AURELIUS STUDIO ตรงชายเสื้อ (บางๆ 10% opacity) */}
              <div className="absolute bottom-4 left-0 w-full text-center z-20 pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 italic drop-shadow-md">
                  AURELIUS STUDIO // V1
                </span>
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-10" />
              
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/20 translate-y-[-100%] group-hover:animate-scan z-30" />
            </div>

            {/* Info Box */}
            <div className="p-5 flex justify-between items-center bg-zinc-900/20">
              <div className="w-full">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{img.id}</p>
                <h3 className="text-[11px] font-black text-white truncate uppercase italic tracking-tight">{img.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedImg(img)}
                className="p-2.5 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all shadow-lg"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- LIGHTBOX (ZOOM VIEW) --- */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-all hover:rotate-90 p-4"
          >
            <X size={40} />
          </button>

          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-12 items-center">
            <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
              <img 
                src={`/gallery/${selectedImg.filename}`} 
                className="w-full max-w-[450px] transition-transform duration-700 group-hover:scale-105"
                alt="Preview"
                onError={(e:any) => e.target.src = "https://via.placeholder.com/400x533/020205/06b6d4?text=IMAGE+NOT+FOUND"}
              />
              {/* ลายน้ำในหน้า Lightbox ด้วย (ปรับชัดขึ้นนิดเป็น 20%) */}
              <div className="absolute bottom-6 left-0 w-full text-center z-20">
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 italic">
                  AURELIUS STUDIO // PROTOTYPE
                </span>
              </div>
            </div>
            
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="border-l-4 border-cyan-500 pl-8">
                 <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">{selectedImg.name}</h2>
                 <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Asset_Node: {selectedImg.id} // Local_Index</p>
              </div>

              <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
                <button className="bg-cyan-500 text-black py-6 rounded-2xl font-black text-sm uppercase italic flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <Printer size={20} /> INITIALIZE PRINT
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`/gallery/${selectedImg.filename}`} 
                    download 
                    className="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase italic flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
                  >
                    <Download size={16} /> SAVE_DISK
                  </a>
                  <button className="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase italic flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-black transition-all">
                    <Zap size={16} /> ANALYZE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Scan Effect */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}