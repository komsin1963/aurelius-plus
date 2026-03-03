"use client";
import { useState } from 'react';
import { 
  Copy, CheckCircle2, Sparkles, ShoppingBag, 
  Tag, FileText, Zap, Terminal, Database, ArrowRightLeft
} from 'lucide-react';

export default function MetadataPage() {
  const [copied, setCopied] = useState("");
  const [userInput, setUserInput] = useState("");
  const [generatedData, setGeneratedData] = useState<any>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const generateMetadata = () => {
    if (!userInput) return;
    
    // Etsy & Stock Metadata Engine
    const title = `${userInput} PNG Digital Art, High Res Sublimation Design, Streetwear Graphic for T-Shirt`;
    const desc = `⚡ AURELIUS-X SYSTEM GENERATED ⚡\n\nAsset: ${userInput}\nResolution: 300 DPI (Ultra Clear)\nFormat: PNG with Transparent Background\n\nPerfect for:\n- DTP / DTG Printing\n- Apparel Design (Hoodies, Tees)\n- Stickers & Decals\n\nNote: This is a digital asset for commercial use. No physical shipping.`;
    const tags = `${userInput.toLowerCase()}, png file, digital download, sublimation, dtg print, streetwear, samurai art, mecha, graphic design, t-shirt design, instant download, artisan design, aurelius style`;

    setGeneratedData({ title, desc, tags });
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8 font-sans italic selection:bg-cyan-500/30">
      
      {/* --- HEADER SYSTEM --- */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Database className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              META<span className="text-cyan-500 text-6xl">DATA</span>
            </h1>
            <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.5em] mt-1">
              Asset_Indexing_Protocol // v.2026.03
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-[10px] font-black text-zinc-500 uppercase">System_Link: Stable</p>
           <p className="text-[10px] font-black text-white uppercase italic">By: Aurelius-X Pod</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- INPUT SECTOR --- */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl sticky top-8">
            <h2 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-400">
              <Terminal size={16} className="text-cyan-400" /> Command_Input
            </h2>
            
            <div className="space-y-5">
              <div className="relative group">
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="ENTER ASSET NAME..."
                  className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white focus:border-cyan-500 outline-none transition-all italic uppercase font-black text-sm tracking-widest placeholder:text-zinc-800"
                />
              </div>

              <button 
                onClick={generateMetadata}
                className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl active:scale-95"
              >
                <Zap size={18} fill="currentColor" /> Process Metadata
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
               <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Optimized Platforms:</p>
               <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
                  <span className="text-[10px] font-black italic">ETSY</span>
                  <span className="text-[10px] font-black italic">ADOBE STOCK</span>
                  <span className="text-[10px] font-black italic">SHUTTERSTOCK</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- OUTPUT SECTOR --- */}
        <div className="lg:col-span-7">
          {!generatedData ? (
            <div className="h-full border border-white/5 rounded-[3rem] bg-zinc-900/10 flex flex-col items-center justify-center text-zinc-800 min-h-[450px]">
              <ArrowRightLeft size={40} strokeWidth={1} className="animate-pulse" />
              <p className="mt-4 font-black uppercase text-[10px] tracking-[0.3em]">Awaiting Data Stream</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Result: Title */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 relative group">
                <label className="text-[9px] font-black text-cyan-500 uppercase mb-2 block tracking-widest">Optimized_Title</label>
                <p className="text-sm font-black italic pr-12 text-white/90 leading-tight uppercase">{generatedData.title}</p>
                <button onClick={() => copyToClipboard(generatedData.title, 'title')} className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-cyan-500 hover:text-black transition-all">
                  {copied === 'title' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Result: Description */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 relative">
                <label className="text-[9px] font-black text-cyan-500 uppercase mb-2 block tracking-widest">Product_Description</label>
                <div className="bg-black/40 p-5 rounded-xl text-[11px] font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed h-[180px] overflow-y-auto border border-white/5">
                  {generatedData.desc}
                </div>
                <button onClick={() => copyToClipboard(generatedData.desc, 'desc')} className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-cyan-500 hover:text-black transition-all">
                  {copied === 'desc' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Result: Tags */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 relative">
                <label className="text-[9px] font-black text-cyan-500 uppercase mb-3 block tracking-widest">SEO_Tags (13 Keyframes)</label>
                <div className="flex flex-wrap gap-2 pr-12">
                  {generatedData.tags.split(',').map((tag: string) => (
                    <span key={tag} className="bg-black/60 text-zinc-400 text-[9px] px-3 py-1.5 rounded-lg border border-white/5 font-bold uppercase hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-default">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <button onClick={() => copyToClipboard(generatedData.tags, 'tags')} className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-cyan-500 hover:text-black transition-all">
                  {copied === 'tags' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}