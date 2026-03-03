'use client';

import React, { useState } from 'react';
import { ShoppingCart, Download, Star, ArrowRight } from 'lucide-react';

// 🔑 ข้อมูล Supabase และการเชื่อมโยงแบรนด์ของคุณคมศิลป์
const PROJECT_ID = "sriunfblgxorzzvzmpmf"; 
const BUCKET = "market-previews";
const BASE_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/mockups`;

const CATEGORIES = [
  'thai-art', 'cyber', 'retro', 'industrial', 
  'pop-art', 'graffiti', 'minimal', '3d', 
  'pixel', 'vector', 'holidays'
];

// 🧠 รายการสินค้าทดสอบ (ดึงรูปจากโฟลเดอร์ Free เป็นหลัก)
const ALL_PRODUCTS = CATEGORIES.flatMap((cat) => {
  return [
    {
      id: `${cat}-1`,
      name: `${cat.replace('-', ' ')} #01`,
      category: cat,
      price: 0,
      image: `${BASE_URL}/${cat}/free/free_thumb.jpg`,
      type: 'FREE ASSET'
    },
    {
      id: `${cat}-2`,
      name: `${cat.replace('-', ' ')} BUNDLE`,
      category: cat,
      price: 6.00,
      image: `${BASE_URL}/${cat}/free/free_thumb.jpg`,
      type: 'PREMIUM',
      isBundle: true
    }
  ];
});

export default function AureliusMarket() {
  const [activeTab, setActiveTab] = useState('all');

  const displayProducts = activeTab === 'all' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#020203] text-white py-12 px-6 italic uppercase font-sans selection:bg-cyan-500/30">
      
      {/* 🏛️ HEADER & BRANDING */}
      <header className="max-w-[1800px] mx-auto mb-16 border-b border-white/5 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-7xl md:text-9xl font-black italic text-cyan-500 tracking-tighter leading-[0.8]">
              AURELIUS MARKET
            </h1>
            <p className="text-zinc-500 mt-6 font-bold tracking-[0.4em] text-[10px]">
              BY KOMSIN / PREMIUM DIGITAL ASSETS / EST. 2026
            </p>
          </div>
          <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 backdrop-blur-md text-right">
             <p className="text-cyan-500 font-black text-[11px] flex items-center justify-end gap-3 mb-1">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></span> 
              PREVIEW MODE ACTIVE
            </p>
            <p className="text-zinc-500 text-[9px] font-bold">ออกแบบและจำหน่ายทั่วโลก / SHIPPING WORLDWIDE</p>
          </div>
        </div>
        
        {/* 🏷️ CATEGORY NAV */}
        <nav className="flex gap-3 mt-16 overflow-x-auto pb-6 no-scrollbar pt-10 border-t border-white/5">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-10 py-3 rounded-full text-[10px] font-black transition-all border ${activeTab === 'all' ? 'bg-white text-black' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
          >
            ALL ASSETS
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)} 
              className={`px-10 py-3 rounded-full text-[10px] font-black transition-all border whitespace-nowrap ${activeTab === cat ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </header>

      {/* 🖼️ ASSET GRID */}
      <main className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {displayProducts.map((p) => (
          <div key={p.id} className="group bg-[#080808] rounded-[3.5rem] overflow-hidden border border-white/5 relative hover:border-cyan-500/30 transition-all duration-700 shadow-2xl">
            {p.isBundle && (
              <div className="absolute top-8 right-8 z-30 bg-yellow-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xl">
                <Star size={12} fill="black" /> BEST VALUE BUNDLE
              </div>
            )}
            <div className="aspect-[4/5] relative bg-zinc-900">
               <img 
                 src={p.image} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
                 alt={p.name}
                 loading="lazy"
                 onError={(e) => {
                   e.currentTarget.src = `https://sriunfblgxorzzvzmpmf.supabase.co/storage/v1/object/public/market-previews/mockups/thai-art/free/free_thumb.jpg`;
                 }}
               />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-10">
                  <button className="w-full py-6 bg-cyan-500 text-black font-black rounded-[2rem] hover:bg-white transition-all flex items-center justify-center gap-3 text-xs">
                    {p.price === 0 ? <><Download size={20} /> FREE</> : <><ShoppingCart size={20} /> BUY ${p.price.toFixed(2)}</>}
                  </button>
                  <p className="text-zinc-500 text-[8px] mt-6 tracking-widest font-bold uppercase">KOMSIN.COM</p>
               </div>
            </div>
            <div className="p-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-cyan-500/80 text-[10px] font-black tracking-[0.2em]">{p.type}</span>
                <span className="text-white text-lg font-black italic">${p.price.toFixed(2)}</span>
              </div>
              <h3 className="text-2xl font-black leading-none tracking-tighter">{p.name}</h3>
            </div>
          </div>
        ))}
      </main>

      {/* 🛒 FLOATING GLOBAL SHOPPING (ETSY LINK) */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hidden md:block shadow-2xl">
          <p className="text-[9px] font-black tracking-[0.2em] text-cyan-500 mb-1">DESIGNED FOR GLOBAL MARKET</p>
          <p className="text-[10px] text-zinc-400 font-bold italic lowercase">ออกแบบและจำหน่ายทั้งในประเทศไทย และต่างประเทศ</p>
        </div>
        <a 
          href="https://aureliusx.etsy.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 bg-[#f56400] hover:bg-white text-white hover:text-black px-8 py-4 rounded-full font-black transition-all duration-500 shadow-[0_0_20px_rgba(245,100,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] opacity-80 mb-1 font-bold">GLOBAL STORE</span>
            <span className="text-sm tracking-tighter font-black">SHOP ON ETSY</span>
          </div>
          <div className="bg-white/20 group-hover:bg-black/10 p-2 rounded-full transition-colors">
            <ArrowRight size={20} />
          </div>
          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-black/20 animate-pulse"></div>
        </a>
      </div>

      <footer className="max-w-[1800px] mx-auto mt-40 text-center border-t border-white/5 pt-16 pb-20 opacity-30">
        <a href="https://komsin.com" className="hover:text-cyan-500 transition-colors">
          <p className="text-[10px] font-black tracking-[0.8em]">© 2026 AURELIUS STUDIO BY KOMSIN.COM</p>
        </a>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}