// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 🔴 เอาค่าจากหน้า Supabase ของพี่มาวางตรงนี้เลยครับ
const supabaseUrl = 'https://sriunfblgxorzzvmpmf.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_jaw_05elpx0Uk4oAjvKy7g_ZQoQ-BeU'; // ก๊อปมาให้ครบทุกตัว

export const supabase = createClient(supabaseUrl, supabaseAnonKey);