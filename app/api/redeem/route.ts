import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // สร้าง Client แบบ Manual เพื่อเลี่ยงปัญหา Library ติดแดง
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const code = body?.code as string | undefined;

    if (!code) return NextResponse.json({ success: false, message: 'MISSING_CODE' }, { status: 400 });
    const cleanCode = code.trim().toUpperCase();

    // 1. ดึงข้อมูล User จากฐานข้อมูล (สมมติว่าส่ง userId มาจากหน้าบ้าน หรือใช้ Session)
    // เพื่อความง่ายในการทดสอบ ให้ลองหาจาก email ที่คุณส่งมา
    const { data: userData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', body?.userEmail)
      .single();

    if (!userData) return NextResponse.json({ success: false, message: 'USER_NOT_FOUND' }, { status: 404 });

    // 2. ตรวจสอบรหัสในตารางที่คุณสร้างสำเร็จแล้ว
    const { data: codeData, error: fetchError } = await supabase
      .from('redeem_codes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (fetchError || !codeData) return NextResponse.json({ success: false, message: 'INVALID_CODE' }, { status: 400 });
    if (codeData.is_used) return NextResponse.json({ success: false, message: 'USED_CODE' }, { status: 400 });

    // 3. รัน RPC 'add_user_xp' ที่คุณทำสำเร็จแล้ว
    const { error: rpcError } = await supabase.rpc('add_user_xp', {
      user_id_input: userData.id,
      xp_to_add: codeData.xp_value
    });

    if (rpcError) throw rpcError;

    // 4. อัปเดตสถานะการใช้งาน
    await supabase.from('redeem_codes').update({ is_used: true, used_by: userData.id }).eq('code', cleanCode);

    return NextResponse.json({ success: true, amount: codeData.xp_value });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'SYSTEM_ERROR' }, { status: 500 });
  }
}