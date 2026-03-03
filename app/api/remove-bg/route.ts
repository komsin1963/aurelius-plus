import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image_file_b64, image_url, mode } = body;

    // เตรียม FormData สำหรับส่งหา remove.bg API
    const formData = new FormData();
    
    // ตั้งค่า Mode: 'preview' (0.25 credit) หรือ 'auto' (1 credit)
    // ถ้าคุณต้องการประหยัด แนะนำใช้ preview สำหรับการทำ Mockup บนเว็บ
    formData.append('size', mode === 'full' ? 'auto' : 'preview');

    if (image_file_b64) {
      // ✅ กรณีมาจาก Studio 01 (Base64)
      // แปลง base64 กลับเป็น Buffer ก่อนส่ง
      const buffer = Buffer.from(image_file_b64, 'base64');
      const blob = new Blob([buffer]);
      formData.append('image_file', blob, 'image.png');
    } else if (image_url) {
      // ✅ กรณีมาจาก Workshop (URL จาก AI)
      formData.append('image_url', image_url);
    } else {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // เรียก API ของ Remove.bg
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY!,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Remove.bg Error:', errorData);
      return NextResponse.json({ error: 'Failed to process image' }, { status: response.status });
    }

    // รับไฟล์ PNG ที่ลบพื้นหลังแล้ว
    const imageBuffer = await response.arrayBuffer();

    // ส่งคืนเป็นภาพ PNG
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (err: any) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}