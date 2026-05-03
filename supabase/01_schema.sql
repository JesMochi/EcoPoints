-- =============================================
-- EcoPoints — Schema completo
-- Pega este archivo en el SQL Editor de Supabase
-- =============================================

-- ============ TABLAS ============

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'ciudadano'
                  CHECK (role IN ('ciudadano', 'centro_acopio', 'admin')),
  puntos_totales INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materiales (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              TEXT NOT NULL,
  puntos_por_kg       INTEGER NOT NULL,
  co2_evitado_por_kg  DECIMAL(10,3) NOT NULL,
  icono               TEXT NOT NULL DEFAULT '♻️'
);

CREATE TABLE IF NOT EXISTS centros_acopio (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    TEXT NOT NULL,
  direccion TEXT NOT NULL,
  lat       DECIMAL(10,7) NOT NULL,
  lng       DECIMAL(10,7) NOT NULL,
  user_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activo    BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS transacciones (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  centro_id      UUID REFERENCES centros_acopio(id) ON DELETE SET NULL,
  material_id    UUID REFERENCES materiales(id) ON DELETE SET NULL,
  peso_kg        DECIMAL(10,3) NOT NULL,
  puntos_ganados INTEGER NOT NULL,
  qr_code        TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recompensas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre            TEXT NOT NULL,
  descripcion       TEXT NOT NULL,
  puntos_requeridos INTEGER NOT NULL,
  stock             INTEGER NOT NULL DEFAULT 0,
  imagen_url        TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS canjes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recompensa_id UUID REFERENCES recompensas(id) ON DELETE SET NULL,
  puntos_usados INTEGER NOT NULL,
  codigo_canje  TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============ FUNCIONES Y TRIGGERS ============

-- Crea un perfil automáticamente al registrarse un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'ciudadano')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Suma puntos al usuario cuando se registra una transacción
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET puntos_totales = puntos_totales + NEW.puntos_ganados
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaccion_created ON transacciones;
CREATE TRIGGER on_transaccion_created
  AFTER INSERT ON transacciones
  FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- Descuenta puntos y stock al realizar un canje
CREATE OR REPLACE FUNCTION handle_canje()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET puntos_totales = puntos_totales - NEW.puntos_usados
  WHERE id = NEW.user_id;

  UPDATE recompensas
  SET stock = stock - 1
  WHERE id = NEW.recompensa_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_canje_created ON canjes;
CREATE TRIGGER on_canje_created
  AFTER INSERT ON canjes
  FOR EACH ROW EXECUTE FUNCTION handle_canje();

-- ============ ROW LEVEL SECURITY ============

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales      ENABLE ROW LEVEL SECURITY;
ALTER TABLE centros_acopio  ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE recompensas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE canjes          ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "Perfiles visibles para usuarios autenticados"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuario puede actualizar su propio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Trigger puede insertar perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---- materiales ----
CREATE POLICY "Materiales visibles para todos"
  ON materiales FOR SELECT
  USING (true);

-- ---- centros_acopio ----
CREATE POLICY "Centros activos visibles para todos"
  ON centros_acopio FOR SELECT
  USING (activo = true);

CREATE POLICY "Centro puede actualizar su propio registro"
  ON centros_acopio FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin puede insertar centros"
  ON centros_acopio FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ---- transacciones ----
CREATE POLICY "Usuario ve sus propias transacciones"
  ON transacciones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Centro ve transacciones de su centro"
  ON transacciones FOR SELECT
  TO authenticated
  USING (
    centro_id IN (
      SELECT id FROM centros_acopio WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuario autenticado puede registrar transacción"
  ON transacciones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ---- recompensas ----
CREATE POLICY "Recompensas visibles para todos"
  ON recompensas FOR SELECT
  USING (true);

-- ---- canjes ----
CREATE POLICY "Usuario ve sus propios canjes"
  ON canjes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario puede realizar canjes"
  ON canjes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
