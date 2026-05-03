// =============================================
// EcoPoints — Interfaces TypeScript del proyecto
// =============================================

export type UserRole = "ciudadano" | "centro_acopio" | "admin";

export interface Profile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  puntos_totales: number;
  created_at: string;
}

export interface Material {
  id: string;
  nombre: string;
  puntos_por_kg: number;
  co2_evitado_por_kg: number;
  icono: string;
}

export interface CentroAcopio {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  user_id: string;
  activo: boolean;
}

export interface Transaccion {
  id: string;
  user_id: string;
  centro_id: string;
  material_id: string;
  peso_kg: number;
  puntos_ganados: number;
  qr_code: string;
  created_at: string;
  // Joins opcionales
  profiles?: Pick<Profile, "username" | "email">;
  materiales?: Pick<Material, "nombre" | "icono">;
  centros_acopio?: Pick<CentroAcopio, "nombre">;
}

export interface Recompensa {
  id: string;
  nombre: string;
  descripcion: string;
  puntos_requeridos: number;
  stock: number;
  imagen_url: string;
}

export interface Canje {
  id: string;
  user_id: string;
  recompensa_id: string;
  puntos_usados: number;
  codigo_canje: string;
  created_at: string;
  // Join opcional
  recompensas?: Pick<Recompensa, "nombre" | "imagen_url">;
}

// ---- Tipos auxiliares ----

export interface LeaderboardEntry {
  id: string;
  username: string;
  puntos_totales: number;
  kg_reciclados: number;
  posicion: number;
}

export interface DashboardStats {
  puntos_totales: number;
  kg_reciclados: number;
  co2_evitado: number;
  posicion_ranking: number;
  transacciones_recientes: Transaccion[];
}

export interface ImpactMetrics {
  total_kg_reciclados: number;
  total_co2_evitado: number;
  total_usuarios_activos: number;
  distribucion_materiales: { nombre: string; kg: number; porcentaje: number }[];
  tendencia_30_dias: { fecha: string; kg: number }[];
}

export interface QRData {
  centro_id: string;
  session_id: string;
  timestamp: number;
}

// ---- Tipos de formularios ----

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role: Extract<UserRole, "ciudadano" | "centro_acopio">;
}

export interface RecyclingFormData {
  material_id: string;
  peso_kg: number;
  centro_id: string;
  qr_code: string;
}
