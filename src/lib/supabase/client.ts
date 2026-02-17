import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Muutetaan throw new Error -> console.warn, jotta asennukset eivät kaatuisi
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase-asetukset puuttuvat .env-tiedostosta');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any;