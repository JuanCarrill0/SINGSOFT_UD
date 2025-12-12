-- Script de inicialización de productos para PostgreSQL

-- Insertar productos de ejemplo con campos extendidos e imágenes específicas
INSERT INTO products (name, price, description, category, brand, sport, gender, in_stock, stock_quantity, image_url) VALUES
-- Calzado Deportivo
('Zapatillas Nike Air Max', 129.99, 'Zapatillas deportivas de alta calidad con tecnología Air Max para máxima comodidad', 'Calzado', 'Nike', 'Running', 'Unisex', true, 45, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
('Zapatillas Adidas Ultraboost', 159.99, 'Zapatillas de running con tecnología Boost para retorno de energía superior', 'Calzado', 'Adidas', 'Running', 'Unisex', true, 32, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'),
('Zapatillas Puma RS-X', 99.99, 'Zapatillas retro de estilo urbano con máxima comodidad', 'Calzado', 'Puma', 'Fitness', 'Unisex', true, 28, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500'),
('Zapatillas Basketball Nike LeBron', 179.99, 'Zapatillas de basketball profesionales con soporte de tobillo', 'Calzado', 'Nike', 'Basketball', 'Hombre', true, 18, 'https://images.unsplash.com/photo-1515396800500-83f8bb8e5ea2?w=500'),

-- Ropa Deportiva
('Camiseta Adidas Running', 39.99, 'Camiseta técnica de running con tecnología Climalite que absorbe la humedad', 'Ropa', 'Adidas', 'Running', 'Hombre', true, 65, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
('Pantalón Deportivo Puma', 54.99, 'Pantalón deportivo cómodo y flexible, ideal para entrenamiento', 'Ropa', 'Puma', 'Fitness', 'Hombre', true, 42, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'),
('Leggings Nike Pro', 49.99, 'Leggings de compresión para entrenamiento intenso', 'Ropa', 'Nike', 'Fitness', 'Mujer', true, 55, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500'),
('Short de Running Under Armour', 34.99, 'Short ligero de running con tecnología de secado rápido', 'Ropa', 'Under Armour', 'Running', 'Hombre', true, 38, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'),
('Top Deportivo Reebok', 29.99, 'Top deportivo con soporte medio para yoga y fitness', 'Ropa', 'Reebok', 'Yoga', 'Mujer', true, 47, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'),

-- Equipamiento
('Balón de Fútbol Nike', 24.99, 'Balón oficial de fútbol, tamaño 5, construcción duradera', 'Equipamiento', 'Nike', 'Fútbol', 'Unisex', true, 75, 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500'),
('Balón de Basketball Wilson', 34.99, 'Balón oficial de basketball con grip superior', 'Equipamiento', 'Wilson', 'Basketball', 'Unisex', true, 28, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500'),
('Raqueta de Tennis Wilson Pro', 149.99, 'Raqueta profesional de tennis con balance perfecto', 'Equipamiento', 'Wilson', 'Tennis', 'Unisex', true, 12, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500'),

-- Fitness
('Mancuernas 5kg (Par)', 34.99, 'Par de mancuernas de 5kg cada una, recubiertas de neopreno', 'Fitness', 'Reebok', 'Fitness', 'Unisex', true, 25, 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b6bd?w=500'),
('Yoga Mat Premium', 29.99, 'Esterilla de yoga antideslizante, 6mm de grosor', 'Fitness', 'Adidas', 'Yoga', 'Unisex', true, 58, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'),
('Banda Elástica Set', 19.99, 'Set de 5 bandas elásticas de resistencia variada', 'Fitness', 'Nike', 'Fitness', 'Unisex', true, 82, 'https://images.unsplash.com/photo-1598632640478-ae2ebc0500f6?w=500'),
('Kettlebell 12kg', 44.99, 'Kettlebell profesional de hierro fundido', 'Fitness', 'Puma', 'Fitness', 'Unisex', true, 15, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'),

-- Accesorios
('Botella Deportiva 1L', 14.99, 'Botella deportiva libre de BPA con medidor de capacidad', 'Accesorios', 'Nike', 'Running', 'Unisex', true, 120, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'),
('Gorra Nike Dri-FIT', 19.99, 'Gorra deportiva con tecnología Dri-FIT que mantiene la cabeza seca', 'Accesorios', 'Nike', 'Running', 'Unisex', true, 68, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'),
('Mochila Deportiva 30L', 44.99, 'Mochila deportiva espaciosa con compartimento para laptop', 'Accesorios', 'Adidas', 'Fitness', 'Unisex', true, 35, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
('Guantes de Gimnasio', 16.99, 'Guantes de entrenamiento con agarre antideslizante', 'Accesorios', 'Under Armour', 'Fitness', 'Unisex', true, 52, 'https://images.unsplash.com/photo-1598632640652-a93347be42bf?w=500'),
('Calcetines Running (Pack 3)', 12.99, 'Pack de 3 pares de calcetines técnicos', 'Accesorios', 'Puma', 'Running', 'Unisex', true, 95, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500'),

-- Tecnología
('Reloj Deportivo GPS', 199.99, 'Reloj deportivo con GPS integrado y monitor de frecuencia cardíaca', 'Tecnología', 'Nike', 'Running', 'Unisex', true, 22, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500'),
('Audífonos Bluetooth Sport', 79.99, 'Audífonos inalámbricos resistentes al agua para deportes', 'Tecnología', 'Adidas', 'Fitness', 'Unisex', true, 41, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'),

-- Ciclismo
('Bicicleta MTB Puma', 599.99, 'Bicicleta de montaña con suspensión completa', 'Equipamiento', 'Puma', 'Ciclismo', 'Unisex', true, 8, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500'),
('Casco Ciclismo Aero', 89.99, 'Casco aerodinámico con ventilación optimizada', 'Accesorios', 'Nike', 'Ciclismo', 'Unisex', true, 18, 'https://images.unsplash.com/photo-1557687790-aaa0defdd2e1?w=500'),

-- Natación
('Gafas de Natación Pro', 24.99, 'Gafas de natación profesionales anti-vaho', 'Equipamiento', 'Adidas', 'Natación', 'Unisex', true, 44, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500'),
('Traje de Baño Competición', 59.99, 'Traje de baño de competición de alto rendimiento', 'Ropa', 'Nike', 'Natación', 'Mujer', true, 27, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500');

-- Verificar la inserción
SELECT COUNT(*) as total_productos FROM products;

