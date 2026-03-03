'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, Layers, Maximize2, Download, Package
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// --- CONFIGURATION ---
const PROJECT_ID = "sriunfblgxorzzvzmpmf"; 
// ปรับ Base URL ให้ชี้ไปที่ Root ของ Bucket ตามที่คุณต้องการ
const MOCKUP_BASE_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/market-previews`;
const ASSET_BASE_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/aurelius-assets`;

// --- DATA GENERATOR (ดึงไฟล์รวมจาก Root ไม่แยก Folder) ---
const ALL_DESIGNS = Array.from({ length: 24 }).map((_, i) => {
  const fileId = (i + 1).toString().padStart(3, '0');
  return {
    id: `design-${fileId}`,
    name: `AURELIUS MOCKUP ${fileId}`,
    // ดึงไฟล์ mockup ตรงๆ จาก root (เช่น mockup_001.jpg)
    image: `${MOCKUP_BASE_URL}/mockup_${fileId}.jpg`, 
    // ดึงไฟล์ zip ตรงๆ จาก root (เช่น mockup_001.zip)
    downloadUrl: `${ASSET_BASE_URL}/mockup_${fileId}.zip`,
    archiveCode: `ARV-S26-${fileId}`
  };
});

export default function AureliusPreviewStore() {
  return (
    <div className="min-h-screen bg-[#020203] text-white py-12 px-6 italic uppercase font-sans selection:bg-cyan-500 selection:text-black">
      <Toaster position="top-right" />
      
      {/* HEADER SECTION */}
      <header className="max-w-[1600px] mx-auto mb-16 border-b border-white/5 pb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic text-cyan-500 tracking-tighter leading-none">
            AURELIUS <span className="text-white text-glow">STUDIO</span>
          </h1>
          <p className="text-zinc-500 mt-4 font-bold tracking-[0.2em] text-[10px] flex items-center gap-3">
            <Package size={14} className="text-cyan-500" /> CENTRAL_ASSET_REPOSITORY // STAFF_ONLY
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-zinc-600 font-black tracking-widest mb-1">TOTAL_RECORDS</p>
          <p className="text-2xl font-black tabular-nums">{ALL_DESIGNS.length}</p>
        </div>
      </header>

      {/* DESIGN GRID */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {ALL_DESIGNS.map((design) => (
          <div key={design.id} className="group relative bg-[#0a0a0c] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-700 shadow-2xl">
            
            {/* IMAGE PREVIEW */}
            <div className="aspect-[4/5] relative overflow-hidden bg-[#050505]">
              <img 
                src={design.image} 
                alt={design.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out" 
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x1000/0a0a0c/333333?text=NO_IMAGE_FOUND'; }}
              />
              
              {/* SCANLINE EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full -translate-y-full group-hover:animate-scan pointer-events-none" />

              {/* FLOATING ARCHIVE CODE */}
              <div className="absolute top-6 left-6 z-10">
                 <p className="text-[8px] font-black tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">{design.archiveCode}</p>
              </div>

              {/* ACTION OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                  <a 
                    href={design.downloadUrl}
                    download
                    className="bg-cyan-500 text-black p-5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:scale-110 active:scale-95"
                  >
                    <Download size={24} strokeWidth={3} />
                  </a>
              </div>
            </div>

            {/* INFO AREA */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                 <div className="space-y-1">
                    <p className="text-cyan-500 text-[8px] font-black tracking-[0.4em] italic leading-none">AURELIUS_ASSET</p>
                    <h3 className="text-lg font-black tracking-tighter italic uppercase leading-tight group-hover:text-cyan-400 transition-colors">
                      {design.name}
                    </h3>
                 </div>
              </div>
              
              <a 
                href={design.downloadUrl}
                className="w-full py-4 bg-white/5 text-zinc-500 border border-white/5 rounded-xl font-black text-[9px] tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all active:scale-95"
              >
                DOWNLOAD_ZIP_ASSET <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-30">
        <p className="text-[8px] font-black tracking-[0.4em]">© 2026 AURELIUS_STUDIO // MASTER_HUB</p>
        <div className="flex gap-8">
            <span className="text-[8px] font-black tracking-[0.2em] underline decoration-cyan-500">KOMSIN.COM</span>
            <span className="text-[8px] font-black tracking-[0.2em]">ADMIN_STAFF_PANEL_V2</span>
        </div>
      </footer>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .text-glow { text-shadow: 0 0 20px rgba(6, 182, 212, 0.4); }
      `}</style>
    </div>
  );
}