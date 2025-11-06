from pydantic import BaseModel

class OrderBase(BaseModel):
    user_id: int
    total: float

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    status: str
    
    class Config:
        from_attributes = True