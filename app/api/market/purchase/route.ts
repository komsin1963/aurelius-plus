// app/api/market/purchase/route.ts
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. ตั้งค่า Supabase Admin (ใช้ Service Role Key เพื่อให้มีสิทธิ์อัปเดต XP และสร้าง Signed URL)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // แนะนำให้ใช้ Service Role สำหรับ Backend
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { assetId, priceXP, filePath } = await req.json();

    // 2. ตรวจสอบการยืนยันตัวตน (User Session)
    const cookieStore = cookies();
    // หมายเหตุ: การใช้ getUser() กับ Client ปกติใน Route Handler 
    // อาจต้องใช้เทคนิคพ่วง Auth Helper หรือส่ง Token มาใน Header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] || ''
    );

    // ถ้าไม่ใช่ของฟรี ต้องเช็ค User ก่อน
    if (priceXP > 0 && (authError || !user)) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    // --- CASE A: สินค้าดาวน์โหลดฟรี (PriceXP = 0) ---
    if (priceXP === 0) {
      const { data: signData, error: signError } = await supabase
        .storage
        .from('aurelius-assets')
        .createSignedUrl(filePath, 3600);

      if (signError) throw signError;

      return NextResponse.json({ 
        success: true, 
        downloadUrl: signData.signedUrl 
      });
    }

    // --- CASE B: สินค้าพรีเมียม (ต้องหัก XP) ---
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // เช็ค XP ปัจจุบัน
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ใช้งาน' }, { status: 404 });
    }

    if (profile.xp < priceXP) {
      return NextResponse.json({ error: 'XP ของคุณไม่เพียงพอสำหรับการแลก' }, { status: 400 });
    }

    // ดำเนินการหัก XP
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ xp: profile.xp - priceXP })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // บันทึกประวัติการแลก (Optionally: สร้างตาราง market_history ไว้เก็บข้อมูล)
    // await supabase.from('market_history').insert({ user_id: user.id, asset_id: assetId });

    // สร้าง Signed URL สำหรับไฟล์พรีเมียม
    const { data: signData, error: signError } = await supabase
      .storage
      .from('aurelius-assets')
      .createSignedUrl(filePath, 3600);

    if (signError) throw signError;

    return NextResponse.json({ 
      success: true, 
      downloadUrl: signData.signedUrl 
    });

  } catch (error: any) {
    console.error('Market Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}