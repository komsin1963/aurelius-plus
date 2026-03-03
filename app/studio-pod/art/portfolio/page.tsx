'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, ExternalLink, Zap, Cpu, Brush, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

// จำลองฐานข้อมูลขนาดใหญ่
const allData = [
  { id: 1, title: "NEURAL INTERFACE V.1", category: "AI Art", tech: "Midjourney v6", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000" },
  { id: 2, title: "CYBERNETIC_DREAM.PNG", category: "AI Art", tech: "SDXL 1.0", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000" },
  { id: 3, title: "SKETCH NODE: PORTRAIT", category: "DailyArts", tech: "Graphite Pencil", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000" },
  { id: 4, title: "INK PROTOCOL: ABSTRACTION", category: "DailyArts", tech: "Black Ink", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000" },
  { id: 5, title: "SCI-FI ASSET PACK", category: "Digital Asset", tech: "Blender 4.0", image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000" },
  { id: 6, title: "D-GEN BRUSH COLLECTION", category: "Digital Asset", tech: "Procreate CC", image: "https://images.unsplash.com/photo-1635332305374-11880f08969b?q=80&w=1000" },
  // ... เพิ่มข้อมูลจำลองเพื่อให้เห็นผลการโหลด
  { id: 7, title: "AI EXPLORATION 02", category: "AI Art", tech: "Stable Diffusion", image: "https://images.unsplash.com/photo-1675249141988-2425674cdb5c?q=80&w=1000" },
  { id: 8, title: "HAND DRAWN NODE", category: "DailyArts", tech: "Charcoal", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" },
];

const categoryIcons: any = {
  "AI Art": { icon: Cpu, color: "text-cyan-500" },
  "DailyArts": { icon: Brush, color: "text-yellow-500/80" },
  "Digital Asset": { icon: Download, color: "text-white" }
};

export default function PortfolioPage() {
  const [items, setItems] = useState(allData.slice(0, 6)); // เริ่มต้นโชว์ 6 อัน
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ระบบตรวจจับการเลื่อนถึงขอบล่าง
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasMore && !loading && selectedCategory === 'all') {
      loadMore();
    }
  }, [inView]);

  const loadMore = () => {
    setLoading(true);
    // จำลองการดึงข้อมูลจาก Server (Delay 1.5 วินาที)
    setTimeout(() => {
      const nextItems = allData.slice(items.length, items.length + 3);
      if (nextItems.length > 0) {
        setItems([...items, ...nextItems]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 1500);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setHasMore(cat === 'all'); // ปิด Infinite Scroll ถ้าเลือกหมวดหมู่เฉพาะ (เพื่อความง่ายในตัวอย่าง)
    setItems(cat === 'all' ? allData.slice(0, 6) : allData.filter(p => p.category === cat));
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-mono relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* HEADER */}
        <header className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 mb-8 text-[10px] font-black uppercase tracking-widest italic">
            <ArrowLeft size={16} /> Return_to_Base
          </Link>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            VISUAL <span className="text-cyan-400">ARCHIVE</span>
          </h1>
        </header>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-3 mb-16">
          {['all', 'AI Art', 'DailyArts', 'Digital Asset'].map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase italic tracking-widest transition-all ${selectedCategory === cat ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((project) => (
            <div key={project.id} className="group relative aspect-[16/10] bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500">
              <img src={project.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-20 transition-all duration-700 grayscale group-hover:grayscale-0" alt="" />
              
              {/* HUD OVERLAY */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                    {React.createElement(categoryIcons[project.category].icon, { size: 18, className: categoryIcons[project.category].color })}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-cyan-500 uppercase italic">Protocol</p>
                    <p className="text-[10px] font-bold text-white uppercase italic">{project.tech}</p>
                  </div>
                </div>
                <div>
                  <p className={`${categoryIcons[project.category].color} text-[9px] font-black uppercase tracking-[0.3em] mb-1`}>{project.category}</p>
                  <h3 className="text-2xl font-black italic uppercase text-white">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOADING INDICATOR / TRIGGER NODE */}
        {hasMore && selectedCategory === 'all' && (
          <div ref={ref} className="mt-20 py-10 flex flex-col items-center justify-center border-t border-white/5">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-cyan-500 animate-spin" size={32} />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Fetching_More_Assets...</span>
              </div>
            ) : (
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[1em]">Scroll_To_Inject_Data</span>
            )}
          </div>
        )}

        {!hasMore && (
          <div className="mt-20 py-10 text-center border-t border-white/5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">--- End_Of_Archive ---</span>
          </div>
        )}
      </div>
    </div>
  );
}