'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  RefreshCw, Loader2, Copy, Download, Package, 
  Search, Image as ImageIcon, FileArchive 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- CONFIGURATION ---
const BUCKET_PREVIEWS = 'market-previews';
const BUCKET_ASSETS = 'aurelius-assets';

export default function AureliusFlatUnifiedArchive() {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFlatData = async () => {
    setLoading(true);
    try {
      // ดึงจาก Root โดยตรง ไม่ผ่าน Folder
      const { data, error } = await supabase.storage
        .from(BUCKET_PREVIEWS)
        .list('', { 
          limit: 150, 
          sortBy: { column: 'name', order: 'asc' } 
        });

      if (error) throw error;

      if (data) {
        const formatted = data
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map((file, index) => {
            const { data: pUrl } = supabase.storage
              .from(BUCKET_PREVIEWS)
              .getPublicUrl(file.name);

            // สมมติว่าไฟล์ zip ชื่อเดียวกับรูป แต่อยู่ในอีก Bucket
            const zipName = file.name.split('.').slice(0, -1).join('.') + '.zip';
            const { data: dUrl } = supabase.storage
              .from(BUCKET_ASSETS)
              .getPublicUrl(zipName);

            return {
              id: file.id,
              previewUrl: pUrl.publicUrl,
              downloadUrl: dUrl.publicUrl,
              fileName: file.name,
              zipName: zipName,
              index: index + 1
            };
          });
        setAssets(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("SYNC_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFlatData(); }, []);

  const filtered = assets.filter(a => 
    a.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-sans italic uppercase tracking-tighter">
      <Toaster position="top-right" />
      
      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 mb-16 gap-6">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter leading-none">
            AURELIUS <span className="text-cyan-500">FLAT_HUB</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[.4em] mt-4 text-zinc-500">
             ROOT_DIRECTORY_ACCESS // TOTAL_ITEMS: {assets.length}
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text"
              placeholder="SEARCH_FILENAME..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[10px] focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
          <button onClick={fetchFlatData} className="p-4 bg-zinc-900 border border-white/10 rounded-2xl hover:bg-cyan-500 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-24">
        
        {/* --- SECTION 1: MOCKUP GRID --- */}
        <section>
          <div className="flex items-center gap-4 mb-10 border-l-4 border-cyan-500 pl-4">
            <div className="text-cyan-500"><ImageIcon size={28}/></div>
            <div>
              <h2 className="text-2xl font-black italic leading-none text-white">01_VISUAL_PREVIEWS</h2>
              <p className="text-[9px] text-zinc-500 tracking-widest mt-1 uppercase">Instant Preview from Root</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map((asset) => (
              <div key={`img-${asset.id}`} className="group relative aspect-[4/5] bg-zinc-900/40 rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all duration-500">
                <img 
                  src={asset.previewUrl} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x500/000000/333333?text=NO_IMAGE'; }}
                />
                <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-[8px] font-bold text-cyan-500 border border-white/10">
                  #{asset.index.toString().padStart(3, '0')}
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(asset.previewUrl); toast.success("COPIED"); }}
                  className="absolute bottom-3 right-3 p-3 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Copy size={14}/>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 2: ASSET LIST --- */}
        <section>
          <div className="flex items-center gap-4 mb-10 border-l-4 border-fuchsia-500 pl-4">
            <div className="text-fuchsia-500"><FileArchive size={28}/></div>
            <div>
              <h2 className="text-2xl font-black italic leading-none text-white">02_PRODUCTION_ASSETS</h2>
              <p className="text-[9px] text-zinc-500 tracking-widest mt-1 uppercase">Direct ZIP access from Root</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((asset) => (
              <div key={`zip-${asset.id}`} className="flex items-center justify-between p-5 bg-[#0a0a0f] border border-white/5 rounded-3xl hover:bg-zinc-900/40 transition-all group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 bg-zinc-900 rounded-2xl group-hover:text-fuchsia-500 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
                    <Package size={22}/>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-zinc-300 truncate tracking-tight uppercase leading-tight">{asset.zipName}</p>
                    <p className="text-[7px] text-zinc-600 font-bold tracking-widest mt-1">READY_FOR_DEPLOYMENT</p>
                  </div>
                </div>
                <a 
                  href={asset.downloadUrl}
                  className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all active:scale-95 shadow-xl"
                >
                  <Download size={20}/>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-32 py-12 border-t border-white/5 flex justify-between items-center opacity-20 text-[8px] font-black tracking-[0.5em]">
        <p>© 2026 AURELIUS_FLAT_VAULT</p>
        <p>FOR_STAFF_AND_ADMIN_PURPOSES</p>
      </footer>
    </div>
  );
}