import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables with fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://emeuomodshkykagjgsdm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZXVvbW9kc2hreWthZ2pnc2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTk1NDEsImV4cCI6MjA3MzI3NTU0MX0.LO2ExQH839rDCroXHUuTqLnuPTQR7dmp3j95lho2dK8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});