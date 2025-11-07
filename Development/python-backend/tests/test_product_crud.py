"""
Pruebas unitarias para el CRUD de productos
"""
import pytest
from sqlalchemy.orm import Session
from app.crud.product_crud import (
    create_product,
    get_product,
    get_products,
    update_product,
    delete_product
)
from app.schemas.product_schema import ProductCreate, ProductUpdate
from app.models.product import Product


class TestProductCRUD:
    """Tests para operaciones CRUD de productos"""

    def test_create_product(self, db_session: Session):
        """Prueba la creación de un producto"""
        # Arrange
        product_data = ProductCreate(
            name="Test Product",
            description="Test Description",
            price=99.99,
            category="Electronics",
            in_stock=True
        )

        # Act
        created_product = create_product(db_session, product_data)

        # Assert
        assert created_product.id is not None
        assert created_product.name == "Test Product"
        assert created_product.price == 99.99
        assert created_product.in_stock is True

    def test_get_product_by_id(self, db_session: Session):
        """Prueba obtener un producto por ID"""
        # Arrange
        product_data = ProductCreate(
            name="Test Product",
            description="Test Description",
            price=49.99,
            category="Books"
        )
        created = create_product(db_session, product_data)

        # Act
        retrieved = get_product(db_session, created.id)

        # Assert
        assert retrieved is not None
        assert retrieved.id == created.id
        assert retrieved.name == "Test Product"

    def test_get_product_not_found(self, db_session: Session):
        """Prueba obtener un producto que no existe"""
        # Act
        result = get_product(db_session, 9999)

        # Assert
        assert result is None

    def test_get_products_empty(self, db_session: Session):
        """Prueba listar productos cuando no hay ninguno"""
        # Act
        products = get_products(db_session)

        # Assert
        assert len(products) == 0

    def test_get_products_with_data(self, db_session: Session):
        """Prueba listar productos con datos existentes"""
        # Arrange
        for i in range(3):
            product_data = ProductCreate(
                name=f"Product {i}",
                description=f"Description {i}",
                price=10.0 + i,
                category="Test"
            )
            create_product(db_session, product_data)

        # Act
        products = get_products(db_session)

        # Assert
        assert len(products) == 3
        assert all(isinstance(p, Product) for p in products)

    def test_get_products_with_pagination(self, db_session: Session):
        """Prueba la paginación de productos"""
        # Arrange
        for i in range(5):
            product_data = ProductCreate(
                name=f"Product {i}",
                description=f"Description {i}",
                price=10.0 + i,
                category="Test"
            )
            create_product(db_session, product_data)

        # Act
        products_page1 = get_products(db_session, skip=0, limit=2)
        products_page2 = get_products(db_session, skip=2, limit=2)

        # Assert
        assert len(products_page1) == 2
        assert len(products_page2) == 2
        assert products_page1[0].id != products_page2[0].id

    def test_update_product(self, db_session: Session):
        """Prueba actualizar un producto"""
        # Arrange
        product_data = ProductCreate(
            name="Original Name",
            description="Original Description",
            price=50.0,
            category="Original"
        )
        created = create_product(db_session, product_data)

        update_data = ProductUpdate(
            name="Updated Name",
            price=75.0,
            in_stock=False
        )

        # Act
        updated = update_product(db_session, created.id, update_data)

        # Assert
        assert updated is not None
        assert updated.name == "Updated Name"
        assert updated.price == 75.0
        assert updated.in_stock is False
        assert updated.description == "Original Description"  # No cambió

    def test_update_nonexistent_product(self, db_session: Session):
        """Prueba actualizar un producto que no existe"""
        # Arrange
        update_data = ProductUpdate(name="New Name")

        # Act
        result = update_product(db_session, 9999, update_data)

        # Assert
        assert result is None

    def test_delete_product(self, db_session: Session):
        """Prueba eliminar un producto"""
        # Arrange
        product_data = ProductCreate(
            name="To Delete",
            description="Will be deleted",
            price=25.0,
            category="Test"
        )
        created = create_product(db_session, product_data)

        # Act
        result = delete_product(db_session, created.id)

        # Assert
        assert result is True
        assert get_product(db_session, created.id) is None

    def test_delete_nonexistent_product(self, db_session: Session):
        """Prueba eliminar un producto que no existe"""
        # Act
        result = delete_product(db_session, 9999)

        # Assert
        assert result is False

    def test_product_price_validation(self, db_session: Session):
        """Prueba que el precio sea válido"""
        # Arrange
        product_data = ProductCreate(
            name="Test Product",
            description="Test",
            price=99.99,
            category="Test"
        )

        # Act
        created = create_product(db_session, product_data)

        # Assert
        assert created.price > 0
        assert isinstance(created.price, float)

    def test_filter_products_by_category(self, db_session: Session):
        """Prueba filtrar productos por categoría"""
        # Arrange
        categories = ["Electronics", "Books", "Electronics"]
        for i, cat in enumerate(categories):
            product_data = ProductCreate(
                name=f"Product {i}",
                description=f"Description {i}",
                price=10.0 + i,
                category=cat
            )
            create_product(db_session, product_data)

        # Act
        all_products = get_products(db_session)
        electronics = [p for p in all_products if p.category == "Electronics"]

        # Assert
        assert len(electronics) == 2
        assert all(p.category == "Electronics" for p in electronics)
