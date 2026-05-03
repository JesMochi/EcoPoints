import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para componentes del navegador (Client Components)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Instancia singleton para uso en hooks de cliente
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
