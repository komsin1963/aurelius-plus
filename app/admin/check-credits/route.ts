import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch("https://api.remove.bg/v1.0/account", {
      headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY || "" },
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    
    return NextResponse.json({
      total: data.data.attributes.credits.total,
      free: data.data.attributes.credits.free,
      // แก้จุด Error ตรงนี้ครับ
      "pay-as-you-go": data.data.attributes.credits.pay_as_you_go 
    });
  } catch (error) {
    return NextResponse.json({ total: 0 }, { status: 500 });
  }
}