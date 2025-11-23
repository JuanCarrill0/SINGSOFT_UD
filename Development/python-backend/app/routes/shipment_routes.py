from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.shipment_schema import ShipmentCreate, ShipmentUpdate, ShipmentStatusUpdate, ShipmentResponse
from app.crud import shipment_crud
from app.crud import order_crud

router = APIRouter()

@router.post("/shipments", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    """
    Create a new shipment for an order.
    
    **Acceptance Criteria:**
    - Dado que un pedido está listo para envío, cuando asigno un número de seguimiento 
      y transportista, entonces el sistema debe actualizar el estado a "shipped".
    """
    # Verify order exists
    db_order = order_crud.get_order(db, shipment.order_id)
    if not db_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {shipment.order_id} not found"
        )
    
    # Check if shipment already exists for this order
    existing_shipment = shipment_crud.get_shipment_by_order(db, shipment.order_id)
    if existing_shipment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shipment already exists for order {shipment.order_id}"
        )
    
    return shipment_crud.create_shipment(db, shipment)

@router.get("/shipments", response_model=List[ShipmentResponse])
def get_shipments(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all shipments with optional status filter"""
    return shipment_crud.get_shipments(db, skip=skip, limit=limit, status=status)

@router.get("/shipments/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Get a specific shipment by ID"""
    db_shipment = shipment_crud.get_shipment(db, shipment_id)
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with id {shipment_id} not found"
        )
    return db_shipment

@router.get("/shipments/order/{order_id}", response_model=ShipmentResponse)
def get_shipment_by_order(order_id: int, db: Session = Depends(get_db)):
    """
    Get shipment information for a specific order.
    
    **Acceptance Criteria:**
    - Customers should be able to see shipment details for their orders.
    """
    db_shipment = shipment_crud.get_shipment_by_order(db, order_id)
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No shipment found for order {order_id}"
        )
    return db_shipment

@router.get("/shipments/tracking/{tracking_number}", response_model=ShipmentResponse)
def get_shipment_by_tracking(tracking_number: str, db: Session = Depends(get_db)):
    """
    Get shipment by tracking number.
    
    **Acceptance Criteria:**
    - Customers can track their shipment using the tracking number.
    """
    db_shipment = shipment_crud.get_shipment_by_tracking(db, tracking_number)
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No shipment found with tracking number {tracking_number}"
        )
    return db_shipment

@router.put("/shipments/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: int, 
    shipment_update: ShipmentUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update shipment information (tracking number, carrier, vehicle info, status).
    
    **Acceptance Criteria:**
    - Logistics Operator can update tracking number, carrier, and vehicle information.
    """
    db_shipment = shipment_crud.update_shipment(db, shipment_id, shipment_update)
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with id {shipment_id} not found"
        )
    return db_shipment

@router.put("/shipments/{shipment_id}/status", response_model=ShipmentResponse)
def update_shipment_status(
    shipment_id: int, 
    status_update: ShipmentStatusUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update shipment status.
    
    **Acceptance Criteria:**
    - Dado que un envío está en tránsito, cuando asigno un transporte, 
      entonces el cliente debe ver la información del vehículo.
    - Dado que un envío se entrega, cuando lo marco como completado, 
      entonces el sistema debe actualizar el estado del pedido.
    """
    db_shipment = shipment_crud.update_shipment_status(db, shipment_id, status_update)
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with id {shipment_id} not found"
        )
    
    # Update order status based on shipment status
    if db_shipment.status == "delivered":
        order_crud.update_order_status(db, db_shipment.order_id, "completed")
    elif db_shipment.status == "shipped":
        order_crud.update_order_status(db, db_shipment.order_id, "shipped")
    elif db_shipment.status == "in_transit":
        order_crud.update_order_status(db, db_shipment.order_id, "in_transit")
    
    return db_shipment

@router.delete("/shipments/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Delete a shipment"""
    success = shipment_crud.delete_shipment(db, shipment_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with id {shipment_id} not found"
        )
    return None
