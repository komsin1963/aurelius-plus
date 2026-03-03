'use client';

import { ReactLenis } from 'lenis/react'; // อัปเดตการ import ตามภาพล่าสุดของคุณ
import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisOptions = {
    duration: 1.5,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    orientation: 'vertical' as const, // เพิ่ม 'as const' เข้าไปตรงนี้ครับ
    gestureOrientation: 'vertical' as const, // และตรงนี้ด้วยครับ
    smoothTouch: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}