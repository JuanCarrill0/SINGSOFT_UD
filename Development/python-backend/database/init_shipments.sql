-- Script de inicialización de shipments para testing
-- Asume que existen órdenes con IDs 1, 2, 3, 4, 5

-- Shipment 1: Pending (recién creado, sin tracking)
INSERT INTO shipments (order_id, status, created_at, updated_at) 
VALUES (1, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Shipment 2: Shipped (con tracking y transportista)
INSERT INTO shipments (order_id, tracking_number, carrier, status, shipped_at, created_at, updated_at) 
VALUES (
    2, 
    'TRK-2024-DHL-001234', 
    'DHL Express', 
    'shipped', 
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP
);

-- Shipment 3: In Transit (con información de vehículo)
INSERT INTO shipments (
    order_id, 
    tracking_number, 
    carrier, 
    vehicle_info, 
    status, 
    shipped_at, 
    created_at, 
    updated_at
) 
VALUES (
    3,
    'TRK-2024-FEDEX-005678',
    'FedEx Ground',
    'Camión: Volvo FH16, Placa: ABC-1234, Conductor: Juan Pérez',
    'in_transit',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP
);

-- Shipment 4: Delivered (completado)
INSERT INTO shipments (
    order_id, 
    tracking_number, 
    carrier, 
    vehicle_info, 
    status, 
    shipped_at, 
    delivered_at, 
    created_at, 
    updated_at
) 
VALUES (
    4,
    'TRK-2024-UPS-009999',
    'UPS Standard',
    'Camión: Mercedes Actros, Placa: XYZ-9876, Conductor: María González',
    'delivered',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '6 days',
    CURRENT_TIMESTAMP
);

-- Shipment 5: Shipped with minimal info
INSERT INTO shipments (
    order_id, 
    tracking_number, 
    carrier, 
    status, 
    shipped_at, 
    created_at, 
    updated_at
) 
VALUES (
    5,
    'TRK-2024-SERVIENTREGA-777',
    'Servientrega',
    'shipped',
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP
);

-- También actualizar el estado de las órdenes correspondientes
UPDATE orders SET status = 'pending' WHERE id = 1;
UPDATE orders SET status = 'shipped' WHERE id = 2;
UPDATE orders SET status = 'in_transit' WHERE id = 3;
UPDATE orders SET status = 'completed' WHERE id = 4;
UPDATE orders SET status = 'shipped' WHERE id = 5;

-- Verificar datos insertados
SELECT 
    s.id as shipment_id,
    s.order_id,
    s.tracking_number,
    s.carrier,
    s.status,
    s.shipped_at,
    s.delivered_at,
    o.status as order_status
FROM shipments s
JOIN orders o ON s.order_id = o.id
ORDER BY s.id;

\echo '=== Shipments de prueba insertados exitosamente ==='
