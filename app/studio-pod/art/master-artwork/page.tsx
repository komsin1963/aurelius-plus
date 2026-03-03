'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, ArrowLeft, Download, Maximize, ShieldCheck, 
  Loader2, Printer, CheckCircle2, AlertCircle, Coins,
  FileSearch, Activity
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MasterArtworkPage() {
  const router = useRouter();
  const [artwork, setArtwork] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ราคาตามหน้าจอที่คุณตั้งไว้เป๊ะๆ
  const UPSCALE_COST = 2500; 

  useEffect(() => {
    const initMaster = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      // 1. ดึงข้อมูล User (ใช้ชื่อคอลัมน์ xp_balance ที่เราเพิ่ง Alter)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, xp_balance')
        .eq('id', session.user.id)
        .single();
      setUserProfile(profile);

      // 2. ดึงข้อมูล Artwork จาก ID ที่ส่งต่อมาจากหน้า Generator
      const artworkId = localStorage.getItem('current_artwork_id');
      if (artworkId) {
        const { data: art } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', artworkId)
          .single();
        setArtwork(art);
      } else {
        // Fallback ถ้าไม่มี ID ให้กลับไปหน้า Workshop
        router.push('/studio-pod/art/generator');
      }
      setIsLoaded(true);
    };

    initMaster();
  }, [router]);

  const handleNeuralUpscale = async () => {
    if (!artwork || !userProfile) return;
    
    // ตรวจสอบ XP ก่อนเริ่ม
    if ((userProfile?.xp_balance || 0) < UPSCALE_COST && !artwork.is_master_unlocked) {
      return alert("XP ของคุณไม่เพียงพอสำหรับการปลดล็อกไฟล์ Master ครับ");
    }

    setIsUpscaling(true);
    try {
      // 1. ตัด XP ผ่าน RPC (target_user_id, amount_to_deduct) ตาม SQL ที่คุณสร้าง
      if (!artwork.is_master_unlocked) {
        const { error: rpcError } = await supabase.rpc('consume_xp', {
          target_user_id: userProfile.id,
          amount_to_deduct: UPSCALE_COST
        });
        if (rpcError) throw new Error(rpcError.message);
      }

      // 2. เรียกระบบ Neural Engine ขยายภาพ
      const res = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_url: artwork.original_url,
          artwork_id: artwork.id 
        }),
      });
      const data = await res.json();

      if (data.upscaled_url) {
        // 3. บันทึกผลลัพธ์ลง Database ทันที
        await supabase
          .from('artworks')
          .update({ 
            upscaled_url: data.upscaled_url,
            is_master_unlocked: true 
          })
          .eq('id', artwork.id);

        // อัปเดต UI หน้าจอ
        setArtwork({ ...artwork, upscaled_url: data.upscaled_url, is_master_unlocked: true });
        
        // ดึง XP ใหม่มาแสดงผล
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('xp_balance')
          .eq('id', userProfile.id)
          .single();
        setUserProfile({ ...userProfile, xp_balance: updatedProfile?.xp_balance });
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "เกิดข้อผิดพลาดในการปลดล็อก");
    } finally {
      setIsUpscaling(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-black italic uppercase animate-pulse">Aurelius Master Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-cyan-500/30">
      
      {/* NAVIGATION */}
      <nav className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <button onClick={() => router.back()} className="group flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
          <ArrowLeft size={14} /> BACK
        </button>
        <div className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase italic">AURELIUS MASTER HUB // BY KOMSIN.COM</div>
        <div className="bg-zinc-900/90 px-5 py-2.5 rounded-full border border-cyan-500/30 flex items-center gap-3">
          <Coins size={14} className="text-cyan-500" />
          <span className="text-[11px] font-black text-cyan-400 italic">{(userProfile?.xp_balance || 0).toLocaleString()} XP</span>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* PREVIEW AREA */}
        <div className="space-y-8">
          <div className="relative aspect-square bg-[#0a0a0b] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl group flex items-center justify-center">
             <img 
               src={artwork?.upscaled_url || artwork?.original_url} 
               className={`w-full h-full object-contain p-12 transition-all duration-1000 ${isUpscaling ? 'blur-2xl scale-110 opacity-50' : ''}`}
               alt="Master Hub"
             />
             
             {!artwork?.is_master_unlocked && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20">
                    <ShieldCheck size={40} className="text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase mb-2">Low-Res Preview</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase italic leading-relaxed tracking-widest">
                    Unlock to access 300DPI Master Asset <br/> for Professional Printing
                  </p>
               </div>
             )}

             {isUpscaling && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                    <Loader2 className="animate-spin text-cyan-500 mb-4" size={48} />
                    <span className="text-xs font-black italic uppercase tracking-[0.3em] animate-pulse">Neural Engine Processing...</span>
                </div>
             )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <StatCard label="RESOLUTION" value={artwork?.is_master_unlocked ? "4500 x 4500" : "1024 x 1024"} active={artwork?.is_master_unlocked} />
             <StatCard label="DPI QUALITY" value={artwork?.is_master_unlocked ? "300 DPI" : "72 DPI"} active={artwork?.is_master_unlocked} />
             <StatCard label="FORMAT" value="TRANSPARENT PNG" active={true} />
          </div>
        </div>

        {/* ACTION AREA */}
        <div className="flex flex-col justify-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Activity size={12} className="text-cyan-500" />
                <span className="text-[9px] font-black text-cyan-400 uppercase italic tracking-widest">Production Mode</span>
            </div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-4">
              MASTER <br/><span className="text-cyan-500">ASSET</span>
            </h1>
            <p className="text-zinc-600 text-xs font-bold uppercase italic tracking-[0.2em]">Transform your vision into master quality</p>
          </div>

          <div className="space-y-6">
            {!artwork?.is_master_unlocked ? (
              <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
                        <Zap size={20} className="text-cyan-500" fill="currentColor"/> 
                        Neural Upgrade
                    </h2>
                    <div className="space-y-4 mb-10">
                        <FeatureRow text="AI Upscaling (4.4x Resolution)" />
                        <FeatureRow text="Edge Smoothing & Noise Removal" />
                        <FeatureRow text="Print-Ready Color Optimization" />
                    </div>
                    
                    <button 
                        onClick={handleNeuralUpscale}
                        disabled={isUpscaling}
                        className="w-full py-7 bg-white text-black rounded-[2rem] font-black uppercase italic text-lg flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                    >
                        {isUpscaling ? <Loader2 className="animate-spin" /> : <>UNLOCK FOR {UPSCALE_COST.toLocaleString()} XP <Coins size={22}/></>}
                    </button>
                  </div>
                  <Maximize size={240} className="absolute right-[-60px] bottom-[-60px] text-white opacity-[0.02] rotate-12" />
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="bg-cyan-500 text-black p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-cyan-500/20">
                   <div>
                     <h4 className="text-xl font-black italic uppercase">Master Ready</h4>
                     <p className="text-[10px] font-bold uppercase italic opacity-70">High-Resolution asset is now available</p>
                   </div>
                   <CheckCircle2 size={40} />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    <a 
                      href={artwork.upscaled_url} 
                      download={`Aurelius_Master_${artwork.id}.png`}
                      className="w-full py-7 bg-white text-black rounded-[2rem] font-black uppercase italic flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl"
                    >
                      Download Master Asset <Download size={20} />
                    </a>
                    
                    <button className="w-full py-7 bg-zinc-900 border border-white/10 text-white rounded-[2rem] font-black uppercase italic flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
                      Create Apparel Order <Printer size={20} />
                    </button>
                </div>
              </div>
            )}

            <div className="pt-8 flex items-start gap-3 opacity-30">
                <AlertCircle size={14} className="mt-0.5" />
                <p className="text-[8px] font-bold uppercase italic leading-relaxed tracking-widest">
                    *Neural Engine processing consumes significant compute resources. <br/>
                    Once unlocked, the master asset is yours forever. No additional XP required.
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// UI SUB-COMPONENTS
function StatCard({ label, value, active }: { label: string, value: string, active: boolean }) {
  return (
    <div className={`p-5 rounded-[2rem] border transition-all text-center ${active ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-zinc-900/40 border-white/5'}`}>
      <div className="text-[8px] font-black text-zinc-500 uppercase italic mb-1 tracking-widest">{label}</div>
      <div className={`text-[11px] font-black uppercase italic ${active ? 'text-cyan-400' : 'text-zinc-400'}`}>{value}</div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] font-black uppercase italic text-zinc-400">
      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
      {text}
    </div>
  );
}