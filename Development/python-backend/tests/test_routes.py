"""
Pruebas de integración para las rutas de la API
"""
import pytest
from fastapi.testclient import TestClient


class TestProductRoutes:
    """Tests para las rutas de productos"""

    def test_get_products_empty(self, client: TestClient):
        """Prueba obtener lista vacía de productos"""
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_product(self, client: TestClient, sample_product_data):
        """Prueba crear un producto"""
        response = client.post("/api/v1/products", json=sample_product_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == sample_product_data["name"]
        assert data["price"] == sample_product_data["price"]
        assert "id" in data

    def test_get_product_by_id(self, client: TestClient, sample_product_data):
        """Prueba obtener un producto por ID"""
        # Crear producto primero
        create_response = client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        # Obtener producto
        response = client.get(f"/api/v1/products/{product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == product_id
        assert data["name"] == sample_product_data["name"]

    def test_get_nonexistent_product(self, client: TestClient):
        """Prueba obtener un producto que no existe"""
        response = client.get("/api/v1/products/9999")
        assert response.status_code == 404

    def test_update_product(self, client: TestClient, sample_product_data):
        """Prueba actualizar un producto"""
        # Crear producto
        create_response = client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        # Actualizar producto
        update_data = {"name": "Updated Product", "price": 149.99}
        response = client.put(f"/api/v1/products/{product_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Product"
        assert data["price"] == 149.99

    def test_delete_product(self, client: TestClient, sample_product_data):
        """Prueba eliminar un producto"""
        # Crear producto
        create_response = client.post("/api/v1/products", json=sample_product_data)
        product_id = create_response.json()["id"]

        # Eliminar producto
        response = client.delete(f"/api/v1/products/{product_id}")
        assert response.status_code == 200

        # Verificar que fue eliminado
        get_response = client.get(f"/api/v1/products/{product_id}")
        assert get_response.status_code == 404

    def test_create_product_invalid_data(self, client: TestClient):
        """Prueba crear producto con datos inválidos"""
        invalid_data = {
            "name": "Test",
            # Falta price (requerido)
            "category": "Test"
        }
        response = client.post("/api/v1/products", json=invalid_data)
        assert response.status_code == 422  # Unprocessable Entity


class TestOrderRoutes:
    """Tests para las rutas de órdenes"""

    def test_get_orders_empty(self, client: TestClient):
        """Prueba obtener lista vacía de órdenes"""
        response = client.get("/api/v1/orders")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    @pytest.mark.asyncio
    async def test_get_orders_by_user(self, client: TestClient):
        """Prueba obtener órdenes de un usuario"""
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        response = client.get(f"/api/v1/orders?user_id={user_id}")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestPaymentRoutes:
    """Tests para las rutas de pagos"""

    def test_get_payments_empty(self, client: TestClient):
        """Prueba obtener lista vacía de pagos"""
        response = client.get("/api/v1/payments")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_payments_by_order(self, client: TestClient):
        """Prueba obtener pagos de una orden"""
        order_id = 1
        response = client.get(f"/api/v1/payments?order_id={order_id}")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestHealthCheck:
    """Tests para el health check"""

    def test_root_endpoint(self, client: TestClient):
        """Prueba el endpoint raíz"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "status" in data
