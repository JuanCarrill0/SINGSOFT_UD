-- Script de inicialización de productos para PostgreSQL

-- Insertar productos de ejemplo
INSERT INTO products (name, price, description, category, in_stock) VALUES
('Zapatillas Nike Air Max', 129.99, 'Zapatillas deportivas de alta calidad con tecnología Air Max para máxima comodidad', 'Calzado', true),
('Camiseta Adidas Running', 39.99, 'Camiseta técnica de running con tecnología Climalite que absorbe la humedad', 'Ropa', true),
('Pantalón Deportivo Puma', 54.99, 'Pantalón deportivo cómodo y flexible, ideal para entrenamiento', 'Ropa', true),
('Balón de Fútbol Nike', 24.99, 'Balón oficial de fútbol, tamaño 5, construcción duradera', 'Equipamiento', true),
('Mancuernas 5kg (Par)', 34.99, 'Par de mancuernas de 5kg cada una, recubiertas de neopreno', 'Fitness', true),
('Yoga Mat Premium', 29.99, 'Esterilla de yoga antideslizante, 6mm de grosor', 'Fitness', true),
('Botella Deportiva 1L', 14.99, 'Botella deportiva libre de BPA con medidor de capacidad', 'Accesorios', true),
('Gorra Nike Dri-FIT', 19.99, 'Gorra deportiva con tecnología Dri-FIT que mantiene la cabeza seca', 'Accesorios', true),
('Reloj Deportivo GPS', 199.99, 'Reloj deportivo con GPS integrado y monitor de frecuencia cardíaca', 'Tecnología', true),
('Mochila Deportiva 30L', 44.99, 'Mochila deportiva espaciosa con compartimento para laptop', 'Accesorios', true),
('Guantes de Gimnasio', 16.99, 'Guantes de entrenamiento con agarre antideslizante', 'Fitness', true),
('Short de Running Under Armour', 34.99, 'Short ligero de running con tecnología de secado rápido', 'Ropa', true);

-- Verificar la inserción
SELECT COUNT(*) as total_productos FROM products;
