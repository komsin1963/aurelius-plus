import { createClient } from '@supabase/supabase-js';

// ตรวจสอบว่ามีค่าใน env หรือไม่
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Missing Supabase Environment Variables!");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);