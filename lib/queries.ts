import { supabase } from "./supabase";
import { generateCanjeCode } from "./utils";
import type {
  Profile,
  Material,
  CentroAcopio,
  Transaccion,
  Recompensa,
  Canje,
  LeaderboardEntry,
  DashboardStats,
  ImpactMetrics,
} from "@/types";

// =============================================
// PROFILES
// =============================================

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "username">>
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

// =============================================
// MATERIALES
// =============================================

export async function getMateriales(): Promise<Material[]> {
  const { data, error } = await supabase
    .from("materiales")
    .select("*")
    .order("nombre");
  if (error) throw error;
  return data as Material[];
}

// =============================================
// CENTROS DE ACOPIO
// =============================================

export async function getCentrosAcopio(): Promise<CentroAcopio[]> {
  const { data, error } = await supabase
    .from("centros_acopio")
    .select("*")
    .eq("activo", true)
    .order("nombre");
  if (error) throw error;
  return data as CentroAcopio[];
}

export async function getCentroByUserId(
  userId: string
): Promise<CentroAcopio | null> {
  const { data, error } = await supabase
    .from("centros_acopio")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data as CentroAcopio | null;
}

// =============================================
// TRANSACCIONES
// =============================================

export async function createTransaccion(
  tx: Omit<Transaccion, "id" | "created_at">
): Promise<Transaccion> {
  const { data, error } = await supabase
    .from("transacciones")
    .insert(tx)
    .select()
    .single();
  if (error) throw error;
  return data as Transaccion;
}

export async function getTransaccionesByUser(
  userId: string,
  limit = 20
): Promise<Transaccion[]> {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*, materiales(nombre, icono), centros_acopio(nombre)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Transaccion[];
}

export async function getTransaccionesByCentro(
  centroId: string,
  limit = 20
): Promise<Transaccion[]> {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*, profiles(username, email), materiales(nombre, icono)")
    .eq("centro_id", centroId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Transaccion[];
}

export async function getTransaccionesUltimosDias(
  userId: string,
  dias = 7
): Promise<{ fecha: string; kg: number; puntos: number }[]> {
  const desde = new Date();
  desde.setDate(desde.getDate() - dias);

  const { data, error } = await supabase
    .from("transacciones")
    .select("created_at, peso_kg, puntos_ganados")
    .eq("user_id", userId)
    .gte("created_at", desde.toISOString())
    .order("created_at");
  if (error) throw error;

  const map = new Map<string, { kg: number; puntos: number }>();
  (data || []).forEach((t) => {
    const fecha = t.created_at.split("T")[0];
    const prev = map.get(fecha) ?? { kg: 0, puntos: 0 };
    map.set(fecha, {
      kg: prev.kg + t.peso_kg,
      puntos: prev.puntos + t.puntos_ganados,
    });
  });

  return Array.from(map.entries()).map(([fecha, vals]) => ({
    fecha,
    ...vals,
  }));
}

// =============================================
// DASHBOARD STATS
// =============================================

export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const [profile, todasTx, recientesTx] = await Promise.all([
    getProfile(userId),
    supabase
      .from("transacciones")
      .select("peso_kg, puntos_ganados, material_id, materiales(co2_evitado_por_kg)")
      .eq("user_id", userId),
    getTransaccionesByUser(userId, 5),
  ]);

  const txs = todasTx.data || [];
  const kg_reciclados =
    Math.round(txs.reduce((s, t) => s + Number(t.peso_kg), 0) * 100) / 100;
  const co2_evitado =
    Math.round(
      txs.reduce((s, t) => {
        const co2 = (t.materiales as { co2_evitado_por_kg: number } | null)
          ?.co2_evitado_por_kg ?? 2;
        return s + Number(t.peso_kg) * co2;
      }, 0) * 100
    ) / 100;

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("puntos_totales", profile.puntos_totales);

  return {
    puntos_totales: profile.puntos_totales,
    kg_reciclados,
    co2_evitado,
    posicion_ranking: (count ?? 0) + 1,
    transacciones_recientes: recientesTx,
  };
}

// =============================================
// LEADERBOARD
// =============================================

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, puntos_totales")
    .order("puntos_totales", { ascending: false })
    .limit(limit);
  if (error) throw error;

  return (data || []).map((p, i) => ({
    id: p.id,
    username: p.username,
    puntos_totales: p.puntos_totales,
    kg_reciclados: 0,
    posicion: i + 1,
  }));
}

export async function getUserRankingPosition(userId: string): Promise<number> {
  const profile = await getProfile(userId);
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("puntos_totales", profile.puntos_totales);
  if (error) throw error;
  return (count ?? 0) + 1;
}

// =============================================
// RECOMPENSAS
// =============================================

export async function getRecompensas(): Promise<Recompensa[]> {
  const { data, error } = await supabase
    .from("recompensas")
    .select("*")
    .gt("stock", 0)
    .order("puntos_requeridos");
  if (error) throw error;
  return data as Recompensa[];
}

// =============================================
// CANJES
// =============================================

export async function createCanje(
  userId: string,
  recompensa: Recompensa
): Promise<Canje> {
  const profile = await getProfile(userId);
  if (profile.puntos_totales < recompensa.puntos_requeridos) {
    throw new Error("Puntos insuficientes para canjear esta recompensa");
  }
  if (recompensa.stock <= 0) {
    throw new Error("Esta recompensa no tiene stock disponible");
  }

  const { data, error } = await supabase
    .from("canjes")
    .insert({
      user_id: userId,
      recompensa_id: recompensa.id,
      puntos_usados: recompensa.puntos_requeridos,
      codigo_canje: generateCanjeCode(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Canje;
}

export async function getCanjesByUser(userId: string): Promise<Canje[]> {
  const { data, error } = await supabase
    .from("canjes")
    .select("*, recompensas(nombre, imagen_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Canje[];
}

// =============================================
// IMPACT METRICS (globales)
// =============================================

export async function getImpactMetrics(): Promise<ImpactMetrics> {
  const [txResult, usuariosResult] = await Promise.all([
    supabase
      .from("transacciones")
      .select("peso_kg, materiales(nombre, co2_evitado_por_kg)"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gt("puntos_totales", 0),
  ]);

  if (txResult.error) throw txResult.error;

  const txs = txResult.data || [];

  const total_kg_reciclados =
    Math.round(txs.reduce((s, t) => s + Number(t.peso_kg), 0) * 100) / 100;

  const total_co2_evitado =
    Math.round(
      txs.reduce((s, t) => {
        const co2 = (t.materiales as { co2_evitado_por_kg: number } | null)
          ?.co2_evitado_por_kg ?? 2;
        return s + Number(t.peso_kg) * co2;
      }, 0) * 100
    ) / 100;

  // Distribución por material
  const matMap = new Map<string, number>();
  txs.forEach((t) => {
    const nombre =
      (t.materiales as { nombre: string } | null)?.nombre ?? "Otro";
    matMap.set(nombre, (matMap.get(nombre) ?? 0) + Number(t.peso_kg));
  });
  const distribucion_materiales = Array.from(matMap.entries()).map(
    ([nombre, kg]) => ({
      nombre,
      kg: Math.round(kg * 100) / 100,
      porcentaje:
        total_kg_reciclados > 0
          ? Math.round((kg / total_kg_reciclados) * 100)
          : 0,
    })
  );

  // Tendencia últimos 30 días
  const treintaDiasAtras = new Date();
  treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);
  const { data: tendenciaData } = await supabase
    .from("transacciones")
    .select("created_at, peso_kg")
    .gte("created_at", treintaDiasAtras.toISOString())
    .order("created_at");

  const tendenciaMap = new Map<string, number>();
  (tendenciaData || []).forEach((t) => {
    const fecha = t.created_at.split("T")[0];
    tendenciaMap.set(fecha, (tendenciaMap.get(fecha) ?? 0) + Number(t.peso_kg));
  });
  const tendencia_30_dias = Array.from(tendenciaMap.entries()).map(
    ([fecha, kg]) => ({ fecha, kg: Math.round(kg * 100) / 100 })
  );

  return {
    total_kg_reciclados,
    total_co2_evitado,
    total_usuarios_activos: usuariosResult.count ?? 0,
    distribucion_materiales,
    tendencia_30_dias,
  };
}
