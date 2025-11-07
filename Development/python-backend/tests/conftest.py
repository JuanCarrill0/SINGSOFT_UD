"""
Fixtures compartidos para todas las pruebas
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, get_db

# Base de datos en memoria para pruebas
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Crea una nueva sesión de base de datos para cada prueba"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Cliente de prueba de FastAPI con override de dependencias"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_product_data():
    """Datos de muestra para un producto"""
    return {
        "name": "Test Product",
        "description": "A test product description",
        "price": 99.99,
        "category": "Test Category",
        "in_stock": True
    }


@pytest.fixture
def sample_order_data():
    """Datos de muestra para una orden"""
    return {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "total": 199.98,
        "status": "pending",
        "shipping_address": "123 Test Street",
        "payment_method": "credit_card"
    }


@pytest.fixture
def sample_payment_data():
    """Datos de muestra para un pago"""
    return {
        "order_id": 1,
        "amount": 199.98,
        "payment_method": "credit_card",
        "payment_status": "completed"
    }


@pytest.fixture
def mock_jwt_token():
    """Token JWT de prueba"""
    return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ.test"
