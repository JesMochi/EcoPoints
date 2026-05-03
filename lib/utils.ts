// Calcula el CO₂ evitado en kg dado el material y el peso reciclado
export function calcularCO2(co2PorKg: number, pesoKg: number): number {
  return Math.round(co2PorKg * pesoKg * 100) / 100;
}

// Calcula los puntos a otorgar dado el material y el peso reciclado
export function calcularPuntos(puntosPorKg: number, pesoKg: number): number {
  return Math.round(puntosPorKg * pesoKg);
}

// Formatea un número con separadores de miles
export function formatNumber(n: number): string {
  return n.toLocaleString("es-MX");
}

// Formatea una fecha ISO a formato legible en español
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Devuelve las iniciales de un nombre de usuario (máx 2 caracteres)
export function getInitials(username: string): string {
  return username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Genera un código de canje único
export function generateCanjeCode(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ECO-${ts}-${rand}`;
}

// Equivalencias ambientales para mostrar en el dashboard de impacto
export function getEquivalencias(kgReciclados: number) {
  return {
    arboles: Math.round(kgReciclados * 0.05 * 10) / 10,
    litrosAgua: Math.round(kgReciclados * 6),
    diasEnergia: Math.round(kgReciclados * 0.3 * 10) / 10,
  };
}
