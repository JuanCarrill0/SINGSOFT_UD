from sqlalchemy import Column, Integer, String, Float, Boolean
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