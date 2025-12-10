from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    brand: Optional[str] = None
    sport: Optional[str] = None
    gender: Optional[str] = None
    in_stock: bool = True
    stock_quantity: int = 0
    image_url: Optional[str] = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    sport: Optional[str] = None
    gender: Optional[str] = None
    in_stock: Optional[bool] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    
    class Config:
        from_attributes = True