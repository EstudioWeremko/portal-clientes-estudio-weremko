import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aioxkxhfxlilynygripl.supabase.co";
const supabaseAnonKey = "sb_publishable_Fg6trPrZcm_EB5dmYpyJT0_zPGzB71T";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
