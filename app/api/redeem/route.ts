import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Cookie: cookieStore.toString() } } }
  )

  const { data: { session } } = await supabaseAuth.auth.getSession()
  if (!session) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 })

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const body = await request.json()
    const cleanCode = body?.code?.trim().toUpperCase()
    if (!cleanCode) return NextResponse.json({ success: false, message: 'NO_CODE' }, { status: 400 })

    const { data: codeData, error: fetchError } = await supabaseAdmin
      .from('redeem_codes')
      .select('*')
      .eq('code', cleanCode)
      .single()

    if (fetchError || !codeData) return NextResponse.json({ success: false, message: 'INVALID' }, { status: 400 })
    if (codeData.is_used) return NextResponse.json({ success: false, message: 'USED' }, { status: 400 })

    await supabaseAdmin.rpc('add_user_xp', { user_id_input: session.user.id, xp_to_add: codeData.xp_value })
    await supabaseAdmin.from('redeem_codes').update({ is_used: true, used_by: session.user.id, used_at: new Date().toISOString() }).eq('code', cleanCode)

    return NextResponse.json({ success: true, amount: codeData.xp_value })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'ERROR' }, { status: 500 })
  }
}