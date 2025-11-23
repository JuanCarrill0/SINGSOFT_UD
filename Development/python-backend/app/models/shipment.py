from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    tracking_number = Column(String(100), unique=True, nullable=True, index=True)
    carrier = Column(String(100), nullable=True)  # e.g., "DHL", "FedEx", "UPS"
    vehicle_info = Column(Text, nullable=True)  # Vehicle details for tracking
    status = Column(String(50), default="pending")  # pending, shipped, in_transit, delivered, cancelled
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
