-- Script de inicialización de productos para PostgreSQL

-- Insertar productos de ejemplo con campos extendidos
INSERT INTO products (name, price, description, category, brand, sport, gender, in_stock, stock_quantity) VALUES
-- Calzado Deportivo
('Zapatillas Nike Air Max', 129.99, 'Zapatillas deportivas de alta calidad con tecnología Air Max para máxima comodidad', 'Calzado', 'Nike', 'Running', 'Unisex', true, 45),
('Zapatillas Adidas Ultraboost', 159.99, 'Zapatillas de running con tecnología Boost para retorno de energía superior', 'Calzado', 'Adidas', 'Running', 'Unisex', true, 32),
('Zapatillas Puma RS-X', 99.99, 'Zapatillas retro de estilo urbano con máxima comodidad', 'Calzado', 'Puma', 'Fitness', 'Unisex', true, 28),
('Zapatillas Basketball Nike LeBron', 179.99, 'Zapatillas de basketball profesionales con soporte de tobillo', 'Calzado', 'Nike', 'Basketball', 'Hombre', true, 18),

-- Ropa Deportiva
('Camiseta Adidas Running', 39.99, 'Camiseta técnica de running con tecnología Climalite que absorbe la humedad', 'Ropa', 'Adidas', 'Running', 'Hombre', true, 65),
('Pantalón Deportivo Puma', 54.99, 'Pantalón deportivo cómodo y flexible, ideal para entrenamiento', 'Ropa', 'Puma', 'Fitness', 'Hombre', true, 42),
('Leggings Nike Pro', 49.99, 'Leggings de compresión para entrenamiento intenso', 'Ropa', 'Nike', 'Fitness', 'Mujer', true, 55),
('Short de Running Under Armour', 34.99, 'Short ligero de running con tecnología de secado rápido', 'Ropa', 'Under Armour', 'Running', 'Hombre', true, 38),
('Top Deportivo Reebok', 29.99, 'Top deportivo con soporte medio para yoga y fitness', 'Ropa', 'Reebok', 'Yoga', 'Mujer', true, 47),

-- Equipamiento
('Balón de Fútbol Nike', 24.99, 'Balón oficial de fútbol, tamaño 5, construcción duradera', 'Equipamiento', 'Nike', 'Fútbol', 'Unisex', true, 75),
('Balón de Basketball Wilson', 34.99, 'Balón oficial de basketball con grip superior', 'Equipamiento', 'Wilson', 'Basketball', 'Unisex', true, 28),
('Raqueta de Tennis Wilson Pro', 149.99, 'Raqueta profesional de tennis con balance perfecto', 'Equipamiento', 'Wilson', 'Tennis', 'Unisex', true, 12),

-- Fitness
('Mancuernas 5kg (Par)', 34.99, 'Par de mancuernas de 5kg cada una, recubiertas de neopreno', 'Fitness', 'Reebok', 'Fitness', 'Unisex', true, 25),
('Yoga Mat Premium', 29.99, 'Esterilla de yoga antideslizante, 6mm de grosor', 'Fitness', 'Adidas', 'Yoga', 'Unisex', true, 58),
('Banda Elástica Set', 19.99, 'Set de 5 bandas elásticas de resistencia variada', 'Fitness', 'Nike', 'Fitness', 'Unisex', true, 82),
('Kettlebell 12kg', 44.99, 'Kettlebell profesional de hierro fundido', 'Fitness', 'Puma', 'Fitness', 'Unisex', true, 15),

-- Accesorios
('Botella Deportiva 1L', 14.99, 'Botella deportiva libre de BPA con medidor de capacidad', 'Accesorios', 'Nike', 'Running', 'Unisex', true, 120),
('Gorra Nike Dri-FIT', 19.99, 'Gorra deportiva con tecnología Dri-FIT que mantiene la cabeza seca', 'Accesorios', 'Nike', 'Running', 'Unisex', true, 68),
('Mochila Deportiva 30L', 44.99, 'Mochila deportiva espaciosa con compartimento para laptop', 'Accesorios', 'Adidas', 'Fitness', 'Unisex', true, 35),
('Guantes de Gimnasio', 16.99, 'Guantes de entrenamiento con agarre antideslizante', 'Accesorios', 'Under Armour', 'Fitness', 'Unisex', true, 52),
('Calcetines Running (Pack 3)', 12.99, 'Pack de 3 pares de calcetines técnicos', 'Accesorios', 'Puma', 'Running', 'Unisex', true, 95),

-- Tecnología
('Reloj Deportivo GPS', 199.99, 'Reloj deportivo con GPS integrado y monitor de frecuencia cardíaca', 'Tecnología', 'Nike', 'Running', 'Unisex', true, 22),
('Audífonos Bluetooth Sport', 79.99, 'Audífonos inalámbricos resistentes al agua para deportes', 'Tecnología', 'Adidas', 'Fitness', 'Unisex', true, 41),

-- Ciclismo
('Bicicleta MTB Puma', 599.99, 'Bicicleta de montaña con suspensión completa', 'Equipamiento', 'Puma', 'Ciclismo', 'Unisex', true, 8),
('Casco Ciclismo Aero', 89.99, 'Casco aerodinámico con ventilación optimizada', 'Accesorios', 'Nike', 'Ciclismo', 'Unisex', true, 18),

-- Natación
('Gafas de Natación Pro', 24.99, 'Gafas de natación profesionales anti-vaho', 'Equipamiento', 'Adidas', 'Natación', 'Unisex', true, 44),
('Traje de Baño Competición', 59.99, 'Traje de baño de competición de alto rendimiento', 'Ropa', 'Nike', 'Natación', 'Mujer', true, 27);

-- Verificar la inserción
SELECT COUNT(*) as total_productos FROM products;

