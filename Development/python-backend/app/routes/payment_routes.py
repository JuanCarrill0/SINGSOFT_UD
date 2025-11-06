from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment_schema import PaymentCreate, PaymentResponse
from app.crud.payment_crud import get_payments, get_payment, create_payment, delete_payment

router = APIRouter()

@router.get("/payments", response_model=list[PaymentResponse])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_payments(db, skip=skip, limit=limit)

@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    db_payment = get_payment(db, payment_id)
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment

@router.post("/payments", response_model=PaymentResponse)
def create_new_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    return create_payment(db, payment)

@router.delete("/payments/{payment_id}")
def delete_existing_payment(payment_id: int, db: Session = Depends(get_db)):
    if not delete_payment(db, payment_id):
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted successfully"}