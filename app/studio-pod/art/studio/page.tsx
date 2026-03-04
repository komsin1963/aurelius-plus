'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { 
  Zap, Trash2, Image as ImageIcon, Type, Save, 
  ChevronUp, ChevronDown, Lock, Unlock,
  Square, Circle, Star, Minus, Hexagon,
  ArrowUpToLine, ArrowDownToLine, Grid3X3, Settings2, Download
} from 'lucide-react';

const GOOGLE_FONTS = [
  { name: 'System', family: 'sans-serif' },
  { name: 'Anton', family: 'Anton, sans-serif' },
  { name: 'Kanit (Thai)', family: 'Kanit, sans-serif' },
  { name: 'Mali (Thai)', family: 'Mali, sans-serif' },
  { name: 'Chakra Petch (Thai)', family: 'Chakra Petch, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' }
];

const ASSET_TEMPLATES = [
  { name: 'Grid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80' },
  { name: 'Wave', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
  { name: 'Dark Geo', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&q=80' },
  { name: 'Dots', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&q=80' },
  { name: 'Lines', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&q=80' },
  { name: 'Retro', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80' }
];

const QUICK_COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#555555'];

const ShapeRenderer = ({ type, color, size, opacity }: { type: string, color: string, size: number, opacity: number }) => {
  const props = { width: size, height: size, fill: color, style: { opacity: opacity / 100 } };
  switch (type) {
    case 'circle': return <svg {...props} viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" /></svg>;
    case 'line': return <svg width={size} height={size/10} viewBox="0 0 100 10" style={{ opacity: opacity / 100 }}><rect width="100" height="10" fill={color} /></svg>;
    case 'star': return <svg {...props} viewBox="0 0 100 100"><path d="M50 2L61 39H100L68 63L79 100L50 77L21 100L32 63L0 39H39L50 2Z" /></svg>;
    case 'hexagon': return <svg {...props} viewBox="0 0 100 100"><path d="M25 5L75 5L100 50L75 95L25 95L0 50Z" /></svg>;
    default: return <svg {...props} viewBox="0 0 100 100"><rect width="90" height="90" x="5" y="5" /></svg>;
  }
};

export default function AureliusStudio_V22() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [showMobilePanel, setShowMobilePanel] = useState(false); // ควบคุมการเปิดปิดเมนูในมือถือ

  useEffect(() => {
    const saved = localStorage.getItem('AURELIUS_V22_TEMP');
    if (saved) {
      try { setLayers(JSON.parse(saved)); } catch (e) { console.error("Failed to load"); }
    }
  }, []);

  const saveTemplate = () => {
    localStorage.setItem('AURELIUS_V22_TEMP', JSON.stringify(layers));
    alert('บันทึก Template เรียบร้อยครับ!');
  };

  const addLayer = (type: 'text' | 'image' | 'shape') => {
    const newLayer = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'AURELIUS ART' : (type === 'shape' ? 'square' : ASSET_TEMPLATES[0].url),
      x: 50, y: 50,
      size: type === 'image' ? 300 : (type === 'shape' ? 100 : 40), // ปรับขนาดเริ่มต้นให้พอดีมือถือขึ้น
      opacity: 100,
      color: '#00FFFF',
      fontWeight: '900',
      fontStyle: 'italic',
      fontFamily: 'Kanit, sans-serif',
      isLocked: false
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
    if (window.innerWidth < 1024) setShowMobilePanel(true);
  };

  const updateLayer = (id: number, data: any) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const moveLayer = (id: number, action: 'up' | 'down' | 'front' | 'back') => {
    const idx = layers.findIndex(l => l.id === id);
    if (idx === -1) return;
    const newLayers = [...layers];
    const item = newLayers.splice(idx, 1)[0];
    if (action === 'up' && idx < layers.length - 1) newLayers.splice(idx + 1, 0, item);
    else if (action === 'down' && idx > 0) newLayers.splice(idx - 1, 0, item);
    else if (action === 'front') newLayers.push(item);
    else if (action === 'back') newLayers.unshift(item);
    setLayers(newLayers);
  };

  return (
    <div className="h-screen bg-[#050506] text-white flex flex-col font-sans overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Kanit:wght@300;900&family=Mali:wght@300;700&family=Chakra+Petch:wght@300;700&family=Roboto:wght@300;900&display=swap" rel="stylesheet" />

      {/* Header - ปรับให้เล็กลงในมือถือ */}
      <nav className="h-16 md:h-20 border-b border-white/5 bg-black/50 backdrop-blur-2xl flex items-center justify-between px-4 md:px-10 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]"><Zap className="text-black" size={18} /></div>
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-xl font-black italic tracking-tighter uppercase leading-none">Aurelius <span className="text-cyan-500 text-[8px] md:text-[10px] block tracking-widest mt-1">V22 MASTER</span></h1>
          </div>
        </div>
        
        <div className="flex gap-1 md:gap-2">
          <button onClick={() => addLayer('image')} className="p-2 md:px-3 md:py-2 bg-zinc-900 rounded-lg text-[9px] font-black border border-white/5 uppercase"><ImageIcon size={14}/></button>
          <button onClick={() => addLayer('text')} className="p-2 md:px-3 md:py-2 bg-zinc-900 rounded-lg text-[9px] font-black border border-white/5 uppercase"><Type size={14}/></button>
          <button onClick={() => addLayer('shape')} className="p-2 md:px-3 md:py-2 bg-zinc-800 rounded-lg text-[9px] font-black border border-cyan-500/30 uppercase"><Square size={14}/></button>
          
          <button onClick={saveTemplate} className="p-2 md:px-3 md:py-2 bg-zinc-800 rounded-lg text-[9px] font-black border border-white/10 uppercase"><Save size={14} className="text-cyan-500" /></button>

          <button onClick={async () => {
             if(canvasRef.current) {
               const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
               const link = document.createElement('a'); link.download = `AURELIUS-V22.png`;
               link.href = dataUrl; link.click();
             }
          }} className="px-3 md:px-6 py-2 bg-cyan-500 text-black rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
            <Download size={14} className="sm:hidden" />
            <span className="hidden sm:inline">Save Master</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Canvas Area - ปรับ Scale ให้อัตโนมัติ */}
        <section className="flex-1 bg-[#030304] relative flex items-center justify-center p-4 md:p-12 overflow-hidden" onClick={() => {setActiveLayerId(null); setShowMobilePanel(false);}}>
          <div 
            ref={canvasRef} 
            onClick={(e) => e.stopPropagation()} 
            className="bg-black relative shadow-2xl overflow-hidden ring-1 ring-white/10 scale-[0.6] sm:scale-[0.8] md:scale-100 origin-center" 
            style={{ width: '500px', height: '600px', minWidth: '500px' }}
          >
            {layers.map((layer, index) => (
              <div key={layer.id} onClick={() => {setActiveLayerId(layer.id); setShowMobilePanel(true);}} className={`absolute transition-all duration-75 cursor-pointer ${activeLayerId === layer.id ? 'ring-2 ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : ''}`} 
                style={{ top: `${layer.y}%`, left: `${layer.x}%`, transform: 'translate(-50%, -50%)', zIndex: index }}>
                
                {layer.type === 'image' && layer.content && <img src={layer.content} style={{ width: `${layer.size}px`, height: 'auto', maxWidth: 'none', opacity: layer.opacity / 100 }} alt="Art" />}
                {layer.type === 'text' && (
                  <div style={{ color: layer.color, fontSize: `${layer.size}px`, fontWeight: layer.fontWeight, fontStyle: layer.fontStyle, fontFamily: layer.fontFamily, opacity: layer.opacity / 100 }} className="leading-none whitespace-nowrap select-none uppercase">{layer.content}</div>
                )}
                {layer.type === 'shape' && <ShapeRenderer type={layer.content} color={layer.color} size={layer.size} opacity={layer.opacity} />}
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar / Mobile Bottom Sheet */}
        <aside className={`
          fixed lg:relative bottom-0 left-0 w-full lg:w-[420px] 
          bg-[#08080a] border-t lg:border-t-0 lg:border-r border-white/5 
          p-4 md:p-6 overflow-y-auto z-[110] transition-transform duration-500
          ${showMobilePanel || activeLayerId ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          h-[60vh] lg:h-full rounded-t-[2rem] lg:rounded-none
        `}>
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 lg:hidden" onClick={() => setShowMobilePanel(false)} />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Layer Inspector</h2>
              {activeLayerId && <button onClick={() => {setActiveLayerId(null); setShowMobilePanel(false);}} className="lg:hidden text-cyan-500 text-[10px] font-black">CLOSE</button>}
            </div>

            {[...layers].reverse().map((layer) => {
              const isActive = activeLayerId === layer.id;
              if (!isActive && window.innerWidth < 1024) return null; // ในมือถือโชว์เฉพาะเลเยอร์ที่เลือก

              return (
                <div key={layer.id} onClick={() => setActiveLayerId(layer.id)} 
                  className={`p-5 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer relative ${isActive ? 'bg-zinc-900 border-cyan-500 shadow-xl' : 'bg-zinc-900/40 border-white/5 opacity-60'}`}>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg">
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'front'); }} className="p-1 hover:text-cyan-500"><ArrowUpToLine size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="p-1 hover:text-cyan-500"><ChevronUp size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="p-1 hover:text-cyan-500"><ChevronDown size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'back'); }} className="p-1 hover:text-cyan-500"><ArrowDownToLine size={12}/></button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { isLocked: !layer.isLocked }) }}>{layer.isLocked ? <Lock className="text-red-500" size={14}/> : <Unlock size={14}/>}</button>
                      <button onClick={(e) => { e.stopPropagation(); setLayers(layers.filter(l => l.id !== layer.id)); setActiveLayerId(null); }} className="hover:text-red-500 text-zinc-600 transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>

                  {isActive && (
                    <div className={`space-y-4 ${layer.isLocked ? 'pointer-events-none opacity-20' : ''}`}>
                      
                      {layer.type === 'image' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {ASSET_TEMPLATES.map((asset) => (
                              <button key={asset.name} onClick={() => updateLayer(layer.id, { content: asset.url })} 
                                className={`h-12 rounded-lg bg-black border overflow-hidden relative ${layer.content === asset.url ? 'border-cyan-500' : 'border-white/5'}`}>
                                <img src={asset.url} className="w-full h-full object-cover opacity-50" />
                              </button>
                            ))}
                          </div>
                          <input type="file" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if(file) updateLayer(layer.id, { content: URL.createObjectURL(file) });
                          }} className="text-[10px] w-full bg-black/50 p-2 rounded border border-dashed border-white/10" />
                        </div>
                      )}

                      {layer.type === 'text' && (
                        <div className="space-y-3">
                          <input value={layer.content} onChange={(e) => updateLayer(layer.id, { content: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none uppercase text-cyan-500" />
                          <select value={layer.fontFamily} onChange={(e) => updateLayer(layer.id, { fontFamily: e.target.value })} className="w-full bg-zinc-800 rounded-lg px-2 py-2 text-[10px] font-black outline-none border-none">
                            {GOOGLE_FONTS.map(f => (<option key={f.family} value={f.family}>{f.name}</option>))}
                          </select>
                        </div>
                      )}

                      {layer.type === 'shape' && (
                        <div className="flex gap-1">
                          {['square', 'circle', 'star', 'line', 'hexagon'].map(s => (
                            <button key={s} onClick={() => updateLayer(layer.id, { content: s })} className={`flex-1 p-2 rounded-lg border ${layer.content === s ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black border-white/10 text-zinc-500'}`}>
                              {s === 'square' && <Square size={14}/>} {s === 'circle' && <Circle size={14}/>} {s === 'star' && <Star size={14}/>} {s === 'line' && <Minus size={14}/>} {s === 'hexagon' && <Hexagon size={14}/>}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-1 overflow-x-auto py-2 border-t border-white/5 no-scrollbar">
                        {QUICK_COLORS.map(c => (
                          <button key={c} onClick={() => updateLayer(layer.id, { color: c })} className={`w-6 h-6 rounded-full flex-shrink-0 border-2 transition-all ${layer.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>

                      <div className="space-y-4 pt-2 text-[8px] font-black uppercase italic text-zinc-500">
                        <div className="space-y-2">
                          <div className="flex justify-between"><span>Opacity / Scale</span></div>
                          <div className="grid grid-cols-2 gap-4">
                             <input type="range" min="0" max="100" value={layer.opacity} onChange={(e) => updateLayer(layer.id, { opacity: parseInt(e.target.value) })} className="w-full accent-cyan-500 h-1" />
                             <input type="range" min="1" max="1000" value={layer.size} onChange={(e) => updateLayer(layer.id, { size: parseInt(e.target.value) })} className="w-full accent-cyan-500 h-1" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between"><span>Position (X / Y)</span></div>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="range" min="-50" max="150" value={layer.x} onChange={(e) => updateLayer(layer.id, { x: parseInt(e.target.value) })} className="w-full accent-white h-1" />
                            <input type="range" min="-50" max="150" value={layer.y} onChange={(e) => updateLayer(layer.id, { y: parseInt(e.target.value) })} className="w-full accent-white h-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}