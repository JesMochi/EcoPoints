-- =============================================
-- EcoPoints — Datos de prueba (seed)
-- Pega este archivo DESPUÉS del schema
-- =============================================

-- ============ MATERIALES ============
INSERT INTO materiales (nombre, puntos_por_kg, co2_evitado_por_kg, icono) VALUES
  ('Plástico PET',   10,  2.500, '🍶'),
  ('Vidrio',          5,  0.315, '🫙'),
  ('Cartón y Papel',  8,  1.100, '📦'),
  ('Aluminio',       20,  9.000, '🥫'),
  ('Electrónicos',   30, 20.000, '💻')
ON CONFLICT DO NOTHING;

-- ============ CENTROS DE ACOPIO ============
-- Nota: user_id es NULL porque son centros demo sin usuario asignado
INSERT INTO centros_acopio (nombre, direccion, lat, lng, user_id, activo) VALUES
  (
    'Centro Ecológico Norte',
    'Av. Morones Prieto 3000, Monterrey, NL',
    25.6866, -100.3161, NULL, TRUE
  ),
  (
    'Punto Verde Sur',
    'Av. Vallarta 1440, Guadalajara, JAL',
    20.6597, -103.3496, NULL, TRUE
  ),
  (
    'EcoAcopio CDMX',
    'Insurgentes Sur 1602, Col. Crédito Constructor, CDMX',
    19.3710, -99.1727, NULL, TRUE
  )
ON CONFLICT DO NOTHING;

-- ============ RECOMPENSAS ============
INSERT INTO recompensas (nombre, descripcion, puntos_requeridos, stock, imagen_url) VALUES
  (
    'Bolsa de despensa básica',
    'Canasta con productos de la despensa básica: arroz, frijoles, aceite, azúcar y más.',
    500,
    50,
    ''
  ),
  (
    'Descuento 20% en tienda local',
    'Cupón de descuento del 20% válido en tiendas afiliadas de tu municipio.',
    300,
    100,
    ''
  ),
  (
    'Planta de árbol nativo',
    'Una planta de árbol nativo de tu región lista para sembrar. Incluye instrucciones de cuidado.',
    200,
    200,
    ''
  )
ON CONFLICT DO NOTHING;
