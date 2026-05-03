# 🚀 Guía de Deploy — EcoPoints en Vercel

## Pre-requisitos

- [ ] Proyecto corriendo localmente sin errores (`npm run dev`)
- [ ] Tablas creadas en Supabase (schema + seed)
- [ ] `.env.local` con las 3 variables de Supabase correctas
- [ ] Cuenta en [GitHub](https://github.com) y [Vercel](https://vercel.com)

---

## Paso 1 — Subir a GitHub

Abre una terminal en `d:\VS\EcoPoints` y ejecuta:

```bash
git init
git add .
git commit -m "feat: EcoPoints MVP - HackaTec 2026"
```

Crea un repositorio en GitHub (vacío, sin README) y luego:

```bash
git remote add origin https://github.com/TU_USUARIO/ecopoints.git
git branch -M main
git push -u origin main
```

---

## Paso 2 — Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Selecciona **Import Git Repository** → elige `ecopoints`
3. Vercel detecta Next.js automáticamente — no cambies nada en la configuración del build

---

## Paso 3 — Configurar variables de entorno en Vercel

En la pantalla de configuración del proyecto, antes de hacer deploy, agrega:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://TU_PROJECT_ID.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key de Supabase |

> También puedes agregarlas después en **Project Settings → Environment Variables**.

---

## Paso 4 — Primer deploy

Haz clic en **Deploy**. Vercel construirá y publicará el proyecto.

Al terminar, obtendrás una URL pública como:
```
https://ecopoints-tu-usuario.vercel.app
```

---

## Paso 5 — Actualizar URL en Supabase

Con tu URL pública de Vercel, actualiza en Supabase:

**Authentication → URL Configuration:**
- **Site URL:** `https://ecopoints-tu-usuario.vercel.app`
- **Redirect URLs:** agrega `https://ecopoints-tu-usuario.vercel.app/auth/callback`

---

## Checklist pre-demo

- [ ] `npm run build` completa sin errores localmente
- [ ] Login y registro funcionan con usuarios reales
- [ ] QR se genera en `/centro/generar-qr` y se escanea en `/dashboard/escanear`
- [ ] Los puntos se suman correctamente después del reciclaje
- [ ] El leaderboard se actualiza en tiempo real
- [ ] El certificado se descarga como PNG
- [ ] Las recompensas se pueden canjear

---

## Deploy continuo

Cada `git push` a la rama `main` dispara un nuevo deploy automático en Vercel.

```bash
git add .
git commit -m "fix: descripción del cambio"
git push
```
