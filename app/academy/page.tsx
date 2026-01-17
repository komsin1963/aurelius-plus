'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Play, Lock, Clock, ArrowLeft, Loader2, Search, PlayCircle, Star } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AcademyPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAcademyData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // 1. ดึงวิดีโอทั้งหมด
        const { data: allVideos } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        
        // 2. ดึงวิดีโอที่ปลดล็อกแล้ว
        if (user) {
          const { data: unlocked } = await supabase
            .from('unlocked_videos')
            .select('video_id')
            .eq('user_id', user.id);
          
          if (unlocked) setUnlockedIds(unlocked.map(i => i.video_id));
        }

        setVideos(allVideos || []);
      } catch (error) {
        console.error("Academy Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademyData();
  }, []);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-fuchsia-500 animate-spin" size={32} />
      <div className="text-fuchsia-500 font-black tracking-[0.3em] text-[10px] uppercase">Connecting Neural Academy...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit Academy</span>
          </Link>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-fuchsia-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="SEARCH TRAINING MODULES..."
              className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[10px] font-black tracking-widest focus:outline-none focus:border-fuchsia-500/50 w-full md:w-80 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Header Section */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-fuchsia-500 fill-current" size={14} />
            <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.4em]">Learning Center v1.0</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">Academy</span>
          </h1>
          <p className="text-slate-500 max-w-2xl text-xs font-bold leading-relaxed uppercase tracking-wider">
            ยกระดับจินตนาการด้วยหลักสูตรการสั่งงาน AI ชั้นสูง พัฒนาโดย Aurelius Studio สำหรับ Citizen ทุกท่าน
          </p>
        </header>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredVideos.map((video) => {
            const isUnlocked = unlockedIds.includes(video.id);
            
            return (
              <div key={video.id} className="group flex flex-col">
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-6 transition-all duration-500 group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.1)]">
                  <img 
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"} 
                    className={`w-full h-full object-cover transition-all duration-700 ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-30 group-hover:grayscale-0'}`}
                    alt={video.title}
                  />
                  
                  {/* Play/Lock Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isUnlocked ? (
                      <Link href={`/academy/${video.id}`} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-2xl">
                        <Play fill="currentColor" size={24} className="ml-1" />
                      </Link>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Lock className="text-white/20" size={32} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-4 py-1 rounded-full">Locked Module</span>
                      </div>
                    )}
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2">
                    <Clock size={12} className="text-fuchsia-500" />
                    <span className="text-[9px] font-black">{video.duration || '10:00'}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest px-2 py-0.5 border border-fuchsia-500/30 rounded">
                      {video.category || 'AI Training'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-fuchsia-500 transition-colors mb-2 truncate">
                    {video.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-600 uppercase leading-relaxed line-clamp-2 italic">
                    {video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem]">
            <PlayCircle className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-700 font-black uppercase tracking-[0.4em] text-xs">No Training Modules Found</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
            Aurelius Studio Academy • Developed By komsin
          </p>
        </footer>
      </div>
    </div>
  );
}