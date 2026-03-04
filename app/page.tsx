'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; 
// @ts-ignore
import ColorThief from 'colorthief';
import { 
  Zap, ArrowRight, ShoppingBag, Maximize2, Eraser, Cpu, 
  Palette, Layout, Wand2, Zap as ZapIcon, Monitor, ChevronRight,
  Twitter, UserPlus, Briefcase, Loader2, MessageCircle, Copy, Check,
  Instagram, Music2, Bookmark, HeartHandshake, ExternalLink,
  LogIn // ✅ เพิ่ม LogIn icon
} from 'lucide-react';


declare global {
  interface Window { 
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToCmyk = (hex: string) => {
  let { r, g, b } = hexToRgb(hex);
  let r_p = r / 255, g_p = g / 255, b_p = b / 255;
  let k = 1 - Math.max(r_p, g_p, b_p);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  let c = (1 - r_p - k) / (1 - k), m = (1 - g_p - k) / (1 - k), y = (1 - b_p - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
};

export default function AureliusCentralHub() {
  const router = useRouter(); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [systemTime, setSystemTime] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeColor, setActiveColor] = useState<'Black' | 'White'>('Black');
  const [currentUser, setCurrentUser] = useState<any>(null); 

  const [paletteImage, setPaletteImage] = useState<string | null>('/designs/store.jpg');
  const [colors, setColors] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleAccess = (role: 'admin' | 'staff', path: string) => {
  const inputPass = prompt(`ACCESS REQUIRED: Enter ${role.toUpperCase()} Key`);
  
  // 🚩 จุดที่ต้องแก้: การดึงค่าจาก process.env ใน Client Component บางครั้งอาจมีปัญหา
  // แนะนำให้เช็คว่าค่าเหล่านี้ "ไม่ว่าง" ก่อนทำงานครับ
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_PASS; 
  const staffKey = process.env.NEXT_PUBLIC_STAFF_PASS; 
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

  if (role === 'admin') {
    // ⚠️ ถ้าพี่ไม่ได้ Login ด้วยเมล Admin ไว้ มันจะดีดไป access-denied ทันที
    if (currentUser?.email === adminEmail && inputPass === adminKey) {
      router.push(path);
    } else {
      alert("ADMIN PRIVILEGE REQUIRED OR WRONG KEY"); // ใส่ Alert บอกเหตุผลหน่อยจะดีครับ
      router.push('/access-denied');
    }
  } else {
    if (inputPass === staffKey) {
      router.push(path);
    } else {
      router.push('/access-denied');
    }
  }
};

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert([{ email: email }]);
      if (error) {
        if (error.code === '23505') setIsRegistered(true);
        else throw error;
      } else {
        setIsRegistered(true);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractColors = () => {
    if (!imgRef.current) return;
    const colorThief = new ColorThief();
    if (imgRef.current.complete && imgRef.current.naturalWidth !== 0) {
      try {
        const palette: any = colorThief.getPalette(imgRef.current, 6); // ✅ ใส่ any เพื่อแก้ติดแดง
        const hexPalette = palette.map((rgb: number[]) => 
          `#${rgb.map((x: number) => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
        );
        setColors(hexPalette);
      } catch (e) {
        console.warn("Palette extraction failed: Check CORS or image integrity.");
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    checkUser();

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "bb3a398a-7f99-4ace-834f-c021cc046220";
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);

    const handleMouseMove = (e: MouseEvent) => { setMousePos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener('mousemove', handleMouseMove);
    const timerInterval = setInterval(() => { setSystemTime(new Date().toLocaleTimeString()); }, 1000);
    
    if (imgRef.current && imgRef.current.complete) {
        extractColors();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative text-left flex flex-col italic">
      
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.12), transparent 70%)` }} />

      {/* 🧭 NAVIGATION - NO DROPDOWN VERSION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 shadow-2xl">
          
          {/* [LEFT] LOGO */}
          <Link href="/" className="flex items-center gap-4 group flex-shrink-0">
            <div className="relative w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all text-black">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">
                AURELIUS<span className="text-cyan-500 text-2xl">X</span>
              </h1>
              <span className="text-[7px] tracking-[0.4em] text-zinc-500 font-black uppercase leading-none italic">By komsin.com</span>
            </div>
          </Link>

          {/* [CENTER] NAVIGATION LINKS - จัดวางตรงกลางพอดี */}
          <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase italic tracking-[0.2em] text-zinc-400 absolute left-1/2 -translate-x-1/2">
              <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
              <Link href="/updates" className="hover:text-cyan-400 transition-colors">Features</Link>
              <Link href="/studio-pod/mygallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
              <Link href="/metadata" className="hover:text-cyan-400 transition-colors">Metadata</Link>
              <Link href="/dashboard" className="text-cyan-500 hover:text-white transition-colors">Profile</Link>
              <Link href="/shop" className="text-cyan-500 hover:text-white transition-colors">Refill XP</Link>
             
          </div>

          {/* [RIGHT] AUTH SECTION - แทนที่ Dropdown เดิม */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-[10px] font-black uppercase italic text-white border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  SIGN IN
                </Link>
                <Link 
                  href="/login?mode=signup" 
                  className="px-5 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase italic rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  SIGN UP
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[9px] font-black text-white uppercase italic">{currentUser.email?.split('@')[0]}</span>
                  <span className="text-[6px] text-cyan-500 font-black uppercase tracking-widest">Operator_Active</span>
                </div>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase italic text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-52 pb-20 px-6 text-center">
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-[15vw] md:text-[10rem] font-black italic uppercase leading-[0.8] tracking-[-0.05em] mb-12 text-white">
              AURELIUS-X <br/> <span className="text-cyan-500"> STUDIO pod </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6 mt-12 scale-110">
              <Link href="/studio-pod/" className="group bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase italic hover:bg-cyan-500 transition-all flex items-center gap-4 shadow-2xl">
                  <ShoppingBag size={20} /> Tools Designer <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* AI TOOLS SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
          {[
            { icon: Wand2, label: 'Line Art', sub: 'DTP Screen Tool', href: '/art/line-art-lab' },
            { icon: Palette, label: 'Pallet', sub: 'Color Engine', href: '#palette-section' },
            { icon: Layout, label: 'Art Studio', sub: 'Mockup Designer', href: '/art/studio' },
            { icon: Eraser, label: 'Remove BG', sub: 'DTP Utility', href: '/art/studio1' },
            { icon: Maximize2, label: 'AI Upscale', sub: 'DTP AI Power', href: '/art/upscale' },
            { icon: ZapIcon, label: 'Vectorize', sub: 'Instant SVG', href: '/art/vectorize' },
          ].map((tool, i) => (
            <Link key={i} href={tool.href.startsWith('#') ? tool.href : `/studio-pod${tool.href}`} className="group bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] transition-all hover:border-cyan-500/50 block">
                <tool.icon size={20} className="text-cyan-500 mb-3" />
                <h3 className="text-sm font-black italic uppercase text-white">{tool.label}</h3>
                <p className="text-[7px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">{tool.sub}</p>
            </Link>
          ))}
        </section>

        {/* 👕 T-SHIRT DESIGN SOLUTION */}
        <section className="max-w-7xl mx-auto px-6 mb-24 text-left">
          <div className="bg-zinc-900/40 border border-white/5 rounded-[3.5rem] p-8 lg:p-16 relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square bg-black rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group">
                  <img 
                    src={`/designs/${activeColor === 'Black' ? 'mock' : 'ui'}-05.png`} 
                    className="w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-110" 
                    alt="Design Preview" 
                  />
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-500/40 animate-[scan_3s_ease-in-out_infinite] z-20" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[8px] font-black uppercase text-cyan-500 backdrop-blur-md">
                      {activeColor === 'Black' ? 'MOCKUP_MODE' : 'UI_PROTOTYPE'}
                    </span>
                  </div>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-500">
                    <Zap size={16} fill="currentColor" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Aurelius System</span>
                  </div>
                  <h4 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                    DTG / DTF <br/> <span className="text-cyan-500 uppercase">Solution</span>
                  </h4>
                  <p className="text-zinc-500 text-[11px] font-bold uppercase leading-relaxed max-w-sm">
                    Verified DTP Infrastructure // komsin.com <br/>
                    Professional Grade Fabric Printing Technology
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setActiveColor('White')} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-[11px] uppercase italic flex items-center justify-center gap-2 ${activeColor === 'White' ? 'border-white bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-white/5 text-zinc-500 hover:border-white/20'}`}>
                    <div className="w-2 h-2 rounded-full bg-zinc-200 border border-black/10" />
                    White Fabric
                  </button>
                  <button onClick={() => setActiveColor('Black')} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-[11px] uppercase italic flex items-center justify-center gap-2 ${activeColor === 'Black' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-white/5 text-zinc-500 hover:border-cyan-500/20'}`}>
                    <div className="w-2 h-2 rounded-full bg-black border border-white/20" />
                    Black Fabric
                  </button>
                </div>

                <Link href="/studio-pod/art/studio" className="block group/btn">
                  <button className="w-full bg-cyan-500 text-black py-7 rounded-2xl font-black text-xs uppercase italic hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3">
                    EXECUTE PRODUCTION PROTOCOL <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ PALETTE ENGINE */}
        <section id="palette-section" className="max-w-7xl mx-auto px-6 mb-24 text-left">
          <div className="bg-zinc-950/50 border border-white/5 rounded-[3.5rem] p-12 overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/3 space-y-8">
                <h5 className="text-xl font-black italic uppercase flex items-center gap-3"><Palette size={20} className="text-cyan-500" /> Palette Engine</h5>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-black/40 hover:border-cyan-500/50 cursor-pointer overflow-hidden group transition-all">
                    {!paletteImage ? (
                        <span className="text-[9px] font-black text-zinc-600 uppercase italic tracking-widest">Drop Identity Asset</span>
                    ) : (
                        <img src={paletteImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onloadend = () => { setPaletteImage(reader.result as string); setColors([]); };
                        reader.readAsDataURL(file);
                      }
                    }} accept="image/*" />
                </label>
                <div className="space-y-3">
                  {colors.length > 0 ? colors.map((hex, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg shadow-lg border border-white/10" style={{ backgroundColor: hex }} />
                        <div>
                          <p className="text-xs font-mono font-bold text-white">{hex}</p>
                          <p className="text-[9px] font-bold text-cyan-400 uppercase italic">Precision Match</p>
                        </div>
                      </div>
                      <button onClick={() => {navigator.clipboard.writeText(hex); setCopiedColor(hex); setTimeout(()=>setCopiedColor(null), 1000)}} className="text-zinc-600 hover:text-white transition-colors">
                        {copiedColor === hex ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )) : (
                    <div className="py-10 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                        <p className="text-[9px] font-black text-zinc-700 uppercase italic">Waiting for analysis...</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow bg-[#050505] rounded-[2.5rem] border border-white/5 flex items-center justify-center relative min-h-[500px]">
                 {paletteImage && (
                    <img 
                        ref={imgRef} 
                        src={paletteImage} 
                        crossOrigin="anonymous" 
                        onLoad={extractColors} 
                        className="max-h-[420px] object-contain shadow-2xl z-10" 
                    />
                 )}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md z-20">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest italic flex items-center gap-3"><span className="text-cyan-500 animate-pulse">●</span> ENGINE V3.0 // DTP SOLUTION</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#050508] pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20 text-left">
            <div className="col-span-2 lg:col-span-1 space-y-8">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black italic uppercase text-white leading-none">Aurelius<span className="text-cyan-500">X</span></h2>
                <span className="text-[7px] font-black tracking-[0.4em] text-zinc-700 mt-2 uppercase italic">By komsin.com</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="#" className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-cyan-500/50 transition-all"><Twitter size={14} /></a>
                <a href="#" className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-pink-500/50 transition-all"><Instagram size={14} /></a>
                <a href="https://tiktok.com/@bittoken7" className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all"><Music2 size={14} /></a>
                <a href="#" className="w-9 h-9 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500/50 transition-all"><Bookmark size={14} /></a>
                <a href="/support" className="px-4 h-9 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all gap-2 text-[8px] font-black uppercase italic"><HeartHandshake size={14} /> Support</a>
              </div>
            </div>

            {/* 🛡️ INTERNAL LINKS - PROTECTED */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Internal Links</h4>
              <ul className="space-y-3 text-[9px] font-bold text-zinc-500 uppercase italic">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/updates" className="hover:text-white">Fearures</Link></li>
                <li><Link href="/studio-pod/mygallery" className="hover:text-white">Gallery</Link></li>
              
                <li><Link href="/dashboard" className="hover:text-white">Profile</Link></li>
                
                
                
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Marketplaces</h4>
              <ul className="space-y-3 text-[9px] font-bold text-zinc-500 uppercase italic">
                <li><a href="https://etsy.com" target="_blank" className="hover:text-orange-400 flex items-center gap-2">Etsy Store <ExternalLink size={8} /></a></li>
                <li><a href="https://printful.com" target="_blank" className="hover:text-white flex items-center gap-2">Printful Hub <ExternalLink size={8} /></a></li>
                <li><a href="https://redbubble.com" target="_blank" className="hover:text-white flex items-center gap-2">redbubble <ExternalLink size={8} /></a></li>
                <li><a href="https://printify.com" target="_blank" className="hover:text-cyan-400 flex items-center gap-2">printify <ExternalLink size={8} /></a></li>
                <li><Link href="/studio-pod/print-partner" className="hover:text-white">Thai print-partner</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Legal Protocol</h4>
              <ul className="space-y-3 text-[9px] font-bold text-zinc-500 uppercase italic">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/faq" className="hover:text-white">faq</Link></li>
                <li><Link href="/redeem" className="hover:text-white">redeem</Link></li>
                <Link href="/shop" className="text-cyan-500 hover:text-white transition-colors">Refill XP</Link>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-white/5 flex justify-between items-end">
            <div className="text-right space-y-2 ml-auto">
              <div className="text-[10px] font-black text-zinc-400 italic uppercase">System_Time: {systemTime}</div>
              <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] mt-4">© 2026 Aurelius Studio • komsin.com</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan { 0% { top: 0; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
      `}</style>
    </div>
  );
}