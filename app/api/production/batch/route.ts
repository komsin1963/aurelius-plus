import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    // สร้างข้อมูลผลลัพธ์เพื่อจำลองกระบวนการ Pipeline
    const results = await Promise.all(
      files.map(async (file, index) => {
        // ในอนาคตคุณจะใส่ Logic: AI Vectorize หรือ CMYK ตรงนี้
        // ตอนนี้เราจำลองสถานะ Processing
        return {
          id: `task_${Date.now()}_${index}`,
          filename: file.name,
          status: 'queued', // สถานะเริ่มต้นในคิว
          size: file.size,
          type: file.type,
          timestamp: new Date().toISOString()
        };
      })
    );

    // ส่งข้อมูลกลับไปให้หน้า Dashboard เพื่ออัปเดตสถานะใน Queue
    return NextResponse.json({
      message: "Batch received and queued for production",
      batch_id: `batch_${Date.now()}`,
      count: files.length,
      data: results
    }, { status: 200 });

  } catch (error) {
    console.error("Batch Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}