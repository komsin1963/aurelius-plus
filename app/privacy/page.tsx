import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Privacy Policy / นโยบายความเป็นส่วนตัว</h1>
      
      {/* English Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-blue-600 underline">English Version</h2>
        <div className="space-y-4">
          <p><strong>1. Data Collection:</strong> We collect your email address via Stripe to process payments and send receipts.</p>
          <p><strong>2. Use of Data:</strong> Your information is used solely to provide 25,000 XP to your account and for customer support.</p>
          <p><strong>3. Third-party Disclosure:</strong> Payment data is securely handled by Stripe. We do not store your credit card details on our servers.</p>
        </div>
      </section>

      <hr className="my-8" />

      {/* Thai Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-blue-600 underline">ภาษาไทย</h2>
        <div className="space-y-4 text-gray-700">
          <p><strong>1. การเก็บรวบรวมข้อมูล:</strong> เราเก็บข้อมูลอีเมลผ่านระบบ Stripe เพื่อใช้ในการออกใบเสร็จและยืนยันการชำระเงิน</p>
          <p><strong>2. การใช้ข้อมูล:</strong> ข้อมูลจะถูกใช้เพื่อเติม 25,000 XP เข้าบัญชีของคุณโดยอัตโนมัติ และเพื่อการช่วยเหลือผ่านหน้า Support</p>
          <p><strong>3. ความปลอดภัย:</strong> ข้อมูลการชำระเงินจะถูกประมวลผลโดย Stripe โดยตรง เราไม่มีการเก็บข้อมูลบัตรเครดิตไว้ในระบบของเราเอง</p>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        Last updated: February 26, 2026 / อัปเดตล่าสุด: 26 กุมภาพันธ์ 2569
      </footer>
    </div>
  );
}