import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gsurujgfbdxltlndhgpl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXJ1amdmYmR4bHRsbmRoZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTg1MzQsImV4cCI6MjA3NTY5NDUzNH0.ETJWmYSQghp2o98bcfqgmTEPRgJdHRWenqiwXMDMkRk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
