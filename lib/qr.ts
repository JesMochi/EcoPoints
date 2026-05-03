export interface QRPayload {
  v: number;
  centro_id: string;
  session_id: string;
  ts: number;
}

export function generateQRData(centroId: string): {
  raw: string;
  payload: QRPayload;
} {
  const payload: QRPayload = {
    v: 1,
    centro_id: centroId,
    session_id: Math.random().toString(36).slice(2, 10),
    ts: Date.now(),
  };
  const raw = btoa(JSON.stringify(payload));
  return { raw, payload };
}

export function validateQRCode(raw: string): QRPayload | null {
  try {
    const payload: QRPayload = JSON.parse(atob(raw));
    if (!payload.v || !payload.centro_id || !payload.session_id || !payload.ts) {
      return null;
    }
    // Válido por 8 horas
    if (Date.now() - payload.ts > 8 * 60 * 60 * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}
