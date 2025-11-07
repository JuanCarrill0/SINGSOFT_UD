"""
Pruebas unitarias para el CRUD de órdenes
"""
import pytest
from unittest.mock import patch, AsyncMock
from sqlalchemy.orm import Session
from app.crud.order_crud import (
    create_order,
    get_order,
    get_orders,
    get_orders_by_user,
    update_order,
    delete_order
)
from app.schemas.order_schema import OrderCreate, OrderUpdate
from app.models.order import Order


class TestOrderCRUD:
    """Tests para operaciones CRUD de órdenes"""

    @pytest.mark.asyncio
    @patch('app.crud.order_crud.validate_user_for_order')
    async def test_create_order_success(self, mock_validate, db_session: Session):
        """Prueba la creación exitosa de una orden"""
        # Arrange
        mock_validate.return_value = None  # Usuario válido
        order_data = OrderCreate(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=199.98,
            status="pending",
            shipping_address="123 Test St",
            payment_method="credit_card"
        )
        token = "Bearer test.token.here"

        # Act
        created_order = await create_order(db_session, order_data, token)

        # Assert
        assert created_order.id is not None
        assert created_order.user_id == "550e8400-e29b-41d4-a716-446655440000"
        assert created_order.total == 199.98
        assert created_order.status == "pending"
        mock_validate.assert_called_once_with(order_data.user_id, token)

    @pytest.mark.asyncio
    @patch('app.crud.order_crud.validate_user_for_order')
    async def test_create_order_invalid_user(self, mock_validate, db_session: Session):
        """Prueba crear orden con usuario inválido"""
        # Arrange
        mock_validate.side_effect = ValueError("User not found")
        order_data = OrderCreate(
            user_id="invalid-uuid",
            total=99.99,
            status="pending",
            shipping_address="456 Test Ave"
        )
        token = "Bearer test.token.here"

        # Act & Assert
        with pytest.raises(ValueError, match="User not found"):
            await create_order(db_session, order_data, token)

    def test_get_order_by_id(self, db_session: Session):
        """Prueba obtener una orden por ID"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=150.0,
            status="pending",
            shipping_address="789 Test Blvd"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        # Act
        retrieved = get_order(db_session, order.id)

        # Assert
        assert retrieved is not None
        assert retrieved.id == order.id
        assert retrieved.total == 150.0

    def test_get_order_not_found(self, db_session: Session):
        """Prueba obtener una orden que no existe"""
        # Act
        result = get_order(db_session, 9999)

        # Assert
        assert result is None

    def test_get_orders(self, db_session: Session):
        """Prueba listar todas las órdenes"""
        # Arrange
        for i in range(3):
            order = Order(
                user_id="550e8400-e29b-41d4-a716-446655440000",
                total=100.0 + i,
                status="pending",
                shipping_address=f"{i} Test St"
            )
            db_session.add(order)
        db_session.commit()

        # Act
        orders = get_orders(db_session)

        # Assert
        assert len(orders) == 3
        assert all(isinstance(o, Order) for o in orders)

    def test_get_orders_by_user(self, db_session: Session):
        """Prueba obtener órdenes de un usuario específico"""
        # Arrange
        user_id_1 = "550e8400-e29b-41d4-a716-446655440000"
        user_id_2 = "660e8400-e29b-41d4-a716-446655440000"

        for i in range(2):
            order = Order(
                user_id=user_id_1,
                total=100.0,
                status="pending",
                shipping_address="Test St"
            )
            db_session.add(order)

        order = Order(
            user_id=user_id_2,
            total=200.0,
            status="pending",
            shipping_address="Other St"
        )
        db_session.add(order)
        db_session.commit()

        # Act
        user1_orders = get_orders_by_user(db_session, user_id_1)

        # Assert
        assert len(user1_orders) == 2
        assert all(o.user_id == user_id_1 for o in user1_orders)

    def test_update_order_status(self, db_session: Session):
        """Prueba actualizar el estado de una orden"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=99.99,
            status="pending",
            shipping_address="Test Address"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        update_data = OrderUpdate(status="completed")

        # Act
        updated = update_order(db_session, order.id, update_data)

        # Assert
        assert updated is not None
        assert updated.status == "completed"
        assert updated.total == 99.99  # No cambió

    def test_update_nonexistent_order(self, db_session: Session):
        """Prueba actualizar una orden que no existe"""
        # Arrange
        update_data = OrderUpdate(status="cancelled")

        # Act
        result = update_order(db_session, 9999, update_data)

        # Assert
        assert result is None

    def test_delete_order(self, db_session: Session):
        """Prueba eliminar una orden"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=50.0,
            status="pending",
            shipping_address="Delete St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        # Act
        result = delete_order(db_session, order.id)

        # Assert
        assert result is True
        assert get_order(db_session, order.id) is None

    def test_delete_nonexistent_order(self, db_session: Session):
        """Prueba eliminar una orden que no existe"""
        # Act
        result = delete_order(db_session, 9999)

        # Assert
        assert result is False

    def test_order_total_calculation(self, db_session: Session):
        """Prueba que el total de la orden sea correcto"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=299.97,
            status="pending",
            shipping_address="Calc St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        # Assert
        assert order.total > 0
        assert isinstance(order.total, float)
        assert round(order.total, 2) == 299.97
