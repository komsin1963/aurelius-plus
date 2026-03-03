import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-8">ข้อกำหนดการให้บริการ (Terms of Service)</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">1. ข้อมูลเกี่ยวกับบริการ</h2>
        <p>ยินดีต้อนรับสู่ komsin.com ให้บริการโดยคุณ คมศิลป์ (komsin kongroy) บริการนี้จัดทำขึ้นเพื่อจำหน่ายแต้มประสบการณ์ดิจิทัล (XP) จำนวน 25,000 XP ต่อรายการสั่งซื้อ เพื่อใช้ภายในระบบ AURELIUS STUDIO</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">2. การชำระเงิน</h2>
        <p>การชำระเงินทั้งหมดดำเนินการผ่าน Stripe ผู้ให้บริการชำระเงินมาตรฐานระดับสากล โดยรองรับการชำระเงินผ่าน PromptPay และบัตรเครดิต/เดบิต</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">3. นโยบายการคืนเงิน (Refund Policy)</h2>
        <p className="font-medium text-red-600">เนื่องจาก XP เป็นสินค้าดิจิทัลที่จัดส่งทันทีผ่านระบบอัตโนมัติ (Webhook) เราขอสงวนสิทธิ์ไม่รับคืนเงินในทุกกรณีหลังจากที่ XP ได้ถูกเพิ่มเข้าสู่บัญชีของผู้ใช้สำเร็จแล้ว</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">4. การคุ้มครองข้อมูลส่วนบุคคล</h2>
        <p>เรามีการเก็บรวบรวมอีเมลของผู้ซื้อเพื่อใช้ในการออกใบเสร็จรับเงินผ่าน Stripe และใช้ระบุตัวตนเพื่อเติม XP เข้าสู่บัญชีให้ถูกต้อง ท่านสามารถอ่านรายละเอียดเพิ่มเติมได้ที่หน้า Privacy Policy</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">5. ติดต่อเรา</h2>
        <p>หากมีปัญหาในการใช้งานหรือสอบถามข้อมูลเพิ่มเติม สามารถติดต่อได้ที่: https://www.komsin.com/support</p>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        อัปเดตล่าสุดเมื่อ: 26 กุมภาพันธ์ 2026
      </footer>
    </div>
  );
}