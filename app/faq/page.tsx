'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, HelpCircle, Zap, ShieldCheck, Cpu } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "XP (NEURAL ENERGY) คืออะไร?",
    answer: "XP หรือ Neural Energy คือทรัพยากรหลักในระบบ AureliusX ใช้สำหรับเข้าถึงฟีเจอร์ระดับสูง, การประมวลผลโมเดล AI และการแลกรับสินทรัพย์ดิจิทัลในตลาด Asset Market ของเรา"
  },
  {
    question: "เติม XP แล้วไม่เข้าบัญชีต้องทำอย่างไร?",
    answer: "ปกติระบบจะฉีด XP (Injection) เข้าบัญชีทันทีภายใน 1-3 นาที หากเกิน 5 นาทีแล้วยอดไม่ขึ้น ให้ติดต่อ Operator ผ่านช่องทาง Support พร้อมแนบสลิปจาก Stripe หรือ PromptPay"
  },
  {
    question: "การรับ 5,000 XP สำหรับสมาชิกใหม่มีเงื่อนไขอย่างไร?",
    answer: "สิทธิ์รับ 5,000 XP ฟรีจะมอบให้เฉพาะการลงทะเบียน Node ครั้งแรกผ่านอีเมลที่ยังไม่เคยอยู่ในฐานข้อมูลของเราเท่านั้น ระบบจะทำการคำนวณและเพิ่ม XP ให้โดยอัตโนมัติ"
  },
  {
    question: "ระบบชำระเงินมีความปลอดภัยแค่ไหน?",
    answer: "เราใช้โปรโตคอลการชำระเงินผ่าน Stripe Global Secure ซึ่งมีการเข้ารหัสระดับธนาคาร (AES-256) และรองรับการสแกน PromptPay ผ่านเกตเวย์มาตรฐานสากล"
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-mono selection:bg-cyan-500 relative overflow-hidden">
      {/* BACKGROUND DECO */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* HEADER */}
        <header className="mb-16">
          <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-all mb-8 text-[10px] font-black uppercase tracking-widest italic">
            <ArrowLeft size={16} /> Back to Protocol
          </Link>
          <div className="flex items-end gap-4">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              F.A.Q <span className="text-cyan-400">SYSTEM</span>
            </h1>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse mb-2" />
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-4 italic">
            KNOWLEDGE BASE • BY KOMSIN.COM
          </p>
        </header>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 ${openIndex === index ? 'bg-zinc-900/40 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.05)]' : 'bg-zinc-900/20'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 md:p-8 flex justify-between items-center text-left group"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-black ${openIndex === index ? 'text-cyan-400' : 'text-zinc-700'} transition-colors`}>
                    0{index + 1}
                  </span>
                  <h3 className={`text-sm md:text-lg font-black italic uppercase tracking-tight transition-colors ${openIndex === index ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${openIndex === index ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10 text-zinc-600'}`}>
                  {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>
              
              <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 md:px-20 md:pb-10">
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-[8px] font-black text-cyan-500/30 uppercase tracking-widest">
                    <Cpu size={12} /> Data Verified by Aurelius Node
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="mt-20 p-8 md:p-12 bg-white/5 border border-white/5 rounded-[3rem] text-center relative overflow-hidden">
          <HelpCircle className="mx-auto mb-6 text-cyan-500/20" size={48} />
          <h4 className="text-xl font-black italic uppercase mb-2">Still Need Assistance?</h4>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8 italic">Operator is standing by for your signal.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-[11px] uppercase italic hover:bg-cyan-500 transition-all shadow-xl">
            Contact Operator <Zap size={14} fill="currentColor" />
          </Link>
        </div>
      </div>
    </div>
  );
}