'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Medal, Star, ArrowLeft, Loader2, Crown } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // ดึงข้อมูล 10 อันดับแรกที่คะแนน XP เยอะที่สุด
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, credits, avatar_url')
          .order('credits', { ascending: false })
          .limit(10);

        if (error) throw error;
        setLeaders(data || []);
      } catch (error) {
        console.error("Leaderboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-yellow-500 animate-spin" size={32} />
      <div className="text-yellow-500 font-black tracking-[0.3em] text-[10px] uppercase">Ranking Intelligence...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Neural Link</span>
        </Link>

        {/* Header */}
        <header className="mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="text-yellow-500" size={64} />
              <Crown className="absolute -top-4 -right-4 text-yellow-500 animate-bounce" size={32} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Global <span className="text-yellow-500">Leaderboard</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Top Authorized Citizens • Aurelius Studio</p>
        </header>

        {/* Rankings List */}
        <div className="space-y-4">
          {leaders.map((user, index) => {
            const isTop3 = index < 3;
            const rankColors = [
              'border-yellow-500/50 bg-yellow-500/5', // Gold
              'border-slate-300/30 bg-slate-300/5',  // Silver
              'border-orange-500/30 bg-orange-500/5' // Bronze
            ];

            return (
              <div 
                key={user.id}
                className={`flex items-center gap-6 p-6 rounded-[2rem] border transition-all ${
                  isTop3 ? rankColors[index] : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                {/* Rank Number */}
                <div className="w-12 h-12 flex items-center justify-center font-black italic text-2xl">
                  {index === 0 ? <Medal className="text-yellow-500" size={32} /> : index + 1}
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 border-2 border-white/5">
                  <img 
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.display_name}`} 
                    alt={user.display_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Title */}
                <div className="flex-grow">
                  <h3 className="font-black uppercase italic text-lg leading-none mb-1">
                    {user.display_name || 'Unknown Citizen'}
                    {index === 0 && <span className="ml-2 text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full not-italic">Elite</span>}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status: Authorized Citizen</p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end text-yellow-500 mb-1">
                    <Star size={14} fill="currentColor" />
                    <span className="font-black italic text-xl">{(user.credits || 0).toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Intelligence XP</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
            AureliusX Intelligence Network • Developed By komsin
          </p>
        </footer>
      </div>
    </div>
  );
}