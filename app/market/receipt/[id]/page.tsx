'use client';

import React from 'react';
import { Download, Check, ShieldCheck, Mail, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function ReceiptPage({ params }: { params: { id: string } }) {
  // ข้อมูลสมมติ (ในอนาคตดึงจาก Supabase โดยใช้ ID)
  const orderData = {
    id: params.id || "INV-882941",
    date: "18 FEB 2026",
    customer: "customer@example.com",
    item: "THAI CAT VECTOR - EXCLUSIVE",
    // ✅ เพิ่ม URL รูปภาพที่ดึงมาจาก market-previews
    imageUrl: "https://sriunfblgxorzzvzmpmf.supabase.co/storage/v1/object/public/market-previews/mockups/thai-art/mock-1772179331726.jpg",
    ratio: "25 x 30 CM",
    price: 2.50,
    paymentMethod: "STRIPE / CREDIT CARD",
    status: "PAID"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans italic selection:bg-cyan-500">
      <div className="max-w-2xl mx-auto">
        
        {/* BACK BUTTON */}
        <button className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] mb-8 transition-all uppercase font-black">
          <ArrowLeft size={14} /> Back to Market
        </button>

        {/* MAIN RECEIPT CARD */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-md">
          
          {/* WATERMARK BACKGROUND */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Check size={300} strokeWidth={3} />
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">
                AURELIUS <span className="text-cyan-500">STUDIO</span>
              </h1>
              <p className="text-[8px] text-zinc-500 tracking-[0.4em] uppercase mt-2">By Komsin / komsin.com</p>
            </div>
            <div className="text-right">
              <span className="bg-cyan-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {orderData.status}
              </span>
              <p className="text-[10px] font-black mt-4 uppercase tracking-tighter text-zinc-400">#{orderData.id}</p>
            </div>
          </div>

          {/* 🖼️ ITEM PREVIEW SECTION (ส่วนที่เพิ่มใหม่) */}
          <div className="mb-10 relative z-10">
            <div className="w-full aspect-video bg-black rounded-[2rem] border border-white/5 overflow-hidden group relative">
              <img 
                src={orderData.imageUrl} 
                alt={orderData.item}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <p className="text-[8px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-1">Authenticated Asset</p>
                <h2 className="text-xl font-black uppercase tracking-tight">{orderData.item}</h2>
              </div>
            </div>
          </div>

          {/* CONTENT DETAILS */}
          <div className="space-y-8 relative z-10">
            <div className="border-b border-white/5 pb-8 flex justify-between items-end">
               <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">License & Dimensions</p>
                  <p className="text-[10px] text-zinc-300 uppercase font-bold">Standard Commercial / {orderData.ratio}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-cyan-400">${orderData.price.toFixed(2)}</p>
               </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">Customer Address</p>
                <p className="text-[10px] font-bold uppercase text-white/90">{orderData.customer}</p>
              </div>
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">Transaction Date</p>
                <p className="text-[10px] font-bold uppercase text-white/90">{orderData.date}</p>
              </div>
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">Payment Gateway</p>
                <p className="text-[10px] font-bold uppercase text-white/90">{orderData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2">Identity Support</p>
                <p className="text-[10px] font-bold uppercase text-cyan-500 hover:underline cursor-pointer">komsin.com/verify</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-12 flex flex-col gap-3 relative z-10">
            <button className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-[0.98]">
              <Download size={16} /> Download High-Res Asset (ZIP)
            </button>
            <button className="w-full border border-white/10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-zinc-400">
              <Mail size={16} /> Forward to Secondary Email
            </button>
          </div>

          {/* SECURITY FOOTER */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-cyan-500" />
              <span className="text-[7px] font-black uppercase tracking-[0.2em]">Secure Encryption</span>
            </div>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">© 2026 Aurelius Studio Archive</span>
          </div>
        </div>
      </div>
    </div>
  );
}