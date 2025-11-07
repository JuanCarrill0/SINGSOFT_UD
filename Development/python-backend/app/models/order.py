from sqlalchemy import Column, Integer, Float, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False)  # UUID from MySQL users table
    total = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    shipping_address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)