from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    method = Column(String(50), nullable=False)
    status = Column(String(50), default="pending")