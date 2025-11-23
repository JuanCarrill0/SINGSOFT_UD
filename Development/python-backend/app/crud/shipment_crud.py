from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List
from app.models.shipment import Shipment
from app.schemas.shipment_schema import ShipmentCreate, ShipmentUpdate, ShipmentStatusUpdate

def create_shipment(db: Session, shipment: ShipmentCreate) -> Shipment:
    """Create a new shipment for an order"""
    db_shipment = Shipment(**shipment.model_dump())
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def get_shipment(db: Session, shipment_id: int) -> Optional[Shipment]:
    """Get a shipment by ID"""
    return db.query(Shipment).filter(Shipment.id == shipment_id).first()

def get_shipment_by_order(db: Session, order_id: int) -> Optional[Shipment]:
    """Get shipment information for a specific order"""
    return db.query(Shipment).filter(Shipment.order_id == order_id).first()

def get_shipment_by_tracking(db: Session, tracking_number: str) -> Optional[Shipment]:
    """Get shipment by tracking number"""
    return db.query(Shipment).filter(Shipment.tracking_number == tracking_number).first()

def get_shipments(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Shipment]:
    """Get all shipments with optional status filter"""
    query = db.query(Shipment)
    if status:
        query = query.filter(Shipment.status == status)
    return query.offset(skip).limit(limit).all()

def update_shipment(db: Session, shipment_id: int, shipment_update: ShipmentUpdate) -> Optional[Shipment]:
    """Update shipment information (tracking number, carrier, vehicle info)"""
    db_shipment = get_shipment(db, shipment_id)
    if not db_shipment:
        return None
    
    update_data = shipment_update.model_dump(exclude_unset=True)
    
    # If status is being updated to 'shipped', set shipped_at timestamp
    if "status" in update_data and update_data["status"] == "shipped" and not db_shipment.shipped_at:
        update_data["shipped_at"] = datetime.utcnow()
    
    # If status is being updated to 'delivered', set delivered_at timestamp
    if "status" in update_data and update_data["status"] == "delivered" and not db_shipment.delivered_at:
        update_data["delivered_at"] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_shipment, key, value)
    
    db_shipment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def update_shipment_status(db: Session, shipment_id: int, status_update: ShipmentStatusUpdate) -> Optional[Shipment]:
    """Update only the shipment status and optionally vehicle info"""
    db_shipment = get_shipment(db, shipment_id)
    if not db_shipment:
        return None
    
    # Update status
    db_shipment.status = status_update.status
    
    # Update vehicle info if provided
    if status_update.vehicle_info:
        db_shipment.vehicle_info = status_update.vehicle_info
    
    # Set timestamps based on status
    if status_update.status == "shipped" and not db_shipment.shipped_at:
        db_shipment.shipped_at = datetime.utcnow()
    
    if status_update.status == "delivered" and not db_shipment.delivered_at:
        db_shipment.delivered_at = datetime.utcnow()
    
    db_shipment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def delete_shipment(db: Session, shipment_id: int) -> bool:
    """Delete a shipment"""
    db_shipment = get_shipment(db, shipment_id)
    if not db_shipment:
        return False
    
    db.delete(db_shipment)
    db.commit()
    return True
