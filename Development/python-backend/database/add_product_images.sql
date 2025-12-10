-- =============================================
-- Script para agregar campo de imagen a productos
-- y actualizar con URLs de imágenes apropiadas
-- =============================================

-- Conectar a la base de datos
\c sportgear_db;

-- Agregar columna image_url si no existe
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400';

-- =============================================
-- Actualizar imágenes según categoría y nombre del producto
-- Usando Unsplash para imágenes de alta calidad
-- =============================================

-- ZAPATILLAS / CALZADO
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' 
WHERE name LIKE '%Nike Air Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' 
WHERE name LIKE '%Adidas Ultraboost%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400' 
WHERE name LIKE '%Puma RS-X%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400' 
WHERE name LIKE '%Basketball Nike LeBron%' OR name LIKE '%Basketball%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400' 
WHERE name LIKE '%Running Shoes%' AND image_url = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400';

-- ROPA DEPORTIVA
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' 
WHERE name LIKE '%Camiseta%Running%' OR name LIKE '%Camiseta Adidas%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400' 
WHERE name LIKE '%Pantalón Deportivo%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' 
WHERE name LIKE '%Leggings%' OR name LIKE '%Nike Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400' 
WHERE name LIKE '%Short%Running%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1518644730709-0835105d9daa?w=400' 
WHERE name LIKE '%Top Deportivo%' AND sport = 'Yoga';

-- EQUIPAMIENTO DEPORTIVO
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=400' 
WHERE name LIKE '%Balón%Fútbol%' OR name LIKE '%Football%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400' 
WHERE name LIKE '%Balón%Basketball%' OR (category = 'Equipamiento' AND sport = 'Basketball');

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400' 
WHERE name LIKE '%Raqueta%Tennis%';

-- FITNESS Y GIMNASIO
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' 
WHERE name LIKE '%Mancuernas%' OR name LIKE '%Dumbbell%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' 
WHERE name LIKE '%Yoga Mat%' OR name LIKE '%Esterilla%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' 
WHERE name LIKE '%Banda Elástica%' OR name LIKE '%Resistance Band%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' 
WHERE name LIKE '%Kettlebell%';

-- ACCESORIOS
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' 
WHERE name LIKE '%Botella%' OR name LIKE '%Water Bottle%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' 
WHERE name LIKE '%Gorra%' OR name LIKE '%Cap%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' 
WHERE name LIKE '%Mochila%' OR name LIKE '%Backpack%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400' 
WHERE name LIKE '%Guantes%' OR name LIKE '%Gloves%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400' 
WHERE name LIKE '%Calcetines%' OR name LIKE '%Socks%';

-- TECNOLOGÍA
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400' 
WHERE name LIKE '%Reloj%GPS%' OR name LIKE '%Smartwatch%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' 
WHERE name LIKE '%Audífonos%' OR name LIKE '%Headphones%' OR name LIKE '%Earbuds%';

-- CICLISMO
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400' 
WHERE name LIKE '%Bicicleta%' OR name LIKE '%Bike%MTB%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400' 
WHERE name LIKE '%Casco%' AND sport = 'Ciclismo';

-- NATACIÓN
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1530329310515-4fc495ba56ab?w=400' 
WHERE name LIKE '%Gafas%Natación%' OR name LIKE '%Swim Goggles%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400' 
WHERE name LIKE '%Traje%Baño%' OR name LIKE '%Swimsuit%';

-- =============================================
-- Verificar los cambios
-- =============================================

\echo '=== Productos actualizados con imágenes ==='
SELECT id, name, category, sport, LEFT(image_url, 50) as image_preview 
FROM products 
ORDER BY category, id
LIMIT 30;

\echo '=== Total de productos con imágenes ==='
SELECT COUNT(*) as total_productos, 
       COUNT(DISTINCT image_url) as imagenes_unicas
FROM products;

\echo '=== Actualización de imágenes completada ==='
