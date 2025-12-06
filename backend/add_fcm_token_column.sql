-- Script de migración para agregar la columna fcm_token a la tabla users
-- Ejecutar este script en tu base de datos de producción/desarrollo

-- Agregar columna fcm_token a la tabla users
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(255);

-- Crear índice para búsquedas más rápidas (opcional pero recomendado)
CREATE INDEX idx_users_fcm_token ON users(fcm_token);

-- Verificar que la columna fue agregada correctamente
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'fcm_token';
