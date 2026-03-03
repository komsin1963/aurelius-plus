import React from 'react';

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">ศูนย์ช่วยเหลือ (Support)</h1>
      <p className="text-gray-600 mb-10 text-lg">
        พบปัญหาในการซื้อ XP หรือต้องการสอบถามข้อมูลเพิ่มเติมเกี่ยวกับ AURELIUS STUDIO? เรายินดีช่วยเหลือครับ
      </p>

      <div className="grid gap-8 md:grid-cols-2 text-left">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">💰 ปัญหาการชำระเงิน</h2>
          <p className="text-gray-600 text-sm">
            หากคุณชำระเงินสำเร็จแต่ไม่ได้รับ 25,000 XP กรุณาแจ้งอีเมลที่ใช้สั่งซื้อและหลักฐานการโอนเงิน (Slip) ให้เราตรวจสอบครับ
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">📧 ช่องทางติดต่อ</h2>
          <p className="text-gray-600 text-sm">
            สามารถติดต่อคุณคมศิลป์ได้โดยตรงผ่านอีเมล: <br/>
            <span className="font-medium text-blue-600">komsin.kongroy@gmail.com</span>
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
        <h3 className="text-lg font-medium mb-4">ข้อมูลผู้ให้บริการ</h3>
        <p className="text-sm text-gray-500">
          ดำเนินงานโดย: คมศิลป์ (komsin kongroy) [By komsin]<br/>
          เว็บไซต์: komsin.com
        </p>
      </div>

      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">← กลับหน้าหลัก</a>
      </div>
    </div>
  );
}