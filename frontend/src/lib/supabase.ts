import { createClient } from '@supabase/supabase-js';

// El cliente anon se usa SOLO para auth en el lado del browser.
// Las operaciones que requieren privilegios de admin van por el backend.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el .env del frontend. ' +
    'La autenticación no funcionará hasta que las configures.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
