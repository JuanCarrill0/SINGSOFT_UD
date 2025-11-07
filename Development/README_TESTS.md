# Guía de Pruebas Unitarias

## Backend Java (JUnit)

### Estructura de Pruebas

```
java-backend/src/test/java/
├── com/sportgear/ecommerce/
│   ├── service/
│   │   └── AuthServiceTest.java          # Pruebas del servicio de autenticación
│   ├── controller/
│   │   └── AuthControllerTest.java       # Pruebas del controlador REST
│   └── security/
│       └── JwtUtilTest.java              # Pruebas de JWT
└── resources/
    └── application-test.properties       # Configuración de pruebas (H2 in-memory)
```

### Ejecutar Pruebas Java

```bash
# Ejecutar todas las pruebas
cd java-backend
mvn test

# Ejecutar pruebas con reporte de cobertura
mvn test jacoco:report

# Ejecutar una clase específica de pruebas
mvn test -Dtest=AuthServiceTest

# Ejecutar un método específico
mvn test -Dtest=AuthServiceTest#testRegisterUser_Success

# Ver reporte de cobertura
# El reporte HTML estará en: target/site/jacoco/index.html
```

### Pruebas Implementadas (Java)

#### AuthServiceTest (11 pruebas)
- ✅ `testRegisterUser_Success` - Registro exitoso de usuario
- ✅ `testRegisterUser_EmailAlreadyExists` - Email duplicado
- ✅ `testAuthenticateUser_Success` - Login exitoso
- ✅ `testAuthenticateUser_InvalidCredentials` - Credenciales inválidas
- ✅ `testAuthenticateUser_UserNotFound` - Usuario no encontrado
- ✅ `testGetUserById_Success` - Obtener usuario por ID
- ✅ `testGetUserById_NotFound` - Usuario no existe
- ✅ `testGetUserByEmail_Success` - Obtener usuario por email

#### AuthControllerTest (5 pruebas)
- ✅ `testRegister_Success` - Endpoint de registro
- ✅ `testLogin_Success` - Endpoint de login
- ✅ `testLogin_InvalidCredentials` - Login fallido
- ✅ `testGetUserById_Success` - Obtener info de usuario
- ✅ `testGetUserById_NotFound` - Usuario no encontrado (404)

#### JwtUtilTest (7 pruebas)
- ✅ `testGenerateToken_Success` - Generar token JWT
- ✅ `testExtractUsername_Success` - Extraer email del token
- ✅ `testValidateToken_ValidToken` - Validar token correcto
- ✅ `testValidateToken_InvalidUsername` - Token con usuario incorrecto
- ✅ `testExtractClaims_Success` - Extraer claims del token
- ✅ `testIsTokenExpired_NotExpired` - Verificar expiración

**Total: 23 pruebas unitarias**

---

## Backend Python (pytest)

### Estructura de Pruebas

```
python-backend/tests/
├── __init__.py
├── conftest.py                   # Fixtures compartidos
├── test_product_crud.py          # Pruebas CRUD de productos
├── test_order_crud.py            # Pruebas CRUD de órdenes
├── test_payment_crud.py          # Pruebas CRUD de pagos
└── test_routes.py                # Pruebas de integración de rutas
```

### Instalar Dependencias

```bash
cd python-backend
pip install -r requirements.txt
```

### Ejecutar Pruebas Python

```bash
# Ejecutar todas las pruebas
pytest

# Ejecutar con cobertura
pytest --cov=app --cov-report=html

# Ejecutar pruebas específicas
pytest tests/test_product_crud.py

# Ejecutar una clase específica
pytest tests/test_product_crud.py::TestProductCRUD

# Ejecutar un método específico
pytest tests/test_product_crud.py::TestProductCRUD::test_create_product

# Ejecutar con más detalle
pytest -v

# Ejecutar solo pruebas que contengan una palabra
pytest -k "product"

# Ver reporte de cobertura
# El reporte HTML estará en: htmlcov/index.html
```

### Pruebas Implementadas (Python)

#### test_product_crud.py (14 pruebas)
- ✅ `test_create_product` - Crear producto
- ✅ `test_get_product_by_id` - Obtener producto por ID
- ✅ `test_get_product_not_found` - Producto no existe
- ✅ `test_get_products_empty` - Lista vacía
- ✅ `test_get_products_with_data` - Listar productos
- ✅ `test_get_products_with_pagination` - Paginación
- ✅ `test_update_product` - Actualizar producto
- ✅ `test_update_nonexistent_product` - Actualizar no existente
- ✅ `test_delete_product` - Eliminar producto
- ✅ `test_delete_nonexistent_product` - Eliminar no existente
- ✅ `test_product_price_validation` - Validar precio
- ✅ `test_filter_products_by_category` - Filtrar por categoría

#### test_order_crud.py (11 pruebas)
- ✅ `test_create_order_success` - Crear orden con validación de usuario
- ✅ `test_create_order_invalid_user` - Usuario inválido
- ✅ `test_get_order_by_id` - Obtener orden por ID
- ✅ `test_get_order_not_found` - Orden no existe
- ✅ `test_get_orders` - Listar órdenes
- ✅ `test_get_orders_by_user` - Órdenes de un usuario
- ✅ `test_update_order_status` - Actualizar estado
- ✅ `test_update_nonexistent_order` - Actualizar no existente
- ✅ `test_delete_order` - Eliminar orden
- ✅ `test_delete_nonexistent_order` - Eliminar no existente
- ✅ `test_order_total_calculation` - Cálculo de total

#### test_payment_crud.py (10 pruebas)
- ✅ `test_create_payment` - Crear pago
- ✅ `test_get_payment_by_id` - Obtener pago por ID
- ✅ `test_get_payment_not_found` - Pago no existe
- ✅ `test_get_all_payments` - Listar pagos
- ✅ `test_get_payments_by_order` - Pagos de una orden
- ✅ `test_update_payment_status` - Actualizar estado
- ✅ `test_update_nonexistent_payment` - Actualizar no existente
- ✅ `test_payment_amount_validation` - Validar monto
- ✅ `test_payment_methods` - Diferentes métodos de pago

#### test_routes.py (9 pruebas de integración)
- ✅ `test_get_products_empty` - GET /api/v1/products
- ✅ `test_create_product` - POST /api/v1/products
- ✅ `test_get_product_by_id` - GET /api/v1/products/{id}
- ✅ `test_get_nonexistent_product` - 404 producto
- ✅ `test_update_product` - PUT /api/v1/products/{id}
- ✅ `test_delete_product` - DELETE /api/v1/products/{id}
- ✅ `test_create_product_invalid_data` - Validación de datos
- ✅ `test_get_orders_empty` - GET /api/v1/orders
- ✅ `test_get_orders_by_user` - Filtrar por usuario
- ✅ `test_get_payments_empty` - GET /api/v1/payments
- ✅ `test_get_payments_by_order` - Filtrar por orden
- ✅ `test_root_endpoint` - Health check

**Total: 44 pruebas unitarias e integración**

---

## Resumen de Cobertura

### Java Backend
- **AuthService**: Registro, login, obtener usuarios
- **AuthController**: Endpoints REST con Spring Security
- **JwtUtil**: Generación y validación de tokens JWT

### Python Backend
- **ProductCRUD**: Operaciones completas de productos
- **OrderCRUD**: Órdenes con validación de usuarios
- **PaymentCRUD**: Gestión de pagos
- **Routes**: Pruebas de integración de la API REST

## Ejecutar Todas las Pruebas (Ambos Backends)

### Windows (PowerShell)
```powershell
# Java
cd java-backend
mvn test

# Python
cd ..\python-backend
pytest

# Volver al directorio raíz
cd ..
```

### Linux/Mac (Bash)
```bash
# Java
cd java-backend && mvn test && cd ..

# Python
cd python-backend && pytest && cd ..
```

## CI/CD

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  java-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd java-backend && mvn test

  python-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: |
          cd python-backend
          pip install -r requirements.txt
          pytest
```

## Buenas Prácticas Implementadas

✅ **Aislamiento**: Cada prueba es independiente  
✅ **Mocks**: Se usan mocks para dependencias externas  
✅ **Fixtures**: Datos de prueba reutilizables  
✅ **Base de datos en memoria**: H2 (Java) y SQLite (Python)  
✅ **Nomenclatura clara**: test_método_escenario_resultado  
✅ **Coverage**: Reportes de cobertura de código  
✅ **Integración**: Pruebas de endpoints completos  

## Próximos Pasos

- [ ] Agregar pruebas de carga (JMeter, Locust)
- [ ] Pruebas end-to-end con Selenium/Playwright
- [ ] Mutation testing (PIT, mutpy)
- [ ] Contract testing para microservicios
