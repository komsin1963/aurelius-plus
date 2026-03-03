import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ดึงค่าจาก .env.local
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Masterpiece vector art, ${prompt}, solid white background, bold black outlines, flat colors, professional sticker style.`,
      n: 1,
      size: "1024x1024",
    });

    // ✅ แก้จุด "possibly undefined" โดยการเช็ค data ก่อนใช้งาน
    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image data received from OpenAI");
    }

    return NextResponse.json({ url: imageUrl });

  } catch (error: any) {
    console.error("OpenAI Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}