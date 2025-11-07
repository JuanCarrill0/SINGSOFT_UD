from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.order_schema import OrderCreate, OrderResponse, OrderUpdate
from app.crud.order_crud import (
    get_orders, 
    get_order, 
    get_orders_by_user,
    create_order, 
    update_order,
    delete_order
)

router = APIRouter()

@router.get("/orders", response_model=list[OrderResponse])
def read_orders(
    skip: int = 0, 
    limit: int = 100, 
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all orders, optionally filtered by user_id"""
    if user_id:
        return get_orders_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return get_orders(db, skip=skip, limit=limit)

@router.get("/orders/{order_id}", response_model=OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific order by ID"""
    db_order = get_order(db, order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.post("/orders", response_model=OrderResponse)
async def create_new_order(
    order: OrderCreate, 
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """
    Create a new order. Validates that user_id exists in MySQL.
    Requires Authorization header with Bearer token.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    # Extract token (remove "Bearer " prefix if present)
    token = authorization.replace("Bearer ", "").strip()
    
    return await create_order(db, order, token)

@router.put("/orders/{order_id}", response_model=OrderResponse)
def update_existing_order(
    order_id: int, 
    order_update: OrderUpdate,
    db: Session = Depends(get_db)
):
    """Update order status or shipping address"""
    db_order = update_order(db, order_id, order_update)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.delete("/orders/{order_id}")
def delete_existing_order(order_id: int, db: Session = Depends(get_db)):
    """Delete an order"""
    if not delete_order(db, order_id):
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}