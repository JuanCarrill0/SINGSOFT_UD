from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(50), default="pending")