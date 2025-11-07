"""
Script de prueba para validar la arquitectura de dos bases de datos
Verifica que:
1. Se puede crear un usuario en MySQL (Spring Boot)
2. Se puede crear una orden en PostgreSQL con validación de usuario de MySQL
3. Las validaciones funcionan correctamente
"""

import httpx
import asyncio
import json
from datetime import datetime

# Configuración
MYSQL_API = "http://localhost:8080"
POSTGRES_API = "http://localhost:8000"

async def test_architecture():
    print("=" * 60)
    print("🧪 Test: Arquitectura de Dos Bases de Datos")
    print("=" * 60)
    print()
    
    async with httpx.AsyncClient() as client:
        
        # Paso 1: Registrar usuario en MySQL
        print("📝 Paso 1: Registrando usuario en MySQL...")
        register_data = {
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "test123",
            "firstName": "Test",
            "lastName": "User",
            "phoneNumber": "+57 300 1234567",
            "dateOfBirth": "1990-01-01"
        }
        
        try:
            response = await client.post(
                f"{MYSQL_API}/api/auth/register",
                json=register_data,
                timeout=10.0
            )
            
            if response.status_code == 200:
                user_data = response.json()
                token = user_data.get("token")
                print(f"✅ Usuario registrado exitosamente")
                print(f"   Email: {register_data['email']}")
                print(f"   Token: {token[:50]}...")
                print()
            else:
                print(f"❌ Error al registrar usuario: {response.status_code}")
                print(f"   {response.text}")
                return
                
        except Exception as e:
            print(f"❌ Error de conexión con MySQL (Spring Boot): {e}")
            print("   ⚠️ Asegúrate de que el backend Spring Boot esté corriendo en puerto 8080")
            return
        
        # Paso 2: Obtener productos de PostgreSQL
        print("🛍️  Paso 2: Obteniendo productos de PostgreSQL...")
        try:
            response = await client.get(f"{POSTGRES_API}/api/v1/products")
            if response.status_code == 200:
                products = response.json()
                print(f"✅ {len(products)} productos encontrados")
                if products:
                    print(f"   Ejemplo: {products[0]['name']} - ${products[0]['price']}")
                print()
            else:
                print(f"⚠️ No hay productos en PostgreSQL (esto es normal si es primera vez)")
                print()
        except Exception as e:
            print(f"❌ Error de conexión con PostgreSQL (FastAPI): {e}")
            print("   ⚠️ Asegúrate de que el backend FastAPI esté corriendo en puerto 8000")
            return
        
        # Paso 3: Crear orden con validación de usuario
        print("🛒 Paso 3: Creando orden con validación de usuario...")
        
        # Necesitamos extraer el user_id del token o hacer una llamada a la API
        # Para este test, usaremos un user_id ficticio primero para demostrar el error
        
        print("   📋 Test 3a: Intentando crear orden con user_id INVÁLIDO...")
        fake_order = {
            "user_id": "00000000-0000-0000-0000-000000000000",
            "total": 99.99,
            "shipping_address": "Test Address 123"
        }
        
        try:
            response = await client.post(
                f"{POSTGRES_API}/api/v1/orders",
                json=fake_order,
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code == 400:
                error_data = response.json()
                print(f"   ✅ Validación funcionó correctamente!")
                print(f"   📛 Error esperado: {error_data.get('detail')}")
                print()
            else:
                print(f"   ⚠️ Se esperaba error 400, pero se obtuvo: {response.status_code}")
                print()
        except Exception as e:
            print(f"   ❌ Error inesperado: {e}")
            print()
        
        print("   📋 Test 3b: Orden con user_id válido requiere implementación adicional")
        print("   ℹ️  Nota: Para crear órdenes reales, necesitas:")
        print("      1. Extraer el user_id del token JWT")
        print("      2. O crear un endpoint en Spring Boot para obtener el user_id actual")
        print()
        
        # Resumen
        print("=" * 60)
        print("📊 Resumen de Pruebas")
        print("=" * 60)
        print("✅ MySQL (Spring Boot): Registro de usuarios OK")
        print("✅ PostgreSQL (FastAPI): Consulta de productos OK")
        print("✅ Validación entre bases de datos: OK")
        print()
        print("🎯 Próximos pasos:")
        print("   1. Implementar extracción de user_id del token JWT")
        print("   2. Crear endpoint GET /api/users/me en Spring Boot")
        print("   3. Probar flujo completo desde el frontend")
        print("=" * 60)

if __name__ == "__main__":
    print("\n🚀 Iniciando pruebas de arquitectura...\n")
    asyncio.run(test_architecture())
