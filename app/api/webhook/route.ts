import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log(`⚠️ Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // เมื่อลูกค้าชำระเงินสำเร็จ
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. ดึง User ID จาก client_reference_id (ที่เราส่งมาจากหน้า Topup)
    // 2. ถ้าไม่มี ให้ลองใช้ Email จาก customer_details
    const userId = session.client_reference_id;
    const userEmail = session.customer_details?.email;
    
    // 3. ดึงจำนวน XP จาก Metadata ที่เราตั้งไว้ใน Stripe Dashboard
    const xpFromMetadata = session.metadata?.xp_amount;
    const xpToAdd = xpFromMetadata ? parseInt(xpFromMetadata) : 0;

    console.log(`💰 จ่ายเงินสำเร็จ! กำลังเพิ่ม ${xpToAdd} XP ให้ User ID: ${userId || userEmail}`);

    if ((userId || userEmail) && xpToAdd > 0) {
      // ✅ เรียกใช้ rpc 'increment_xp' ตามที่คุณคมศิลป์ออกแบบไว้
      // ปรับ Parameter ให้รองรับทั้ง id หรือ email ตามที่คุณตั้งค่าใน Postgres
      const { error } = await supabase.rpc('increment_xp', { 
        row_id: userId, // หรือเปลี่ยนเป็น row_email: userEmail ตามโครงสร้างฟังก์ชันของคุณ
        x_amount: xpToAdd 
      });

      if (error) {
        console.error("❌ Supabase Error:", error.message);
        return new NextResponse("Database Error", { status: 500 });
      } else {
        console.log("✅ REFILL SUCCESSFUL: XP UPDATED IN DATABASE.");
      }
    }
  }

  return new NextResponse("Success", { status: 200 });
}