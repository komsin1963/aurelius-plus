'use client';

import { useState } from 'react';
import { 
  Zap, Terminal, ArrowUpRight, Lightbulb, 
  Sparkles, Layers, Palette, Scissors, 
  Printer, Languages, Coins, CheckCircle2, 
  Database, Layout, Filter 
} from 'lucide-react';
import Link from 'next/link';

// --- 🛠️ 8 TOOLS DATA (เพิ่ม Reduce Color ที่ ui-09) ---
const studioToolsGuide = [
  {
    id: "reduce-color",
    title: "Reduce Color (Smart Indexed)",
    icon: <Filter size={24} />,
    color: "text-pink-500",
    desc: "ลดจำนวนสีในภาพให้เหลือเฉพาะสีหลัก (Spot Colors) พร้อมเพิ่มความคมชัดของขอบภาพ (Edge Sharpening)",
    proTip: "เหมาะสำหรับเตรียมไฟล์ส่งโรงพิมพ์สกรีนที่จำกัดจำนวนสี ช่วยให้การแยกบล็อกทำได้ง่ายและประหยัดค่าบล็อก",
    xpCost: "10 XP",
    image: "/designs/ui-09.png" 
  },
  {
    id: "metadata-master",
    title: "Metadata Master",
    icon: <Database size={24} />,
    color: "text-blue-500",
    desc: "ฝังข้อมูลลิขสิทธิ์และรายละเอียดเทคนิคลงในไฟล์ภาพ เพื่อการจัดการ Asset ระดับมืออาชีพ",
    proTip: "ใช้ฟีเจอร์นี้ฝังค่า DPI และชื่อผู้ออกแบบ เพื่อให้ระบบจัดเก็บไฟล์ใน Server ได้อย่างถูกต้อง",
    xpCost: "10 XP",
    image: "/designs/ui-07.png" 
  },
  {
    id: "mockup-engine",
    title: "Mockup Engine",
    icon: <Layout size={24} />,
    color: "text-orange-500",
    desc: "ระบบจำลองลายพิมพ์บนพื้นผิวจริง (Realistic Mockup) เพื่อตรวจเช็คสเกลก่อนสั่งผลิต",
    proTip: "แนะนำให้ใช้คู่กับไฟล์ที่ผ่านการ 'Remove BG' มาแล้วเพื่อความเนียนสมจริงที่สุด",
    xpCost: "Free",
    image: "/designs/ui-08.png" 
  },
  {
    id: "palette-lab",
    title: "AI Palette Generator",
    icon: <Palette size={24} />,
    color: "text-cyan-500",
    desc: "สกัดชุดสี (Color Palette) จากภาพต้นฉบับ เพื่อใช้ในการคุมโทนงานพิมพ์สกรีน",
    proTip: "ใช้ฟีเจอร์นี้ก่อนส่งงานเข้า CMYK Lab เพื่อเช็คว่าสีไหนเป็นสีพิเศษ",
    xpCost: "5 XP",
    image: "/designs/ui-02.png" 
  },
  {
    id: "vectorize",
    title: "Image to Vector",
    icon: <Zap size={24} />,
    color: "text-yellow-500",
    desc: "แปลงภาพ Pixel เป็นลายเส้น Vector คมชัดสูง รองรับการขยายใหญ่โดยภาพไม่แตก",
    proTip: "เหมาะสำหรับโลโก้ที่ต้องการส่งเข้าเครื่องตัดสติ๊กเกอร์",
    xpCost: "15 XP",
    image: "/designs/ui-03.png" 
  },
  {
    id: "line-art",
    title: "Line Art Lab",
    icon: <Layers size={24} />,
    color: "text-purple-500",
    desc: "เปลี่ยนภาพถ่ายหรือภาพ AI ให้เป็นลายเส้น Line Art แนว Drawing สไตล์มังงะ",
    proTip: "ปรับค่า Threshold ให้สูงขึ้นหากต้องการลายเส้นที่ดุดัน",
    xpCost: "Free",
    image: "/designs/ui-04.png"
  },
  {
    id: "remove-bg",
    title: "AI Remove BG",
    icon: <Scissors size={24} />,
    color: "text-emerald-500",
    desc: "ตัดฉากหลังออกอย่างรวดเร็วด้วย AI Neural Engine แม่นยำทุกรายละเอียด",
    proTip: "แนะนำให้ส่งต่อไปที่ 'Image to Vector' เพื่อทำไฟล์สติ๊กเกอร์ต่อ",
    xpCost: "10 XP",
    image: "/designs/ui-05.png"
  },
  {
    id: "cmyk-lab",
    title: "CMYK Separation",
    icon: <Printer size={24} />,
    color: "text-red-500",
    desc: "ระบบแยกสีสำหรับงานสกรีน Halftone แยกเพลท C, M, Y, K พร้อมทำบล็อกสกรีน",
    proTip: "ตั้งค่า LPI ให้เหมาะกับเบอร์ผ้า (แนะนำ 45 LPI สำหรับผ้าคอตตอน)",
    xpCost: "25 XP",
    image: "/designs/ui-06.png"
  }
];

const content = {
  th: {
    heroTag: "Studio-Pod Manual",
    heroTitle: "คู่มือเครื่องมือระดับมาสเตอร์",
    heroDesc: "เจาะลึก 8 เครื่องมือในระบบนิเวศน์ AURELIUS สำหรับ Operator มืออาชีพ เพื่อคุณภาพงานผลิตที่ไร้ที่ติ",
    btnLaunch: "เข้าสู่หน้า Studio-Pod",
    sectionTitle: "คู่มือการใช้งานเครื่องมือ",
  },
  en: {
    heroTag: "Studio-Pod Manual",
    heroTitle: "MASTER TOOLKIT GUIDE",
    heroDesc: "Deep dive into 8 AURELIUS tools for professional operators, ensuring flawless production quality.",
    btnLaunch: "Launch Studio-Pod",
    sectionTitle: "Tool Manual & Guides",
  }
};

export default function UpdatePage() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30 uppercase italic">
      
      {/* 🌐 NAV / LANG */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <div className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black shadow-2xl">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-white">1,000 XP</span>
        </div>
        <button 
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black hover:border-cyan-500 transition-all shadow-2xl"
        >
          <Languages size={14} className="text-cyan-500" />
          {lang === 'th' ? 'EN' : 'TH'}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HERO SECTION --- */}
        <section className="relative w-full aspect-[21/9] min-h-[400px] rounded-[3.5rem] overflow-hidden border border-white/5 mb-16 group bg-zinc-900">
          <img 
            src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all duration-1000" 
            alt="BG" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl z-10 text-left">
            <span className="bg-cyan-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full animate-pulse mb-6 inline-block">{t.heroTag}</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 text-white uppercase italic">
              {t.heroTitle}
            </h1>
            <p className="text-zinc-500 text-sm md:text-base font-bold max-w-2xl mb-10 leading-relaxed tracking-wide">
              {t.heroDesc}
            </p>
            <Link href="/studio-pod" className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl">
              {t.btnLaunch} <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>

        {/* --- CONTENT GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <h2 className="text-2xl font-black flex items-center gap-4 tracking-[0.2em] border-b border-white/5 pb-8 uppercase">
              <Terminal className="text-cyan-500" size={24} /> {t.sectionTitle}
            </h2>

            <div className="grid gap-10">
              {studioToolsGuide.map((tool) => (
                <div key={tool.id} className="group bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 hover:bg-zinc-900/40 transition-all relative overflow-hidden text-left shadow-lg">
                  <div className="flex flex-col md:flex-row gap-10 relative z-10">
                    <div className="w-full md:w-64 h-64 bg-black rounded-[2rem] overflow-hidden border border-white/10 flex-shrink-0">
                      <img 
                        src={tool.image} 
                        alt={tool.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                        onError={(e:any) => e.target.src = "https://via.placeholder.com/300x300?text=Module+Updating..."}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${tool.color} bg-white/5 p-3 rounded-2xl`}>{tool.icon}</div>
                        <span className="text-[10px] font-black text-zinc-500 tracking-widest bg-white/5 px-3 py-1 rounded-lg">COST: {tool.xpCost}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4 group-hover:text-cyan-500 transition-colors uppercase italic leading-tight">{tool.title}</h3>
                      <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-6 italic tracking-wide">{tool.desc}</p>

                      <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-2xl flex items-start gap-4">
                        <Lightbulb className="text-cyan-500 shrink-0" size={20} />
                        <p className="text-[11px] font-bold text-zinc-300 leading-relaxed">
                          <span className="text-cyan-500 block mb-1 uppercase font-black">OPERATOR'S SECRET:</span>
                          {tool.proTip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
             <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-2xl sticky top-8 text-left border-l-cyan-500/20 shadow-2xl">
               <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-zinc-400 uppercase tracking-widest">
                 <Terminal size={14} /> SYSTEM STATUS
               </h3>
               <div className="space-y-6">
                 {["Neural Engine", "XP Ledger", "DTP Processor", "Color Indexer"].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center text-[10px] font-black border-b border-white/5 pb-4">
                     <span className="text-zinc-600 uppercase">{stat}</span>
                     <span className="text-green-500 flex items-center gap-2 italic">
                       <CheckCircle2 size={12} /> STABLE
                     </span>
                   </div>
                 ))}
               </div>
               
               <div className="mt-12 p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                 <p className="text-[10px] font-black text-cyan-500/80 uppercase italic tracking-widest mb-2">Notice:</p>
                 <p className="text-[9px] text-zinc-500 leading-relaxed font-bold">
                   ฟีเจอร์ Reduce Color ช่วยเพิ่มความแม่นยำในการแยกสี Halftone ได้มากกว่า 40%
                 </p>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}