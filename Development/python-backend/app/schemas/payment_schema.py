from typing import Optional
from pydantic import BaseModel, field_validator, Field
from pydantic.config import ConfigDict

class PaymentBase(BaseModel):
    # Accept common frontend keys via validation aliases (method/status)
    order_id: int
    amount: float
    payment_method: str
    payment_status: str = "pending"

    # Allow strings for amount (e.g., "289.97") and coerce to float
    @field_validator("amount", mode="before")
    @classmethod
    def amount_str_to_float(cls, v):
        if isinstance(v, str):
            try:
                return float(v)
            except ValueError:
                raise ValueError("amount must be a number")
        return v

class PaymentCreate(PaymentBase):
    # Accept common frontend aliases
    model_config = ConfigDict(populate_by_name=True)
    order_id: int = Field(..., alias="orderId")
    payment_method: str = Field(..., alias="method")
    payment_status: str = Field("pending", alias="status")

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    
    class Config:
        from_attributes = True