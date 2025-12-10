from sqlalchemy import Column, Integer, Float, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), nullable=False)  # External UUID from Java Auth service
    total = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    shipping_address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True
    )