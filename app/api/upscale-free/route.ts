import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // 👈 ใช้ตัวเชื่อมต่อที่พี่แก้กุญแจแล้ว

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt } = await req.json();

    // 1. ตรวจสอบสิทธิ์ User (ดึงจาก Session)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    // 2. เช็ค XP ของ User ว่าพอไหม (ตัวอย่าง: ใช้ 100 XP ต่อการ Upscale)
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single();

    if (!profile || profile.xp < 100) {
      return NextResponse.json({ error: 'Insufficient XP' }, { status: 403 });
    }

    // 3. จำลองการเรียก API Upscale (หรือใส่ Logic เชื่อมต่อ AI ของพี่ตรงนี้)
    // สำหรับตอนนี้เราจะทำการบันทึกลง Database เพื่อให้ไปโผล่ที่หน้า Connect Hub ของพี่ komsin
    const { data: artwork, error: dbError } = await supabase
      .from('artworks')
      .insert([
        { 
          user_id: user.id,
          original_url: imageUrl,
          upscaled_url: imageUrl, // รอ AI ประมวลผล
          status: 'processing',
          is_master_unlocked: false
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. หัก XP ผู้ใช้
    await supabase
      .from('profiles')
      .update({ xp: profile.xp - 100 })
      .eq('id', user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Protocol Initiated', 
      artworkId: artwork.id 
    });

  } catch (error: any) {
    console.error('❌ ERROR in upscale-free:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}