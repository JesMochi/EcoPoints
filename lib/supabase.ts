import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton para hooks de cliente — se inicializa solo en el navegador
let _client: ReturnType<typeof createBrowserClient> | null = null;

export const supabase =
  typeof window !== "undefined"
    ? (_client ??= createBrowserClient(supabaseUrl, supabaseAnonKey))
    : createBrowserClient(supabaseUrl, supabaseAnonKey);
