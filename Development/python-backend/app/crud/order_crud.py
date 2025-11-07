from sqlalchemy.orm import Session
from app.models.order import Order
from app.schemas.order_schema import OrderCreate, OrderUpdate
from app.services.user_service import UserService
from fastapi import HTTPException

async def validate_user_for_order(user_id: str, token: str) -> bool:
    """Validate that the user exists in MySQL before creating order"""
    user_service = UserService()
    is_valid = await user_service.validate_user_exists(user_id, token)
    if not is_valid:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid user_id: {user_id}. User not found in authentication system."
        )
    return True

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get all orders for a specific user"""
    return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()

async def create_order(db: Session, order: OrderCreate, token: str):
    """Create order after validating user exists in MySQL"""
    # Validate user exists
    await validate_user_for_order(order.user_id, token)
    
    # Create order
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: int, order_update: OrderUpdate):
    """Update order status or shipping address"""
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        return None
    
    update_data = order_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False