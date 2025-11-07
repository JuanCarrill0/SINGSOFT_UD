# SportGear Online - Arquitectura de Dos Bases de Datos

## Visión General

Este proyecto utiliza una arquitectura de **microservicios con dos bases de datos separadas**:

### 1. **MySQL** (Spring Boot Backend - Puerto 8080)
- **Responsabilidad**: Autenticación y gestión de usuarios
- **Ubicación**: `ecommerce-backend/`
- **Tecnologías**: Spring Boot 3.5, MySQL 9.2
- **Tablas**:
  - `users` - Información de usuarios, autenticación JWT
  - `addresses` - Direcciones de usuarios

### 2. **PostgreSQL** (FastAPI Backend - Puerto 8000)
- **Responsabilidad**: Lógica de negocio (productos, órdenes, pagos)
- **Ubicación**: `python-backend/`
- **Tecnologías**: FastAPI, PostgreSQL 17
- **Tablas**:
  - `products` - Catálogo de productos
  - `orders` - Órdenes de compra (con `user_id` de MySQL)
  - `payments` - Pagos asociados a órdenes

## Flujo de Validación de Usuarios

### Creación de Órdenes

```
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│ Frontend │──1──>│ FastAPI      │──2──>│ Spring Boot  │
│          │      │ (PostgreSQL) │      │ (MySQL)      │
└──────────┘      └──────────────┘      └──────────────┘
                         │                      │
                         3                      │
                         │<─────────────────────┘
                         │ (User exists: OK)
                         ▼
                  ┌──────────────┐
                  │ Create Order │
                  │ in PostgreSQL│
                  └──────────────┘
```

**Pasos**:
1. Frontend envía `POST /api/v1/orders` con `user_id` y token JWT
2. FastAPI valida el token con Spring Boot (`GET /api/users/{user_id}`)
3. Si el usuario existe → crea la orden en PostgreSQL
4. Si el usuario NO existe → retorna error 400

### Código de Ejemplo

**Frontend (crear orden)**:
```typescript
const createOrder = async (userId: string, total: number) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id: userId,  // UUID desde MySQL
      total: total,
      shipping_address: "123 Main St"
    })
  });
  
  return response.json();
};
```

**Backend (validación automática)**:
```python
# app/crud/order_crud.py
async def create_order(db: Session, order: OrderCreate, token: str):
    # Valida automáticamente que user_id existe en MySQL
    await validate_user_for_order(order.user_id, token)
    
    # Si pasa validación, crea la orden
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    return db_order
```

## Configuración

### Variables de Entorno (`.env`)

**Python Backend**:
```env
# PostgreSQL
POSTGRES_USER=sportgear_user
POSTGRES_PASSWORD=sportgear123
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=sportgear_db

# Spring Boot Auth API
AUTH_API_URL=http://localhost:8080
```

**Spring Boot Backend** (`application.properties`):
```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/sportgear_db
spring.datasource.username=sportgear_user
spring.datasource.password=sportgear123
```

## Endpoints Principales

### Autenticación (Spring Boot - :8080)
```
POST /api/auth/register  - Registrar usuario
POST /api/auth/login     - Login (retorna JWT)
GET  /api/users/{id}     - Obtener info de usuario (requiere JWT)
```

### Lógica de Negocio (FastAPI - :8000)
```
# Productos
GET    /api/v1/products       - Listar productos
POST   /api/v1/products       - Crear producto
GET    /api/v1/products/{id}  - Obtener producto

# Órdenes (requieren validación de usuario)
GET    /api/v1/orders                    - Listar órdenes
GET    /api/v1/orders?user_id={uuid}     - Órdenes de un usuario
POST   /api/v1/orders                    - Crear orden (requiere JWT)
PUT    /api/v1/orders/{id}               - Actualizar orden
DELETE /api/v1/orders/{id}               - Eliminar orden

# Pagos
GET    /api/v1/payments       - Listar pagos
POST   /api/v1/payments       - Crear pago
```

## Ventajas de Esta Arquitectura

✅ **Separación de responsabilidades**
- Autenticación aislada (MySQL)
- Lógica de negocio independiente (PostgreSQL)

✅ **Escalabilidad**
- Cada servicio puede escalar independientemente
- Fácil agregar más microservicios

✅ **Tecnología apropiada**
- Spring Boot + MySQL: Robusto para autenticación
- FastAPI + PostgreSQL: Rápido para operaciones CRUD

✅ **Mantenimiento**
- Cambios en autenticación no afectan la lógica de negocio
- Fácil de probar cada servicio por separado

## Desventajas y Consideraciones

⚠️ **Latencia de red**
- Cada creación de orden requiere validación HTTP a MySQL
- **Solución**: Caché de usuarios o validación asíncrona

⚠️ **Consistencia de datos**
- No hay foreign keys reales entre bases de datos
- **Solución**: Validaciones estrictas en la API

⚠️ **Complejidad operacional**
- Requiere mantener dos bases de datos
- **Solución**: Buena documentación y scripts de setup

## Inicialización del Sistema

### 1. Iniciar MySQL (Spring Boot)
```bash
cd ecommerce-backend
mvn spring-boot:run
```

### 2. Iniciar PostgreSQL (FastAPI)
```bash
cd python-backend
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend_react
npm run dev
```

## Testing

### Crear un usuario y orden completa

```bash
# 1. Registrar usuario (MySQL)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Respuesta: { "token": "eyJ...", "user": { "userid": "abc-123-..." } }

# 2. Crear orden (PostgreSQL con validación MySQL)
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "user_id": "abc-123-...",
    "total": 99.99,
    "shipping_address": "123 Main St"
  }'
```

## Próximos Pasos

- [ ] Agregar caché Redis para usuarios validados
- [ ] Implementar eventos/mensajería (RabbitMQ/Kafka) para sincronización
- [ ] Agregar health checks entre servicios
- [ ] Implementar circuit breakers para tolerancia a fallos
- [ ] Agregar API Gateway (opcional)
