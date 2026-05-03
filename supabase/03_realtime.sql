-- =============================================
-- EcoPoints — Habilitar Realtime en profiles
-- Pega este SQL en el editor de Supabase
-- (o actívalo en Dashboard → Database → Replication)
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
