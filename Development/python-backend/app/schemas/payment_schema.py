from pydantic import BaseModel
from typing import Optional

class PaymentBase(BaseModel):
    order_id: int
    amount: float
    payment_method: str
    payment_status: str = "pending"

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    
    class Config:
        from_attributes = True