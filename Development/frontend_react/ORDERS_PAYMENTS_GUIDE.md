# Gestión de Órdenes y Pagos - Frontend

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de gestión de órdenes y pagos en el frontend que se conecta con el backend de Python (PostgreSQL).

## 🎯 Funcionalidades Implementadas

### 1. **Hooks Personalizados**

#### `useOrders.ts`
Hook para gestionar órdenes:
- `fetchOrders(userId?)`: Obtiene órdenes, opcionalmente filtradas por usuario
- `getOrder(orderId)`: Obtiene una orden específica
- `createOrder(orderData, token)`: Crea una nueva orden (requiere token de autorización)
- `updateOrder(orderId, updates)`: Actualiza una orden existente
- `deleteOrder(orderId)`: Elimina una orden

**Interfaz OrderCreate:**
```typescript
{
  user_id: string;  // UUID del usuario de MySQL
  total: number;
  shipping_address?: string;
}
```

#### `usePayments.ts`
Hook para gestionar pagos:
- `fetchPayments()`: Obtiene todos los pagos
- `getPayment(paymentId)`: Obtiene un pago específico
- `createPayment(paymentData)`: Crea un nuevo pago
- `deletePayment(paymentId)`: Elimina un pago

**Interfaz PaymentCreate:**
```typescript
{
  order_id: number;
  amount: number;
  method: string;  // 'credit_card', 'debit_card', 'paypal', 'bank_transfer'
}
```

### 2. **Páginas**

#### **CheckoutPage** (`/checkout`)
Página de finalización de compra:
- **Muestra resumen del carrito**: productos, cantidades, precios
- **Formulario de dirección de envío**: campo para ingresar dirección completa
- **Selección de método de pago**: tarjeta de crédito, débito, PayPal, transferencia
- **Campos de tarjeta**: número, vencimiento, CVV (UI placeholder)
- **Validación de usuario**: verifica que el usuario esté autenticado
- **Creación de orden**: envía orden al backend Python con validación en MySQL
- **Procesamiento de pago**: crea el pago asociado a la orden
- **Estado de éxito**: muestra confirmación y redirige a órdenes

**Flujo de checkout:**
1. Usuario hace clic en "Proceder al Pago" en el carrito
2. Se abre `/checkout` con resumen de productos
3. Ingresa dirección de envío
4. Selecciona método de pago
5. Confirma la orden
6. Sistema crea orden en PostgreSQL (valida user_id en MySQL)
7. Procesa el pago
8. Muestra confirmación y limpia carrito
9. Redirige a `/orders` después de 3 segundos

#### **OrdersPage** (`/orders`)
Página de historial de órdenes:
- **Lista de órdenes del usuario**: filtradas por user_id
- **Información de cada orden**:
  - Número de orden
  - Fecha de creación
  - Estado (pendiente, procesando, enviado, entregado, cancelado)
  - Dirección de envío
  - Total de la orden
- **Estados con colores**:
  - 🟡 Pendiente (amarillo)
  - 🔵 Procesando (azul)
  - 🟣 Enviado (morado)
  - 🟢 Entregado (verde)
  - 🔴 Cancelado (rojo)
- **Acciones**: Ver detalles, Cancelar orden (solo si está pendiente)
- **Protegida**: requiere autenticación, redirige a `/login` si no hay sesión

### 3. **Actualizaciones de Componentes**

#### **Header.tsx**
- ➕ Botón "Mis Órdenes" (ícono de paquete 📦)
- Visible solo cuando el usuario está autenticado
- Navega a `/orders` al hacer clic

#### **Cart.tsx**
- ➕ Botón "Proceder al Pago" conectado con `/checkout`
- Cierra el carrito automáticamente al navegar

#### **App.tsx**
- ➕ Nuevas rutas:
  - `/checkout`: Página de checkout
  - `/orders`: Historial de órdenes (protegida)
- ➕ Función `handleClearCart()`: limpia el carrito después de una compra exitosa

### 4. **Configuración de API**

**`config/api.ts` actualizado:**
```typescript
ORDERS: {
  LIST: 'http://localhost:8000/api/v1/orders',
  CREATE: 'http://localhost:8000/api/v1/orders',
  GET: (id) => `http://localhost:8000/api/v1/orders/${id}`,
  UPDATE: (id) => `http://localhost:8000/api/v1/orders/${id}`,
  DELETE: (id) => `http://localhost:8000/api/v1/orders/${id}`,
},
PAYMENTS: {
  LIST: 'http://localhost:8000/api/v1/payments',
  CREATE: 'http://localhost:8000/api/v1/payments',
  GET: (id) => `http://localhost:8000/api/v1/payments/${id}`,
  DELETE: (id) => `http://localhost:8000/api/v1/payments/${id}`,
}
```

## 🔄 Flujo Completo de Compra

```
1. Usuario navega productos → Dashboard
2. Agrega productos al carrito → ProductCard
3. Abre carrito lateral → Cart (Sheet)
4. Hace clic "Proceder al Pago" → Navega a /checkout
5. Ingresa dirección de envío → CheckoutPage
6. Selecciona método de pago → CheckoutPage
7. Confirma orden → CheckoutPage
   ├─ Valida autenticación (token + user_id)
   ├─ Crea orden en PostgreSQL → POST /api/v1/orders
   │   └─ Backend valida user_id en MySQL via HTTP
   ├─ Procesa pago → POST /api/v1/payments
   └─ Limpia carrito
8. Muestra confirmación de éxito → CheckoutPage
9. Redirige a /orders → OrdersPage
10. Usuario ve su historial de órdenes → OrdersPage
```

## 🔐 Validación de Usuarios

El sistema implementa **validación cross-database**:

1. **Frontend** obtiene `user_id` del localStorage (datos del usuario autenticado)
2. **Frontend** envía orden con `user_id` y `Authorization: Bearer <token>`
3. **Python Backend** recibe la solicitud en `/api/v1/orders`
4. **UserService** hace HTTP GET a `http://localhost:8080/api/users/{user_id}` con el token
5. **Spring Boot Backend** valida el token y verifica que el usuario existe en MySQL
6. Si es válido, **Python Backend** crea la orden en PostgreSQL
7. Si es inválido, retorna error 400 o 401

## 📊 Estructura de Datos

### Orden (Order)
```typescript
{
  id: number;
  user_id: string;          // UUID del usuario de MySQL
  total: number;
  status: string;           // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  shipping_address?: string;
  created_at: string;
  updated_at: string;
}
```

### Pago (Payment)
```typescript
{
  id: number;
  order_id: number;
  amount: number;
  method: string;          // 'credit_card', 'debit_card', 'paypal', 'bank_transfer'
  status: string;          // 'pending', 'completed', 'failed'
}
```

## 🧪 Cómo Probar

### Prerrequisitos
1. ✅ Spring Boot backend corriendo en `http://localhost:8080`
2. ✅ Python backend corriendo en `http://localhost:8000`
3. ✅ Frontend React corriendo en `http://localhost:3000`
4. ✅ Usuario registrado y autenticado

### Pasos para probar:

1. **Iniciar sesión**:
   ```
   Navega a http://localhost:3000/login
   Ingresa credenciales de un usuario registrado
   ```

2. **Agregar productos al carrito**:
   ```
   En el Dashboard, haz clic en "Agregar al Carrito" en varios productos
   Verifica que el contador del carrito se actualice
   ```

3. **Abrir carrito**:
   ```
   Haz clic en el ícono del carrito en el header
   Verifica que se muestren los productos agregados
   Ajusta cantidades con +/-
   ```

4. **Procesar orden**:
   ```
   Haz clic en "Proceder al Pago"
   Ingresa una dirección de envío
   Selecciona un método de pago
   Haz clic en "Confirmar y Pagar"
   ```

5. **Verificar éxito**:
   ```
   Deberías ver una pantalla de confirmación con ✅
   Mensaje: "¡Orden Completada!"
   El carrito debe estar vacío
   ```

6. **Ver historial de órdenes**:
   ```
   Haz clic en el ícono de paquete 📦 en el header
   O espera la redirección automática a /orders
   Verifica que tu orden aparezca en la lista
   ```

7. **Verificar en base de datos**:
   ```sql
   -- PostgreSQL (órdenes)
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
   
   -- PostgreSQL (pagos)
   SELECT * FROM payments ORDER BY id DESC LIMIT 5;
   ```

## 🐛 Debugging

### Ver logs del backend Python:
Los hooks hacen console.error cuando hay errores. Abre DevTools → Console para ver:
- `Error fetching orders:`
- `Error creating order:`
- `Error creating payment:`

### Verificar token:
```javascript
// En DevTools Console
localStorage.getItem('authToken')
localStorage.getItem('user')
```

### Probar endpoints directamente:
```bash
# Obtener órdenes de un usuario
curl -X GET "http://localhost:8000/api/v1/orders?user_id=<UUID>"

# Crear orden (requiere token)
curl -X POST "http://localhost:8000/api/v1/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"user_id":"<UUID>","total":50000,"shipping_address":"Calle 123"}'

# Crear pago
curl -X POST "http://localhost:8000/api/v1/payments" \
  -H "Content-Type: application/json" \
  -d '{"order_id":1,"amount":50000,"method":"credit_card"}'
```

## 📝 Notas Importantes

1. **Autenticación requerida**: Tanto `/checkout` como `/orders` necesitan que el usuario esté autenticado
2. **Token en headers**: Las órdenes requieren `Authorization: Bearer <token>` para validación
3. **User ID**: Se obtiene automáticamente del localStorage (guardado en login)
4. **Validación cross-database**: El backend Python valida contra MySQL antes de crear órdenes
5. **Estados de orden**: Por defecto se crean en estado "pending"
6. **Estados de pago**: Por defecto se crean en estado "pending"
7. **Limpieza de carrito**: Solo se limpia después de una orden exitosa

## 🚀 Mejoras Futuras Sugeridas

1. **Detalles de orden**: Crear página `/orders/:id` con productos de la orden
2. **Order items**: Agregar tabla `order_items` para guardar productos de cada orden
3. **Pasarela de pago real**: Integrar Stripe, PayPal, MercadoPago
4. **Tracking de envío**: Agregar número de guía y tracking
5. **Notificaciones**: Emails de confirmación de orden
6. **Cancelación de órdenes**: Implementar lógica de cancelación
7. **Reembolsos**: Gestión de devoluciones y reembolsos
8. **Historial de pagos**: Página separada para ver todos los pagos
9. **Filtros en órdenes**: Filtrar por estado, fecha, monto
10. **Exportar órdenes**: Descargar historial en PDF/CSV

## 🎨 UI/UX Implementado

- ✅ Loading states con spinners
- ✅ Error handling con alertas
- ✅ Success confirmations
- ✅ Empty states con ilustraciones
- ✅ Navegación breadcrumbs
- ✅ Badges de estado con colores
- ✅ Responsive design
- ✅ Formularios con validación básica
- ✅ Redirecciones automáticas
- ✅ Protected routes con guards

---

**Sistema completamente funcional y listo para pruebas!** 🎉
