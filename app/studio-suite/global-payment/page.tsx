'use client';

import React, { useEffect, useState, Suspense } from 'react'; // ✅ เพิ่ม Suspense
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, CreditCard, Zap, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

// 1. แยกส่วนเนื้อหาหลักออกมาเป็น Component ย่อย
function PaymentContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('item');
  const [isProcessing, setIsProcessing] = useState(false);

  const productData = {
    id: itemId || '000',
    name: 'INDUSTRIAL MASTER ASSET',
    price: 4.99,
    specs: '4500X5400 | 300 DPI',
    license: 'Standard Commercial'
  };

  const handlePayPalCheckout = () => {
    setIsProcessing(true);
    alert('Redirecting to PayPal Secure Gateway...');
  };

  return (
    <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-10">
          <Link href="/market" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black tracking-widest">
            <ArrowLeft size={16} /> ABORT_TRANSACTION
          </Link>
          <div className="text-right">
            <p className="text-cyan-500 text-[10px] font-black tracking-[0.5em]">GLOBAL_PAYMENT_NODE</p>
            <p className="text-xs text-zinc-500">SECURE_ENCRYPTION_ACTIVE</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Order Summary */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">ORDER <span className="text-cyan-500">SUMMARY</span></h1>
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest">TRANSACTION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-cyan-500 text-[10px] font-black mb-2 tracking-widest">ITEM_NAME</p>
                  <h3 className="text-xl font-black">{productData.name}</h3>
                </div>
                <div className="text-right text-cyan-500 font-black">
                   <Globe size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                  <p className="text-[8px] text-zinc-500 font-black mb-1 tracking-widest">RESOLUTION</p>
                  <p className="text-[10px] font-black">{productData.specs}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                  <p className="text-[8px] text-zinc-500 font-black mb-1 tracking-widest">LICENSE</p>
                  <p className="text-[10px] font-black">{productData.license}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-zinc-500 px-4">
              <ShieldCheck className="text-green-500" size={18} />
              <p className="text-[9px] font-bold tracking-[0.2em]">Verified by Aurelius Security Protocol. Authorized by Komsin.</p>
            </div>
          </div>

          {/* Right Side: Payment Form */}
          <div className="bg-white text-black p-10 rounded-[3rem] shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-10">
                <p className="font-black text-xs tracking-widest text-zinc-400">TOTAL_DUE</p>
                <div className="bg-[#ffc439]/20 px-3 py-1 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#ffc439] rounded-full animate-pulse" />
                   <p className="text-[9px] font-black text-[#2c2e2f]">PAYPAL_ONLY</p>
                </div>
              </div>
              
              <div className="mb-12">
                <span className="text-6xl font-black tracking-tighter italic">${productData.price}</span>
                <span className="text-xl font-black ml-2 text-zinc-400">USD</span>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handlePayPalCheckout}
                  disabled={isProcessing}
                  className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-[#2c2e2f] py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group"
                >
                  <CreditCard size={18} className="group-hover:rotate-12 transition-transform" />
                  {isProcessing ? 'INITIALIZING...' : 'CHECKOUT WITH PAYPAL'}
                </button>
                <p className="text-center text-[9px] font-bold text-zinc-400 leading-relaxed px-4">
                  By clicking Checkout, you agree to our <Link href="/license" className="underline hover:text-black">Terms of Service</Link> and Digital License Agreement.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-center gap-8 opacity-40 grayscale">
              <Lock size={14} />
              <span className="text-[10px] font-black tracking-[0.3em]">SECURE_GATEWAY_NODE_01</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 flex justify-between items-center text-zinc-600">
           <div className="flex items-center gap-4 text-[9px] font-black tracking-widest">
              <Zap size={14} className="text-cyan-500" />
              <span>INSTANT_DOWNLOAD_READY</span>
           </div>
           <span className="text-[9px] font-black tracking-[0.5em]">KOMSIN.COM_GLOBAL</span>
        </div>
      </div>
  );
}

// 2. Main Page Component ที่หุ้มด้วย Suspense
export default function GlobalPaymentPage() {
  return (
    <div className="min-h-screen bg-[#020205] text-white py-20 px-6 font-sans italic uppercase">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[150px]" />
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-cyan-500 font-black animate-pulse">
          INITIALIZING SECURE TERMINAL...
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}