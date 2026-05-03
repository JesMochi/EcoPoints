// Rutas de la aplicación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_ESCANEAR: "/dashboard/escanear",
  DASHBOARD_RANKING: "/dashboard/ranking",
  DASHBOARD_RECOMPENSAS: "/dashboard/recompensas",
  DASHBOARD_IMPACTO: "/dashboard/impacto",
  DASHBOARD_CERTIFICADO: "/dashboard/certificado",
  CENTRO: "/centro",
  CENTRO_QR: "/centro/generar-qr",
  ADMIN: "/admin",
} as const;

// Roles de usuario
export const ROLES = {
  CIUDADANO: "ciudadano",
  CENTRO_ACOPIO: "centro_acopio",
  ADMIN: "admin",
} as const;

// Colores de la paleta EcoPoints para recharts
export const CHART_COLORS = [
  "#22c55e", // eco-500
  "#16a34a", // eco-600
  "#86efac", // eco-300
  "#4ade80", // eco-400
  "#15803d", // eco-700
  "#bbf7d0", // eco-200
  "#eab308", // earth-500
  "#facc15", // earth-400
];

// Medallas para el podio del leaderboard
export const MEDALS = ["🥇", "🥈", "🥉"] as const;
