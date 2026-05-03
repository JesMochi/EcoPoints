export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: "ciudadano" | "centro_acopio" | "admin";
          puntos_totales: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          role?: "ciudadano" | "centro_acopio" | "admin";
          puntos_totales?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          role?: "ciudadano" | "centro_acopio" | "admin";
          puntos_totales?: number;
          created_at?: string;
        };
      };
      materiales: {
        Row: {
          id: string;
          nombre: string;
          puntos_por_kg: number;
          co2_evitado_por_kg: number;
          icono: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          puntos_por_kg: number;
          co2_evitado_por_kg: number;
          icono?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          puntos_por_kg?: number;
          co2_evitado_por_kg?: number;
          icono?: string;
        };
      };
      centros_acopio: {
        Row: {
          id: string;
          nombre: string;
          direccion: string;
          lat: number;
          lng: number;
          user_id: string | null;
          activo: boolean;
        };
        Insert: {
          id?: string;
          nombre: string;
          direccion: string;
          lat: number;
          lng: number;
          user_id?: string | null;
          activo?: boolean;
        };
        Update: {
          id?: string;
          nombre?: string;
          direccion?: string;
          lat?: number;
          lng?: number;
          user_id?: string | null;
          activo?: boolean;
        };
      };
      transacciones: {
        Row: {
          id: string;
          user_id: string;
          centro_id: string | null;
          material_id: string | null;
          peso_kg: number;
          puntos_ganados: number;
          qr_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          centro_id?: string | null;
          material_id?: string | null;
          peso_kg: number;
          puntos_ganados: number;
          qr_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          centro_id?: string | null;
          material_id?: string | null;
          peso_kg?: number;
          puntos_ganados?: number;
          qr_code?: string;
          created_at?: string;
        };
      };
      recompensas: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string;
          puntos_requeridos: number;
          stock: number;
          imagen_url: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion: string;
          puntos_requeridos: number;
          stock?: number;
          imagen_url?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string;
          puntos_requeridos?: number;
          stock?: number;
          imagen_url?: string;
        };
      };
      canjes: {
        Row: {
          id: string;
          user_id: string;
          recompensa_id: string | null;
          puntos_usados: number;
          codigo_canje: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recompensa_id?: string | null;
          puntos_usados: number;
          codigo_canje: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recompensa_id?: string | null;
          puntos_usados?: number;
          codigo_canje?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "ciudadano" | "centro_acopio" | "admin";
    };
  };
};
