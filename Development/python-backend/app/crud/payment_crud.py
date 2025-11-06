from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment_schema import PaymentCreate

def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Payment).offset(skip).limit(limit).all()

def get_payment(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()

def create_payment(db: Session, payment: PaymentCreate):
    db_payment = Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def delete_payment(db: Session, payment_id: int):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment:
        db.delete(db_payment)
        db.commit()
        return True
    return False