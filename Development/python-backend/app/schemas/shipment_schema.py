from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ShipmentBase(BaseModel):
    order_id: int
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    vehicle_info: Optional[str] = None

class ShipmentCreate(ShipmentBase):
    """Schema for creating a new shipment"""
    pass

class ShipmentUpdate(BaseModel):
    """Schema for updating shipment information"""
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    vehicle_info: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|shipped|in_transit|delivered|cancelled)$")

class ShipmentStatusUpdate(BaseModel):
    """Schema for updating only the shipment status"""
    status: str = Field(..., pattern="^(pending|shipped|in_transit|delivered|cancelled)$")
    vehicle_info: Optional[str] = None

class ShipmentResponse(ShipmentBase):
    id: int
    status: str
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
