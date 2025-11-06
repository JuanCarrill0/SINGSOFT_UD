from pydantic import BaseModel

class PaymentBase(BaseModel):
    order_id: int
    amount: float
    method: str

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    status: str
    
    class Config:
        from_attributes = True