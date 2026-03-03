import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // เรียกใช้ไฟล์เชื่อมต่อที่คุณสร้างไว้ในรูปที่ 8

// 📋 ตารางราคา XP ต่อกิจกรรม (ปรับปรุงให้ตรงกับระบบ Pro Pipeline)
const XP_RATES: Record<string, number> = {
  'AI_GEN': 500,
  'UPSCALE_4K': 2000,
  'VECTORIZE': 3500,
  'REMOVE_BG': 1000,
  'PRO_BATCH_PIPELINE': 5000, // เพิ่มราคาสำหรับระบบ Batch
};

export async function POST(req: NextRequest) {
  try {
    const { userId, jobType } = await req.json();

    // 1. ตรวจสอบว่า jobType ถูกต้องไหม
    const amountToDeduct = XP_RATES[jobType];
    if (!amountToDeduct) {
      return NextResponse.json({ error: "Invalid Job Type" }, { status: 400 });
    }

    // 2. เรียกใช้ RPC (Stored Procedure) ใน Supabase 
    // ตัวนี้จะเข้าไปหัก 'neural_energy' และบันทึก 'transactions' ให้ในคำสั่งเดียว (Atomic)
    const { data: newBalance, error } = await supabase.rpc('deduct_user_xp', {
      user_id_input: userId,
      amount_input: amountToDeduct,
      job_type_input: jobType
    });

    // 3. จัดการ Error กรณีแต้มไม่พอ (ที่เรา RAISE EXCEPTION ไว้ใน SQL)
    if (error) {
      const isInsufficient = error.message.includes('Energy ไม่พอ') || error.message.includes('Insufficient');
      return NextResponse.json({ 
        error: error.message,
        insufficient: isInsufficient
      }, { status: isInsufficient ? 402 : 400 });
    }

    // 4. ส่งผลลัพธ์กลับไปที่หน้าจอ (Frontend)
    console.log(`✅ [komsin.com] User ${userId}: Deducted ${amountToDeduct} XP. New Balance: ${newBalance}`);

    return NextResponse.json({
      success: true,
      jobType,
      deducted: amountToDeduct,
      newBalance: newBalance,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}