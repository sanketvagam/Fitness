import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://badqhdpbwutfuisgggrs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZHFoZHBid3V0ZnVpc2dnZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODEzMTMsImV4cCI6MjA3NTc1NzMxM30.bflrDI6cQRP4wGuMzzuHLmEbgE-0Uxg3UXZou-RHOOQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
