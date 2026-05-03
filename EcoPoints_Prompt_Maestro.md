# 🌱 EcoPoints — Prompt Maestro del Proyecto
> HackaTec 2026 | Reto 1: Ecosistemas de Desarrollo | Temática: Sustentabilidad y Territorio

---

## 📋 Contexto del proyecto

Eres un asistente experto en desarrollo web full-stack. Vas a ayudarme a construir **EcoPoints**, un MVP de plataforma de gamificación de reciclaje con economía circular regional, desarrollado para el HackaTec 2026 del Tecnológico Nacional de México.

**Stack tecnológico (100% gratuito):**
- Frontend: Next.js 14+ con App Router + React
- Base de datos y Auth: Supabase (PostgreSQL + Row Level Security)
- Estilos: Tailwind CSS
- Deploy: Vercel (conectado a GitHub)
- QR Codes: librería `qrcode.react`
- Gráficas: librería `recharts`

**Reglas del proyecto:**
1. Todo el código debe ser funcional, sin placeholders vacíos
2. Usar siempre TypeScript
3. Cada componente debe ser reutilizable
4. El código debe correr localmente con `npm run dev`
5. Al final de cada paso, el proyecto debe estar en un estado funcional y sin errores

---

## 🎯 Alcance del MVP (18-24 horas de hackathon)

### Lo que SÍ incluye el MVP:
- Registro e inicio de sesión (Supabase Auth)
- 3 roles: `ciudadano`, `centro_acopio`, `admin`
- Escaneo de QR para registrar reciclaje y ganar puntos
- Leaderboard en tiempo real (top 10 ciudadanos)
- Dashboard ambiental con métricas (kg reciclados, CO₂ evitado, puntos totales)
- Mapa visual de centros de acopio registrados
- Generación de certificado de impacto ambiental (PDF simple)
- Canje de puntos por recompensas (catálogo básico)

### Lo que NO incluye el MVP:
- Pagos reales
- App nativa móvil (solo web responsiva)
- Integración con APIs gubernamentales
- Sistema de notificaciones push

---

## 🗂️ Estructura de base de datos (Supabase)

```sql
-- Tabla de perfiles de usuario
profiles (id, username, email, role, puntos_totales, created_at)

-- Tabla de materiales reciclables
materiales (id, nombre, puntos_por_kg, co2_evitado_por_kg, icono)

-- Tabla de centros de acopio
centros_acopio (id, nombre, direccion, lat, lng, user_id, activo)

-- Tabla de transacciones de reciclaje
transacciones (id, user_id, centro_id, material_id, peso_kg, puntos_ganados, qr_code, created_at)

-- Tabla de recompensas
recompensas (id, nombre, descripcion, puntos_requeridos, stock, imagen_url)

-- Tabla de canjes
canjes (id, user_id, recompensa_id, puntos_usados, created_at)
```

---

## 🔢 División del proyecto en pasos

Usa estos pasos en orden. **Al terminar cada paso, pídeme reporte antes de continuar.**

---

### PASO 1 — Configuración inicial del proyecto
**Prompt para Claude:**
```
Inicia el proyecto EcoPoints desde cero. 
Haz lo siguiente:
1. Crea un proyecto Next.js 14 con TypeScript, Tailwind CSS y App Router llamado "ecopoints"
2. Instala las dependencias: @supabase/supabase-js @supabase/ssr qrcode.react recharts lucide-react
3. Crea el archivo .env.local con las variables de Supabase (con placeholders para que yo las llene)
4. Crea la estructura de carpetas del proyecto:
   /app, /components, /lib, /types, /hooks, /utils
5. Crea el archivo /lib/supabase.ts con el cliente de Supabase configurado
6. Crea el archivo /types/index.ts con todas las interfaces TypeScript del proyecto
7. Configura tailwind.config.ts con la paleta de colores verde de EcoPoints
8. Muéstrame el árbol de archivos final y el contenido de cada archivo creado

Al terminar dime exactamente qué comandos ejecutar y qué variables llenar en .env.local
```

**Reporte esperado:** Proyecto corriendo en localhost:3000 sin errores ✅

---

### PASO 2 — Base de datos en Supabase
**Prompt para Claude:**
```
Continuamos con EcoPoints. El proyecto ya está iniciado.
Ahora necesito configurar la base de datos en Supabase:

1. Dame el SQL completo para crear todas las tablas en Supabase:
   - profiles, materiales, centros_acopio, transacciones, recompensas, canjes
2. Dame el SQL para configurar Row Level Security (RLS) en cada tabla según los roles: ciudadano, centro_acopio, admin
3. Dame el SQL con datos de prueba (seed) para poblar:
   - 5 materiales reciclables (plástico, vidrio, cartón, aluminio, electrónicos)
   - 3 centros de acopio ficticios
   - 3 recompensas (ej. descuento en tienda local, despensa, planta de árbol)
4. Crea el archivo /lib/database.types.ts generado desde el schema de Supabase
5. Crea el archivo /lib/queries.ts con todas las funciones de consulta a Supabase que usaremos

Muéstrame el SQL listo para pegar en el editor de Supabase y el contenido de cada archivo TypeScript.
```

**Reporte esperado:** Tablas creadas en Supabase, datos de seed visibles en el dashboard ✅

---

### PASO 3 — Autenticación y roles de usuario
**Prompt para Claude:**
```
Continuamos con EcoPoints. Base de datos lista.
Ahora implementa el sistema de autenticación completo:

1. Crea /app/(auth)/login/page.tsx — formulario de login con email y contraseña
2. Crea /app/(auth)/register/page.tsx — formulario de registro con: nombre, email, contraseña, selección de rol (ciudadano / centro_acopio)
3. Crea /middleware.ts — para proteger rutas según el rol del usuario
4. Crea /lib/auth.ts — con las funciones: signIn, signUp, signOut, getCurrentUser
5. Crea /hooks/useUser.ts — hook para obtener el usuario actual desde cualquier componente
6. Configura el redirect automático: 
   - ciudadano → /dashboard
   - centro_acopio → /centro
   - admin → /admin
7. Diseña las páginas de login y register con Tailwind usando la paleta verde de EcoPoints

Muéstrame el código completo de cada archivo. El login y register deben verse profesionales.
```

**Reporte esperado:** Puedo registrarme, iniciar sesión y soy redirigido según mi rol ✅

---

### PASO 4 — Dashboard del ciudadano
**Prompt para Claude:**
```
Continuamos con EcoPoints. La autenticación está funcionando.
Crea el dashboard principal del ciudadano en /app/dashboard:

1. Crea /app/dashboard/page.tsx con:
   - Header con nombre del usuario y sus puntos totales actuales
   - Tarjeta de resumen: kg reciclados, CO₂ evitado, posición en ranking
   - Gráfica de barras (recharts) con historial de reciclaje de los últimos 7 días
   - Acceso rápido a: Escanear QR, Ver Ranking, Canjear Puntos
2. Crea /components/layout/Navbar.tsx — barra de navegación responsiva
3. Crea /components/layout/Sidebar.tsx — menú lateral para desktop
4. Crea /components/ui/StatCard.tsx — componente reutilizable para mostrar métricas
5. Crea /components/ui/EcoChart.tsx — gráfica de actividad con recharts
6. Conecta los datos reales desde Supabase usando los hooks

El diseño debe ser moderno, limpio y con la paleta verde. Responsivo para móvil.
Muéstrame el código completo de cada archivo.
```

**Reporte esperado:** Dashboard del ciudadano con datos reales de Supabase visible ✅

---

### PASO 5 — Sistema de QR y registro de reciclaje
**Prompt para Claude:**
```
Continuamos con EcoPoints. El dashboard está listo.
Implementa el sistema de QR codes para el reciclaje:

1. Crea /app/dashboard/escanear/page.tsx:
   - Lector de QR usando la cámara del dispositivo (librería html5-qrcode)
   - Al escanear, muestra formulario: material reciclado + peso en kg
   - Calcula automáticamente los puntos a ganar y CO₂ evitado
   - Botón de confirmar que guarda la transacción en Supabase y suma puntos al usuario
   
2. Crea /app/centro/generar-qr/page.tsx (para el rol centro_acopio):
   - Formulario para generar un QR único por sesión de acopio
   - El QR contiene el ID del centro codificado
   - Muestra el QR generado con qrcode.react listo para imprimir
   - Lista de los últimos 10 escaneos recibidos en este centro

3. Crea /lib/qr.ts con las funciones: generateQRData, validateQRCode, processRecycling

4. Crea /components/qr/QRScanner.tsx — componente del lector de cámara
5. Crea /components/qr/QRGenerator.tsx — componente generador de QR

Instala html5-qrcode si es necesario. Muéstrame el código completo.
```

**Reporte esperado:** Puedo generar un QR desde el centro y escanearlo como ciudadano, los puntos se suman ✅

---

### PASO 6 — Leaderboard en tiempo real
**Prompt para Claude:**
```
Continuamos con EcoPoints. El sistema de QR funciona.
Implementa el leaderboard en tiempo real:

1. Crea /app/dashboard/ranking/page.tsx:
   - Top 10 ciudadanos con más puntos
   - Muestra: posición, avatar con iniciales, nombre, puntos totales, kg reciclados
   - Mi posición destacada aunque no esté en el top 10
   - Actualización en tiempo real con Supabase Realtime (suscripción a cambios)
   - Podio visual para los 3 primeros lugares

2. Crea /components/leaderboard/RankingTable.tsx — tabla del ranking
3. Crea /components/leaderboard/PodiumCard.tsx — tarjetas del podio top 3
4. Crea /hooks/useLeaderboard.ts — hook con suscripción en tiempo real de Supabase

El leaderboard debe actualizarse automáticamente sin recargar la página cuando alguien suba puntos.
Diseño motivador y con gamificación visual (medallas, colores).
Muéstrame el código completo.
```

**Reporte esperado:** El ranking se actualiza en vivo cuando se registra un reciclaje ✅

---

### PASO 7 — Dashboard ambiental y catálogo de recompensas
**Prompt para Claude:**
```
Continuamos con EcoPoints. El leaderboard funciona en tiempo real.
Implementa las dos últimas funcionalidades del MVP:

PARTE A — Dashboard Ambiental en /app/dashboard/impacto:
1. Métricas globales de la plataforma: total kg reciclados, total CO₂ evitado, total usuarios activos
2. Gráfica de dona (recharts) con distribución por tipo de material reciclado
3. Gráfica de línea con tendencia de reciclaje de los últimos 30 días
4. Equivalencias visuales: "X kg = Y árboles salvados = Z litros de agua ahorrados"

PARTE B — Catálogo de recompensas en /app/dashboard/recompensas:
1. Grid de tarjetas con las recompensas disponibles (imagen, nombre, puntos requeridos, stock)
2. Botón de canje que descuenta puntos y genera un código de canje único
3. Historial de canjes del usuario
4. Validación: no puede canjear si no tiene suficientes puntos

Crea también /components/impact/ImpactMetrics.tsx y /components/rewards/RewardCard.tsx
Muéstrame el código completo de cada archivo.
```

**Reporte esperado:** Las métricas ambientales y el catálogo de recompensas están funcionales ✅

---

### PASO 8 — Certificado de impacto y deploy final
**Prompt para Claude:**
```
Continuamos con EcoPoints. Todas las funcionalidades están listas.
Implementa el certificado y prepara el deploy:

PARTE A — Certificado de impacto ambiental:
1. Crea /app/dashboard/certificado/page.tsx:
   - Certificado visual con: nombre del usuario, kg reciclados, CO₂ evitado, fecha
   - Diseño profesional con logo de EcoPoints y colores verdes
   - Botón para descargar como imagen (usar html2canvas)
   - Botón para compartir (Web Share API)

PARTE B — Deploy en Vercel:
1. Dame el paso a paso para:
   - Subir el proyecto a GitHub (comandos git)
   - Conectar el repositorio con Vercel
   - Configurar las variables de entorno en Vercel (las mismas del .env.local)
   - Hacer el primer deploy exitoso
2. Lista de verificación pre-deploy: variables de entorno, build sin errores, rutas protegidas

PARTE C — README.md del proyecto:
1. Crea un README.md profesional con: descripción, stack, instalación local, capturas, licencia

Muéstrame el código del certificado y el README completo.
```

**Reporte esperado:** EcoPoints desplegado en Vercel con URL pública funcional ✅

---

## 📊 Resumen de pasos

| Paso | Tema | Entregable |
|------|------|-----------|
| 1 | Setup inicial | Proyecto Next.js corriendo |
| 2 | Base de datos | Tablas y seed en Supabase |
| 3 | Autenticación | Login + roles funcionando |
| 4 | Dashboard ciudadano | UI con datos reales |
| 5 | QR + reciclaje | Flujo completo de escaneo |
| 6 | Leaderboard | Ranking en tiempo real |
| 7 | Impacto + recompensas | Métricas y canjes |
| 8 | Certificado + deploy | URL pública en Vercel |

---

## 🏆 Cómo presentar en el HackaTec

**Historia de usuario para el pitch:**
> "Juan es un estudiante del Tec que quiere reciclar sus botellas. Va al centro de acopio, el encargado genera un QR de sesión, Juan escanea con EcoPoints, pesa su plástico, gana 50 puntos, sube al ranking y canjea su reward por una bolsa de despensa local. Todo en 60 segundos."

**Métricas de impacto para mencionar:**
- Solo 5% de residuos se reciclan en México
- Cada kg de plástico reciclado evita 2.5 kg de CO₂
- El modelo es replicable en cualquier municipio del país

---

*Documento generado para HackaTec 2026 — InnovaTecNM*
*Stack: Next.js + Supabase + Vercel (100% gratuito)*
