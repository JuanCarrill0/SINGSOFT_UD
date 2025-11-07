# Guía de Uso - API SportGear Online

## Flujo Completo: Registro → Login → Crear Orden

### Paso 1: Registrar Usuario (MySQL - Spring Boot)

**Endpoint**: `POST http://localhost:8080/api/auth/register`

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumber": "+57 300 1234567",
    "dateOfBirth": "1990-05-15"
  }'
```

**Respuesta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMwOTQwMDAwLCJleHAiOjE3MzA5NzYwMDB9.abc123...",
  "message": "User registered successfully",
  "user": {
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

**💾 Guardar**: Token y user_id (extraído del token o de una llamada GET /api/users/me)

---

### Paso 2: Login (si ya tienes cuenta)

**Endpoint**: `POST http://localhost:8080/api/auth/login`

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumber": "+57 300 1234567"
  }
}
```

---

### Paso 3: Obtener Productos (PostgreSQL - FastAPI)

**Endpoint**: `GET http://localhost:8000/api/v1/products`

```bash
curl http://localhost:8000/api/v1/products
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Professional Football",
    "description": "Official size 5 football for professional matches",
    "price": 49.99,
    "category": "Football",
    "in_stock": true,
    "stock_quantity": 50
  },
  {
    "id": 2,
    "name": "Basketball Pro",
    "price": 39.99,
    "category": "Basketball",
    "stock_quantity": 30
  }
]
```

---

### Paso 4: Crear Orden con Validación de Usuario

**Endpoint**: `POST http://localhost:8000/api/v1/orders`

**⚠️ IMPORTANTE**: 
- Requiere header `Authorization: Bearer {token}`
- El `user_id` debe ser el UUID del usuario en MySQL
- El backend validará automáticamente que el usuario existe

```bash
# Obtener el user_id primero (desde el token JWT o desde la base de datos MySQL)
# Supongamos que el user_id es: "550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "total": 89.98,
    "shipping_address": "Calle 123 #45-67, Bogotá, Colombia"
  }'
```

**Respuesta Exitosa** (usuario válido):
```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total": 89.98,
  "status": "pending",
  "shipping_address": "Calle 123 #45-67, Bogotá, Colombia",
  "created_at": "2025-11-06T20:30:00",
  "updated_at": "2025-11-06T20:30:00"
}
```

**Respuesta Error** (usuario no existe):
```json
{
  "detail": "Invalid user_id: 550e8400-e29b-41d4-a716-446655440000. User not found in authentication system."
}
```

---

### Paso 5: Ver Mis Órdenes

**Endpoint**: `GET http://localhost:8000/api/v1/orders?user_id={UUID}`

```bash
curl "http://localhost:8000/api/v1/orders?user_id=550e8400-e29b-41d4-a716-446655440000"
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "total": 89.98,
    "status": "pending",
    "shipping_address": "Calle 123 #45-67, Bogotá, Colombia",
    "created_at": "2025-11-06T20:30:00",
    "updated_at": "2025-11-06T20:30:00"
  }
]
```

---

### Paso 6: Actualizar Estado de Orden

**Endpoint**: `PUT http://localhost:8000/api/v1/orders/{order_id}`

```bash
curl -X PUT http://localhost:8000/api/v1/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing"
  }'
```

**Respuesta**:
```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total": 89.98,
  "status": "processing",
  "shipping_address": "Calle 123 #45-67, Bogotá, Colombia",
  "created_at": "2025-11-06T20:30:00",
  "updated_at": "2025-11-06T20:35:00"
}
```

---

## Ejemplo Completo en JavaScript/TypeScript

```typescript
// 1. Registrar o Login
async function loginUser(email: string, password: string) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Guardar token
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// 2. Obtener productos
async function getProducts() {
  const response = await fetch('http://localhost:8000/api/v1/products');
  return response.json();
}

// 3. Crear orden (con validación automática de usuario)
async function createOrder(userId: string, total: number, address: string) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      user_id: userId,
      total: total,
      shipping_address: address
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  
  return response.json();
}

// 4. Obtener órdenes del usuario
async function getMyOrders(userId: string) {
  const response = await fetch(
    `http://localhost:8000/api/v1/orders?user_id=${userId}`
  );
  return response.json();
}

// Uso completo
async function completePurchase() {
  try {
    // Login
    const { token, user } = await loginUser('juan@example.com', 'password123');
    
    // Ver productos
    const products = await getProducts();
    console.log('Productos disponibles:', products);
    
    // Crear orden
    const order = await createOrder(
      user.userid,  // UUID desde MySQL
      149.97,       // Total
      'Calle 123 #45-67, Bogotá'
    );
    
    console.log('Orden creada:', order);
    
    // Ver mis órdenes
    const myOrders = await getMyOrders(user.userid);
    console.log('Mis órdenes:', myOrders);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## Validación Automática

### ¿Qué pasa si intento crear una orden con un user_id inexistente?

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000",
    "total": 50.00
  }'
```

**Respuesta (Error 400)**:
```json
{
  "detail": "Invalid user_id: 00000000-0000-0000-0000-000000000000. User not found in authentication system."
}
```

### ¿Qué pasa si no envío el token?

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "total": 50.00
  }'
```

**Respuesta (Error 401)**:
```json
{
  "detail": "Authorization header required"
}
```

---

## Documentación Interactiva

### Swagger UI (recomendado)
- **URL**: http://localhost:8000/docs
- Permite probar todos los endpoints
- Incluye validación de esquemas
- Muestra ejemplos automáticos

### ReDoc
- **URL**: http://localhost:8000/redoc
- Documentación más limpia
- Ideal para leer la API completa

---

## Estados de Órdenes

| Estado | Descripción |
|--------|-------------|
| `pending` | Orden creada, esperando pago |
| `processing` | Pago recibido, preparando envío |
| `shipped` | Orden en tránsito |
| `delivered` | Orden entregada al cliente |
| `cancelled` | Orden cancelada |

---

## Troubleshooting

### Error: "User not found in authentication system"
- ✅ Verifica que el `user_id` sea correcto (UUID válido)
- ✅ Asegúrate de que el usuario exista en MySQL
- ✅ Verifica que el token JWT sea válido

### Error: "Authorization header required"
- ✅ Incluye el header `Authorization: Bearer {token}`
- ✅ Verifica que el token no haya expirado

### Error de conexión a PostgreSQL
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Revisa las credenciales en `.env`
- ✅ Confirma que la base de datos `sportgear_db` existe

### Error de conexión a MySQL (validación de usuarios)
- ✅ Verifica que Spring Boot esté corriendo en puerto 8080
- ✅ Revisa `AUTH_API_URL` en `.env`
- ✅ Confirma conectividad: `curl http://localhost:8080/health`
