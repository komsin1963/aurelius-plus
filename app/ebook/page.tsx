'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Book, Download, Eye, ArrowLeft, Loader2, Lock, Search ,Zap} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function EBookVaultPage() {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // ดึงรายชื่อ E-Book ทั้งหมด
        const { data: allBooks } = await supabase.from('ebooks').select('*');
        
        // ดึงรายการที่ User ปลดล็อกแล้ว
        if (user) {
          const { data: unlocked } = await supabase
            .from('unlocked_ebooks')
            .select('ebook_id')
            .eq('user_id', user.id);
          
          if (unlocked) setUnlockedIds(unlocked.map(i => i.ebook_id));
        }

        setEbooks(allBooks || []);
      } catch (error) {
        console.error("E-Book Vault Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEBooks();
  }, []);

  const filteredBooks = ebooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-cyan-500 animate-spin" size={32} />
      <div className="text-cyan-500 font-black tracking-[0.3em] text-[10px] uppercase">Accessing Knowledge Vault...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Neural Link</span>
          </Link>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="SEARCH ASSETS..."
              className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-xs font-bold tracking-widest focus:outline-none focus:border-cyan-500/50 w-full md:w-80 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Knowledge <span className="text-cyan-500">Vault</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-cyan-500"></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Intellectual Assets • Aurelius Studio</p>
          </div>
        </header>

        {/* E-Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => {
            const isUnlocked = unlockedIds.includes(book.id);
            
            return (
              <div key={book.id} className="group relative">
                {/* Book Cover Container */}
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-4 relative transition-transform duration-500 group-hover:-translate-y-2 shadow-2xl">
                  <img 
                    src={book.cover_url} 
                    className={`w-full h-full object-cover transition-all duration-700 ${isUnlocked ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 opacity-40'}`}
                    alt={book.title}
                  />
                  
                  {/* Overlay for Locked Items */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                      <Lock className="text-white/20 mb-2" size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Locked Asset</span>
                    </div>
                  )}

                  {/* Action Buttons on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                    {isUnlocked ? (
                      <Link 
                        href={`/ebook/read/${book.id}`}
                        className="w-full bg-cyan-500 text-black font-black uppercase italic py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors text-sm"
                      >
                        <Eye size={18} /> Read Asset
                      </Link>
                    ) : (
                      <Link 
                        href={`/recharge`}
                        className="w-full bg-white text-black font-black uppercase italic py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-500 transition-colors text-sm"
                      >
                        <Zap className="fill-current" size={18} /> Unlock with XP
                      </Link>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="px-2">
                  <h3 className="font-black uppercase italic text-lg leading-tight group-hover:text-cyan-500 transition-colors line-clamp-1">{book.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      {isUnlocked ? 'Access Granted' : 'Requires Authorization'}
                    </p>
                    <Book className={isUnlocked ? 'text-cyan-500' : 'text-slate-800'} size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
            Aurelius Studio Intelligence • Developed By komsin
          </p>
        </footer>
      </div>
    </div>
  );
}