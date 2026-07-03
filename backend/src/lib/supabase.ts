import { createClient } from '@supabase/supabase-js';
import { WebSocket as NodeWebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

if (!globalThis.WebSocket) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).WebSocket = NodeWebSocket;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno');
}

// Cliente admin: se usa en backend para leer y escribir sin depender de la sesión del usuario.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});