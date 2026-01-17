export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // เปลี่ยนจาก awesome เป็น google
import "./globals.css";
// 1. Import Toaster สำหรับระบบแจ้งเตือน
import { Toaster } from 'react-hot-toast';
 
export const metadata: Metadata = {
  title: "AureliusX | By Komsin Intelligence",
  description: "Advanced AI Learning & Digital Asset Protocol",
};

export default function RootLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#050508]">
        {/* ส่วนเนื้อหาของหน้าเว็บ */}
        {children}

        {/* 2.  ตัวรับสัญญาณแจ้งเตือน (Toaster) 
            ผมตั้งค่าดีไซน์ให้เข้ากับ AureliusX v2 (ขอบมน, ตัวหนังสือหนา, โทน Dark) */}
        <Toaster 
          position="bottom-right" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0b0b12',
              color: '#fff',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              padding: '16px 24px',
              borderRadius: '1.5rem',
              fontSize: '11px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#06b6d4', // สี Cyan
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // สี Red
                secondary: '#fff',
              },
            },
          }} 
        />
      </body>
    </html>
  );
}