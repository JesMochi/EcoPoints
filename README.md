# 🌱 EcoPoints

> Plataforma de gamificación de reciclaje con economía circular regional.
> Desarrollado para **HackaTec 2026** — TecNM | Reto 1: Ecosistemas de Desarrollo.

---

## ¿Qué es EcoPoints?

EcoPoints conecta a ciudadanos con centros de acopio locales mediante un sistema de puntos y recompensas. El usuario escanea un QR, registra su reciclaje, gana puntos y los canjea por recompensas reales de su comunidad.

**Historia de usuario:**
> "Juan va al centro de acopio, el encargado genera un QR de sesión, Juan lo escanea, pesa su plástico, gana 50 puntos, sube al ranking y canjea su recompensa por una bolsa de despensa local. Todo en 60 segundos."

---

## Stack tecnológico (100% gratuito)

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) + React 18 + TypeScript |
| Estilos | Tailwind CSS |
| Base de datos + Auth | Supabase (PostgreSQL + RLS + Realtime) |
| Gráficas | Recharts |
| QR Codes | qrcode.react + html5-qrcode |
| Certificado PDF | html2canvas |
| Deploy | Vercel |

---

## Funcionalidades del MVP

- Registro e inicio de sesión con 3 roles: `ciudadano`, `centro_acopio`, `admin`
- Escaneo de QR con cámara para registrar reciclaje y ganar puntos
- Dashboard personal con estadísticas y gráfica de actividad semanal
- Leaderboard en tiempo real (Supabase Realtime)
- Dashboard ambiental: kg totales, CO₂ evitado, equivalencias visuales
- Catálogo de recompensas con canje de puntos y código único
- Certificado de impacto ambiental descargable como PNG

---

## Instalación local

### Requisitos
- Node.js 20+
- Cuenta gratuita en [Supabase](https://supabase.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/ecopoints.git
cd ecopoints

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Configurar la base de datos en Supabase
# Ejecuta en el SQL Editor de Supabase:
# → supabase/01_schema.sql  (tablas + RLS + triggers)
# → supabase/02_seed.sql    (datos de prueba)
# → supabase/03_realtime.sql (habilitar Realtime)

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

Encuéntralas en Supabase → **Settings → API**.

---

## Estructura del proyecto

```
ecopoints/
├── app/
│   ├── (auth)/login         # Inicio de sesión
│   ├── (auth)/register      # Registro con selección de rol
│   ├── dashboard/           # Panel del ciudadano
│   │   ├── escanear/        # Lector de QR + registro de reciclaje
│   │   ├── ranking/         # Leaderboard en tiempo real
│   │   ├── recompensas/     # Catálogo y canje de puntos
│   │   ├── impacto/         # Dashboard ambiental
│   │   └── certificado/     # Certificado descargable
│   ├── centro/              # Panel del centro de acopio
│   │   └── generar-qr/      # Generación de QR de sesión
│   └── admin/               # Panel de administración
├── components/
│   ├── layout/              # Sidebar + Navbar
│   ├── ui/                  # StatCard, EcoChart
│   ├── qr/                  # QRScanner, QRGenerator
│   ├── leaderboard/         # PodiumCard, RankingTable
│   ├── impact/              # ImpactMetrics
│   └── rewards/             # RewardCard
├── hooks/                   # useUser, useDashboard, useLeaderboard
├── lib/                     # supabase, auth, queries, qr, utils
├── types/                   # Interfaces TypeScript
├── supabase/                # SQL: schema, seed, realtime
└── utils/                   # constants
```

---

## Métricas de impacto ambiental

- Solo el **5% de residuos** se reciclan correctamente en México
- Cada kg de plástico reciclado evita **2.5 kg de CO₂**
- Modelo replicable en cualquier municipio del país

---

## Deploy en Vercel

Ver [DEPLOY.md](DEPLOY.md) para instrucciones completas.

---

## Licencia

MIT © 2026 — HackaTec InnovaTecNM
