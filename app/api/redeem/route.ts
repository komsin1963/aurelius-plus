import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  
  // 1. สร้าง Client สำหรับเช็ค Auth (ใช้คุกกี้จากหน้าบ้าน)
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Cookie: cookieStore.toString() } }
    }
  );

  const { data: { session } } = await supabaseAuth.auth.getSession();

  if (!session) {
    return NextResponse.json({ success: false, message: 'UNAUTHORIZED_ACCESS' }, { status: 401 });
  }

  // 2. ใช้ Service Role สำหรับจัดการ Database (ข้าม RLS เพื่อ Update XP)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const code = body?.code as string | undefined;

    if (!code) {
      return NextResponse.json({ success: false, message: 'MISSING_PROTOCOL_CODE' }, { status: 400 });
    }
    
    const cleanCode = code.trim().toUpperCase();

    // 3. ตรวจสอบรหัสในตาราง redeem_codes
    const { data: codeData, error: fetchError } = await supabaseAdmin
      .from('redeem_codes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (fetchError || !codeData) {
      return NextResponse.json({ success: false, message: 'INVALID_PROTOCOL_CODE' }, { status: 400 });
    }

    if (codeData.is_used) {
      return NextResponse.json({ success: false, message: 'PROTOCOL_ALREADY_ACTIVATED' }, { status: 400 });
    }

    // 4. รัน RPC 'add_user_xp' เติม XP
    const { error: rpcError } = await supabaseAdmin.rpc('add_user_xp', {
      user_id_input: session.user.id,
      xp_to_add: codeData.xp_value
    });

    if (rpcError) throw new Error('XP_INJECTION_FAILED');

    // 5. อัปเดตสถานะรหัส
    await supabaseAdmin
      .from('redeem_codes')
      .update({ 
        is_used: true, 
        used_by: session.user.id,
        used_at: new Date().toISOString()
      })
      .eq('code', cleanCode);

    return NextResponse.json({ success: true, amount: codeData.xp_value });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'CORE_SYSTEM_ERROR' }, { status: 500 });
  }
}