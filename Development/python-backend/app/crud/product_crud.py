from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
from app.models.product import Product
from app.schemas.product_schema import ProductCreate, ProductUpdate

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def search_products(
    db: Session,
    search_query: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    sport: Optional[str] = None,
    gender: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = False,
    skip: int = 0,
    limit: int = 100
):
    """
    Búsqueda avanzada de productos con múltiples filtros.
    
    Args:
        search_query: Búsqueda por nombre, descripción o marca
        category: Filtro por categoría
        brand: Filtro por marca
        sport: Filtro por deporte
        gender: Filtro por género
        min_price: Precio mínimo
        max_price: Precio máximo
        in_stock_only: Solo productos en stock
        skip: Número de registros a saltar
        limit: Límite de resultados
    """
    query = db.query(Product)
    
    # Búsqueda por texto en nombre, descripción o marca
    if search_query:
        search_filter = or_(
            Product.name.ilike(f"%{search_query}%"),
            Product.description.ilike(f"%{search_query}%"),
            Product.brand.ilike(f"%{search_query}%")
        )
        query = query.filter(search_filter)
    
    # Filtros específicos
    if category:
        query = query.filter(Product.category == category)
    
    if brand:
        query = query.filter(Product.brand == brand)
    
    if sport:
        query = query.filter(Product.sport == sport)
    
    if gender:
        query = query.filter(Product.gender == gender)
    
    # Filtro por rango de precio
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Filtro por disponibilidad
    if in_stock_only:
        query = query.filter(Product.in_stock == True, Product.stock_quantity > 0)
    
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def create_product(db: Session, product: ProductCreate):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        update_data = product_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
        return db_product
    return None

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False