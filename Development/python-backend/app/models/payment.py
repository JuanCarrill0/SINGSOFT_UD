from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    # Keep existing DB column names ('method', 'status') but expose
    # attributes expected by the rest of the code/tests (`payment_method`, `payment_status`).
    payment_method = Column('method', String(50), nullable=False)
    payment_status = Column('status', String(50), default="pending")