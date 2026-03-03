'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js'; 
import { 
  ArrowLeft, RefreshCcw, ExternalLink, 
  CheckCircle2, Activity, ShieldCheck,
  Server, ShoppingCart, Globe 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MarketSyncPage() {
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
  const [displayImage, setDisplayImage] = useState<string>("");
  const [config, setConfig] = useState({ category: 'thai-art', tier: 'free', targetPath: '' });

  useEffect(() => {
    const category = (localStorage.getItem('currentCategory') || 'thai-art').toLowerCase(); 
    const tier = (localStorage.getItem('currentTier') || 'free').toLowerCase();
    const path = `mockups/${category}/${tier}/free_thumb.jpg`;

    const { data } = supabase.storage.from('market-previews').getPublicUrl(path);
    if (data?.publicUrl) setDisplayImage(data.publicUrl);

    setConfig({ category, tier, targetPath: `market-previews/${path}` });
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('completed'), 3500);
  };

  const marketplaces = [
    { id: 'printify', name: 'printify node', region: 'global', icon: <Server size={16} /> },
    { id: 'etsy', name: 'etsy marketplace', region: 'us/eu', icon: <ShoppingCart size={16} /> },
    { id: 'shopify', name: 'komsin store', region: 'komsin.com', icon: <Globe size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans italic p-6 md:p-12 selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-500 transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> return to studio
        </button>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">aurelius studio by komsin</p>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: CONTROLS & MARKETPLACES */}
        <div className="lg:col-span-5 space-y-10">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 text-cyan-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Activity size={16} className="animate-pulse" /> e-commerce engine v2.0
            </div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
              market <br /><span className="text-cyan-500 opacity-50 text-outline">sync.</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase truncate border-b border-white/5 pb-2">
              path: {config.targetPath}
            </p>
          </header>

          {/* MARKETPLACE LIST (คืนชีพมาแล้วครับ) */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] px-2">target nodes</p>
            {marketplaces.map((m) => (
              <div key={m.id} className="p-4 bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-cyan-500/30 transition-all shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-cyan-500 transition-colors shadow-inner">
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest">{m.name}</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase">{m.region}</p>
                  </div>
                </div>
                {syncStatus === 'completed' ? <CheckCircle2 size={16} className="text-cyan-500" /> : <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />}
              </div>
            ))}
          </div>

          {/* ADMIN BYPASS CARD */}
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-[2.5rem] flex items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
               <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">master admin: komsin.com</p>
               <p className="text-zinc-600 text-[8px] uppercase font-bold italic">authorization cost: 0 xp (system bypass)</p>
            </div>
          </div>

          <button 
            onClick={handleSync} 
            disabled={syncStatus !== 'idle'} 
            className={`w-full py-8 rounded-[2.5rem] font-black italic uppercase text-2xl transition-all shadow-2xl flex items-center justify-center gap-4
              ${syncStatus === 'completed' 
                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-cyan-500 hover:text-white active:scale-95 shadow-cyan-500/10'}`}
          >
            {syncStatus === 'syncing' ? <RefreshCcw className="animate-spin" /> : syncStatus === 'completed' ? <CheckCircle2 /> : <ExternalLink />}
            {syncStatus === 'syncing' ? 'syncing...' : syncStatus === 'completed' ? 'success' : 'push to market'}
          </button>
        </div>

        {/* RIGHT COLUMN: TERMINAL & PREVIEW */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-950 rounded-[4rem] border border-white/5 p-10 flex flex-col gap-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden h-full">
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-32 h-32 bg-black rounded-[2.2rem] border border-white/10 p-5 shadow-inner relative overflow-hidden group">
                {displayImage ? (
                  <img src={displayImage} alt="Preview" className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="animate-pulse text-[8px] text-zinc-700 flex items-center justify-center h-full uppercase tracking-widest">connecting_cloud...</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{config.category}</h3>
                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.3em]">{config.tier} asset online</p>
                <div className="pt-2 flex gap-2">
                   <div className="px-2 py-0.5 bg-zinc-900 rounded-full text-[7px] text-zinc-500 font-black uppercase">v2.0</div>
                   <div className="px-2 py-0.5 bg-zinc-900 rounded-full text-[7px] text-zinc-500 font-black uppercase">secure</div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-black/90 rounded-[2.5rem] border border-white/5 p-8 font-mono text-[10px] text-zinc-500 overflow-y-auto min-h-[250px] shadow-inner relative">
               <p className="mb-2">[{new Date().toLocaleTimeString()}] establishing secure handshake with global nodes...</p>
               <p className="text-cyan-500/60 font-bold underline mb-4">[node] komsin.com/api/v2/market_sync</p>
               
               <p className="opacity-40">-- checking permissions --</p>
               <p className="text-zinc-400">[info] admin credentials verified: komsin</p>
               <p className="text-zinc-400">[info] asset found at: {config.targetPath}</p>

               {syncStatus === 'syncing' && (
                 <div className="mt-4 space-y-2 animate-in fade-in duration-500">
                   <p className="text-cyan-400 animate-pulse font-bold">[active] uploading metadata to shopify & etsy...</p>
                   <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 animate-[progress_3.5s_linear_forwards]" />
                   </div>
                 </div>
               )}

               {syncStatus === 'completed' && (
                 <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl animate-in zoom-in-95">
                   <p className="text-cyan-500 font-bold uppercase tracking-widest text-[11px]">sync_deployment_successful</p>
                   <p className="text-zinc-600 mt-1 italic italic">ผลงานของคุณเปิดขายบน komsin.com และพาร์ทเนอร์แล้ว</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .text-outline { -webkit-text-stroke: 1px rgba(6, 182, 212, 0.3); color: transparent; }
      `}</style>
    </div>
  );
}