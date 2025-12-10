from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price = Column(Float, nullable=False)
    category = Column(String(100))
    brand = Column(String(100))
    sport = Column(String(100))
    gender = Column(String(20))
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=0)
    image_url = Column(String(500), default='https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400')

    # Relationships
    order_items = relationship(
        "OrderItem",
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True
    )