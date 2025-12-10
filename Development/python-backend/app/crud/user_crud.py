from sqlalchemy.orm import Session
from app.models.customer_profile import CustomerProfile
from app.schemas.user_schema import UserCreate

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CustomerProfile).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    return db.query(CustomerProfile).filter(CustomerProfile.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(CustomerProfile).filter(CustomerProfile.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = CustomerProfile(
        name=user.name,
        email=user.email,
        external_user_id=user.external_user_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(CustomerProfile).filter(CustomerProfile.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False