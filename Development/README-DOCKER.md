# SportGear E-Commerce - Docker Deployment

## 🚀 Descripción


Aplicación completa de e-commerce dockerizada con arquitectura de microservicios:

- **Frontend**: React + Vite + TypeScript con Nginx
- **Backend Autenticación**: Spring Boot + MySQL
- **Backend Lógica de Negocio**: FastAPI + PostgreSQL

## 📋 Prerrequisitos


- Docker Desktop instalado y corriendo
- Puertos disponibles: 3000, 3307, 5433, 8001, 8081

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                     (React + Nginx)                         │
│                     localhost:3000                          │
└──────────────┬──────────────────────┬──────────────────────┘
               │                      │
               │                      │
      ┌────────▼────────┐    ┌────────▼────────┐
      │  Java Backend   │    │ Python Backend  │
      │  (Spring Boot)  │    │    (FastAPI)    │
      │  localhost:8081 │    │  localhost:8001 │
      └────────┬────────┘    └────────┬────────┘
               │                      │
      ┌────────▼────────┐    ┌────────▼────────┐
      │     MySQL       │    │   PostgreSQL    │
      │  localhost:3307 │    │  localhost:5433 │
      └─────────────────┘    └─────────────────┘
```

## 🛠️ Configuración

### Variables de Entorno

**Docker Compose maneja automáticamente:**

- MySQL: sportgear_db (puerto 3307)
  - Usuario: sportgear_user
  - Password: sportgear123

- PostgreSQL: sportgear_db (puerto 5433)
  - Usuario: postgres
  - Password: postgres123

- Java Backend (puerto 8081)
  - JWT Secret configurado

- Python Backend (puerto 8001)
  - Conectado a PostgreSQL
  - Valida usuarios contra Java Backend

## 🚀 Comandos

### Iniciar todos los servicios

```powershell
docker-compose up -d
```

### Ver logs de todos los servicios

```powershell
docker-compose logs -f
```

### Ver logs de un servicio específico

```powershell
docker-compose logs -f frontend
docker-compose logs -f java-backend
docker-compose logs -f python-backend
docker-compose logs -f mysql
docker-compose logs -f postgres
```

### Ver estado de los contenedores

```powershell
docker-compose ps
```

### Detener todos los servicios

```powershell
docker-compose down
```

### Reconstruir y reiniciar todo

```powershell
docker-compose down
docker-compose up --build -d
```

### Eliminar volúmenes de datos (CUIDADO: Borra todas las bases de datos)

```powershell
docker-compose down -v
```

## 🌐 Acceso a los Servicios

- **Frontend**: http://localhost:3000
- **Java Backend API**: http://localhost:8081
  - Swagger UI: http://localhost:8081/swagger-ui.html (si está configurado)
  - Auth endpoints: http://localhost:8081/api/auth/*
  
- **Python Backend API**: http://localhost:8001
  - Docs: http://localhost:8001/docs
  - Products: http://localhost:8001/api/v1/products
  - Orders: http://localhost:8001/api/v1/orders
  - Payments: http://localhost:8001/api/v1/payments

- **MySQL**: localhost:3307
  ```powershell
  docker exec -it sportgear-mysql mysql -u sportgear_user -p
  # Password: sportgear123
  ```

- **PostgreSQL**: localhost:5433
  ```powershell
  docker exec -it sportgear-postgres psql -U postgres -d sportgear_db
  # Password: postgres123
  ```

## 📁 Estructura de Archivos

```
Development/
├── docker-compose.yml          # Orquestación de servicios
├── frontend_react/
│   ├── Dockerfile             # Build multi-stage con Nginx
│   ├── nginx.conf             # Configuración de proxy
│   └── .dockerignore
├── java-backend/
│   ├── Dockerfile             # Build Maven + JRE
│   └── .dockerignore
└── python-backend/
    ├── Dockerfile             # Python 3.11 + FastAPI
    └── .dockerignore
```

## 🔧 Troubleshooting

### Los contenedores no inician

```powershell
# Ver logs detallados
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose up --build
```

### Puerto ya en uso

Si ves errores como "bind: address already in use":

1. Detén los servicios locales que usan esos puertos
2. O modifica los puertos en `docker-compose.yml`

### Base de datos vacía

Al primer inicio, las bases de datos se crean automáticamente. Las tablas de MySQL se crean con Hibernate. Para PostgreSQL, verifica que las migraciones se ejecuten correctamente.

### Frontend no carga

```powershell
# Verificar que nginx esté corriendo
docker-compose logs frontend

# Reconstruir solo el frontend
docker-compose up --build frontend -d
```

## 🎯 Próximos Pasos

1. **Registrar usuario**: Ve a http://localhost:3000 y crea una cuenta
2. **Explorar productos**: Navega por el catálogo
3. **Hacer pedido**: Agrega productos al carrito y completa la compra
4. **Ver órdenes**: Revisa tus pedidos en "Mis Órdenes"

## 📊 Monitoreo

### Ver uso de recursos

```powershell
docker stats
```

### Inspeccionar red

```powershell
docker network inspect development_sportgear-network
```

### Ver volúmenes

```powershell
docker volume ls | findstr development
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Las credenciales actuales son para desarrollo. Antes de producción:

1. Cambiar todas las contraseñas
2. Usar variables de entorno externas
3. Configurar HTTPS
4. Revisar configuraciones de CORS
5. Implementar rate limiting

## 📝 Notas

- Los volúmenes persisten los datos entre reinicios
- El frontend usa proxy inverso para evitar CORS
- Los backends se comunican a través de la red Docker
- MySQL y PostgreSQL son independientes (diferentes dominios de negocio)

## 🆘 Soporte

Para reportar problemas o sugerencias:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta la documentación de cada servicio
