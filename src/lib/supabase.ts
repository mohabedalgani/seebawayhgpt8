import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nokdhskfropjiqopiyme.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5va2Roc2tmcm9wamlxb3BpeW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MjQ2MDUsImV4cCI6MjA1MjEwMDYwNX0.EiVu15wQlsgI4LNUo6eD36vPDWvJcXHPaP3yH4Fw7Ps';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});