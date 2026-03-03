'use client';

import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์
import { ShieldCheck, Zap, Loader2, CreditCard, ArrowRight, Download, Package, Shield } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState<any[]>([]); // สำหรับระบบ Bundle

  // --- 1. ตรวจสอบระบบที่ลูกค้าเลือกมา (XP หรือ Bundle) ---
  const isBundleMode = searchParams.get('mode') === 'bundle';
  const itemName = searchParams.get('name') || (isBundleMode ? 'DIGITAL_ART_BUNDLE' : 'REFILL XP PROTOCOL');
  const itemPrice = searchParams.get('price') || (isBundleMode ? '250' : '250');
  const itemXp = searchParams.get('xp') || '25,000';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    checkUser();
    
    // ถ้าเป็นโหมด Bundle ลองดึงข้อมูลจาก localStorage (ถ้ามีระบบตะกร้าเซฟไว้)
    if (isBundleMode) {
      const savedCart = localStorage.getItem('aurelius_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    }
  }, [isBundleMode]);

  const handleStripePayment = async () => {
    if (!user || !user.id) {
      alert("IDENTIFICATION REQUIRED: PLEASE LOGIN.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          priceAmount: itemPrice,
          xpAmount: isBundleMode ? 0 : itemXp, // ถ้าซื้อ Bundle อาจจะไม่ให้ XP หรือให้ตามเงื่อนไขคุณ
          mode: isBundleMode ? 'payment' : 'subscription_or_refill',
          cartItems: isBundleMode ? cart.map(item => item.id) : [] // ส่ง ID ลายที่เลือกไปให้ Stripe/Webhook
        }),
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url; 
    } catch (err: any) {
      console.error("GATEWAY ERROR:", err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 mt-10 grid lg:grid-cols-2 gap-12 font-sans italic uppercase">
      
      {/* ส่วนซ้าย: รายละเอียดคำสั่งซื้อ (Dynamic Content) */}
      <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          {isBundleMode ? 'Bundle' : 'Refill'} <span className="text-cyan-500">Protocol</span>
        </h1>

        <div className="bg-zinc-900/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            {isBundleMode ? <Package size={120} /> : <Zap size={120} />}
          </div>
          
          <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">Aurelius Production Node</p>
          <h3 className="text-3xl font-black italic text-white tracking-tighter mb-4">{itemName}</h3>
          
          {isBundleMode ? (
            /* แสดงรายการลายที่เลือกถ้าเป็น Bundle */
            <div className="space-y-3 mt-6 border-t border-white/5 pt-6">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-[10px] text-zinc-400">
                  <Download size={12} className="text-cyan-500" /> {item.name || `ASSET_ID: ${item.id}`}
                </div>
              ))}
              <div className="bg-black/40 p-4 rounded-2xl mt-4">
                <p className="text-[10px] text-zinc-500 mb-1">PROMOTION_APPLIED</p>
                <p className="text-white font-black">เหมา 5 ลาย // ฿250.00</p>
              </div>
            </div>
          ) : (
            /* แสดง XP ถ้าเป็นโหมดเติมเงิน */
            <div className="mt-8 flex items-center gap-3 border-t border-white/5 pt-6 text-amber-500 font-black text-xs">
              <Zap size={18} fill="currentColor" /> + {itemXp} Neural XP Credits
            </div>
          )}

          <p className="text-6xl font-black italic text-white mt-8 tracking-tighter">฿{itemPrice}</p>
        </div>

        <div className="flex items-center gap-4 px-6 text-zinc-600">
           <Shield size={20} />
           <p className="text-[8px] font-black tracking-widest leading-relaxed">ข้อมูลของคุณถูกเข้ารหัสผ่านระบบเครือข่าย AURELIUS และประมวลผลการชำระเงินอย่างปลอดภัยผ่าน STRIPE GATEWAY</p>
        </div>
      </div>

      {/* ส่วนขวา: สรุปยอดและปุ่มจ่ายเงิน */}
      <div className="flex flex-col justify-center">
        <div className="bg-zinc-900/80 border border-white/10 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative">
          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
               <div>
                 <p className="text-[10px] text-zinc-500 font-black mb-1">ORDER_TOTAL</p>
                 <p className="text-4xl font-black text-white italic">฿{itemPrice}</p>
               </div>
               <CreditCard size={32} className="text-zinc-800" />
            </div>

            <button 
              onClick={handleStripePayment} 
              disabled={isProcessing || !user} 
              className="w-full bg-cyan-500 py-10 rounded-[2.5rem] font-black text-[16px] tracking-[0.2em] text-black hover:bg-white transition-all flex flex-col justify-center items-center gap-1 disabled:opacity-50 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : (
                <>
                  <span className="flex items-center gap-3">CONFIRM_PAYMENT <ArrowRight /></span>
                  <span className="text-[8px] opacity-60">SECURE_EXTERNAL_LINK</span>
                </>
              )}
            </button>
            
            <div className="space-y-2">
              <p className="text-center text-[9px] text-zinc-600 font-black uppercase italic tracking-widest">
                Operator: {user?.email || 'OFFLINE'}
              </p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-1/3 animate-[loading_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#020203] pb-20 pt-10 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <Suspense fallback={<div className="flex flex-col items-center justify-center mt-20 text-cyan-500 font-black italic text-[10px] tracking-widest"><Loader2 className="animate-spin mb-4" /> ESTABLISHING SECURE NODE...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}