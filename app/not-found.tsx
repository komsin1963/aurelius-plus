"use client"
import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      
      {/* Background Effect: วงแหวนสัญญาณรบกวน */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Error Code */}
        <h1 className="text-[12rem] font-black italic leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-black select-none">
          404
        </h1>

        {/* Warning Label */}
        <div className="mt-[-2rem] flex flex-col items-center">
          <div className="bg-red-600 text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] mb-6 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            Connection Lost
          </div>
          
          <h2 className="text-2xl font-black uppercase italic tracking-widest text-white mb-2">
            พิกัดสูญหายใน <span className="text-red-500">Sentinel</span>
          </h2>
          
          <p className="max-w-md text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed mb-10">
            ขออภัย คุณคมศิลป์... ระบบไม่สามารถระบุพิกัด URL ที่คุณร้องขอได้ 
            โปรดตรวจสอบความถูกต้องของระบบนำทางอีกครั้ง
          </p>

          {/* Action Button: กลับสู่ห้องควบคุม */}
          <Link href="/studio-pod/portfolio">
            <button className="group relative px-10 py-4 bg-transparent border border-gray-800 rounded-full overflow-hidden transition-all hover:border-cyan-500">
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-cyan-400 transition-colors">
                Back to Command Center
              </span>
              {/* แสงวิ่งตอน Hover */}
              <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 text-center">
        <p className="text-[9px] text-gray-800 uppercase tracking-[0.8em] font-medium italic">
          AureliusX System Protocol • By komsin
        </p>
      </footer>

      {/* สัญลักษณ์ AX จางๆ มุมจอ */}
      <div className="absolute top-10 right-10 text-gray-900 font-black italic text-4xl opacity-20">
        AX
      </div>
    </div>
  )
}