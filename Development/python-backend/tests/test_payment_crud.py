"""
Pruebas unitarias para el CRUD de pagos
"""
import pytest
from sqlalchemy.orm import Session
from app.crud.payment_crud import (
    create_payment,
    get_payment,
    get_payments,
    get_payments_by_order,
    update_payment
)
from app.schemas.payment_schema import PaymentCreate, PaymentUpdate
from app.models.payment import Payment
from app.models.order import Order


class TestPaymentCRUD:
    """Tests para operaciones CRUD de pagos"""

    def test_create_payment(self, db_session: Session):
        """Prueba la creación de un pago"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=199.99,
            status="pending",
            shipping_address="123 Payment St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        payment_data = PaymentCreate(
            order_id=order.id,
            amount=199.99,
            payment_method="credit_card",
            payment_status="completed"
        )

        # Act
        created_payment = create_payment(db_session, payment_data)

        # Assert
        assert created_payment.id is not None
        assert created_payment.order_id == order.id
        assert created_payment.amount == 199.99
        assert created_payment.payment_method == "credit_card"
        assert created_payment.payment_status == "completed"

    def test_get_payment_by_id(self, db_session: Session):
        """Prueba obtener un pago por ID"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=99.99,
            status="pending",
            shipping_address="456 Payment Ave"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        payment = Payment(
            order_id=order.id,
            amount=99.99,
            payment_method="paypal",
            payment_status="pending"
        )
        db_session.add(payment)
        db_session.commit()
        db_session.refresh(payment)

        # Act
        retrieved = get_payment(db_session, payment.id)

        # Assert
        assert retrieved is not None
        assert retrieved.id == payment.id
        assert retrieved.amount == 99.99

    def test_get_payment_not_found(self, db_session: Session):
        """Prueba obtener un pago que no existe"""
        # Act
        result = get_payment(db_session, 9999)

        # Assert
        assert result is None

    def test_get_all_payments(self, db_session: Session):
        """Prueba listar todos los pagos"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=300.0,
            status="pending",
            shipping_address="789 Payment Blvd"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        for i in range(3):
            payment = Payment(
                order_id=order.id,
                amount=100.0 + i,
                payment_method="credit_card",
                payment_status="completed"
            )
            db_session.add(payment)
        db_session.commit()

        # Act
        payments = get_payments(db_session)

        # Assert
        assert len(payments) == 3
        assert all(isinstance(p, Payment) for p in payments)

    def test_get_payments_by_order(self, db_session: Session):
        """Prueba obtener pagos de una orden específica"""
        # Arrange
        order1 = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=200.0,
            status="pending",
            shipping_address="Order 1 St"
        )
        order2 = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=300.0,
            status="pending",
            shipping_address="Order 2 St"
        )
        db_session.add(order1)
        db_session.add(order2)
        db_session.commit()
        db_session.refresh(order1)
        db_session.refresh(order2)

        # Crear pagos para order1
        for i in range(2):
            payment = Payment(
                order_id=order1.id,
                amount=100.0,
                payment_method="credit_card",
                payment_status="completed"
            )
            db_session.add(payment)

        # Crear pago para order2
        payment = Payment(
            order_id=order2.id,
            amount=300.0,
            payment_method="paypal",
            payment_status="completed"
        )
        db_session.add(payment)
        db_session.commit()

        # Act
        order1_payments = get_payments_by_order(db_session, order1.id)

        # Assert
        assert len(order1_payments) == 2
        assert all(p.order_id == order1.id for p in order1_payments)

    def test_update_payment_status(self, db_session: Session):
        """Prueba actualizar el estado de un pago"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=150.0,
            status="pending",
            shipping_address="Update Payment St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        payment = Payment(
            order_id=order.id,
            amount=150.0,
            payment_method="credit_card",
            payment_status="pending"
        )
        db_session.add(payment)
        db_session.commit()
        db_session.refresh(payment)

        update_data = PaymentUpdate(payment_status="completed")

        # Act
        updated = update_payment(db_session, payment.id, update_data)

        # Assert
        assert updated is not None
        assert updated.payment_status == "completed"
        assert updated.amount == 150.0  # No cambió

    def test_update_nonexistent_payment(self, db_session: Session):
        """Prueba actualizar un pago que no existe"""
        # Arrange
        update_data = PaymentUpdate(payment_status="failed")

        # Act
        result = update_payment(db_session, 9999, update_data)

        # Assert
        assert result is None

    def test_payment_amount_validation(self, db_session: Session):
        """Prueba que el monto del pago sea válido"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=99.99,
            status="pending",
            shipping_address="Validation St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        payment_data = PaymentCreate(
            order_id=order.id,
            amount=99.99,
            payment_method="credit_card",
            payment_status="completed"
        )

        # Act
        created = create_payment(db_session, payment_data)

        # Assert
        assert created.amount > 0
        assert isinstance(created.amount, float)
        assert round(created.amount, 2) == 99.99

    def test_payment_methods(self, db_session: Session):
        """Prueba diferentes métodos de pago"""
        # Arrange
        order = Order(
            user_id="550e8400-e29b-41d4-a716-446655440000",
            total=500.0,
            status="pending",
            shipping_address="Methods St"
        )
        db_session.add(order)
        db_session.commit()
        db_session.refresh(order)

        payment_methods = ["credit_card", "debit_card", "paypal", "bank_transfer"]

        # Act
        for method in payment_methods:
            payment = Payment(
                order_id=order.id,
                amount=125.0,
                payment_method=method,
                payment_status="completed"
            )
            db_session.add(payment)
        db_session.commit()

        # Assert
        all_payments = get_payments(db_session)
        assert len(all_payments) == 4
        methods_used = [p.payment_method for p in all_payments]
        assert set(methods_used) == set(payment_methods)
