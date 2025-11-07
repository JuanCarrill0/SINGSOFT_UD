# Guía de Configuración - Frontend React + Backend Spring Boot

## 🚀 Configuración Rápida

### 1. Variables de Entorno del Frontend

El frontend usa variables de entorno para la URL del backend. 

**Archivo `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Archivo `.env.example`:** (template para referencia)
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Estructura de Archivos

```
frontend_react/
├── .env                    # Variables de entorno (NO commitear)
├── .env.example           # Template de variables de entorno
├── src/
│   ├── config/
│   │   └── api.ts         # Configuración centralizada de API
│   ├── components/
│   │   └── LoginForm.tsx  # Formulario de login/registro
│   └── vite-env.d.ts      # Tipos de TypeScript para variables de entorno
```

### 3. Endpoints del Backend

**Base URL:** `http://localhost:8080`

#### 🔐 Autenticación

**POST** `/api/auth/register`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phoneNumber": "+57 300 123 4567"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  },
  "message": "User registered successfully"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phoneNumber": "+57 300 123 4567"
  }
}
```

### 4. Configuración de CORS

El backend permite solicitudes desde:
- `http://localhost:3000` (Puerto de desarrollo de Vite/React)
- `http://localhost:5173` (Puerto alternativo de Vite)

### 5. Almacenamiento de Sesión

El frontend guarda la sesión en `localStorage`:
- `authToken`: Token JWT del usuario
- `user`: Información del usuario en formato JSON

### 6. Ejecución

#### Backend:
```bash
cd ecommerce-backend
mvn spring-boot:run
```

#### Frontend:
```bash
cd frontend_react
npm install
npm run dev
```

### 7. Base de Datos MySQL

**Configuración:**
- Database: `sportgear_db`
- Usuario: `sportgear_user`
- Password: `sportgear123`
- Puerto: `3306`

**Script de creación:** `ecommerce-backend/database/schema.sql`

### 8. Flujo de Autenticación

1. Usuario visita `/login` o hace clic en "Iniciar Sesión" en el header
2. Completa el formulario (registro o login)
3. Frontend envía petición a `/api/auth/register` o `/api/auth/login`
4. Backend valida credenciales y devuelve token JWT + información del usuario
5. Frontend guarda token en `localStorage`
6. Usuario es redirigido a `/dashboard`

### 9. Protección de Rutas

Actualmente el dashboard es accesible sin autenticación. Para proteger rutas:

```tsx
// En App.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authToken = localStorage.getItem("authToken");
  
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Usar en las rutas
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage ... />
    </ProtectedRoute>
  }
/>
```

### 10. Manejo de Errores

El LoginForm maneja automáticamente:
- Errores de conexión
- Credenciales inválidas
- Email ya registrado
- Validación de campos requeridos

### 📝 Notas Importantes

- ⚠️ El archivo `.env` **NO** debe commitearse a Git (ya está en `.gitignore`)
- ✅ Usa `.env.example` como referencia para otros desarrolladores
- 🔒 En producción, cambiar las credenciales de la base de datos
- 🔐 En producción, usar HTTPS y secretos seguros para JWT
