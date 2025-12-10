from sqlalchemy import Column, Integer, String
from app.database import Base


class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    # External identity from Java Auth service (UUID string format)
    external_user_id = Column(String(36), unique=True, index=True, nullable=False)

    # Optional profile info stored locally for convenience
    name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
