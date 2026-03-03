import Stripe from "stripe";
import { NextResponse } from "next/server";

// ตรวจสอบว่ามี Secret Key ใน .env.local หรือยัง
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const session = await stripe.checkout.sessions.create({
      // ✅ แนะนำให้เพิ่ม promptpay เพื่อให้ลูกค้าไทยจ่ายง่ายขึ้น
      payment_method_types: ["card", "promptpay"], 
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "REFILL XP PROTOCOL (25,000 XP)", // ปรับชื่อตามราคาใหม่
              description: "Aurelius Art Market Credit - Secure Production Node",
            },
            // ✅ ปรับเป็น 250.00 THB (หน่วยเป็นสตางค์)
            unit_amount: 25000, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ปรับ URL กลับไปที่หน้า Studio ของคุณคมศิลป์
      success_url: `${req.headers.get("origin")}/studio-pod/art/studio1?success=true`,
      cancel_url: `${req.headers.get("origin")}/topup?canceled=true`,
    });

    // ส่งเฉพาะ URL กลับไปให้หน้าบ้านเพื่อทำการ Redirect
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}