export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai'; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const body = await req.json();
    const { prompt, userId } = body;

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // --- ส่วนตรรกะสั่งงาน OpenAI ---
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, professional t-shirt vector design, minimalist style, isolated on white background`,
      n: 1,
      size: "1024x1024",
    });

    // เปลี่ยนบรรทัดเดิม เป็นการเช็คความปลอดภัยแบบนี้ครับ
    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "AI could not generate image" }, { status: 500 });
    }

    // ส่ง URL รูปภาพกลับไปให้หน้า Workshop ของคุณคมศิลป์
    return NextResponse.json({ success: true, url: imageUrl });
    // ส่ง URL รูปภาพกลับไปให้หน้า Workshop ของคุณคมศิลป์
    return NextResponse.json({ success: true, url: imageUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}