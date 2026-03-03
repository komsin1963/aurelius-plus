'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const ADMIN_EMAIL = 'komplusone@gmail.com'; // อีเมลพี่

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        alert("ADMIN PRIVILEGE REQUIRED");
        router.push('/'); // ไม่ใช่แอดมิน ดีดออกหน้าแรก
      }
    };
    checkAdmin();
  }, [router]);

  if (!isAdmin) return <div className="bg-black min-h-screen text-white p-10 uppercase font-black italic">Verifying Identity...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-20">
      <h1 className="text-5xl font-black italic uppercase text-cyan-500 mb-10 underline">Admin Command Center</h1>
      <p>ยินดีต้อนรับครับพี่ komsin ตอนนี้พี่อยู่ในหน้าจัดการระบบแล้วครับ</p>
      {/* ใส่เครื่องมือจัดการข้อมูลของพี่ตรงนี้ */}
    </div>
  );
}